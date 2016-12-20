define(["knockout"],function (ko) {
    var LicenseTypeModel = function(label, alias, count){
        var self = this;
        
        self.label = ko.observable(label);
        self.alias = ko.observable(alias);
        self.count = ko.observable(count);
    };
    
    return LicenseTypeModel;
});