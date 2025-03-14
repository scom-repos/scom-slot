var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-slot/formSchema.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-slot/formSchema.ts'/> 
    exports.default = {
        dataSchema: {
            type: 'object',
            properties: {
                slotName: {
                    title: '$slot_machine_name',
                    type: 'string',
                    required: true
                },
                defaultStake: {
                    title: '$default_stake',
                    type: 'string',
                    enum: ['1', '2', '3']
                },
                firstImage: {
                    title: '$first_image_url',
                    type: 'string'
                },
                secondImage: {
                    title: '$second_image_url',
                    type: 'string'
                },
                thirdImage: {
                    title: '$third_image_url',
                    type: 'string'
                }
            }
        },
        uiSchema: {
            type: 'VerticalLayout',
            elements: [
                {
                    type: 'Control',
                    scope: '#/properties/slotName'
                },
                {
                    type: 'Control',
                    scope: '#/properties/defaultStake'
                },
                {
                    type: 'Control',
                    scope: '#/properties/firstImage'
                },
                {
                    type: 'Control',
                    scope: '#/properties/secondImage'
                },
                {
                    type: 'Control',
                    scope: '#/properties/thirdImage'
                }
            ]
        }
    };
});
define("@scom/scom-slot/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-slot/model.ts", ["require", "exports", "@ijstech/components", "@scom/scom-slot/formSchema.ts"], function (require, exports, components_1, formSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SlotModel = exports.DEFAULT_HEIGHT = exports.DEFAULT_WIDTH = exports.PADDING_BLOCK = exports.SYMBOL_SIZE = exports.REEL_WIDTH = exports.DEFAULT_STAKE = exports.COLUMNS = exports.ROWS = void 0;
    exports.ROWS = 3;
    exports.COLUMNS = 3;
    exports.DEFAULT_STAKE = 1;
    exports.REEL_WIDTH = 90;
    exports.SYMBOL_SIZE = 80;
    exports.PADDING_BLOCK = 4;
    exports.DEFAULT_WIDTH = 640;
    exports.DEFAULT_HEIGHT = 360;
    class SlotModel {
        constructor(module) {
            this._data = {
                defaultStake: exports.DEFAULT_STAKE
            };
            this.slotTextures = [];
            this.tweening = [];
            this.reels = [];
            this.balance = 500;
            this.stake = exports.DEFAULT_STAKE;
            this.win = 0;
            this.running = false;
            this.module = module;
            if (!this._data.slotName) {
                this._data.slotName = this.module.i18n.get('$slot_machine');
            }
        }
        getConfigurators() {
            return [
                {
                    name: 'Builder Configurator',
                    target: 'Builders',
                    getActions: this.getActions.bind(this),
                    getData: this.getData.bind(this),
                    setData: async (value) => {
                        const defaultData = { defaultStake: exports.DEFAULT_STAKE, slotName: this.module.i18n.get('$slot_machine') };
                        this.setData({ ...defaultData, ...value });
                    },
                    getTag: this.getTag.bind(this),
                    setTag: this.setTag.bind(this)
                },
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
            this.stake = (value.defaultStake > this.balance ? this.balance : value.defaultStake) || exports.DEFAULT_STAKE;
            if (this.updateUIBySetData)
                await this.updateUIBySetData();
        }
        getData() {
            return this._data;
        }
        getTag() {
            return this.module.tag;
        }
        setTag(value) {
            this.module.tag = value;
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
                                this._data = JSON.parse(JSON.stringify(oldData));
                                if (builder?.setData)
                                    builder.setData(this._data);
                            },
                            redo: () => { }
                        };
                    },
                    userInputDataSchema: formSchema_1.default.dataSchema,
                    userInputUISchema: formSchema_1.default.uiSchema,
                }
            ];
            return actions;
        }
        get isLoggedIn() {
            const loggedInUserStr = localStorage.getItem('loggedInUser');
            return !!loggedInUserStr;
        }
        async loadLib(moduleDir) {
            let self = this;
            return new Promise((resolve, reject) => {
                components_1.RequireJS.config({
                    baseUrl: `${moduleDir}/lib`,
                    paths: {
                        'howler': 'howler',
                    }
                });
                components_1.RequireJS.require(['howler'], function (howler) {
                    self.Howl = howler.Howl;
                    resolve(howler);
                });
            });
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
            this.tweening.push(tween);
            return tween;
        }
        lerp(a1, a2, t) {
            return a1 * (1 - t) + a2 * t;
        }
        //Function to start playing.
        startPlay(moduleDir, callback) {
            console.log('startPlay', this.running);
            if (this.running || this.balance < this.stake)
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
            for (let i = 0; i < this.reels.length; i++) {
                const r = this.reels[i];
                const extra = Math.floor(Math.random() * 3);
                this.tweenTo(r, "position", r.position + 10 + i * 5 + extra, 2500 + i * 600 + extra * 600, this.backout(0.6), null, i == this.reels.length - 1 ? this.reelsComplete(callback) : null);
            }
        }
        //Reels done handler.
        reelsComplete(callback) {
            setTimeout(() => {
                console.log('reelsComplete');
                this.running = false;
                if (callback) {
                    callback();
                }
            }, 3500);
        }
        backout(amount) {
            return (t) => --t * t * ((amount + 1) * t + amount) + 1;
        }
        updateTweeting() {
            const now = Date.now();
            const remove = [];
            for (let i = 0; i < this.tweening.length; i++) {
                const t = this.tweening[i];
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
                    s.y = (r.position + j) % r.symbols.length * exports.SYMBOL_SIZE - exports.SYMBOL_SIZE;
                    if (s.y < 0 && prevy > exports.SYMBOL_SIZE) {
                        //Detect going over and swap a texture.
                        //This should in proper product be determined from some logical reel.
                        s.texture = this.slotTextures[Math.floor(Math.random() * this.slotTextures.length)];
                        s.scale.x = s.scale.y = Math.min(exports.SYMBOL_SIZE / s.texture.width, exports.SYMBOL_SIZE / s.texture.height);
                        s.x = Math.round((exports.SYMBOL_SIZE - s.width) / 2);
                        s.height = exports.SYMBOL_SIZE - exports.PADDING_BLOCK;
                    }
                }
            }
        }
    }
    exports.SlotModel = SlotModel;
});
define("@scom/scom-slot/translations.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-slot/translations.json.ts'/> 
    exports.default = {
        "en": {
            "slot_machine": "Slot Machine",
            "slot_machine_name": "Slot machine name",
            "default_stake": "Default stake",
            "first_image_url": "First image URL",
            "second_image_url": "Second image URL",
            "third_image_url": "Third image URL",
        },
        "zh-hant": {
            "slot_machine": "角子機",
            "slot_machine_name": "老虎機名稱",
            "default_stake": "預設投注",
            "first_image_url": "第一張圖片網址",
            "second_image_url": "第二張圖片網址",
            "third_image_url": "第三張圖片網址",
        },
        "vi": {
            "slot_machine": "Máy đánh bạc",
            "slot_machine_name": "Tên máy",
            "default_stake": "Cấp cược mặc định",
            "first_image_url": "Đường dẫn hình ảnh đầu tiên",
            "second_image_url": "Đường dẫn hình ảnh thứ hai",
            "third_image_url": "Đường dẫn hình ảnh thứ ba",
        }
    };
});
define("@scom/scom-slot", ["require", "exports", "@ijstech/components", "@scom/scom-pixi", "@scom/scom-slot/model.ts", "@scom/scom-slot/translations.json.ts"], function (require, exports, components_2, scom_pixi_1, model_1, translations_json_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomSlot = void 0;
    const moduleDir = components_2.application.currentModuleDir;
    let ScomSlot = class ScomSlot extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.tag = {};
            this.initModel();
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        set width(value) {
            this.tag.width = value;
            this.resizeLayout();
        }
        initModel() {
            if (!this.model) {
                this.i18n.init({ ...translations_json_1.default });
                this.model = new model_1.SlotModel(this);
                this.model.loadLib(moduleDir);
            }
        }
        getConfigurators() {
            this.initModel();
            return this.model.getConfigurators();
        }
        getConfigJson() {
            return translations_json_1.default;
        }
        getData() {
            return this.model.getData();
        }
        async setData(value) {
            this.model.setData(value);
        }
        getTag() {
            return this.tag;
        }
        async setTag(value) {
            this.model.setTag(value);
        }
        async updateUIBySetData() {
            await this.updateSlot();
        }
        updateBalance() {
            this.model.updateBalance();
        }
        async loadAsset() {
            const { firstImage, secondImage, thirdImage } = this.getData();
            const _firstImage = firstImage || `${moduleDir}/assets/images/gem_blue.png`;
            const _secondImage = secondImage || `${moduleDir}/assets/images/gem_green.png`;
            const _thirdImage = thirdImage || `${moduleDir}/assets/images/gem_orange.png`;
            await scom_pixi_1.Assets.load([
                _firstImage,
                _secondImage,
                _thirdImage,
                `${moduleDir}/assets/images/spin.png`,
                `${moduleDir}/assets/images/BTN_Spin_deactivated.png`,
                `${moduleDir}/assets/images/coin.png`,
                `${moduleDir}/assets/images/leftArrow.png`,
                `${moduleDir}/assets/images/rightArrow.png`,
                `${moduleDir}/assets/images/background.png`
            ]);
            const firstSymbol = scom_pixi_1.Texture.from(_firstImage);
            const secondSymbol = scom_pixi_1.Texture.from(_secondImage);
            const thirdSymbol = scom_pixi_1.Texture.from(_thirdImage);
            this.model.slotTextures = [
                firstSymbol,
                secondSymbol,
                thirdSymbol
            ];
        }
        async updateSlot() {
            await this.loadAsset();
            const { slotName } = this.getData() || {};
            if (this.headerText) {
                this.headerText.text = slotName || this.i18n.get('$slot_machine');
                this.updateButtonSpin();
                this.updateStackInfo();
                this.updateContainer();
            }
        }
        updateContainer() {
            this.model.reels = [];
            if (this.reelContainer) {
                try {
                    this.parentContainer.removeChild(this.reelContainer);
                }
                catch { }
            }
            this.reelContainer = new scom_pixi_1.Container();
            const margin = (this.app.screen.height - model_1.SYMBOL_SIZE * 3) / 2;
            this.reelContainer.y = margin + 2.5;
            this.reelContainer.x = 200;
            this.reelContainer.zIndex = 0;
            for (let i = 0; i < model_1.COLUMNS; i++) {
                const rc = new scom_pixi_1.Container();
                rc.x = i * model_1.REEL_WIDTH;
                this.reelContainer.addChild(rc);
                this.model.reel = {
                    container: rc,
                    symbols: [],
                    position: 0,
                    previousPosition: 0,
                    blur: new scom_pixi_1.BlurFilter()
                };
                this.model.reel.blur.blurX = 0;
                this.model.reel.blur.blurY = 0;
                rc.filters = [this.model.reel.blur];
                //Build the symbols
                for (let j = 0; j < (model_1.ROWS + 1); j++) {
                    const symbol = new scom_pixi_1.Sprite(this.model.slotTextures[Math.floor(Math.random() * this.model.slotTextures.length)]);
                    //Scale the symbol to fit symbol area.
                    symbol.y = j * model_1.SYMBOL_SIZE;
                    symbol.scale.x = symbol.scale.y = Math.min(model_1.SYMBOL_SIZE / symbol.width, model_1.SYMBOL_SIZE / symbol.height);
                    symbol.x = Math.round((model_1.SYMBOL_SIZE - symbol.width) / 2);
                    symbol.height = model_1.SYMBOL_SIZE - model_1.PADDING_BLOCK;
                    this.model.reel.symbols.push(symbol);
                    rc.addChild(symbol);
                }
                this.model.reels.push(this.model.reel);
            }
            this.parentContainer.addChild(this.reelContainer);
        }
        updateStackInfo() {
            this.stackText.text = this.model.stake;
            this.leftArrow.cursor = this.model.stake > 1 ? 'pointer' : 'default';
            this.leftArrow.alpha = this.model.stake > 1 ? 1 : 0.5;
            this.rightArrow.cursor = this.model.stake < 3 ? 'pointer' : 'default';
            this.rightArrow.alpha = this.model.stake < 3 ? 1 : 0.5;
        }
        updateButtonSpin() {
            this.buttonSpin.cursor = this.model.balance < this.model.stake ? 'default' : 'pointer';
            this.buttonSpin.alpha = this.model.balance < this.model.stake ? 0.5 : 1;
        }
        async initSlot() {
            await this.loadAsset();
            this.parentContainer = new scom_pixi_1.Container();
            //container for footer items
            const footerContainer = new scom_pixi_1.Container();
            // draw a rounded rectangle
            let graphicsOne = new scom_pixi_1.Graphics();
            graphicsOne.roundRect(50, 296, 120, 35, 15);
            graphicsOne.stroke({ width: 2, color: 0xFF00FF, alpha: 1 });
            graphicsOne.fill({ color: 0xFF00BB, alpha: 0.25 });
            // draw a rounded rectangle
            let graphicsTwo = new scom_pixi_1.Graphics();
            graphicsTwo.roundRect(255, 296, 120, 35, 15);
            graphicsTwo.stroke({ width: 2, color: 0xFF00FF, alpha: 1 });
            graphicsTwo.fill({ color: 0xFF00BB, alpha: 0.25 });
            //draw coin image for total balance
            let coins = scom_pixi_1.Sprite.from(`${moduleDir}/assets/images/coin.png`);
            coins.x = this.app.screen.width - 150;
            coins.y = 2;
            coins.scale.x *= 0.08;
            coins.scale.y *= 0.08;
            coins.zIndex = 1;
            //Create PIXI container to hold all app buttons
            const buttonsHolder = new scom_pixi_1.Container();
            buttonsHolder.x = 0;
            buttonsHolder.y = 0;
            const makeImageButton = (image, audioMP3, audioOGG, x, y, scale) => {
                const button = scom_pixi_1.Sprite.from(image);
                const sound = new this.model.Howl({
                    src: [audioMP3, audioOGG]
                });
                button.sound = sound;
                button.interactive = true;
                buttonsHolder.addChild(button);
                button.x = x;
                button.y = y;
                button.scale.set(scale);
                return button;
            };
            //Add image sprite, sound, location and scale leftArrow button
            this.leftArrow = makeImageButton(`${moduleDir}/assets/images/leftArrow.png`, `${moduleDir}/assets/sounds/mp3/multimedia_button_click_006.mp3`, `${moduleDir}/assets/sounds/ogg/multimedia_button_click_006.mp3`, 220, 296, 0.05);
            //Add image sprite, sound, location and scale rightArrow button
            this.rightArrow = makeImageButton(`${moduleDir}/assets/images/rightArrow.png`, `${moduleDir}/assets/sounds/mp3/multimedia_button_click_006.mp3`, `${moduleDir}/assets/sounds/ogg/multimedia_button_click_006.mp3`, 380, 296, 0.05);
            //Add image sprite, sound, location and scale the spinButton button
            this.buttonSpin = makeImageButton(`${moduleDir}/assets/images/spin.png`, `${moduleDir}/assets/sounds/mp3/zapsplat_foley_money_pouch_fabric_coins_down_on_surface_006_15052.mp3`, `${moduleDir}/assets/sounds/ogg/zapsplat_foley_money_pouch_fabric_coins_down_on_surface_006_15052.mp3`, 460, 235, 0.2);
            this.updateButtonSpin();
            //check for event on click on rightArrow button and call AddStake function
            this.rightArrow.addListener("pointerdown", () => {
                this.model.addStake();
                this.updateStackInfo();
            });
            //check for event on click on leftArrow button and call MinusStake function
            this.leftArrow.addListener("pointerdown", () => {
                this.model.minusStake();
                this.updateStackInfo();
            });
            //check for event on spin button
            this.buttonSpin.addListener('pointerdown', () => {
                this.buttonSpin.cursor = 'default';
                this.buttonSpin.alpha = 0.5;
                this.model.startPlay(moduleDir, () => {
                    this.updateButtonSpin();
                });
                this.balanceText.text = this.model.balance;
            });
            // Build the reels
            this.updateContainer();
            //Build top & bottom covers
            const margin = (this.app.screen.height - model_1.SYMBOL_SIZE * 3) / 2;
            const top = new scom_pixi_1.Graphics();
            top.zIndex = 1;
            top.rect(0, 0, this.app.screen.width, margin);
            top.fill('#FF3300');
            const bottom = new scom_pixi_1.Graphics();
            bottom.rect(0, model_1.SYMBOL_SIZE * 3 + margin - 15, this.app.screen.width, margin + 15);
            bottom.fill('#000000');
            bottom.alpha = 1;
            //Add text Style properties
            const style = new scom_pixi_1.TextStyle({
                fontFamily: 'Arial',
                fontSize: 24,
                fontStyle: 'italic',
                fontWeight: 'bold',
                fill: '#FFFFFF',
                // fill: [new Color('#FFFFFF').toNumber(), new Color('#00FF99').toNumber()], // gradient
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
            const { slotName } = this.getData() || {};
            //Add header text
            this.headerText = new scom_pixi_1.Text({ text: slotName || this.i18n.get('$slot_machine'), style });
            this.headerText.x = Math.round((top.width - this.headerText.width) / 2);
            this.headerText.y = Math.round((margin - this.headerText.height) / 2);
            top.addChild(this.headerText);
            //Stack Selector Text between arrow buttons
            this.stackText = new scom_pixi_1.Text({ text: `${this.model.stake}`, style });
            this.stackText.x = (this.app.screen.width / 2 - 15);
            this.stackText.y = 295;
            this.updateStackInfo();
            footerContainer.addChild(this.stackText);
            //Add win text to the canvas
            this.winText = new scom_pixi_1.Text({ text: `${this.model.win}`, style });
            this.winText.x = 100;
            this.winText.y = 295;
            footerContainer.addChild(this.winText);
            //Add balance text to the canvas
            this.balanceText = new scom_pixi_1.Text({ text: `${this.model.balance}`, style });
            this.balanceText.x = 535;
            this.balanceText.y = 7;
            top.addChild(this.balanceText);
            this.parentContainer.addChild(top);
            this.parentContainer.addChild(coins);
            this.parentContainer.addChild(footerContainer);
            this.app.stage.addChild(this.parentContainer);
            footerContainer.addChild(bottom, graphicsOne, graphicsTwo, buttonsHolder, this.buttonSpin, this.stackText, this.winText);
            footerContainer.x = 0;
            footerContainer.y = 20;
            footerContainer.zIndex = 1;
            this.model.running = false;
        }
        resizeLayout() {
            if (!this.app?.renderer || !this.parentContainer)
                return;
            const tagWidth = Number(this.tag?.width);
            const osWidth = this.offsetWidth;
            let width = window.innerWidth;
            let height = window.innerHeight;
            if (osWidth !== 0 && !isNaN(tagWidth) && tagWidth !== 0) {
                width = Math.min(osWidth, tagWidth);
            }
            else if (osWidth !== 0) {
                width = osWidth;
            }
            else if (!isNaN(tagWidth) && tagWidth !== 0) {
                width = tagWidth;
            }
            const scaleFactor = Math.min(width / model_1.DEFAULT_WIDTH, height / model_1.DEFAULT_HEIGHT);
            if (scaleFactor <= 1) {
                const aspectRatio = model_1.DEFAULT_WIDTH / model_1.DEFAULT_HEIGHT;
                let newWidth = Math.min(width, model_1.DEFAULT_WIDTH);
                let newHeight = width / aspectRatio;
                if (newHeight > height) {
                    newHeight = Math.min(height, model_1.DEFAULT_HEIGHT);
                    newWidth = newHeight * aspectRatio;
                }
                this.app.renderer.resize(newWidth, newHeight);
                this.parentContainer.scale.set(scaleFactor);
            }
            else {
                const { width, height } = this.app.renderer;
                if (width < model_1.DEFAULT_WIDTH || height < model_1.DEFAULT_HEIGHT) {
                    this.app.renderer.resize(model_1.DEFAULT_WIDTH, model_1.DEFAULT_HEIGHT);
                    this.parentContainer.scale.set(1);
                }
            }
        }
        isEmptyData(value) {
            return !value || !value.slotName;
        }
        async init() {
            super.init();
            this.app = new scom_pixi_1.Application();
            this.model.updateUIBySetData = this.updateUIBySetData.bind(this);
            await this.app.init({ width: model_1.DEFAULT_WIDTH, height: model_1.DEFAULT_HEIGHT, background: 'transparent' });
            this.pnlCanvas.appendChild(this.app.canvas);
            await this.initSlot();
            const lazyLoad = this.getAttribute('lazyLoad', true, false);
            if (!lazyLoad) {
                const slotName = this.getAttribute('slotName', true);
                const defaultStake = this.getAttribute('defaultStake', true);
                const firstImage = this.getAttribute('firstImage', true);
                const secondImage = this.getAttribute('secondImage', true);
                const thirdImage = this.getAttribute('thirdImage', true);
                const data = {
                    slotName,
                    defaultStake,
                    firstImage,
                    secondImage,
                    thirdImage,
                };
                if (!this.isEmptyData(data)) {
                    await this.setData(data);
                }
            }
            this.app.ticker.add(delta => {
                this.model.updateTweeting();
            });
            this.app.ticker.add(delta => {
                // Update the slots
                this.model.updateReels();
            });
            this.resizeLayout();
            window.addEventListener('resize', () => {
                this.resizeLayout();
            });
        }
        render() {
            return this.$render("i-vstack", { id: "pnlCanvas", height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' });
        }
    };
    ScomSlot = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-slot')
    ], ScomSlot);
    exports.ScomSlot = ScomSlot;
});
