# ui5_upload

ui5_upload is a Node.js module to easily update a SAPUI5 repository.

It work this way :

1. The source folder is zipped.

2. The zip file is sent to SAP in a temporary folder through a specific SICF node.

3. The standard function module /UI5/UI5_REPOSITORY_LOAD_HTTP is then called to update the repository using a transport order,an application name and a package name.

### Installation

1. For the moment the repository can't be installed using npm, so this git repository must be used. So you will need git installed on your computer.

```sh
npm install https://github.com/abaticle/ui5_upload.git
```

2. On your SAP system, use SAPLINK to install the nugget :


    [NUGG_ZCL_LOAD_UI5_REPOSITORY.nugg](NUGG_ZCL_LOAD_UI5_REPOSITORY.nugg)

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