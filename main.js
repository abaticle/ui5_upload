var oZipdir = require("zip-dir");
var oRequest = require("request");
var fs = require("fs");
var _ = require("lodash");


var oConfigExample = {
    sourceFolder: "sources",
    uploadUrl: "http://ABA10137:Viseo001@ns414177.ovh.net:8002/sap/zui5_repository",
    application: "ZLOAD_TEST",
    transportOrder: "DE8K900717",
    package: "ZUI5LOAD",
    codePage: "UTF-8",
    displayLog: true
};

module.exports = function(oConfig, fCallback) {

    var oError;
    var sTmpZipFile = "tmpSource.zip";

    if (!_.has(oConfig, "sourceFolder")) {
        oError = new TypeError("Missing parameter 'sourceFolder'");
        fCallback(oError, null);
        return;
    }

    if (!_.has(oConfig, "uploadUrl")) {
        oError = new TypeError("Missing parameter 'uploadUrl'");
        fCallback(oError, null);
        return;
    }

    if (!_.has(oConfig, "application")) {
        oError = new TypeError("Missing parameter 'application'");
        fCallback(oError, null);
        return;
    }

    if (!_.has(oConfig, "transportOrder")) {
        oError = new TypeError("Missing parameter 'transportOrder'");
        fCallback(oError, null);
        return;
    }


    if (!_.has(oConfig, "package")) {
        oError = new TypeError("Missing parameter 'package'");
        fCallback(oError, null);
        return;
    }

    if (!_.has(oConfig, "displayLog")) {
        oConfig.displayLog = false;
    }


    if (oConfig.displayLog) {
        console.log("Zip folder");
    }

    /*  
     *  Zip source folder
     */
    oZipdir(oConfig.sourceFolder, {
        saveTo: sTmpZipFile
    }, function(oError, buffer) {

        if (oError) {
            oError = new Error("Folder Zip error");
            fCallback(oError, null);
            return;
        }

        /*
         *  Send zipped folder to SAP
         */

        if (oConfig.displayLog) {
            console.log("Send Zip folder to SAP");
        }

        var oReqTmp = oRequest({
            method: "post",
            json: true,
            url: oConfig.uploadUrl
        }, function(oError) {

            if (oError) {
                fCallback(oError, null);
                return;
            }

            if (oConfig.displayLog) {
                console.log("Update application " + oConfig.application + " with order " + oConfig.transportOrder + " and package " + oConfig.package);
            }

            var sUrl = [
                oConfig.uploadUrl,
                "?mode=" + "update_repository",
                "&ot=" + oConfig.transportOrder,
                "&package=" + oConfig.package,
                "&application=" + oConfig.application,
                "&url=" + oConfig.uploadUrl,
                "&code_page=" + oConfig.codePage
            ].join("");

            var oReqTmp = oRequest({
                method: "get",
                url: sUrl
            }, function(oError, oResponse) {

                if (oError) {
                    fCallback(oError, null);
                    return;
                }


                var oResult = JSON.parse(oResponse.body);


                if (oResult.sucess === "E") {
                    fCallback(new Error("Error during repository update"), oResult);
                } else {
                    fCallback(null, oResult);
                }


                if (oConfig.displayLog) {
                    _.each(oResult.messages, function(oMessage) {
                        console.log(oMessage.message);
                    });
                }

            });
        });


        //Add zipped file to the request
        oReqTmp.form().append('zip', fs.createReadStream(sTmpZipFile));

    });


};