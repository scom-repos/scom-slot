/// <amd-module name="@scom/scom-slot/formSchema.ts" />
declare module "@scom/scom-slot/formSchema.ts" {
    const _default: {
        dataSchema: {
            type: string;
            properties: {
                slotName: {
                    title: string;
                    type: string;
                    required: boolean;
                };
                defaultStake: {
                    title: string;
                    type: string;
                    enum: string[];
                };
                firstImage: {
                    title: string;
                    type: string;
                };
                secondImage: {
                    title: string;
                    type: string;
                };
                thirdImage: {
                    title: string;
                    type: string;
                };
            };
        };
        uiSchema: {
            type: string;
            elements: {
                type: string;
                scope: string;
            }[];
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-slot/interface.ts" />
declare module "@scom/scom-slot/interface.ts" {
    export interface ISlotInfo {
        id?: string;
        slotName?: string;
        firstImage?: string;
        secondImage?: string;
        thirdImage?: string;
        defaultStake?: number;
    }
}
/// <amd-module name="@scom/scom-slot/model.ts" />
declare module "@scom/scom-slot/model.ts" {
    import { Module } from "@ijstech/components";
    import { ISlotInfo } from "@scom/scom-slot/interface.ts";
    export const ROWS = 3;
    export const COLUMNS = 3;
    export const DEFAULT_STAKE = 1;
    export const REEL_WIDTH = 90;
    export const SYMBOL_SIZE = 80;
    export const PADDING_BLOCK = 4;
    export const DEFAULT_WIDTH = 640;
    export const DEFAULT_HEIGHT = 360;
    export class SlotModel {
        private module;
        private _data;
        updateUIBySetData: () => Promise<void>;
        slotTextures: any[];
        reel: any;
        tweening: any[];
        reels: any[];
        balance: number;
        stake: number;
        win: number;
        running: boolean;
        Howl: any;
        constructor(module: Module);
        getConfigurators(): {
            name: string;
            target: string;
            getActions: any;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        setData(value: ISlotInfo): Promise<void>;
        getData(): ISlotInfo;
        getTag(): any;
        setTag(value: any): void;
        private getActions;
        get isLoggedIn(): boolean;
        loadLib(moduleDir: string): Promise<unknown>;
        updateBalance(): void;
        addStake(): void;
        minusStake(): void;
        reduceBalance(): void;
        tweenTo(object: any, property: any, target: any, time: number, easing: any, onchange: any, oncomplete: any): {
            object: any;
            property: any;
            propertyBeginValue: any;
            target: any;
            easing: any;
            time: number;
            change: any;
            complete: any;
            start: number;
        };
        lerp(a1: number, a2: number, t: number): number;
        startPlay(moduleDir: string, callback?: () => void): void;
        reelsComplete(callback?: () => void): void;
        backout(amount: number): (t: number) => number;
        updateTweeting(): void;
        updateReels(): void;
    }
}
/// <amd-module name="@scom/scom-slot/translations.json.ts" />
declare module "@scom/scom-slot/translations.json.ts" {
    const _default_1: {
        en: {
            slot_machine: string;
            slot_machine_name: string;
            default_stake: string;
            first_image_url: string;
            second_image_url: string;
            third_image_url: string;
        };
        "zh-hant": {
            slot_machine: string;
            slot_machine_name: string;
            default_stake: string;
            first_image_url: string;
            second_image_url: string;
            third_image_url: string;
        };
        vi: {
            slot_machine: string;
            slot_machine_name: string;
            default_stake: string;
            first_image_url: string;
            second_image_url: string;
            third_image_url: string;
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-slot" />
declare module "@scom/scom-slot" {
    import { ControlElement, Container, Module } from "@ijstech/components";
    import { ISlotInfo } from "@scom/scom-slot/interface.ts";
    interface ScomSlotElement extends ControlElement {
    }
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-slot']: ScomSlotElement;
            }
        }
    }
    export class ScomSlot extends Module {
        private model;
        private pnlCanvas;
        private app;
        private headerText;
        private stackText;
        private winText;
        private balanceText;
        private reelContainer;
        private buttonSpin;
        private leftArrow;
        private rightArrow;
        private parentContainer;
        tag: any;
        constructor(parent?: Container, options?: any);
        static create(options?: ScomSlotElement, parent?: Container): Promise<ScomSlot>;
        set width(value: string | number);
        private initModel;
        getConfigurators(): {
            name: string;
            target: string;
            getActions: any;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        getConfigJson(): {
            en: {
                slot_machine: string;
                slot_machine_name: string;
                default_stake: string;
                first_image_url: string;
                second_image_url: string;
                third_image_url: string;
            };
            "zh-hant": {
                slot_machine: string;
                slot_machine_name: string;
                default_stake: string;
                first_image_url: string;
                second_image_url: string;
                third_image_url: string;
            };
            vi: {
                slot_machine: string;
                slot_machine_name: string;
                default_stake: string;
                first_image_url: string;
                second_image_url: string;
                third_image_url: string;
            };
        };
        getData(): ISlotInfo;
        setData(value: ISlotInfo): Promise<void>;
        getTag(): any;
        setTag(value: any): Promise<void>;
        private updateUIBySetData;
        updateBalance(): void;
        private loadAsset;
        private updateSlot;
        private updateContainer;
        private updateStackInfo;
        private updateButtonSpin;
        private initSlot;
        resizeLayout(): void;
        private isEmptyData;
        init(): Promise<void>;
        render(): any;
    }
}
