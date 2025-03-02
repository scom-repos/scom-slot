var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-slot/translations.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-slot/translations.json.ts'/> 
    exports.default = {
        "en": {
            "slot_machine": "Slot Machine"
        },
        "zh-hant": {
            "slot_machine": "角子機"
        },
        "vi": {
            "slot_machine": "máy đánh bạc"
        }
    };
});
define("@scom/scom-slot/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-slot/configInput.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-slot/translations.json.ts"], function (require, exports, components_1, translations_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomSlotConfigInput = void 0;
    const Theme = components_1.Styles.Theme.ThemeVars;
    let ScomSlotConfigInput = class ScomSlotConfigInput extends components_1.Module {
        constructor() {
            super(...arguments);
            this.config = {};
        }
        // private communities: ICommunity[];
        getData() {
            const slotName = this.edtSlotName?.value || "";
            return {
                slotName
            };
        }
        async setData(data) {
            this.config = data;
            if (this.edtSlotName) {
                this.edtSlotName.value = data.slotName || "";
            }
        }
        async handleSlotNameChanged() {
            if (this['onChanged'])
                this['onChanged']();
            if (this.timeout)
                clearTimeout(this.timeout);
            const slotName = this.edtSlotName.value;
            if (!slotName)
                return;
        }
        async init() {
            this.i18n.init({ ...translations_json_1.default });
            super.init();
        }
        render() {
            return (this.$render("i-stack", { direction: "vertical" },
                this.$render("i-panel", { id: "pnlSlotName", padding: { top: 5, bottom: 5, left: 5, right: 5 } },
                    this.$render("i-stack", { direction: "vertical", width: "100%", margin: { bottom: 5 }, gap: 5 },
                        this.$render("i-label", { caption: "$slot_name" }),
                        this.$render("i-input", { id: "edtSlotName", width: "100%", height: 42, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, border: { radius: '0.625rem' }, placeholder: "Slot name", onChanged: this.handleSlotNameChanged })))));
        }
    };
    ScomSlotConfigInput = __decorate([
        (0, components_1.customElements)('i-scom-slot--config-input')
    ], ScomSlotConfigInput);
    exports.ScomSlotConfigInput = ScomSlotConfigInput;
});
define("@scom/scom-slot/formSchema.ts", ["require", "exports", "@scom/scom-slot/configInput.tsx"], function (require, exports, configInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        dataSchema: {
            type: 'object',
            properties: {
                config: {
                    title: '$slot_machine',
                    type: "object",
                    required: true
                }
            }
        },
        uiSchema: {
            type: "VerticalLayout",
            elements: [
                {
                    type: "Control",
                    scope: "#/properties/config"
                },
            ]
        },
        customControls() {
            return {
                "#/properties/config": {
                    render: () => {
                        const communityProductInput = new configInput_1.ScomSlotConfigInput();
                        return communityProductInput;
                    },
                    getData: (control) => {
                        return control.getData();
                    },
                    setData: async (control, value, rowData) => {
                        await control.ready();
                        control.setData(rowData?.config);
                    }
                }
            };
        }
    };
});
define("@scom/scom-slot/model.ts", ["require", "exports", "@scom/scom-slot/formSchema.ts"], function (require, exports, formSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SlotModel = void 0;
    // import { IProductInfo } from "./interface";
    // import { fetchCommunityProducts, fetchCommunityStalls, getLoggedInUserId } from "./utils";
    class SlotModel {
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
            ];
        }
        async setData(value) {
            this._data = value;
            const { config, slotName } = this._data || {};
            if (this.updateUIBySetData)
                this.updateUIBySetData();
        }
        getData() {
            return this._data;
        }
        getTag() {
            return this._tag;
        }
        setTag(value) {
            this._tag = value;
        }
        getActions() {
            const actions = [
                {
                    name: 'Edit',
                    icon: 'edit',
                    command: (builder, userInputData) => {
                        let oldData = {};
                        return {
                            execute: () => {
                                oldData = JSON.parse(JSON.stringify({}));
                                if (builder?.setData)
                                    builder.setData(userInputData);
                            },
                            undo: () => {
                                //   this._data = JSON.parse(JSON.stringify(oldData));
                                if (builder?.setData)
                                    builder.setData(null);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: formSchema_1.default.dataSchema,
                    userInputUISchema: formSchema_1.default.uiSchema,
                    customControls: formSchema_1.default.customControls()
                }
            ];
            return actions;
        }
        get isLoggedIn() {
            const loggedInUserStr = localStorage.getItem('loggedInUser');
            return !!loggedInUserStr;
        }
    }
    exports.SlotModel = SlotModel;
});
define("@scom/scom-slot", ["require", "exports", "@ijstech/components", "@scom/scom-pixi", "@scom/scom-slot/model.ts"], function (require, exports, components_2, scom_pixi_1, model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomSlot = void 0;
    const moduleDir = components_2.application.currentModuleDir;
    const REEL_WIDTH = 90;
    const SYMBOL_SIZE = 80;
    let reels = [];
    let anotherSlot = [];
    let slotTextures = [];
    let anotherSlotTextures = [];
    let reelContainer;
    let reel;
    const tweening = [];
    let ScomSlot = class ScomSlot extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.balance = 500;
            this.stake = 1;
            this.win = 0;
            this.playing = false;
            this.running = false;
            this.loadLib(moduleDir);
        }
        get isPreview() {
            return this._isPreview;
        }
        set isPreview(value) {
            this._isPreview = value;
            // if (this.pnlProduct) this.pnlProduct.cursor = value || !this.model.isLoggedIn ? "default" : "pointer";
            // if (this.btnAddToCart) this.btnAddToCart.enabled = !value && this.model.isLoggedIn;
        }
        getConfigurators() {
            return this.model.getConfigurators();
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
        tweenTo(object, property, target, time, easing, onchange, oncomplete) {
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
            tweening.push(tween);
            return tween;
        }
        lerp(a1, a2, t) {
            return a1 * (1 - t) + a2 * t;
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        async init() {
            super.init();
            this.app = new scom_pixi_1.Application();
            this.model = new model_1.SlotModel();
            this.model.updateUIBySetData = this.updateUIBySetData.bind(this);
            await this.app.init({ width: 640, height: 360, background: 'transparent' });
            this.pnlCanvas.appendChild(this.app.canvas);
            await this.loadAsset();
            this.app.ticker.add(delta => {
                const now = Date.now();
                const remove = [];
                for (var i = 0; i < tweening.length; i++) {
                    const t = tweening[i];
                    const phase = Math.min(1, (now - t.start) / t.time);
                    t.object[t.property] = this.lerp(t.propertyBeginValue, t.target, t.easing(phase));
                    if (t.change)
                        t.change(t);
                    if (phase == 1) {
                        t.object[t.property] = t.target;
                        if (t.complete)
                            t.complete(t);
                        remove.push(t);
                    }
                }
                for (var i = 0; i < remove.length; i++) {
                    tweening.splice(tweening.indexOf(remove[i]), 1);
                }
            });
            this.app.ticker.add(delta => {
                //Update the slots.
                for (const r of reels) {
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
                            s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                            s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                            s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                        }
                    }
                }
            });
        }
        async loadLib(moduleDir) {
            let self = this;
            return new Promise((resolve, reject) => {
                components_2.RequireJS.config({
                    baseUrl: `${moduleDir}/lib`,
                    paths: {
                        'howler': 'howler',
                    }
                });
                components_2.RequireJS.require(['howler'], function (howler) {
                    self.Howler = howler.Howler;
                    self.Howl = howler.Howl;
                    resolve(howler);
                });
            });
        }
        async loadAsset() {
            // const imageDelivery = {
            //     extension: ExtensionType.LoadParser,
            //     test: (url) => url.startsWith('https://imagedelivery.net'),
            //     async load(src) {
            //         return new Promise((resolve, reject) => {
            //             const img = new Image()
            //             img.crossOrigin = 'anonymous'
            //             img.onload = () => resolve(Texture.from(img))
            //             img.onerror = reject
            //             img.src = src
            //         })
            //     },
            // }
            // this.loader = new Loader({);
            // const assets = await this.loader.load([
            //     `${moduleDir}/assets/images/gem_blue.png`,
            //     `${moduleDir}/assets/images/gem_green.png`,
            //     `${moduleDir}/assets/images/gem_orange.png`,
            //     `${moduleDir}/assets/images/spin.png`,
            //     `${moduleDir}/assets/images/BTN_Spin_deactivated.png`,
            //     `${moduleDir}/assets/images/coin.png`,
            //     `${moduleDir}/assets/images/leftArrow.png`,
            //     `${moduleDir}/assets/images/rightArrow.png`,
            //     `${moduleDir}/assets/images/background.png`
            // ]);
            await scom_pixi_1.Assets.load([
                `${moduleDir}/assets/images/gem_blue.png`,
                `${moduleDir}/assets/images/gem_green.png`,
                `${moduleDir}/assets/images/gem_orange.png`,
                `${moduleDir}/assets/images/spin.png`,
                `${moduleDir}/assets/images/BTN_Spin_deactivated.png`,
                `${moduleDir}/assets/images/coin.png`,
                `${moduleDir}/assets/images/leftArrow.png`,
                `${moduleDir}/assets/images/rightArrow.png`,
                `${moduleDir}/assets/images/background.png`
            ]);
            this.blue = scom_pixi_1.Texture.from(`${moduleDir}/assets/images/gem_blue.png`);
            this.green = scom_pixi_1.Texture.from(`${moduleDir}/assets/images/gem_green.png`);
            this.orange = scom_pixi_1.Texture.from(`${moduleDir}/assets/images/gem_orange.png`);
            this.onAssetsLoaded();
        }
        onAssetsLoaded() {
            //Create different slot symbols.
            slotTextures = [
                this.blue,
                this.green,
                this.orange
            ];
            //container for footer items
            const footerContainer = new scom_pixi_1.Container();
            // draw a rounded rectangle
            let graphicsOne = new scom_pixi_1.Graphics();
            graphicsOne.lineStyle(2, 0xFF00FF, 1);
            graphicsOne.beginFill(0xFF00BB, 0.25);
            graphicsOne.drawRoundedRect(50, 296, 120, 35, 15);
            graphicsOne.endFill();
            // draw a rounded rectangle
            let graphicsTwo = new scom_pixi_1.Graphics();
            graphicsTwo.lineStyle(2, 0xFF00FF, 1);
            graphicsTwo.beginFill(0xFF00BB, 0.25);
            graphicsTwo.drawRoundedRect(255, 296, 120, 35, 15);
            graphicsTwo.endFill();
            //draw coin image for total balance
            let coins = scom_pixi_1.Sprite.from(`${moduleDir}/assets/images/coin.png`);
            coins.x = this.app.screen.width - 150;
            coins.y = 2;
            coins.scale.x *= 0.08;
            coins.scale.y *= 0.08;
            //Create PIXI container to hold all app buttons
            const buttonsHolder = new scom_pixi_1.Container();
            buttonsHolder.x = 0;
            buttonsHolder.y = 0;
            const makeImageButton = (image, audioMP3, audioOGG, x, y, scale) => {
                const button = scom_pixi_1.Sprite.from(image);
                const sound = new this.Howl({
                    src: [audioMP3, audioOGG]
                });
                button.sound = sound;
                button.interactive = true;
                // button.buttonMode = true;
                // button.on('pointerdown', event => sound.play());
                buttonsHolder.addChild(button);
                button.x = x;
                button.y = y;
                button.scale.set(scale);
                return button;
            };
            //Add image sprite, sound, location and scale leftArrow button
            const leftArrow = makeImageButton(`${moduleDir}/assets/images/leftArrow.png`, `${moduleDir}/assets/sounds/mp3/multimedia_button_click_006.mp3`, `${moduleDir}/assets/sounds/ogg/multimedia_button_click_006.mp3`, 220, 296, 0.05);
            //Add image sprite, sound, location and scale rightArrow button
            const rightArrow = makeImageButton(`${moduleDir}/assets/images/rightArrow.png`, `${moduleDir}/assets/sounds/mp3/multimedia_button_click_006.mp3`, `${moduleDir}/assets/sounds/ogg/multimedia_button_click_006.mp3`, 380, 296, 0.05);
            //Add image sprite, sound, location and scale the spinButton button
            const buttonActive = makeImageButton(`${moduleDir}/assets/images/spin.png`, `${moduleDir}/assets/sounds/mp3/zapsplat_foley_money_pouch_fabric_coins_down_on_surface_006_15052.mp3`, `${moduleDir}/assets/sounds/ogg/zapsplat_foley_money_pouch_fabric_coins_down_on_surface_006_15052.mp3`, 450, 235, 0.2);
            //check for event on click on rightArrow button and call AddStake function
            rightArrow.addListener("pointerdown", () => {
                this.addStake();
                // pdate  PIXI stack text on screen
                stackText.text = this.stake;
            });
            //check for event on click on leftArrow button and call MinusStake function
            leftArrow.addListener("pointerdown", () => {
                this.minusStake();
                footerContainer.addChild(stackText);
                //update  PIXI text on screen
                stackText.text = this.stake;
            });
            //check for event on spin button
            buttonActive.addListener('pointerdown', () => {
                this.startPlay();
                //Reduce balance on click depending on bet amount
                //Add changes on canvas environment
                balanceText.text = this.balance;
                console.log(`button clicked`);
            });
            //Build the reels
            reelContainer = new scom_pixi_1.Container();
            for (let i = 0; i < 3; i++) {
                const rc = new scom_pixi_1.Container();
                rc.x = i * REEL_WIDTH;
                reelContainer.addChild(rc);
                reel = {
                    container: rc,
                    symbols: [],
                    position: 0,
                    previousPosition: 0,
                    blur: new scom_pixi_1.BlurFilter()
                };
                //let newposition = reel.reelContainer.getChildIndex;
                reel.blur.blurX = 0;
                reel.blur.blurY = 0;
                rc.filters = [reel.blur];
                //Build the symbols
                for (let j = 0; j < 3; j++) {
                    const symbol = new scom_pixi_1.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
                    //Scale the symbol to fit symbol area.
                    symbol.y = j * SYMBOL_SIZE;
                    symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
                    symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 9);
                    reel.symbols.push(symbol);
                    rc.addChild(symbol);
                }
                reels.push(reel);
            }
            this.app.stage.addChild(reelContainer);
            /* TODO:
                -change style of top and bottom canvas background
                FIXME:
                - responsive on all devices
            */
            //Build top & bottom covers and position reelContainer
            const margin = 50;
            reelContainer.y = margin * 2.8;
            reelContainer.x = 200;
            const top = new scom_pixi_1.Graphics();
            top.rect(0, 0, this.app.screen.width, margin);
            top.fill('#FF3300');
            const bottom = new scom_pixi_1.Graphics();
            bottom.rect(0, 240 + margin, this.app.screen.width, margin);
            bottom.fill('#000000');
            bottom.alpha = 1;
            // bottom.beginFill(0, 1);
            // bottom.drawRect(0, 240 + margin, this.app.screen.width, margin);
            //Add text Style properties
            const style = new scom_pixi_1.TextStyle({
                fontFamily: 'Arial',
                fontSize: 24,
                fontStyle: 'italic',
                fontWeight: 'bold',
                fill: '#FFFFFF',
                // fill: [new Color('#FFFFFF').toNumber(), new Color('#00FF99').toNumber()], // gradient
                // stroke: '#4a1850',
                stroke: {
                    color: '#4A1850',
                    width: 5
                },
                dropShadow: {
                    color: '#000000',
                    blur: 4,
                    angle: Math.PI / 6,
                    distance: 6
                },
                wordWrap: true,
                wordWrapWidth: 300
            });
            const { config, slotName } = this.getData() || {};
            //Add header text
            this.headerText = new scom_pixi_1.Text(config?.slotName || 'Slot Machine', style);
            this.headerText.x = Math.round((top.width - this.headerText.width) / 2);
            this.headerText.y = Math.round((margin - this.headerText.height) / 2);
            top.addChild(this.headerText);
            //Stack Selector Text between arrow buttons
            let stackText = new scom_pixi_1.Text(`${this.stake}`, style);
            stackText.x = (this.app.screen.width / 2 - 10);
            stackText.y = 295;
            footerContainer.addChild(stackText);
            //Add win text to the canvas
            let winText = new scom_pixi_1.Text(`${this.win}`, style);
            winText.x = 100;
            winText.y = 295;
            footerContainer.addChild(winText);
            //Add balance text to the canvas
            let balanceText = new scom_pixi_1.Text(`${this.balance}`, style);
            balanceText.x = 535;
            balanceText.y = 7;
            top.addChild(balanceText);
            this.app.stage.addChild(top);
            this.app.stage.addChild(coins);
            this.app.stage.addChild(footerContainer);
            footerContainer.addChild(bottom, graphicsOne, graphicsTwo, buttonsHolder, buttonActive, stackText, winText);
            footerContainer.x = 0;
            footerContainer.y = 20;
            this.running = false;
            //function to get symbols index/position
            /*     Response balance = "98.80" stake = "1.20" win = "0.00" >
                    <SymbolGrid column_id="0" symbols="2,2,1" />
                    <SymbolGrid column_id="1" symbols="1,2,1" />
                    <SymbolGrid column_id="2" symbols="1,0,1" />
            </Response > */
            // Listen for animate update.
        }
        //Function to start playing.
        startPlay() {
            console.log('startPlay', this.running);
            if (this.running)
                return;
            this.running = true;
            this.reduceBalance();
            // Add sound when reels running is set to true
            if (this.running) {
                const sound = new this.Howl({
                    src: [`${moduleDir}/assets/sounds/mp3/arcade-game-fruit-machine-jackpot-002-long.mp3`, `${moduleDir}/assets/sounds/mp3/arcade-game-fruit-machine-jackpot-002-long.mp3`]
                });
                sound.play();
            }
            ;
            for (let i = 0; i < reels.length; i++) {
                const r = reels[i];
                const extra = Math.floor(Math.random() * 3);
                this.tweenTo(r, "position", r.position + 10 + i * 5 + extra, 2500 + i * 600 + extra * 600, this.backout(0.6), null, i == reels.length - 1 ? this.reelsComplete.bind(this) : null);
            }
        }
        //Reels done handler.
        reelsComplete() {
            console.log('reelsComplete');
            this.running = false;
        }
        backout(amount) {
            return (t) => --t * t * ((amount + 1) * t + amount) + 1;
        }
        render() {
            return this.$render("i-vstack", { id: "pnlCanvas", height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' });
        }
        getData() {
            return this.model.getData();
        }
        async updateUIBySetData() {
            const { config, slotName } = this.getData() || {};
            this.headerText.text = config.slotName;
        }
    };
    ScomSlot = __decorate([
        (0, components_2.customElements)('i-scom-slot')
    ], ScomSlot);
    exports.ScomSlot = ScomSlot;
});
