define(["knockout"], function (ko) {
    var Utils = function () {

        this.baseUrl = "";
        this.numberOfLicenses = 0;
        
        this.validateSession = function () {
            $.ajax({
                data: JSON.stringify({}),
                dataType: 'json',
                type: 'post',
                contentType: "application/json",
                complete: function (jqXHR) {
                    eval('var data = ' + jqXHR.responseText);
                    if (data.status === false) {
                        window.location = URL_LOGIN_OFF;
                    }
                },
                url: URL_INDEX_SESSAO
            });
        };
        
        this.generateHashMD5 = function (string){
        	var hash = 0,
        	strlen = string.length,
        	i,
        	c;
        	if ( strlen === 0 ) {
        	return hash;
        	}
        	for ( i = 0; i < strlen; i++ ) {
        	c = string.charCodeAt( i );
        	hash = ((hash << 5)-hash) + c;
        	//hash = hash & hash; // Convert to 32bit integer
        	}
        	return hash;
        };
        
        this.decryptHashMD5 = function (hash){
        	var string = "",
        	hashlen = hash.length,
        	i,
        	c;
        	if ( hashlen === 0 ) {
        	return string;
        	}
        	for ( i = 0; i < hashlen; i++ ) {
        	c = hash.charCodeAt( i );
        	string = ((string << 5)-string) + c;
        	//hash = hash & hash; // Convert to 32bit integer
        	}
        	return string;
        };

        this.currentDateFormatedUS = function () {
            var self = this;

            var date = new Date();

            return self.formateDateUS(date);
        };

        this.addDaysInDate = function (days) {
            var self = this;

            var afterDate = new Date();
            afterDate.setDate(afterDate.getDate() + days);

            return self.formateDateUS(afterDate);
        };

        this.formateDateUS = function (date) {
            var day = date.getDate();
            if (day.toString().length === 1) {
                day = "0" + day;
            }
            day = isNaN(day) ? "00" : day;

            var month = date.getMonth() + 1;
            if (month.toString().length === 1) {
                month = "0" + month;

            }
            month = isNaN(month) ? "00" : month;

            var year = isNaN(date.getFullYear()) ? "0000" : date.getFullYear();

            return year + "-" + month + "-" + day;
        };

        this.formatDateBr = function (dateString) {
            var date = new Date(dateString);

            var day = date.getDate();
            if (day.toString().length === 1) {
                day = "0" + day;
            }
            day = isNaN(day) ? "00" : day;

            var month = date.getMonth() + 1;
            if (month.toString().length === 1) {
                month = "0" + month;
            }
            month = isNaN(month) ? "00" : month;

            var year = isNaN(date.getFullYear()) ? "0000" : date.getFullYear();

            return day + "/" + month + "/" + year;
        };

        this.showLoading = function () {
            $('#loading-application').show();
        };

        this.updateLoading = function (message) {
            var loading = $('#status-loading');
            loading.html(message);
            $('#loading-application > div').css('width', $('#loading-application > div span').outerWidth() + $('#loading-application > div > div').outerWidth() + 70);
        };

        this.hideLoading = function () {
            $('#loading-application').hide(250);
        };
    };

    return new Utils;
});