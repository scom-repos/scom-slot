var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-slot", ["require", "exports", "@ijstech/components", "@scom/scom-pixi"], function (require, exports, components_1, scom_pixi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomPost = void 0;
    const moduleDir = components_1.application.currentModuleDir;
    const REEL_WIDTH = 90;
    const SYMBOL_SIZE = 80;
    let reels = [];
    let anotherSlot = [];
    let slotTextures = [];
    let anotherSlotTextures = [];
    let reelContainer;
    let reel;
    const tweening = [];
    let ScomPost = class ScomPost extends components_1.Module {
        constructor(parent, options) {
            super(parent, options);
            this.balance = 500;
            this.stake = 1;
            this.win = 0;
            this.playing = false;
            this.running = false;
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
            await this.app.init({ width: 640, height: 360, background: "#FFFFFF" });
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
                // const sound = new Howl({
                //     src: [audioMP3, audioOGG]
                // });
                // button.sound = sound;
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
            top.beginFill(0xFF3300);
            //.beginFill(0, 1);
            top.drawRect(0, 0, this.app.screen.width, margin);
            const bottom = new scom_pixi_1.Graphics();
            bottom.beginFill(0, 1);
            bottom.drawRect(0, 240 + margin, this.app.screen.width, margin);
            //Add text Style properties
            const style = new scom_pixi_1.TextStyle({
                fontFamily: 'Arial',
                fontSize: 24,
                fontStyle: 'italic',
                fontWeight: 'bold',
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
            //Add header text
            const headerText = new scom_pixi_1.Text('Nostrnaut Slot Machine', style);
            headerText.x = Math.round((top.width - headerText.width) / 2);
            headerText.y = Math.round((margin - headerText.height) / 2);
            top.addChild(headerText);
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
                // const sound = new Howl({
                //     src: ['./assets/sounds/mp3/arcade-game-fruit-machine-jackpot-002-long.mp3', './assets/sounds/mp3/arcade-game-fruit-machine-jackpot-002-long.mp3']
                // });
                // sound.play();
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
            return this.$render("i-panel", { id: "pnlCanvas", height: 1000, width: 1000 });
        }
    };
    ScomPost = __decorate([
        (0, components_1.customElements)('i-scom-slot')
    ], ScomPost);
    exports.ScomPost = ScomPost;
});
