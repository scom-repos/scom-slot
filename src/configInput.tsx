import {
    customElements,
    ControlElement,
    Styles,
    Module,
    Input,
    ComboBox,
    Panel,
} from '@ijstech/components';
// import { fetchCommunities, fetchCommunityProducts, fetchCommunityStalls, getCommunityBasicInfoFromUri, getLoggedInUserId } from './utils';
import translations from './translations.json';
import { ISlotConfig } from './interface';

const Theme = Styles.Theme.ThemeVars;

declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['i-scom-slot--config-input']: ControlElement;
        }
    }
}

@customElements('i-scom-slot--config-input')
export class ScomSlotConfigInput extends Module {
    private edtSlotName: Input;
    private timeout: any;
    private config: ISlotConfig = {};
    // private communities: ICommunity[];

    getData() {
        const slotName = this.edtSlotName?.value || "";
        return {
            slotName
        }
    }

    async setData(data: ISlotConfig) {
        this.config = data;
        if(this.edtSlotName) {
            this.edtSlotName.value = data.slotName || "";
        }
    }

    private async handleSlotNameChanged() {
        if(this['onChanged']) this['onChanged']();
        if (this.timeout) clearTimeout(this.timeout);
        const slotName = this.edtSlotName.value;
        if(!slotName) return;

    }

    async init() {
        this.i18n.init({ ...translations });
        super.init();
    }

    render() {
        return (
            <i-stack direction="vertical">
                <i-panel id="pnlSlotName" padding={{ top: 5, bottom: 5, left: 5, right: 5 }}>
                    <i-stack direction="vertical" width="100%" margin={{ bottom: 5 }} gap={5}>
                        <i-label caption="$slot_name"></i-label>
                        <i-input
                            id="edtSlotName"
                            width="100%"
                            height={42}
                            padding={{ top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }}
                            border={{ radius: '0.625rem' }}
                            placeholder="Slot name"
                            onChanged={this.handleSlotNameChanged}
                        ></i-input>
                    </i-stack>
                </i-panel>
            </i-stack>
        )
    }
}