define(["text!./licensing-component.html",
    "webgis/models/LicenseTypeModel",
    "webgis/models/DeviceModel",
    "webgis/models/Utils",
    "bootstrap",
    "bootbox",
    "datatables",
    "datatablesBootstrap",
    "knockout"], function (html, LicenseTypeModel, DeviceModel, Utils,
                           bootstrap, bootbox, datatables, datatablesBootstrap, ko) {

    function LicensingComponentViewModel() {
        var self = this;

        self.licensingViewModel = ko.observable(this).publishOn("licensingViewModel");

        self.licenseType = ko.observableArray([]);
        self.selectedLicenseType = ko.observable();

        self.licenses = ko.observableArray([]);
        
        self.today = new Date();
    }

    LicensingComponentViewModel.prototype.focus = function () {
        var self = this;

        self.today = new Date();
        
        self.getLicenseType();
        self.queryLicenses();
    };

    LicensingComponentViewModel.prototype.getLicenseType = function () {
        var self = this;
        
        self.licenseType([]);
        
        self.licenseType.push(new LicenseTypeModel("Licenças Livres", "livres", 0));
        self.licenseType.push(new LicenseTypeModel("Licenças Ativas", "ativas", 0));
        self.licenseType.push(new LicenseTypeModel("Licenças Expiradas", "expiradas",0));

        self.selectedLicenseType(self.licenseType()[0]);
    };

    LicensingComponentViewModel.prototype.changeLicenseType = function (item) {
        var self = this;

        self.selectedLicenseType(item);

        self.queryLicenses();
    };

    LicensingComponentViewModel.prototype.queryLicenses = function () {
        var self = this;

        $.ajax({
            data: "",
            dataType: "json",
            type: 'get',
            crossDomain: true,
            contentType: "application/json",
            complete: function (jqXHR) {
                var result = JSON.parse(jqXHR.responseText);

                self.queryLicensesCompleted(result);
            },
            error: function () {
                bootbox.alert("Erro ao buscar dispositivos. Contate o administrador.");
            },
            url: Utils.baseUrl + "selectData?tablename=dispositivos&columns=*&whereclause=1=1"
        });
    };

    LicensingComponentViewModel.prototype.queryLicensesCompleted = function (result) {
        var self = this;
        
        self.licenses([]);
        
        if (self.datatable) {
            self.datatable.clear();
            self.datatable.destroy();
        }

        var countLicenseType = {};
        countLicenseType["ativas"] = 0;
        countLicenseType["expiradas"] = 0;
        countLicenseType["livres"] = 0;

        self.activeLicenses = [];
        self.expiredLicenses = [];

        for (var i = 0; i < result.length; i++) {
            var device = result[i];
            
            for (var key in device) {
        		var temp; 
        	    if (device.hasOwnProperty(key)) {
        	    	temp = device[key];
        	        delete device[key];
        	        device[key.toLowerCase()] = temp;
        	    }
        	}

            var deviceModel = new DeviceModel();
            deviceModel.id(device.id);
            deviceModel.fullName(device.nome_usuario);
            deviceModel.petrobrasKey(device.chave_petrobras);
            deviceModel.phoneNumber(device.telefone);
            deviceModel.license(device.licenca);
            deviceModel.imei(device.imei);
            deviceModel.isActive(device.status === "1" ? true : false);
            deviceModel.dateActivation(Utils.formatDateBr(device.data_ativacao));
            deviceModel.dateExpiration(Utils.formatDateBr(device.data_expiracao));
            deviceModel.dateAlteration(device.data_alteracao);
            
            if(device.data_alteracao === "null" && self.convertStringToDate(device.data_expiracao) >= self.today && device.status === '1') {
                countLicenseType.ativas++;
                self.activeLicenses.push(deviceModel);
            } else if(self.convertStringToDate(device.data_expiracao) < self.today) {
                countLicenseType.expiradas++;
                self.expiredLicenses.push(deviceModel);
            }
        }
        
        if(self.selectedLicenseType().alias() === "ativas") {
            ko.utils.arrayPushAll(self.licenses, self.activeLicenses);
        } else if(self.selectedLicenseType().alias() === "expiradas") {
            ko.utils.arrayPushAll(self.licenses, self.expiredLicenses);
        }
        
        self.updateLicenseCount(countLicenseType);
        
        setTimeout(function () {
            self.datatable = $('#tableLicense').DataTable({
                "autoWidth": false,
                smart: false,
                language: {url: "src/libs/datatableJquery/json/pt-br.json"}
            });
        }, 100);
    };
    
    LicensingComponentViewModel.prototype.convertStringToDate = function (dateString) {
        return new Date(dateString);
    };
    
    LicensingComponentViewModel.prototype.updateLicenseCount = function (countLicenseType) {
        var self = this;
        
        for(var i=0; i < self.licenseType().length; i++) {
            var licenseType = self.licenseType()[i];
            
            if(licenseType.alias() === "livres") {
                licenseType.count(Utils.numberOfLicenses - countLicenseType.ativas);
            } else {
                licenseType.count(countLicenseType[licenseType.alias()]);
            }
        }
    };

    return {viewModel: LicensingComponentViewModel, template: html};
});
