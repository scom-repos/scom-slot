/// <amd-module name="@scom/scom-slot/translations.json.ts" />
declare module "@scom/scom-slot/translations.json.ts" {
    const _default: {
        en: {
            slot_machine: string;
        };
        "zh-hant": {
            slot_machine: string;
        };
        vi: {
            slot_machine: string;
        };
    };
    export default _default;
}
/// <amd-module name="@scom/scom-slot/interface.ts" />
declare module "@scom/scom-slot/interface.ts" {
    export interface ISlotConfig {
        id?: string;
        slotName?: string;
    }
    export interface ISlotInfo {
        config: ISlotConfig;
        slotName: string;
    }
}
/// <amd-module name="@scom/scom-slot/configInput.tsx" />
declare module "@scom/scom-slot/configInput.tsx" {
    import { ControlElement, Module } from '@ijstech/components';
    import { ISlotConfig } from "@scom/scom-slot/interface.ts";
    global {
        namespace JSX {
            interface IntrinsicElements {
                ['i-scom-slot--config-input']: ControlElement;
            }
        }
    }
    export class ScomSlotConfigInput extends Module {
        private edtSlotName;
        private timeout;
        private config;
        getData(): {
            slotName: any;
        };
        setData(data: ISlotConfig): Promise<void>;
        private handleSlotNameChanged;
        init(): Promise<void>;
        render(): any;
    }
}
/// <amd-module name="@scom/scom-slot/formSchema.ts" />
declare module "@scom/scom-slot/formSchema.ts" {
    import { ScomSlotConfigInput } from "@scom/scom-slot/configInput.tsx";
    const _default_1: {
        dataSchema: {
            type: string;
            properties: {
                config: {
                    title: string;
                    type: string;
                    required: boolean;
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
        customControls(): {
            "#/properties/config": {
                render: () => ScomSlotConfigInput;
                getData: (control: ScomSlotConfigInput) => {
                    slotName: any;
                };
                setData: (control: ScomSlotConfigInput, value: string, rowData: any) => Promise<void>;
            };
        };
    };
    export default _default_1;
}
/// <amd-module name="@scom/scom-slot/model.ts" />
declare module "@scom/scom-slot/model.ts" {
    import { ISlotInfo } from "@scom/scom-slot/interface.ts";
    export class SlotModel {
        private _tag;
        updateUIBySetData: () => Promise<void>;
        private _data;
        getConfigurators(): {
            name: string;
            target: string;
            getActions: any;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        setData(value: any): Promise<void>;
        getData(): ISlotInfo;
        getTag(): any;
        setTag(value: any): void;
        private getActions;
        get isLoggedIn(): boolean;
    }
}
/// <amd-module name="@scom/scom-slot" />
declare module "@scom/scom-slot" {
    import { ControlElement, Container, Module } from "@ijstech/components";
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
        private balance;
        private stake;
        private win;
        private playing;
        private blue;
        private green;
        private orange;
        private loader;
        private running;
        private _isPreview;
        private headerText;
        private Howler;
        private Howl;
        constructor(parent?: Container, options?: any);
        get isPreview(): boolean;
        set isPreview(value: boolean);
        getConfigurators(): {
            name: string;
            target: string;
            getActions: any;
            getData: any;
            setData: any;
            getTag: any;
            setTag: any;
        }[];
        addStake(): void;
        minusStake(): void;
        reduceBalance(): void;
        tweenTo(object: any, property: any, target: any, time: any, easing: any, onchange: any, oncomplete: any): {
            object: any;
            property: any;
            propertyBeginValue: any;
            target: any;
            easing: any;
            time: any;
            change: any;
            complete: any;
            start: number;
        };
        lerp(a1: any, a2: any, t: any): number;
        static create(options?: ScomSlotElement, parent?: Container): Promise<ScomSlot>;
        init(): Promise<void>;
        loadLib(moduleDir: string): Promise<unknown>;
        loadAsset(): Promise<void>;
        onAssetsLoaded(): void;
        startPlay(): void;
        reelsComplete(): void;
        backout(amount: any): (t: any) => number;
        render(): any;
        getData(): import("@scom/scom-slot/interface.ts").ISlotInfo;
        private updateUIBySetData;
    }
}
