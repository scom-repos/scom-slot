import { Module, RequireJS } from "@ijstech/components";
import formSchema from "./formSchema";
import { ISlotInfo } from "./interface";

export const ROWS = 3;
export const COLUMNS = 3;
export const DEFAULT_STAKE = 1;
export const REEL_WIDTH = 90;
export const SYMBOL_SIZE = 80;
export const PADDING_BLOCK = 4;
export const DEFAULT_WIDTH = 640;
export const DEFAULT_HEIGHT = 360;

export class SlotModel {
  private module: Module;
  private _data: ISlotInfo = {
    defaultStake: DEFAULT_STAKE
  };
  public updateUIBySetData: () => Promise<void>;

  slotTextures = [];
  reel: any;
  tweening = [];
  reels = [];
  balance: number = 500;
  stake: number = DEFAULT_STAKE;
  win: number = 0;
  running: boolean = false;
  Howl: any;

  constructor(module: Module) {
    this.module = module;
    if (!this._data.slotName) {
      this._data.slotName = this.module.i18n.get('$slot_machine');
    }
  }

  getConfigurators() {
    return [
      {
        name: 'Editor',
        target: 'Editor',
        getActions: this.getActions.bind(this),
        getData: this.getData.bind(this),
        setData: this.setData.bind(this),
        getTag: this.getTag.bind(this),
        setTag: this.setTag.bind(this)
      }
    ]
  }

  async setData(value: ISlotInfo) {
    this._data = value;
    this.stake = (value.defaultStake > this.balance ? this.balance : value.defaultStake) || DEFAULT_STAKE;
    if (this.updateUIBySetData) await this.updateUIBySetData();
  }

  getData() {
    return this._data;
  }

  getTag() {
    return this.module.tag;
  }

  setTag(value: any) {
    this.module.tag = value;
  }

  private getActions() {
    const actions = [
      {
        name: 'Edit',
        icon: 'edit',
        command: (builder: any, userInputData: any) => {
          let oldData: any = {};
          return {
            execute: () => {
              oldData = JSON.parse(JSON.stringify({}));
              if (builder?.setData) builder.setData(userInputData);
            },
            undo: () => {
              this._data = JSON.parse(JSON.stringify(oldData));
              if (builder?.setData) builder.setData(this._data);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: formSchema.dataSchema,
        userInputUISchema: formSchema.uiSchema,
      }
    ]
    return actions;
  }

  get isLoggedIn() {
    const loggedInUserStr = localStorage.getItem('loggedInUser');
    return !!loggedInUserStr;
  }

  async loadLib(moduleDir: string) {
    let self = this;
    return new Promise((resolve, reject) => {
      RequireJS.config({
        baseUrl: `${moduleDir}/lib`,
        paths: {
          'howler': 'howler',
        }
      })
      RequireJS.require(['howler'], function (howler: any) {
        self.Howl = howler.Howl;
        resolve(howler);
      });
    })
  }

  updateBalance() {
    // TODO
  }

  addStake() {
    if (this.stake >= 1 && this.stake <= 2) {
      this.stake++;
    }
  }

  minusStake() {
    if (this.stake > 1) {
      this.stake--;
    }
  }

  reduceBalance() {
    this.balance = this.balance - this.stake;
  }

  tweenTo(object: any, property: any, target: any, time: number, easing: any, onchange: any, oncomplete: any) {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now()
    };

    this.tweening.push(tween);
    return tween;
  }

  lerp(a1: number, a2: number, t: number) {
    return a1 * (1 - t) + a2 * t;
  }

  //Function to start playing.
  startPlay(moduleDir: string, callback?: () => void) {
    console.log('startPlay', this.running)
    if (this.running || this.balance < this.stake) return;
    this.running = true;

    this.reduceBalance();
    // Add sound when reels running is set to true
    if (this.running) {
      const sound = new this.Howl({
        src: [`${moduleDir}/assets/sounds/mp3/arcade-game-fruit-machine-jackpot-002-long.mp3`, `${moduleDir}/assets/sounds/mp3/arcade-game-fruit-machine-jackpot-002-long.mp3`]
      });
      sound.play();
    }

    for (let i = 0; i < this.reels.length; i++) {
      const r = this.reels[i];
      const extra = Math.floor(Math.random() * 3);
      this.tweenTo(r, "position", r.position + 10 + i * 5 + extra, 2500 + i * 600 + extra * 600, this.backout(0.6), null, i == this.reels.length - 1 ? this.reelsComplete(callback) : null);
    }
  }

  //Reels done handler.
  reelsComplete(callback?: () => void) {
    setTimeout(() => {
      console.log('reelsComplete')
      this.running = false;
      if (callback) {
        callback();
      }
    }, 3500)
  }

  backout(amount: number) {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
  }

  updateTweeting() {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < this.tweening.length; i++) {
      const t = this.tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);

      t.object[t.property] = this.lerp(t.propertyBeginValue, t.target, t.easing(phase));
      if (t.change) t.change(t);
      if (phase == 1) {
        t.object[t.property] = t.target;
        if (t.complete)
          t.complete(t);
        remove.push(t);
      }
    }
    for (let i = 0; i < remove.length; i++) {
      this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
    }
  }

  updateReels() {
    for (const r of this.reels) {
      //Update blur filter y amount based on speed.
      //This would be better if calculated with time in mind also. Now blur depends on frame rate.
      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;

      //Update symbol positions on reel.
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevy = s.y;
        s.y = (r.position + j) % r.symbols.length * SYMBOL_SIZE - SYMBOL_SIZE;
        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          //Detect going over and swap a texture.
          //This should in proper product be determined from some logical reel.
          s.texture = this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)];
          s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
          s.height = SYMBOL_SIZE - PADDING_BLOCK;
        }
      }
    }
  }
}