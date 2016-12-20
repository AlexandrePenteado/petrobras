define(["text!./historic-component.html",
    "webgis/models/LicenseTypeModel",
    "webgis/models/DeviceModel",
    "webgis/models/Utils",
    "bootstrap",
    "bootbox",
    "datatables",
    "datatablesBootstrap",
    "knockout"], function (html, LicenseTypeModel, DeviceModel, Utils,
                           bootstrap, bootbox, datatables, datatablesBootstrap, ko) {

    function HistoricComponentViewModel() {
        var self = this;
        self.historicViewModel = ko.observable(this).publishOn("historicViewModel");
        
        self.historic = ko.observableArray([]);
    }

    HistoricComponentViewModel.prototype.focus = function () {
        var self = this;

        self.queryHistoric();
    };

    HistoricComponentViewModel.prototype.queryHistoric = function () {
        var self = this;

        $.ajax({
            data: "",
            dataType: "json",
            type: 'get',
            crossDomain: true,
            contentType: "application/json",
            complete: function (jqXHR) {            	
            	if (jqXHR.responseText != "")
            		var result = JSON.parse(jqXHR.responseText);
            	else
            		var result = jqXHR.responseText;

                self.queryHistoricCompleted(result);
            },
            error: function () {
                bootbox.alert("Erro ao buscar dispositivos. Contate o administrador.");
            },
            url: Utils.baseUrl + "selectData?tablename=dispositivos&columns=*&whereclause=data_alteracao is not null"
        });
    };

    HistoricComponentViewModel.prototype.queryHistoricCompleted = function (result) {
        var self = this;
        
        self.historic([]);
        
        if (self.datatable) {
            self.datatable.clear();
            self.datatable.destroy();
        }
        
        var devices = [];
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
            deviceModel.dateAlteration(Utils.formatDateBr(device.data_alteracao));
            
            devices.push(deviceModel);
        }
        
        ko.utils.arrayPushAll(self.historic, devices);
        
        setTimeout(function () {
            self.datatable = $('#tableHistoric').DataTable({
                "autoWidth": false,
                language: {url: "src/libs/datatableJquery/json/pt-br.json"}
            });
        }, 100);
    };

    return {viewModel: HistoricComponentViewModel, template: html};
});
