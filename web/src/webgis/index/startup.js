require(["jquery",
    "webgis/models/Utils",
    "masked-input",
    "bootstrap",
    "bootbox",
    "knockout"],
        function ($, Utils, maskedInput, bootstrap, bootbox, ko) {
            
            $.ajax({
                type: "GET",
                url: "src/webgis/config/config.xml",
                dataType: "xml",
                error: function (xhr, ajaxOptions, thrownError) {
                    bootbox.alert("Erro na configuração da aplicação. Contate o administrador.");
                },
                success: function (xml) {
                    if($(xml).find('urlBase').text()) {
                        Utils.baseUrl = $(xml).find('urlBase').text();
                    } else {
                        bootbox.alert("Erro na configuração da aplicação. URL base inválida. Contate o administrador.");
                        return false;
                    }
                    
                    if($(xml).find('numeroLicencas').text()) {
                        Utils.numberOfLicenses = parseInt($(xml).find('numeroLicencas').text());
                    } else {
                        bootbox.alert("Erro na configuração da aplicação. Número de licenças inválido. Contate o administrador.");
                        
                        return false;
                    }
                }
            });
            
            ko.components.register('index-component', {require: 'webgis/components/index-component/index-component'});
            ko.components.register('menu-component', {require: 'webgis/components/menu-component/menu-component'});
            ko.components.register('admin-device-component', {require: 'webgis/components/admin-device-component/admin-device-component'});
            ko.components.register('licensing-component', {require: 'webgis/components/licensing-component/licensing-component'});
            ko.components.register('historic-component', {require: 'webgis/components/historic-component/historic-component'});
            ko.components.register('upload-component', {require: 'webgis/components/upload-component/upload-component'});
            ko.components.register('email-component', {require: 'webgis/components/email-component/email-component'});

            ko.bindingHandlers.masked = {
                init: function (element, valueAccessor, allBindingsAccessor) {
                    var mask = allBindingsAccessor().mask || {};
                    $(element).mask(mask);
                    ko.utils.registerEventHandler(element, 'focusout', function () {
                        var observable = valueAccessor();
                        observable($(element).val());
                    });
                },
                update: function (element, valueAccessor) {
                    var value = ko.utils.unwrapObservable(valueAccessor());
                    $(element).val(value);
                }
            };

            ko.applyBindings();
        });