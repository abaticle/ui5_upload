# ui5_upload

ui5_upload is node module to easily update a SAPUI5 repository.

It work this way :
1. The source folder is zipped
2. The zip file is sent to SAP in a temporary folder to a specific SICF node
3. Then the standard function module /UI5/UI5_REPOSITORY_LOAD_HTTP is called to update the repository

### Installation

1. For the moment the repository can't be installed using npm, so this git repository must be used. So you will need git installed on your computer.

```sh
npm install https://github.com/abaticle/ui5_upload.git
```

2. On your SAP system a SICF HTTP class need to be created. Use SAPLINK to install the nugget :


    [NUGG_ZCL_LOAD_UI5_REPOSITORY.nugg](ui5_upload/NUGG_ZCL_LOAD_UI5_REPOSITORY.nugg)

3. Create a SICF node to handle this class. Remember this node url, as you will need it later.

### Usage

You repository can now easily be updated 

```sh
var ui5 = require("ui5_upload");

ui5({
    sourceFolder: "../path/to/my/sources",
    uploadUrl: "http://<your user>:<your password>@<path to sicf node>",
    application: "ZAPPLICATION_NAME",
    transportOrder: "DCVKXXXXX",
    package: "ZMY_PACK",
    displayLog: true
}, function(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(JSON.stringify(result));
});
```