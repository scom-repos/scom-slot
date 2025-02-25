// import { MarketplaceProductType } from "@scom/scom-social-sdk";
import formSchema from "./formSchema";
import { ISlotInfo } from "./interface";
// import { IProductInfo } from "./interface";
// import { fetchCommunityProducts, fetchCommunityStalls, getLoggedInUserId } from "./utils";

export class SlotModel {
//   private _data: ISlotInfo = {};
  private _tag: any;
  public updateUIBySetData: () => Promise<void>;
  private _data: ISlotInfo;

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
    ]
  }

  async setData(value: any) {
    this._data = value;
    const { config, slotName } = this._data || {};
    if (this.updateUIBySetData) this.updateUIBySetData();
  }

  getData() {
    return this._data;
  }

  getTag() {
    return this._tag;
  }

  setTag(value: any) {
    this._tag = value;
  }

  private getActions() {
    const actions = [
      {
        name: 'Edit',
        icon: 'edit',
        command: (builder: any, userInputData: any) => {
          let oldData: any = {};
          return {
            execute: () => {
              oldData = JSON.parse(JSON.stringify({}));
              if (builder?.setData) builder.setData(userInputData);
            },
            undo: () => {
            //   this._data = JSON.parse(JSON.stringify(oldData));
              if (builder?.setData) builder.setData(null);
            },
            redo: () => { }
          }
        },
        userInputDataSchema: formSchema.dataSchema,
        userInputUISchema: formSchema.uiSchema,
        customControls: formSchema.customControls()
      }
    ]
    return actions;
  }

  get isLoggedIn() {
    const loggedInUserStr = localStorage.getItem('loggedInUser');
    return !!loggedInUserStr;
  }

}