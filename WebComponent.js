(function () {
    let _shadowRoot;
    let _date;
    let _id;

    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <style>
    </style>
    <div id="ui5_content" name="ui5_content">
       <slot name="content"></slot>
    </div>
      <script id="oView" name="oView" type="sapui5/xmlview">
          <mvc:View
              controllerName="myView.Template"
              xmlns:mvc="sap.ui.core.mvc"
              xmlns="sap.m"
              height="100%">                      
                      <Link text="Show popup" press=".onShowPopupLinkPress"/>  
          </mvc:View>
      </script>  
    `;

    customElements.define('com-openpromos-sac-pdf-vidget', class PDFViewer extends HTMLElement {
        constructor() {
            super();

            _shadowRoot = this.attachShadow({
                mode: "open"
            });
            _shadowRoot.appendChild(tmpl.content.cloneNode(true));

            _id = createGuid();

            _shadowRoot.querySelector("#oView").id = _id + "_oView";


            // this._export_settings = {};
            // this._export_settings.pdf_url = "";
            // this._export_settings.title = "";
            // this._export_settings.height = "";

            // this.settings = {};
            // this.settings.format = "";

            // this.addEventListener("click", event => {
            //     console.log('click');
            //     this.dispatchEvent(new CustomEvent("onStart", {
            //         detail: {    
            //             settings: this.settings
            //         }
            //     }));
            // });

            this._firstConnection = 0;
        }

        //Fired when the widget is added to the html DOM of the page
        connectedCallback() {
            this._firstConnection = true;

            loadthis(this);
        }

        //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
        disconnectedCallback() {

        }

        //When the custom widget is updated, the Custom Widget SDK framework executes this function first
        onCustomWidgetBeforeUpdate(oChangedProperties) {

        }

        //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
        onCustomWidgetAfterUpdate(oChangedProperties) {
            if (this._firstConnection) {
                loadthis(this);
            }
        }

        //When the custom widget is removed from the canvas or the analytic application is closed
        onCustomWidgetDestroy() {
        }

        //When the custom widget is resized on the canvas, the Custom Widget SDK framework executes the following JavaScript function call on the custom widget
        // Commented out by default.  If it is enabled, SAP Analytics Cloud will track DOM size changes and call this callback as needed
        //  If you don't need to react to resizes, you can save CPU by leaving it uncommented.
        /*
        onCustomWidgetResize(width, height){
        
        }
        */

        //Getters and Setters
        get widgetText() {
            return this._tagText;
        }

        set widgetText(value) {
            this._tagText = value;
        }

        //Getters and Setters
        get headingType() {
            return this._tagType;
        }

        set headingType(value) {
            this._tagType = value;
        }

     

    });

    // UTILS
    function loadthis(that) {
        var that_ = that;


        let content = document.createElement('div');
        content.slot = "content";
        that_.appendChild(content);


        // that_._renderExportButton();

        sap.ui.getCore().attachInit(function () {
            "use strict";

            //### Controller ###
            sap.ui.define([
                "jquery.sap.global",
                "sap/ui/core/mvc/Controller",
                "sap/ui/model/json/JSONModel",
                "sap/m/MessageToast",
                "sap/ui/core/library",
                "sap/ui/core/Core",
                "sap/m/PDFViewer"
            ], function (jQuery, Controller, JSONModel, MessageToast, coreLibrary, Core, PDFViewer) {
                "use strict";

                return Controller.extend("myView.Template", {

                    onInit: function () {
                        // if (that._firstConnection === 0) {
                        //     that._firstConnection = 1;
                        //     this._sValidPath = that._export_settings.pdf_url
                        //     console.log(this._sValidPath);

                        //     this._oModel = new JSONModel({
                        //         Source: this._sValidPath,
                        //         Title: that._export_settings.title,
                        //         Height: that._export_settings.height
                        //     });

                        //     this.getView().setModel(this._oModel);
                        //     sap.ui.getCore().setModel(this._oModel, "core");
                        // } else {
                        //     var oModel = sap.ui.getCore().getModel("core");
                        //     oModel.setProperty("/Source", that._export_settings.pdf_url);
                        // }
                    },

                    onloaded: function () {
                        console.log("onloaded");
                    },

                    onerror: function () {
                        console.log("onerror");
                    },

                    onShowPopupLinkPress: function(){
                        MessageToast.show("It works...");
                        this.dipslayPDFPopup();
                    },

                    onsourceValidationFailed: function (oEvent) {
                        console.log("onsourceValidationFailed");
                        oEvent.preventDefault();
                    },

                    _getPdfSource: function(){
                        return "https://schrader.promos-consult.de:8408/sap/opu/odata/prohan/WFS4_SRV/ArchiveLinkDocuments(ProcessId=guid'e22155d5-7207-1eeb-bea0-607b6c761ffe',AttachKey='ARCHIVELINK%20DOCUMENT%2FPROMOS%2FTPE22155D572071EEBBEA0607B6C761FFE%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20T9E22155D572071EDBBEBE4F91EA1EFDF7')/$value";
                    },

                    dipslayPDFPopup: function(){
                        if (!this._oPDFViewer){
                            this._oPDFViewer = new PDFViewer();
                            this._oPDFViewer.attachSourceValidationFailed(this.onPDFSourceValidationFailed, this);
                        }

                        jQuery.sap.addUrlWhitelist("https", "schrader.promos-consult.de");
                        this._oPDFViewer.setSource(this._getPdfSource());
                        
                        this._oPDFViewer.setTitle("My Custom Document");
                        this._oPDFViewer.open();
                        this._setForPopup();
                    }, 

                    onPDFSourceValidationFailed: function(oEvent){
                        oEvent.preventDefault();
                    }
                });
            });

            //### THE APP: place the XMLView somewhere into DOM ###
            var oView = sap.ui.xmlview({
                viewContent: jQuery(_shadowRoot.getElementById(_id + "_oView")).html(),
            });

            oView.placeAt(content);
        });
    }

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0,
                v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

})();



// (function () {
//     let tmpl = document.createElement('template');
//     tmpl.innerHTML = `

//     `;

//     customElements.define('com-openpromos-sac-pdf-vidget', class PDFViewer extends HTMLElement {
//         constructor() {
//             super();
//             this._shadowRoot = this.attachShadow({ mode: "open" });
//             this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
//             this._tagContainer;
//             this._tagType = "h1";
//             this._tagText = "Hello World";

//             //Adding event handler for click events
// 			this.addEventListener("click", event => {
// 				var event = new Event("onClick");
// 				this.dispatchEvent(event);
//             });
//         }

//         //Fired when the widget is added to the html DOM of the page
//         connectedCallback() {
//             this._firstConnection = true;
//             this.redraw();
//         }

//         //Fired when the widget is removed from the html DOM of the page (e.g. by hide)
//         disconnectedCallback() {

//         }

//         //When the custom widget is updated, the Custom Widget SDK framework executes this function first
//         onCustomWidgetBeforeUpdate(oChangedProperties) {

//         }

//         //When the custom widget is updated, the Custom Widget SDK framework executes this function after the update
//         onCustomWidgetAfterUpdate(oChangedProperties) {
//             //if (this._firstConnection) {
//             this.redraw();
//             //}
//         }

//         //When the custom widget is removed from the canvas or the analytic application is closed
//         onCustomWidgetDestroy() {
//         }

//         //When the custom widget is resized on the canvas, the Custom Widget SDK framework executes the following JavaScript function call on the custom widget
//         // Commented out by default.  If it is enabled, SAP Analytics Cloud will track DOM size changes and call this callback as needed
//         //  If you don't need to react to resizes, you can save CPU by leaving it uncommented.
//         /*
//         onCustomWidgetResize(width, height){

//         }
//         */

//         //Getters and Setters
//         get widgetText() {
//             return this._tagText;
//         }

//         set widgetText(value) {
//             this._tagText = value;
//         }

//         //Getters and Setters
//         get headingType() {
//             return this._tagType;
//         }

//         set headingType(value) {
//             this._tagType = value;
//         }

//         redraw() {
//             if (this._tagText != null) {
//                 if (this._tagContainer) {
//                     this._tagContainer.parentNode.removeChild(this._tagContainer);
//                 }

//                 var shadow = window.getSelection(this._shadowRoot);

//                 this._tagContainer = document.createElement(this._tagType);
//                 var theText = document.createTextNode(this._tagText);
//                 this._tagContainer.appendChild(theText);
//                 this._shadowRoot.appendChild(this._tagContainer);
//             }
//         }

//     });

// })();
