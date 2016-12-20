define(["text!./menu-component.html",
    "webgis/models/Utils",
    "knockout",
    "ko-postbox"], function (html, Utils, ko, postbox) {

    function MenuComponentViewModel() {
        var self = this;

        self.selectedMenuItem = ko.observable('device');

        var transform = function (newValue) {
            return newValue;
        };

        self.indexViewModel = ko.observable().subscribeTo("indexViewModel", true, transform);
    }

    MenuComponentViewModel.prototype.menuClick = function (item) {
        var self = this;
        
        Utils.validateSession();

        var transform = function (newValue) {
            return newValue;
        };

        self.adminDeviceViewModel = ko.observable().subscribeTo("adminDeviceViewModel", true, transform);
        self.licensingViewModel = ko.observable().subscribeTo("licensingViewModel", true, transform);
        self.historicViewModel = ko.observable().subscribeTo("historicViewModel", true, transform);
        self.uploadViewModel = ko.observable().subscribeTo("uploadViewModel", true, transform);
        self.emailViewModel = ko.observable().subscribeTo("emailViewModel", true, transform);

        self.selectedMenuItem(item);

        if (self.indexViewModel()) {
            self.indexViewModel().changeView(item);
            
            if(self.adminDeviceViewModel() && item === 'device') {
                self.adminDeviceViewModel().focus();
            }
            
            if(self.licensingViewModel() && item === 'license') {
                self.licensingViewModel().focus();
            }
            
            if(self.historicViewModel() && item === 'historic') {
                self.historicViewModel().focus();
            }
            
            if(self.uploadViewModel() && item === 'upload') {
                self.uploadViewModel().focus();
            }
            
            if(self.emailViewModel() && item === 'email') {
                self.emailViewModel().focus();
            }
            
        }
    };
    
    MenuComponentViewModel.prototype.logout = function () {
        window.location = URL_LOGIN_OFF;
    };

    return {viewModel: MenuComponentViewModel, template: html};

});
