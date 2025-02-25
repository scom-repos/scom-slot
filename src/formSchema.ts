import { ScomSlotConfigInput } from "./configInput";

export default {
    dataSchema: {
        type: 'object',
        properties: {
            config: {
                title: '$slot_machine',
                type: "object",
                required: true
            }
        }
    },
    uiSchema: {
        type: "VerticalLayout",
        elements: [
            {
                type: "Control",
                scope: "#/properties/config"
            },
        ]
    },
    customControls() {
        return {
            "#/properties/config": {
                render: () => {
                    const communityProductInput = new ScomSlotConfigInput();
                    return communityProductInput;
                },
                getData: (control: ScomSlotConfigInput) => {
                    return control.getData();
                },
                setData: async (control: ScomSlotConfigInput, value: string, rowData: any) => {
                    await control.ready();
                    control.setData(rowData?.config)
                }
            }
        }
    }
}