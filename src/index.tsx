import {
    ControlElement,
    customElements,
    Container,
    Module,
    application,
    VStack,
    customModule,
} from "@ijstech/components";
import {
    Application,
    Graphics,
    Container as PIXIContainer,
    Sprite,
    Text,
    TextStyle,
    BlurFilter,
    Assets,
    Texture,
} from "@scom/scom-pixi";
import { COLUMNS, DEFAULT_HEIGHT, DEFAULT_WIDTH, PADDING_BLOCK, REEL_WIDTH, ROWS, SlotModel, SYMBOL_SIZE } from "./model";
import { ISlotInfo } from "./interface";
import translations from "./translations.json";

interface ScomSlotElement extends ControlElement {

}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-slot']: ScomSlotElement;
        }
    }
}
const moduleDir = application.currentModuleDir;

@customModule
@customElements('i-scom-slot')
export class ScomSlot extends Module {
    private model: SlotModel;
    private pnlCanvas: VStack;
    private app: Application;
    private headerText: Text;
    private stackText: Text;
    private winText: Text;
    private balanceText: Text;
    private reelContainer: PIXIContainer;
    private buttonSpin: Sprite;
    tag = {};

    constructor(parent?: Container, options?: any) {
        super(parent, options);
        this.initModel();
    }

    static async create(options?: ScomSlotElement, parent?: Container) {
        let self = new this(parent, options);
        await self.ready();
        return self;
    }

    private initModel() {
        if (!this.model) {
            this.i18n.init({ ...translations });
            this.model = new SlotModel(this);
            this.model.loadLib(moduleDir);
        }
    }

    getConfigurators() {
        this.initModel();
        return this.model.getConfigurators();
    }

    getConfigJson() {
        return translations;
    }

    getData() {
        return this.model.getData();
    }

    async setData(value: ISlotInfo) {
        this.model.setData(value);
    }

    getTag() {
        return this.tag;
    }

    async setTag(value: any) {
        this.model.setTag(value);
    }

    private async updateUIBySetData() {
        await this.updateSlot();
    }

    updateBalance() {
        this.model.updateBalance();
    }

    private async loadAsset() {
        const { firstImage, secondImage, thirdImage } = this.getData();
        const _firstImage = firstImage || `${moduleDir}/assets/images/gem_blue.png`;
        const _secondImage = secondImage || `${moduleDir}/assets/images/gem_green.png`;
        const _thirdImage = thirdImage || `${moduleDir}/assets/images/gem_orange.png`;
        await Assets.load([
            _firstImage,
            _secondImage,
            _thirdImage,
            `${moduleDir}/assets/images/spin.png`,
            `${moduleDir}/assets/images/BTN_Spin_deactivated.png`,
            `${moduleDir}/assets/images/coin.png`,
            `${moduleDir}/assets/images/leftArrow.png`,
            `${moduleDir}/assets/images/rightArrow.png`,
            `${moduleDir}/assets/images/background.png`
        ])
        const firstSymbol = Texture.from(_firstImage);
        const secondSymbol = Texture.from(_secondImage);
        const thirdSymbol = Texture.from(_thirdImage);
        this.model.slotTextures = [
            firstSymbol,
            secondSymbol,
            thirdSymbol
        ];
    }

    private async updateSlot() {
        await this.loadAsset();
        const { slotName } = this.getData() || {};
        if (this.headerText) {
            this.headerText.text = slotName || this.i18n.get('$slot_machine');
            this.stackText.text = this.model.stake;
            this.buttonSpin.alpha = this.model.balance < this.model.stake ? 0.5 : 1;
            this.updateContainer();
        }
    }

    private updateContainer() {
        this.model.reels = [];
        if (this.reelContainer) {
            try {
                this.app.stage.removeChild(this.reelContainer);
            } catch { }
        }
        this.reelContainer = new PIXIContainer();
        const margin = (this.app.screen.height - SYMBOL_SIZE * 3) / 2;
        this.reelContainer.y = margin + 2.5;
        this.reelContainer.x = 200;
        this.reelContainer.zIndex = 0;
        for (let i = 0; i < COLUMNS; i++) {
            const rc = new PIXIContainer();
            rc.x = i * REEL_WIDTH;
            this.reelContainer.addChild(rc);

            this.model.reel = {
                container: rc,
                symbols: [],
                position: 0,
                previousPosition: 0,
                blur: new BlurFilter()
            };

            this.model.reel.blur.blurX = 0;
            this.model.reel.blur.blurY = 0;
            rc.filters = [this.model.reel.blur];

            //Build the symbols
            for (let j = 0; j < (ROWS + 1); j++) {
                const symbol = new Sprite(this.model.slotTextures[Math.floor(Math.random() * this.model.slotTextures.length)]);
                //Scale the symbol to fit symbol area.
                symbol.y = j * SYMBOL_SIZE;
                symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
                symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
                symbol.height = SYMBOL_SIZE - PADDING_BLOCK;
                this.model.reel.symbols.push(symbol);
                rc.addChild(symbol);
            }
            this.model.reels.push(this.model.reel);
        }
        this.app.stage.addChild(this.reelContainer);
    }

    private async initSlot() {
        await this.loadAsset();

        //container for footer items
        const footerContainer = new PIXIContainer();

        // draw a rounded rectangle
        let graphicsOne = new Graphics();
        graphicsOne.lineStyle(2, 0xFF00FF, 1);
        graphicsOne.beginFill(0xFF00BB, 0.25);
        graphicsOne.drawRoundedRect(50, 296, 120, 35, 15);
        graphicsOne.endFill();

        // draw a rounded rectangle
        let graphicsTwo = new Graphics();
        graphicsTwo.lineStyle(2, 0xFF00FF, 1);
        graphicsTwo.beginFill(0xFF00BB, 0.25);
        graphicsTwo.drawRoundedRect(255, 296, 120, 35, 15);
        graphicsTwo.endFill();

        //draw coin image for total balance
        let coins = Sprite.from(`${moduleDir}/assets/images/coin.png`);
        coins.x = this.app.screen.width - 150;
        coins.y = 2;
        coins.scale.x *= 0.08;
        coins.scale.y *= 0.08;

        //Create PIXI container to hold all app buttons
        const buttonsHolder = new PIXIContainer();
        buttonsHolder.x = 0;
        buttonsHolder.y = 0;
        const makeImageButton = (image, audioMP3, audioOGG, x, y, scale) => {
            const button = Sprite.from(image);
            const sound = new this.model.Howl({
                src: [audioMP3, audioOGG]
            });

            (button as any).sound = sound;
            button.interactive = true;
            buttonsHolder.addChild(button);
            button.x = x;
            button.y = y;
            button.scale.set(scale);
            return button;
        };
        //Add image sprite, sound, location and scale leftArrow button
        const leftArrow = makeImageButton(
            `${moduleDir}/assets/images/leftArrow.png`,
            `${moduleDir}/assets/sounds/mp3/multimedia_button_click_006.mp3`,
            `${moduleDir}/assets/sounds/ogg/multimedia_button_click_006.mp3`,
            220,
            296,
            0.05
        );
        //Add image sprite, sound, location and scale rightArrow button
        const rightArrow = makeImageButton(
            `${moduleDir}/assets/images/rightArrow.png`,
            `${moduleDir}/assets/sounds/mp3/multimedia_button_click_006.mp3`,
            `${moduleDir}/assets/sounds/ogg/multimedia_button_click_006.mp3`,
            380,
            296,
            0.05
        );
        //Add image sprite, sound, location and scale the spinButton button
        this.buttonSpin = makeImageButton(
            `${moduleDir}/assets/images/spin.png`,
            `${moduleDir}/assets/sounds/mp3/zapsplat_foley_money_pouch_fabric_coins_down_on_surface_006_15052.mp3`,
            `${moduleDir}/assets/sounds/ogg/zapsplat_foley_money_pouch_fabric_coins_down_on_surface_006_15052.mp3`,
            460,
            235,
            0.2
        );

        //check for event on click on rightArrow button and call AddStake function
        rightArrow.addListener("pointerdown", () => {
            this.model.addStake();
            // pdate  PIXI stack text on screen
            this.stackText.text = this.model.stake;
        });

        //check for event on click on leftArrow button and call MinusStake function
        leftArrow.addListener("pointerdown", () => {
            this.model.minusStake();
            //update  PIXI text on screen
            this.stackText.text = this.model.stake;
        });

        //check for event on spin button
        this.buttonSpin.addListener('pointerdown', () => {
            this.buttonSpin.alpha = 0.5;
            this.model.startPlay(moduleDir);
            //Reduce balance on click depending on bet amount
            //Add changes on canvas environment
            this.balanceText.text = this.model.balance;
            this.buttonSpin.alpha = this.model.balance < this.model.stake ? 0.5 : 1;
            console.log('button clicked');
        });

        // Build the reels
        this.updateContainer();

        /* TODO:
            -change style of top and bottom canvas background
            FIXME:
            - responsive on all devices
        */

        //Build top & bottom covers
        const margin = (this.app.screen.height - SYMBOL_SIZE * 3) / 2;
        const top = new Graphics();
        top.zIndex = 1;
        top.rect(0, 0, this.app.screen.width, margin)
        top.fill('#FF3300');
        const bottom = new Graphics();
        bottom.rect(0, SYMBOL_SIZE * 3 + margin - 15, this.app.screen.width, margin + 15);
        bottom.fill('#000000')
        bottom.alpha = 1;

        //Add text Style properties
        const style = new TextStyle({
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
        this.headerText = new Text(slotName || this.i18n.get('$slot_machine'), style);
        this.headerText.x = Math.round((top.width - this.headerText.width) / 2);
        this.headerText.y = Math.round((margin - this.headerText.height) / 2);
        top.addChild(this.headerText);

        //Stack Selector Text between arrow buttons
        this.stackText = new Text(`${this.model.stake}`, style);
        this.stackText.x = (this.app.screen.width / 2 - 15);
        this.stackText.y = 295;
        footerContainer.addChild(this.stackText);

        //Add win text to the canvas
        this.winText = new Text(`${this.model.win}`, style);
        this.winText.x = 100;
        this.winText.y = 295;
        footerContainer.addChild(this.winText);

        //Add balance text to the canvas
        this.balanceText = new Text(`${this.model.balance}`, style);
        this.balanceText.x = 535;
        this.balanceText.y = 7;
        top.addChild(this.balanceText);

        this.app.stage.addChild(top);
        this.app.stage.addChild(coins);
        this.app.stage.addChild(footerContainer);
        footerContainer.addChild(
            bottom,
            graphicsOne,
            graphicsTwo,
            buttonsHolder,
            this.buttonSpin,
            this.stackText,
            this.winText
        );
        footerContainer.x = 0;
        footerContainer.y = 20;
        footerContainer.zIndex = 1;

        this.model.running = false;
    }

    private isEmptyData(value: ISlotInfo) {
        return !value || !value.slotName;
    }

    async init() {
        super.init();
        this.app = new Application();
        this.model.updateUIBySetData = this.updateUIBySetData.bind(this);
        await this.app.init({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT, background: 'transparent' });
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
    }

    render() {
        return <i-vstack id={"pnlCanvas"} height={'100%'} width={'100%'} justifyContent={'center'} alignItems={'center'}></i-vstack>
    }
}
