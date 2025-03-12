export default {
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
                type: 'string', // cbb form doesnt support number because of i18n
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
}