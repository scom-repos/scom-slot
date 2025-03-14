import { Module, customModule, Container } from '@ijstech/components';
import { ScomSlot } from '@scom/scom-slot';
import ScomWidgetTest from '@scom/scom-widget-test';

@customModule
export default class Module1 extends Module {
  private scomSlot: ScomSlot;
  private widgetModule: ScomWidgetTest;

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  private async onShowConfig() {
    const editor = this.scomSlot.getConfigurators().find(v => v.target === 'Editor');
    const widgetData = await editor.getData();
    if (!this.widgetModule) {
      this.widgetModule = await ScomWidgetTest.create({
        widgetName: 'scom-slot',
        onConfirm: (data: any, tag: any) => {
          editor.setData(data);
          editor.setTag(tag);
          this.widgetModule.closeModal();
        }
      });
      this.widgetModule.i18n.init({ ...this.scomSlot.getConfigJson() });
    }
    this.widgetModule.openModal({
      width: '90%',
      maxWidth: '90rem',
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      closeOnBackdropClick: true,
      closeIcon: null,
      onOpen: (target) => { setTimeout(() => { target.refresh() }, 1) }
    });
    this.widgetModule.show(widgetData);
    this.widgetModule.refresh();
  }

  init() {
    super.init();
  }

  render() {
    return (
      <i-panel>
        <i-vstack
          margin={{ top: '1rem', left: '1rem', right: '1rem' }}
          gap="1rem"
        >
          <i-button caption="Config" onClick={this.onShowConfig} width={160} padding={{ top: 5, bottom: 5 }} margin={{ left: 'auto', right: 20 }} font={{ color: '#fff' }} />
          <i-scom-slot id="scomSlot" />
        </i-vstack>
      </i-panel>
    );
  }
}
