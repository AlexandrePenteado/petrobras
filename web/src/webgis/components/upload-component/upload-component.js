define(["text!./upload-component.html",
    "webgis/models/Utils",
    "shp",
    "bootstrap",
    "bootbox",
    "knockout"], function (html, Utils, shp,
        bootstrap, bootbox, ko) {

    function UploadComponentViewModel() {
        var self = this;
        self.uploadViewModel = ko.observable(this).publishOn("uploadViewModel");
        self.selectedDataType = ko.observable("Point");
    }

    UploadComponentViewModel.prototype.focus = function () {
        //método chamado quando selecionado upload no menu
        var self = this;
        self.addFunction();
    };

    UploadComponentViewModel.prototype.inputFileClick = function () {
        $("#inputFile").click();
    };

    UploadComponentViewModel.prototype.inputFileChanged = function (file) {
        var self = this;
        self.handleFile(file);
    };

    UploadComponentViewModel.prototype.addFunction = function (map) {
        var self = this;

        var dropbox = document.getElementById("uploadArea");
        dropbox.addEventListener("dragenter", dragenter, false);
        dropbox.addEventListener("dragover", dragover, false);
        dropbox.addEventListener("drop", drop, false);

        function dragenter(e) {
            e.stopPropagation();
            e.preventDefault();
        }

        function dragover(e) {
            e.stopPropagation();
            e.preventDefault();
        }

        function drop(e) {
            e.stopPropagation();
            e.preventDefault();

            var dt = e.dataTransfer;
            var files = dt.files;

            var i = 0;
            var len = files.length;
            if (!len) {
                return;
            }
            while (i < len) {
                self.handleFile(files[i]);
                i++;
            }
        }
    };

    UploadComponentViewModel.prototype.handleFile = function (file) {
        var self = this;

        if (file.name.slice(-3) === 'zip' || file.name.slice(-3) === 'rar') {
            return self.handleZipFile(file);
        }

        bootbox.alert("Arquivo inválido. Certifique-se que a extensão do mesmo é .zip");
    };

    UploadComponentViewModel.prototype.handleZipFile = function (file) {
        var self = this;

        Utils.showLoading();

        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function () {
            if (this.readyState !== 2 || this.error) {
                return;
            }
            else {
                shp(this.result).then(function (geojson) {
                	self.processShapefile(geojson);
                }).catch(function (e) {
                    Utils.hideLoading();
                    console.log(e);
                    bootbox.alert("Ocorreu um erro na leitura do arquivo. Verifique se há algum erro em algum shapefile e tente novamente.");
                });
            }
        };
    };

    UploadComponentViewModel.prototype.processShapefile = function (geojson) {
        var self = this;

        console.log(self.selectedDataType());
        if (geojson.features.length > 0) {
            if (geojson.features[0].geometry.type !== self.selectedDataType()) {
                bootbox.alert("O tipo de dado identificado no shapefile não corresponde ao tipo de dado selecionado.");
                console.log(geojson.features[0].geometry);
                Utils.hideLoading();
                return;
            }

            self.geojson = geojson;
            
            $.ajax({
            	async: false,
                data: "",
                dataType: "json",
                type: 'get',
                crossDomain: true,
                contentType: "application/json",
                complete: function () {
                	self.getAllGeometries();
                }                
            });           
        }

        Utils.hideLoading();
    };

    UploadComponentViewModel.prototype.getAllGeometries = function () {       
        var self = this;
        var tablename = self.selectedDataType() === "Point" ? "POI" : "LINHA";     
        var features = self.geojson.features;                    
    	var fields = 0;
    	var countInsert = 0;
    	var countUpdate = 0;
        
        if (tablename == "POI") {     
        	var columns = "&columns=(gid, uf, classe, contexto, nome, lat, lon, val, geom)";
        	for (var key in features[0].properties) {           
        		switch(key.toLowerCase()) {
        			case "gid": fields += 1; continue; break;
    	    	    case "uf": fields += 1; continue; break;
    	    	    case "classe": fields += 1; continue; break;
    	    	    case "contexto": fields += 1; continue; break;
    	    	    case "nome": fields += 1; continue; break;
    	    	    case "lat": fields += 1; continue; break;
    	    	    case "lon": fields += 1; continue; break;
    	    	    case "val": fields += 1; continue; break;
    	    	    case "geom": fields += 1; continue; break;
    	    	    default: 
    	    	    	if (!confirm("O campo " + key + " não existe. Deseja continuar mesmo assim?" ))
    	    	    		return; 
    	    	    	break;
        		}
        	} 
        	
        	if (fields != 8) {
        		if (!confirm("Falta(m) " + (8 - fields) + " campo(s). Deseja continuar mesmo assim?" ))
            	    return;        	
        	}  
        	
        	if (!confirm("Este arquivo apresenta "+ features.length +" registros. Deseja continuar mesmo assim?" ))
	    		return;
        	
        	console.log(features.length);
	        for(var i = 0; i < features.length; i++) {  
	        
	        	var data = features[i].properties;
	        	
	        	for (var key in data) {
	        		var temp; 
	        	    if (data.hasOwnProperty(key)) {
	        	    	temp = data[key];
	        	        delete data[key];
	        	        data[key.toUpperCase()] = temp;
	        	    }
	        	}	        	
	        	
	        	var sdoGeometry = self.pointToSdoGeom(features[i]);
	        	var values = "&values=(";
	        	var whereclause = "gid=" + data.GID + "";	        	
	        	
	        	var sets =  "&set=gid=" + data.GID + ", ";
	            sets = sets + "uf='" + data.UF + "', ";
	            sets = sets + "classe='" + data.CLASSE + "', ";
	            sets = sets + "contexto='" + data.CONTEXTO + "', ";
	            sets = sets + "nome='" + data.NOME + "', ";
	            sets = sets + "lat=" + data.LAT + ", ";
	            sets = sets + "lon=" + data.LON + ", ";
	            sets = sets + "val=to_char(sysdate,'dd-mm-yyyy'), ";
	            sets = sets + "geom=" + sdoGeometry;
	       	
	            $.ajax({
	            	async: false,
	                data: "",
	                dataType: "json",
	                type: 'get',
	                crossDomain: true,
	                contentType: "application/json",
	                complete: function (jqXHR) {
	                	var way = "";	   
	                	
	                	if (jqXHR.responseText != "")
	                		var result = JSON.parse(jqXHR.responseText);
	                	else
	                		var result = jqXHR.responseText;
	                    
	                    if (result == "") {
	                    	values = values + data.GID + ",";
	                    	way = "INSERT";
	                    }	                    
	                    
	                    values = values + "'" + data.UF       + "',";
	    	            values = values + "'" + data.CLASSE   + "',";
	    	            values = values + "'" + data.CONTEXTO + "',";
	    	            values = values + "'" + data.NOME     + "',";  
	    	            values = values + data.LAT + ",";
	    	            values = values + data.LON + ",";
	    	            values = values + "to_char(sysdate,'dd-mm-yyyy'),";
	    	            values = values + sdoGeometry + ")";
	    	            
	    	            if (way != "INSERT") {
	    	            		$.ajax({
	    		            	async: false,
	    		                data: "",
	    		                dataType: "json",
	    		                type: 'get',
	    		                crossDomain: true,
	    		                contentType: "application/json",
	    		                url: Utils.baseUrl + "updateData?tablename=" + tablename + sets + "&whereclause=" + whereclause,
	    		                complete: function() {
	    		                	countUpdate++;
	    		                }
	    	            		});
	    	            } else {	            
	    	            	$.ajax({
	    		            	async: false,
	    		                data: "",
	    		                dataType: "json",
	    		                type: 'get',
	    		                crossDomain: true,
	    		                contentType: "application/json",
	    		                url: Utils.baseUrl + "putData?tablename=" + tablename + columns + values,
	    		                complete: function() {
	    		                	countInsert++;
	    		                }
	    		            }); 
	    	            }
	                },
	                url: Utils.baseUrl + "selectData?tablename=POI&columns=*&whereclause=gid=" + data.GID 
	            });
	     
	        }
        	 
        } else {     	
        	var columns = "&columns=(id, uf, classe, contexto, nome, val, geom)";
        	for (var key in features[0].properties) {           
        		switch(key.toLowerCase()) {
        			case "id": fields += 1; continue; break;
    	    	    case "uf": fields += 1; continue; break;
    	    	    case "classe": fields += 1; continue; break;
    	    	    case "contexto": fields += 1; continue; break;
    	    	    case "nome": fields += 1; continue; break;
    	    	    case "val": fields += 1; continue; break;
    	    	    case "geom": fields += 1; continue; break;
    	    	    default: 
    	    	    	if (!confirm("O campo " + key + " não existe. Deseja continuar mesmo assim?" ))
    	    	    		return; 
    	    	    	break;
        		}
        	} 
        	
        	if (fields != 7) {
        		if (!confirm("Falta(m) " + (7 - fields) + " campo(s). Deseja continuar mesmo assim?" ))
            	    return;        	
        	} 
        	
        	if (!confirm("Este arquivo apresenta "+ features.length +" registros. Deseja continuar mesmo assim?" ))
	    		return;
        	
        	
        	for(var i = 0; i < features.length; i++) {       		
        		var data = features[i].properties;
        		
        		for (var key in data) {
	        		var temp; 
	        	    if (data.hasOwnProperty(key)) {
	        	    	temp = data[key];
	        	        delete data[key];
	        	        data[key.toUpperCase()] = temp;
	        	    }
	        	}	   
        		
        		var sdoGeometry = self.lineStringToSdoGeom(features[i]);
	        	var values = "&values=(";
	        	var whereclause = "id=" + data.ID + "";	        		        	
	        	var sets =  "&set=id=" + data.ID + ", ";
	            sets = sets + "uf='" + data.UF + "', ";
	            sets = sets + "classe='" + data.CLASSE + "', ";
	            sets = sets + "contexto='" + data.CONTEXTO + "', ";
	            sets = sets + "nome='" + data.NOME + "', ";
	            sets = sets + "val=to_char(sysdate,'dd-mm-yyyy'), ";
	            sets = sets + "geom=" + sdoGeometry;
	            
	            $.ajax({
	            	async: false,
	                data: "",
	                dataType: "json",
	                type: 'get',
	                crossDomain: true,
	                contentType: "application/json",
	                complete: function (jqXHR) {
	                	var way = "";	                	
	                    var result = jqXHR.responseText;	
	                    
	                    if (result == "") {
	                    	values = values + data.ID + ",";
	                    	way = "INSERT";
	                    }	                    
	                    
	    	            values = values + "'" + data.UF       + "',";
	    	            values = values + "'" + data.CLASSE   + "',";
	    	            values = values + "'" + data.CONTEXTO + "',";
	    	            values = values + "'" + data.NOME     + "',";  
	    	            values = values + "to_char(sysdate,'dd-mm-yyyy'),";
	    	            values = values + sdoGeometry + ")";
	    	            
	    	            if (way != "INSERT") {	            
	    		            $.ajax({
	    		            	async: false,
	    		                data: "",
	    		                dataType: "json",
	    		                type: 'get',
	    		                crossDomain: true,
	    		                contentType: "application/json",
	    		                url: Utils.baseUrl + "updateData?tablename=" + tablename + sets + "&whereclause=" + whereclause,
	    		                complete: function() {
	    		                	countUpdate++;
	    		                }
	    		            });  
	    	            } else {	            
	    		            $.ajax({
	    		            	async: false,
	    		                data: "",
	    		                dataType: "json",
	    		                type: 'get',
	    		                crossDomain: true,
	    		                contentType: "application/json",
	    		                url: Utils.baseUrl + "putData?tablename=" + tablename + columns + values,
	    		                complete: function() {
	    		                	countInsert++;
	    		                }
	    		            });  
	    	            }
	                },
	                url: Utils.baseUrl + "selectData?tablename=LINHA&columns=*&whereclause=id=" + data.ID
	            });  
	        }        
        } 
        bootbox.confirm("<strong>Operação concluída!</strong><br></br>"+"<strong>Inseridos:</strong> "+countInsert+" registros.  <strong>Atualizados:</strong> "+countUpdate+" registros.  <strong>Total de:</strong> "+features.length+" registros",function(result) {
        	  location.reload();
        });
    };
          
    // Converting GeoJSON to SDO_GEOMETRY
    UploadComponentViewModel.prototype.pointToSdoGeom = function (geoJson) {
    	console.log('SDO_GEOMETRY(2001, 28992, SDO_POINT_TYPE(' + geoJson.geometry.coordinates + ', NULL), NULL, NULL)');
    	return 'SDO_GEOMETRY(2001, 28992, SDO_POINT_TYPE(' + geoJson.geometry.coordinates + ', NULL), NULL, NULL)';
    }
    
    UploadComponentViewModel.prototype.lineStringToSdoGeom = function (geoJson) {
    	return 'SDO_GEOMETRY(2002, 28992, NULL, SDO_ELEM_INFO_ARRAY(1, 2, 1), SDO_ORDINATE_ARRAY(' + geoJson.geometry.coordinates + '))';
    }

    return {viewModel: UploadComponentViewModel, template: html};
});
