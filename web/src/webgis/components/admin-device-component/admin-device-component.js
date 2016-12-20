define(["text!./admin-device-component.html",
    "webgis/models/DeviceModel",
    "webgis/models/Utils",
    "bootstrap",
    "bootbox",
    "datatables",
    "datatablesBootstrap",
    "knockout",
    "ko-mapping"], function (html, DeviceModel, Utils,
                    bootstrap, bootbox, datatables, datatablesBootstrap, ko, mapping) {

    function AdminDeviceComponentViewModel() {
        var self = this;

        self.adminDeviceViewModel = ko.observable(this).publishOn("adminDeviceViewModel");

        self.listDevicesVisible = ko.observable(true);

        self.selectedDevice = ko.observable(new DeviceModel());

        self.devices = ko.observableArray();

        self.isFullNameEmpty = ko.observable(false);
        self.isPetrobrasKeyEmpty = ko.observable(false);
        self.isPhoneNumberEmpty = ko.observable(false);
        self.isLicenseEmpty = ko.observable(false);
        self.isImeiEmpty = ko.observable(false);

        $('.input-group-addon').tooltip();

        self.queryDevices();
    }

    AdminDeviceComponentViewModel.prototype.focus = function () {
        var self = this;

        self.listDevicesVisible(true);
        self.selectedDevice(new DeviceModel());

        self.isFullNameEmpty(false);
        self.isPetrobrasKeyEmpty(false);
        self.isPhoneNumberEmpty(false);
        self.isLicenseEmpty(false);
        self.isImeiEmpty(false);
    };

    AdminDeviceComponentViewModel.prototype.backToListView = function () {
        var self = this;
        
        self.selectedDevice(new DeviceModel());
        self.listDevicesVisible(true);
    };

    AdminDeviceComponentViewModel.prototype.queryDevices = function () {
        var self = this;

        self.devices([]);

        if (self.datatable) {
            self.datatable.clear();
            self.datatable.destroy();
        }

        $.ajax({
            data: "",
            dataType: "json",
            type: 'get',
            crossDomain: true,
            contentType: "application/json",
            complete: function (jqXHR) {
                var result = JSON.parse(jqXHR.responseText);

                self.queryDevicesCompleted(result);
            },
            error: function () {
                bootbox.alert("Erro ao buscar dispositivos. Contate o administrador.");
            },
            
            url: Utils.baseUrl + "selectData?tablename=dispositivos&columns=*&whereclause=data_alteracao is null"
        });
    };

    AdminDeviceComponentViewModel.prototype.queryDevicesCompleted = function (result) {
        var self = this;

        var devices = [];
        for (var i = 0; i < result.length; i++) {
            var device = result[i];
            
            var deviceModel = new DeviceModel();
            deviceModel.id(device.ID);
            deviceModel.fullName(device.NOME_USUARIO);
            deviceModel.petrobrasKey(device.CHAVE_PETROBRAS);
            deviceModel.phoneNumber(device.TELEFONE);
            deviceModel.license(device.LICENCA);
            deviceModel.imei(device.IMEI);
            deviceModel.isActive(device.STATUS === "1" ? true : false);
            deviceModel.dateActivation(device.DATA_ATIVACAO);
            deviceModel.dateExpiration(device.DATA_EXPIRACAO);
            deviceModel.dateAlteration(device.DATA_ALTERACAO);

            devices.push(deviceModel);
        }

        ko.utils.arrayPushAll(self.devices, devices);

        setTimeout(function () {
            self.datatable = $('#example').DataTable({
                "columnDefs": [
                    {"orderable": false, "targets": 5}
                ],
                smart: false,
                language: {url: "src/libs/datatableJquery/json/pt-br.json"}
            });
        }, 100);
    };

    AdminDeviceComponentViewModel.prototype.newDevice = function () {
        var self = this;

        self.listDevicesVisible(false);
    };

    AdminDeviceComponentViewModel.prototype.editDevice = function (item) {
        var self = this;

        self.selectedDevice(item);

        self.listDevicesVisible(false);
    };

    AdminDeviceComponentViewModel.prototype.addDevice = function (item) {
        var self = this;

        if (!self.checkRequiredFields(item)) {
            bootbox.alert("Preencha os campos obrigatórios.");
            return;
        }

        var data = mapping.toJS(item);
        
        url = self.getUrlToInsertDispositivo(data);
        self.request(url, "Dispositivo inserido com sucesso.");
        
        //self.listDevicesVisible(true);
        self.backToListView();
    };

    AdminDeviceComponentViewModel.prototype.updateDevice = function (item) {
        var self = this;

        if (!self.checkRequiredFields(item)) {
            bootbox.alert("Preencha os campos obrigatórios.");
            return;
        }

        var data = mapping.toJS(item);
        
        if((data.isActive ? '1': '0') === '1'){
            url = self.getUrlToInsertDispositivo(data);
            self.request(url);
        }
        
        url = self.getUrlToUpdateDispositivo(data);
        self.request(url, "Dispositivo atualizado com sucesso.");

        //self.listDevicesVisible(true);
        self.backToListView();
    };

    AdminDeviceComponentViewModel.prototype.request = function (url, message) {
        var self = this;       
        
        $.ajax({
            data: "",
            dataType: "json",
            type: 'get',
            crossDomain: true,
            contentType: "application/json",
            complete: function (jqXHR) {
                var result = jqXHR.responseText;
                
                if (result.indexOf("SUCCESS") !== -1) {
                    if(message){
                        self.clearForm();
                        self.queryDevices();
                        bootbox.alert(message);
                    }
                }  
                else {
                    bootbox.alert("Erro ao completar operação. Contate o administrador.");
                }  
            },
            url: url
        });
    };

    AdminDeviceComponentViewModel.prototype.clearForm = function () {
        var self = this;

        var mappedObject = mapping.fromJS(new DeviceModel());

        self.selectedDevice(mappedObject);

        self.isFullNameEmpty(false);
        self.isPetrobrasKeyEmpty(false);
        self.isPhoneNumberEmpty(false);
        self.isLicenseEmpty(false);
        self.isImeiEmpty(false);
           
    };

    AdminDeviceComponentViewModel.prototype.checkRequiredFields = function (item) {
        var self = this;

        self.isFullNameEmpty(item.fullName() ? false : true);
        self.isPetrobrasKeyEmpty(item.petrobrasKey() ? false : true);
        self.isPhoneNumberEmpty(item.phoneNumber() ? false : true);
        self.isLicenseEmpty(item.license() ? false : true);
        self.isImeiEmpty(item.imei() ? false : true);

        return item.fullName() && item.petrobrasKey() && item.phoneNumber() && item.license() && item.imei();
    };
    
    AdminDeviceComponentViewModel.prototype.getUrlToInsertDispositivo = function (data){
        var self = this;
        
        var tablename= "dispositivos";
        
        /*var columns without cryptography key
        var columns = "&columns=(id, nome_usuario, chave_petrobras, telefone, licenca, imei, status, data_ativacao, data_expiracao)";*/
        
        //var columns with
        var columns = "&columns=(id, nome_usuario, chave_petrobras, telefone, licenca, imei, hash_imei, status, data_ativacao, data_expiracao)";
        
        var values = "&values=(";
        values = values + "seq_" + tablename              + ".nextval,";
        values = values + "'" + data.fullName              + "',";
        values = values + "'" + data.petrobrasKey          + "',";
        values = values + "'" + data.phoneNumber           + "',";
        values = values + "'" + data.license               + "',";
        values = values + "'" + data.imei                  + "',";
        values = values + (data.isActive ? '1,': '0,'); 
        values = values + "to_date('" + Utils.currentDateFormatedUS() + "','yyyy-mm-dd'),";
        values = values + "to_date('" + Utils.addDaysInDate(1095) + "','yyyy-mm-dd'))";
        
        url = Utils.baseUrl + "putData?tablename=" + tablename + columns + values;
        return encodeURI(url);
    };
    
    
    AdminDeviceComponentViewModel.prototype.getUrlToUpdateDispositivo = function (data){
        var self = this;
        
        var tablename= "dispositivos";
        var values =  "&set=data_alteracao=to_date('" + Utils.currentDateFormatedUS() + "','yyyy-mm-dd')";
        
        if((data.isActive ? '1': '0') === '0'){
            values = values + ",status=0" ;
        }
        
        var whereClause = "id='" + data.id + "'"; 
        
        url = Utils.baseUrl + "updateData?tablename=" + tablename + values + "&whereclause=" + whereClause;
        return encodeURI(url);
    };
    
    return {viewModel: AdminDeviceComponentViewModel, template: html};
});
