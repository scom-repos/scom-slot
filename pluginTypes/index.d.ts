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
    export class ScomPost extends Module {
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
        constructor(parent?: Container, options?: any);
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
        static create(options?: ScomSlotElement, parent?: Container): Promise<ScomPost>;
        init(): Promise<void>;
        loadAsset(): Promise<void>;
        onAssetsLoaded(): void;
        startPlay(): void;
        reelsComplete(): void;
        backout(amount: any): (t: any) => number;
        render(): any;
    }
}
