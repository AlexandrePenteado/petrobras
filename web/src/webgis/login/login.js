$(document).ready(function () {
    $('form').submit(function () {
        $("#btnEntrar").prop("disabled", true);

        var login = $('input[type=text]');
        var password = $('input[type=password]');

        if (login.val().trim() === "") {
            $("#btnEntrar").prop("disabled", false);
            return false;
        } else if (password.val() === "") {
            $("#btnEntrar").prop("disabled", false);
            return false;
        }
        
        var byteKeyGeopx = new Array(30);
        byteKeyGeopx = [1,3,5,7,9,7,3,5,7,9,5,3,5,7,9,1,3,5,7,9,5,3,5,7,9,7,3,5,7,9];
        var hash = "";
        var j =0;
        	for (var i=0; i<byteKeyGeopx.length;i++){
        			if (j==password.val().length){
        				j=0;
        			}
                    hash = hash + ((byteKeyGeopx[i]*password.val().charCodeAt(j))%15).toString(16);
        	  j++;
        	}
        
        password = hash;
     
        ;

        $.ajax({
            data: {
                login: login.val().trim(),
                password: password
            },
            dataType: 'json',
            type: 'post',
            complete: function (jqXHR) {
                eval('var data = ' + jqXHR.responseText);
                if (data.authenticated) {
                    window.location = URL_INDEX;
                } else {
                    alert("Erro na autenticação");
                }

                $("#btnEntrar").prop("disabled", false);
            },
            url: URL_LOGIN_AUTENTICAR
        });
        return false;
    });

});