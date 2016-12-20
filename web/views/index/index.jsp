<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<c:if test="${not empty param.lang}">
    <fmt:setLocale value="${param.lang}" scope="session"/>
</c:if>
<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>	
        <meta name="viewport" content="width=device-width,user-scalable=no"/>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no"/>

        <title>Dispositivos</title>

        <link href='<html:rewrite page="${pageContext.request.contextPath}/img/favicon.ico" />' rel="shortcut icon" type="image/png">
        <link rel="apple-touch-icon" href="${pageContext.request.contextPath}/img/favicon.ico" />
        <link rel="shortcut icon" href="${pageContext.request.contextPath}/img/favicon.ico" />

        <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/src/libs/bootstrap-3.3.4/css/bootstrap.css" />
        <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/src/libs/datatableJquery/css/dataTables.bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/src/webgis/index/index.css" />

        <script src="${pageContext.request.contextPath}/src/webgis/index/require.config.js"></script>
        <script data-main="${pageContext.request.contextPath}/src/webgis/index/startup.js" src="${pageContext.request.contextPath}/src/libs/requirejs/require.js"></script>

        <script type="text/javascript">
            URL_INDEX_SESSAO = '<c:url value="/sessao" />';
            URL_LOGIN_OFF = '<c:url value="/login/exit" />';
        </script>
    </head>
    <body>
        <div id="loading-application">
            <div>
                <div id="circular3dG">
                    <div id="circular3d_1G" class="circular3dG">
                    </div>
                    <div id="circular3d_2G" class="circular3dG">
                    </div>
                    <div id="circular3d_3G" class="circular3dG">
                    </div>
                    <div id="circular3d_4G" class="circular3dG">
                    </div>
                    <div id="circular3d_5G" class="circular3dG">
                    </div>
                    <div id="circular3d_6G" class="circular3dG">
                    </div>
                    <div id="circular3d_7G" class="circular3dG">
                    </div>
                    <div id="circular3d_8G" class="circular3dG">
                    </div>
                </div>
                <span id="status-loading">Carregando...</span>
            </div>
        </div>

        <div class="full-height">   
            <index-component></index-component>
        </div>
    </body>
</html>