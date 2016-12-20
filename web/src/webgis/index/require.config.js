// require.js looks for the following global when initializing
var require = {
    baseUrl: "src",
    paths: {
        "bootstrap":            "libs/bootstrap-3.3.4/js/bootstrap.min",
        "bootbox":              "libs/bootstrap-3.3.4/js/bootbox.min",
        "jquery":               "libs/jquery/jquery",
        "masked-input":         "libs/jquery/jquery.maskedinput.min",
        "datatables":           "libs/datatableJquery/js/jquery.dataTables.min",
        "datatablesBootstrap":  "libs/datatableJquery/js/dataTables.bootstrap.min",
        "catiline":             "libs/catiline/catiline",
        "shp":                  "libs/shp/shp",
        "knockout":             "libs/knockout/knockout-3.3.0",
        "ko-postbox":           "libs/knockout/knockout-postbox",
        "ko-mapping":           "libs/knockout/knockout-mapping",
        "text":                 "libs/requirejs-text/text"
    },
    shim: {
        "bootstrap": { deps: ["jquery"] }
    }
};
