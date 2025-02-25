import { Module, customModule, Container } from '@ijstech/components';
import { ScomSlot } from '@scom/scom-slot';

@customModule
export default class Module1 extends Module {

    constructor(parent?: Container, options?: any) {
        super(parent, options);
    }

    init() {
        super.init();
    }

    render() {
        return (
            <i-vstack margin={{ left: 'auto', right: 'auto' }} padding={{left: 0, right: 0, top: 0, bottom: 0}} maxWidth={'100%'}>
                <i-scom-slot/>
            </i-vstack>
        );
    }
}
