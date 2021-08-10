import React from 'react';
import { FlumeConfig, Colors, Controls } from 'flume';

const processor = process.env.REACT_APP_PROCESSOR_URL;

export const getNodeTypes = (templateOptions, issueCertificateListOptions, productsList) => {
    return new FlumeConfig()
    // All port types
    .addPortType({
        type: "data",
        name: "data",
        label: "Data Object",
        color: Colors.yellow,
        controls: [
            Controls.custom({
                name: "data",
                label: "Data Object",
                defaultValue: {},
                render: (data, onChange) => (
                    <PrettyPrint data={data} />
                ),
            })
        ]
    })
    .addPortType({
        type: "bytes",
        name: "bytes",
        label: "Byte data",
        color: Colors.red,
        controls: [
            Controls.custom({
                name: "bytes",
                label: "Byte Data",
                defaultValue: [],
                render: (data, onChange) => (
                    <PrettyPrint data={data} />
                ),
            })
        ]
    })
    .addPortType({
        type: "boolean",
        name: "boolean",
        label: "True/False",
        color: Colors.blue,
        controls: [
            Controls.checkbox({
                name: "boolean",
                label: "True/False"
            })
        ]
    })
    .addPortType({
        type: "string",
        name: "string",
        label: "Text",
        acceptTypes: ["string", "orgForm", "emailTemplate", "stringCompare", "issueCertificateList", "productsList"],
        color: Colors.green,
        controls: [
            Controls.text({
                name: "string",
                label: "Text"
            })
        ]
    })
    .addPortType({
        type: "orgForm",
        name: "orgForm",
        label: "Forms",
        color: Colors.green,
        acceptTypes: ["string"],
        controls: [
        Controls.select({
            name: "orgForm",
            label: "Org Forms",
            options: [
                {value: "preApptForm", label: "Pre appointment form"},
                {value: "tvForm", label: "Travel vaccine"},
            ]
        })
        ]
    })
    .addPortType({
        type: "emailTemplate",
        name: "emailTemplate",
        label: "Email Template",
        color: Colors.green,
        acceptTypes: ["string"],
        controls: [
            Controls.select({
                name: "emailTemplate",
                label: "Template",
                options: templateOptions,
            })
        ]
    })
    .addPortType({
        type: "productsList",
        name: "productsList",
        label: "Product List",
        color: Colors.green,
        acceptTypes: ["string"],
        controls: [
            Controls.select({
                name: "productsList",
                label: "Template",
                options: productsList,
            })
        ]
    })
    .addPortType({
        type: "stringCompare",
        name: "stringCompare",
        label: "Maths",
        color: Colors.green,
        controls: [
            Controls.select({
                name: "stringCompare",
                label: "Maths",
                options: [
                    {value: "eq", label: "Equal to"},
                    {value: "neq", label: "Not Equal to"},
                ]
            })
        ]
    })
    .addPortType({
        type: "issueCertificateList",
        name: "issueCertificateList",
        label: "Certificates",
        color: Colors.green,
        acceptTypes: ["string"],
        controls: [
            Controls.select({
                name: "issueCertificateList",
                label: "Certificates",
                options: issueCertificateListOptions,
            })
        ]
    })
    .addPortType({
        type: "logicGate",
        name: "Logic Gate",
        color: Colors.green,
        controls: [
            Controls.select({
                name: "logicGate",
                label: "Gate",
                options: [
                    {value: "and", label: "AND (A B)"},
                    {value: "or", label: "OR (A+B)"},
                    {value: "not", label: "NOT (A !A)"},
                ]
            })
        ]
    })
    // Functionality ports
    .addNodeType({
        type: "value",
        name: "stringValue",
        label: "String value",
        description: "A base string value",
        initalWidth: 120,
        inputs: ports => [
            ports.string({
                hidePort: true,
                name: "value",
                label: "Value"
            })
        ],
        outputs: ports => [
            ports.string({
                name: "value",
                label: "Value",
            })
        ]
    })
    .addNodeType({
        type: "sendGridTemplateString",
        name: "sendGridTemplateString",
        label: "Sendgrid Templates",
        description: "All the available sendgrid templates",
        initalWidth: 120,
        inputs: ports => [
            ports.emailTemplate({
                hidePort: true,
                name: "value",
                label: "Value"
            })
        ],
        outputs: ports => [
            ports.emailTemplate({
                name: "value",
                label: "Value"
            })
        ]
    })
    .addNodeType({
        type: "productListString",
        name: "productsListString",
        label: "Products List",
        description: "All the available productsd",
        initalWidth: 120,
        inputs: ports => [
            ports.productsList({
                hidePort: true,
                name: "product",
                label: "Product"
            })
        ],
        outputs: ports => [
            ports.productsList({
                name: "product",
                label: "Product"
            })
        ]
    })
    .addNodeType({
        type: "checkOrderForProduct",
        label: "Check Order for product",
        description: "Check an order for a product",
        initialWidth: 220,
        actionNode: true,
        inputs: ports => [
            ports.productsList({
                name: "product",
                label: "Product ID"
            }),
            ports.string({
                name: "order",
                label: "Order"
            }),
            ports.boolean({
                name: "incBundles",
                label: "include bundles"
            })
        ],
        outputs: ports => [
            ports.boolean({
                name: "productPresent",
                label: "Product present on order",
            })
        ]
    })
    .addNodeType({
        type: "checkProductHasTag",
        label: "Check product for given tag",
        description: "Check a product for a tag",
        initialWidth: 220,
        actionNode: true,
        inputs: ports => [
            ports.productsList({
                name: "product",
                label: "Product ID"
            }),
            ports.string({
                name: "tag",
                label: "Tag"
            }),
        ],
        outputs: ports => [
            ports.boolean({
                name: "tagPresent",
                label: "Tag present in product",
            })
        ]
    })
    .addNodeType({
        type: "stringToData",
        name: "stringToData",
        label: "String to data",
        description: "Injects a string into a data flow",
        initalWidth: 100,
        inputs: ports => [
            ports.string({
                name:"key",
                label: "Key",
            }),
            ports.string({
                name: "value",
                label: "Value",
            })
        ],
        outputs: ports => [
            ports.data({
                name: "data",
                label: "Output"
            })
        ]
    })
    .addNodeType({
        type: "eventStart",
        label: "Event Start",
        description: "The triggering starting point for a processor event",
        initialWidth: 120,
        addable: false,
        deletable: false,
        outputs: ports => [
            ports.data({
                name: "data",
                label: "Event Data"
            })
        ]
    })
    .addNodeType({
        type: "mergeData",
        label: "Join data",
        description: "Combines two objects",
        initialWidth: 160,
        inputs: ports => [
            ports.string({
                name: "primary_tag",
                label: "Primary Tag",
            }),
            ports.data({
                name: "primary",
                label: "Primary"
            }),
            ports.string({
                name: "secondary_tag",
                label: "Secondary Tag",
            }),
            ports.data({
                name: "secondary",
                label: "Secondary"
            }),
        ],
        outputs: ports => [
            ports.data({
                name: "combined",
                label: "Combined"
            }),
        ]
    })
    .addNodeType({
        type: "logicStringBoolMaths",
        label: "String Maths",
        initalWidth: 160,
        inputs: ports => [
            ports.stringCompare({
                name: "maths",
                label: "Maths",
                hidePort: true,
            }),
            ports.string({
                name: "a",
                label: "Input 1",
            }),
            ports.string({
                name: "b",
                label: "Input 2",
            })
        ],
        outputs: ports => [
            ports.boolean({
                name: "result",
                label: "Result"
            }),
        ]
    })
    .addNodeType({
        type: "logicLogicGates",
        label: "Boolean Logic gates",
        initalWidth: 160,
        inputs: ports => [
            ports.logicGate({
                name: "gate",
                label: "Gate",
            }),
            ports.boolean({
                name: "a",
                label: "A",
            }),
            ports.boolean({
                name: "b",
                label: "B",
            })
        ],
        outputs: ports => [
            ports.boolean({
                name: "result",
                label: "Result"
            }),
        ]
    })
    .addNodeType({
        type: "getAppointment",
        label: "Get Booking Slot",
        initalWidth: 160,
        inputs: ports => [
            ports.string({
                name: "appointmentId",
                label: "Appointment ID",
            }),
        ],
        outputs: ports => [
            ports.data({
                name: "data",
                label: "Appointment Data"
            })
        ]
    })
    .addNodeType({
        type: "getUserFromRole",
        label: "Get User From Role",
        initalWidth: 160,
        inputs: ports => [
            ports.string({
                name: "userRoleId",
                label: "User Role ID",
            }),
        ],
        outputs: ports => [
            ports.data({
                name: "data",
                label: "User Data"
            })
        ]
    })
    .addNodeType({
        type: "getBookingUser",
        label: "Get Booking User",
        initalWidth: 160,
        inputs: ports => [
            ports.string({
                name: "appointmentId",
                label: "Appointment ID",
            }),
            ports.string({
                name: "bookingUserId",
                label: "Booking User ID",
            }),
        ],
        outputs: ports => [
            ports.data({
                name: "data",
                label: "Booking User Data"
            })
        ]
    })
    .addNodeType({
        type: "putBookingUserMetadata",
        label: "Put Booking User Metadata",
        initalWidth: 160,
        inputs: ports => [
            ports.string({
                name: "appointmentId",
                label: "Appointment ID",
            }),
            ports.string({
                name: "bookingUserId",
                label: "Booking User ID",
            }),
            ports.data({
                name: "data",
                label: "Booking User Data"
            })
        ]
    })
    .addNodeType({
        type: "getOrder",
        label: "Get Order",
        initalWidth: 160,
        inputs: ports => [
            ports.string({
                name: "order",
                label: "Order ID",
            })
        ],
        outputs: ports => [
            ports.data({
                name: "data",
                label: "Order Data"
            })
        ]
    })
    .addNodeType({
        type: "getOrderByShortToken",
        label: "Get Order via short token (order reference)",
        initalWidth: 160,
        inputs: ports => [
            ports.string({
                name: "order",
                label: "Short Token",
            })
        ],
        outputs: ports => [
            ports.data({
                name: "data",
                label: "Order Data"
            })
        ]
    })
    .addNodeType({
        type: "issueCertificate",
        label: "Create Certificate",
        initalWidth: 160,
        inputs: ports => [
            ports.issueCertificateList({
                name: "certificates",
                label: "Certificate",
            }),
            ports.boolean({
                name:"createCertificate",
                label: "Create Certificate",
            }),
            ports.data({
                name: "data",
                label: "Booking User data",
            }),
            ports.string({
                name: "provider",
                label: "Provider",
            }),
            ports.string({
                name: "provider_id",
                label: "Provider ID",
            }),
            ports.string({
                name: "recipient_id",
                label: "Recipient ID",
            }),
            ports.string({
                name: "reference",
                label: "Reference",
            }),
            ports.string({
                name: "email",
                label: "Email",
            })
        ],
        outputs: ports => [
            ports.data({
                name: "data",
                label: "Certificate Data"
            })
        ]
    })
    .addNodeType({
        type: "createDropboxReceipt",
        label: "Create Dropbox Receipt",
        initalWidth: 160,
        inputs: ports => [
            ports.boolean({
                name:"createReceipt",
                label: "Create Receipt",
            }),
            ports.data({
                name: "data",
                label: "Receipt Data",
            })
        ],
    })
    .addNodeType({
        type: "updateDropboxReceipt",
        label: "Update Dropbox Receipt",
        initalWidth: 160,
        inputs: ports => [
            ports.boolean({
                name:"updateReceipt",
                label: "Update Receipt",
            }),
            ports.data({
                name: "data",
                label: "Receipt Data",
            })
        ],
    })
    .addNodeType({
        type: "markDropboxReceiptMissed",
        label: "Update Dropbox Receipt as appointment missed",
        initalWidth: 160,
        inputs: ports => [
            ports.boolean({
                name:"updateReceipt",
                label: "Update Receipt",
            }),
            ports.data({
                name: "data",
                label: "Receipt Data",
            })
        ],
    })
    .addNodeType({
        type: "getRenderCertificate",
        label: "Get Certificate Bytes",
        initalWidth: 160,
        inputs: ports => [
            ports.string({
                name: "certificateId",
                label: "Certificate Id"
            })
        ],
        outputs: ports => [
            ports.bytes({
                name: "data",
                label: "Certificate Data"
            })
        ]
    })
    .addNodeType({
        type: "getDiscountViaCode",
        label: "Get Discount information by code",
        initalWidth: 160,
        inputs: ports => [
            ports.string({
                name: "discountCode",
                label: "Discount Code"
            })
        ],
        outputs: ports => [
            ports.data({
                name: "data",
                label: "Discount Data"
            })
        ]
    })
    .addNodeType({
        type: "logicBoolString",
        label: "Boolean string output",
        initalWidth: 160,
        inputs: ports => [
            ports.boolean({
                label: "input",
            }),
            ports.string({
                name: "inputTrue",
                label: "input true",
            }),
            ports.string({
                name: "inputFalse",
                label: "input false",
            })
        ],
        outputs: ports => [
            ports.string({
                label: "output"
            })
        ]
    })
    .addNodeType({
        type: "getDataValue",
        label: "Get data object value",
        description: "Extract a value from the JSON object data",
        initialWidth: 160,
        inputs: ports => [
            ports.data({
                name: "object",
                label: "data"
            }),
            ports.string({
                name: "key",
                label: "Key"
            }),
        ],
        outputs: ports => [
            ports.string({
                label: "value",
            })
        ]
    })
    .addNodeType({
        type: "getDataData",
        label: "Get data object data",
        description: "Extract a child object from the JSON object data",
        initialWidth: 160,
        inputs: ports => [
            ports.data({
                name: "object",
                label: "data"
            }),
            ports.string({
                name: "key",
                label: "Key"
            }),
        ],
        outputs: ports => [
            ports.data({
                label: "value",
            })
        ]
    })
    .addNodeType({
        type: "sendSendgridEmail",
        label: "Send Sendgrid email",
        description: "Send an email",
        initialWidth: 220,
        actionNode: true,
        inputs: ports => [
            ports.emailTemplate({
                name: "template",
                label: "Template"
            }),
            ports.boolean({
                name: "send",
                label: "Send if true",
            }),
            ports.string({
                name: "to",
                label: "To"
            }),
            ports.string({
                name: "from",
                label: "From",
            }),
            ports.data({
                name:"data",
                label: "Template Data",
            }),
            ports.bytes({
                name: "bytes",
                label: "Attachment",
            }),
        ]
    })
    .addNodeType({
        type: "stringFormatValue",
        label: "String template formatter",
        initalWidth: 600,
        inputs: ports => [
            ports.string({
                name: "template",
                label: "Template"
            }),
            ports.data({
                name: "data",
                label: "Template Data"
            })
        ],
        outputs: ports => [
            ports.string({
                name: "result",
                label: "Template result"
            })
        ],
    })
    .addNodeType({
        type: "sendHTTP",
        label: "HTTP Request",
        initalWidth: 200,
        inputs: ports => [
            ports.boolean({
                name: "send",
                label: "send request"
            }),
            ports.string({
                name: "url",
                label: "url",
            }),
            ports.string({
                name: "method",
                label: "method",
            }),
            ports.data({
                name: "body",
                label: "body"
            })
        ]
    })
    .addNodeType({
        type: "form",
        label: "Form",
        description: "Generate a form to be filled in",
        initialWidth: 160,
        inputs: ports => [
            ports.orgForm({
                name: "form",
                label: "Form",
                hidePort: true,
            })
        ],
        outputs: ports => [
            ports.data({
                name: "formData",
                label: "Form Data",
            })
        ]
    })
    .addNodeType({
        type: "boolFailOnFalse",
        label: "Fail task on false input",
        initalWidth: 200,
        inputs: ports => [
            ports.boolean({
                name: "input",
                label: "Input"
            }),
        ]
    })
    .addNodeType({
        type: "sendSMS",
        label: "Send SMS",
        initalWidth: 200,
        inputs: ports => [
            ports.boolean({
                name: "send",
                label: "send request"
            }),
            ports.string({
                name: "recipient",
                label: "Recipient number",
            }),
            ports.string({
                name: "sender",
                label: "Sender Number",
            }),
            ports.string({
                name: "content",
                label: "Content"
            })
        ]
    })
    .addNodeType({
        type: "issueSynlabOrder",
        label: "Create Synlab Result",
        initalWidth: 160,
        inputs: ports => [
            ports.boolean({
                name:"createSynlabResult",
                label: "Create Synlab Result",
            }),
            ports.data({
                name: "data",
                label: "Synlab Result Data",
            })
        ],
    })
    .addNodeType({
        type: "getSynlabResult",
        label: "Get Synlab Result",
        initalWidth: 160,
        inputs: ports => [
            ports.string({
                name: "result",
                label: "Result ID",
            })
        ],
        outputs: ports => [
            ports.data({
                name: "data",
                label: "Synlab Result Data",
            })
        ]
    })
    .addNodeType({
        type: "getSynlabReceipt",
        label: "Get Synlab Receipt",
        initalWidth: 160,
        inputs: ports => [
            ports.string({
                name: "result",
                label: "Receipt ID",
            })
        ],
        outputs: ports => [
            ports.data({
                name: "data",
                label: "Synlab Receipt Data",
            })
        ]
    })
    .addNodeType({
        type: "getShopProduct",
        label: "Get Shop Product",
        initalWidth: 160,
        inputs: ports => [
            ports.productsList({
                name: "id",
                label: "Product ID",
            })
        ],
        outputs: ports => [
            ports.data({
                name: "data",
                label: "Product Data",
            })
        ]
    })
    .addNodeType({
        type: "getDropbox",
        label: "Get Dropbox",
        initalWidth: 160,
        inputs: ports => [
            ports.string({
                name: "dropbox",
                label: "Dropbox ID",
            })
        ],
        outputs: ports => [
            ports.data({
                name: "data",
                label: "Dropbox Data",
            })
        ]
    })
    .addNodeType({
        type: "getBookingUserDataByKey",
        label: "Get Booking User Data by Key",
        initalWidth: 160,
        inputs: ports => [
            ports.string({
                name: "key",
                label: "Key to search by",
            }),
            ports.string({
                name: "value",
                label: "Value to search for",
            }),
        ],
        outputs: ports => [
            ports.data({
                name: "data",
                label: "Booking User Data",
            })
        ]
    })
    .addNodeType({
        type: "createEurofinsOrder",
        label: "Create Eurofins order",
        initalWidth: 150,
        inputs: ports => [
            ports.boolean({
                name: "createEurofinsOrder",
                label: "Create Order",
            }),
            ports.data({
                name: "data",
                label: "Order data",
            })
        ],
    })
    .addNodeType({
        type: "createEurofinsTransaction",
        label: "Create Eurofins transaction",
        initalWidth: 150,
        inputs: ports => [
            ports.boolean({
                name: "createEurofinsTransaction",
                label: "Create Transaction",
            }),
            ports.data({
                name: "data",
                label: "Transaction data",
            })
        ],
    })
    .addNodeType({
        type:"dataToData",
        label:"Data to Data conversion",
        initalWidth: 175,
        inputs: ports => [
            ports.string({
                name:"object",
                label: "Conversion template"
            }),
            ports.data({
                name:"inputData",
                label:"Input Data"
            })
        ],
        outputs: ports => [
            ports.data({
                name:"outputData",
                label:"Output Data"
            })
        ]
    })
    .addNodeType({
        type:"validation",
        label:"Data Validation",
        initalWidth: 175,
        inputs: ports => [
            ports.boolean({
                name:"takeAsTaskError",
                label: "Fail task on validation error",
            }),
            ports.string({
                name:"object",
                label: "Validation template"
            }),
            ports.data({
                name:"inputData",
                label:"Input Data"
            })
        ],
        outputs: ports => [
            ports.boolean({
                name:"validationResult",
                label: "Validation Result",
            }),
        ]
    })
}

const PrettyPrint = ({data}) => {
    return (<div><pre>{JSON.stringify(data, null, 2) }</pre></div>);
}
