define(["text!./email-component.html",
    "webgis/models/Utils",
    "shp",
    "bootstrap",
    "bootbox",
    "knockout"], function (html, Utils, shp,
        bootstrap, bootbox, ko) {
	var ck=false;
    function EmailComponentViewModel() {
        var self = this;
        self.emailViewModel = ko.observable(this).publishOn("emailViewModel");
        document.getElementById("check-auto").checked = ck;
    }

    EmailComponentViewModel.prototype.focus = function () {
        //método chamado quando selecionado upload no menu
    	
    	document.getElementById("to").disabled = true;
    	document.getElementById("check-auto").checked = true;
        
    };
    
    EmailComponentViewModel.prototype.btnEnviarClick = function () {

    	var login = $("#login").val();
    	var password = $("#login-password").val();
    	var to ="getAllPetroMail";
    	var assunto = $("#assunto").val();
    	var mensagem = $("#mensagem").val();

    	login = login.replace("#",",,,,,");
    	login = login.replace("&","@@@@@");
    	login = login.replace("+","!!!!!");
    	
    	password = password.replace("#",",,,,,");
    	password = password.replace("&","@@@@@");
    	password = password.replace("+","!!!!!");
    	
    	assunto = assunto.replace("#",",,,,,");
    	assunto = assunto.replace("&","@@@@@");
    	assunto = assunto.replace("+","!!!!!");
    	
    	mensagem = mensagem.replace("#",",,,,,");
    	mensagem = mensagem.replace("&","@@@@@");
    	mensagem = mensagem.replace("+","!!!!!");
    	
      	 $.ajax({
           	async: false,
               data: "",
               dataType: "json",
               type: 'get',
               crossDomain: true,
               contentType: "application/json",
               url: Utils.baseUrl + "sendMail?username="+login+"&password="+password+"&to="+to+"&assunto="+assunto+"&mensagem="+mensagem,
               complete: function() {
            	   bootbox.confirm("<strong>Email enviado com sucesso!",function(result) {
            		   location.reload();
                 });
               }
           });  
    	
    };

    return {viewModel: EmailComponentViewModel, template: html};
});