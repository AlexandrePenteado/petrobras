define(["knockout"],function (ko) {
    var DeviceModel = function(){
        var self = this;
        
        self.id = ko.observable(0);
        self.fullName = ko.observable();
        self.petrobrasKey = ko.observable();
        self.phoneNumber = ko.observable();
        self.license = ko.observable();
        self.imei = ko.observable();
        self.isActive = ko.observable();
        self.dateActivation = ko.observable();
        self.dateExpiration = ko.observable();
        self.dateAlteration = ko.observable();
        
        self.isActiveLabel = ko.computed(function () {
            return this.isActive() === true ? "Ativo" : "Inativo";
        }, self);
    };
    
    return DeviceModel;
});