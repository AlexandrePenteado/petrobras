define(["text!./index-component.html",
        "knockout",
        "ko-postbox"], function (html, ko, postbox) {

    function IndexComponentViewModel() {
        var self = this;
        
        self.adminDeviceVisible = ko.observable(true);
        self.licenseControl =  ko.observable(false);
        self.historicControl =  ko.observable(false);
        self.uploadControl =  ko.observable(false);
        self.emailControl =  ko.observable(false);
        
        self.indexViewModel = ko.observable(this).publishOn("indexViewModel");
    }
    
    IndexComponentViewModel.prototype.changeView = function(view) {
        var self = this;
        
        if(view === "device") {
            self.adminDeviceVisible(true);
        } else {
            self.adminDeviceVisible(false);
        }
        
        if(view === "license") {
            self.licenseControl(true);
        } else {
            self.licenseControl(false);
        }
        
        if(view === "historic") {
            self.historicControl(true);
        } else {
            self.historicControl(false);
        }
        
        if(view === "upload") {
            self.uploadControl(true);
        } else {
            self.uploadControl(false);
        }
        
        if(view === "email") {
            self.emailControl(true);
        } else {
            self.emailControl(false);
        }
    };

    return {viewModel: IndexComponentViewModel, template: html};

});
