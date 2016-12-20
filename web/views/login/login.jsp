<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>	
        <meta http-equiv="X-UA-Compatible" content="IE=7, IE=9" />
        <meta name="viewport" content="width=device-width,user-scalable=no"/>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no"/>
        
        <title>Login</title>

        <link rel="shortcut icon" type="image/png" href="${pageContext.request.contextPath}/img/favicon.ico" />
        <link rel="apple-touch-icon" href="${pageContext.request.contextPath}/img/favicon.ico" />
        <link rel="shortcut icon" href="${pageContext.request.contextPath}/img/favicon.ico" />
        
        <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/src/libs/bootstrap-3.3.4/css/bootstrap.css" />
        <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/src/webgis/login/login.css" />

        <script type="text/javascript" src="${pageContext.request.contextPath}/src/libs/jquery/jquery.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/src/libs/bootstrap-3.3.4/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/src/libs/bootstrap-3.3.4/js/bootbox.min.js"></script>
        <script type="text/javascript" src="${pageContext.request.contextPath}/src/webgis/login/login.js"></script>
        
        
        <script type="text/javascript">
            URL_INDEX = '<c:url value="/" />';
            URL_LOGIN_AUTENTICAR = '<c:url value="/login/autenticar" />';
        </script>
    </head>
    <body>
        <div class="container">
            <div class="row" id="pwd-container">
                <div class="col-md-4"></div>
                
                <div class="col-md-4">
                    <section class="login-form">
                        <form method="post" action="#" role="login">
                            <img src="${pageContext.request.contextPath}/img/logo.png" class="img-responsive" alt="" />
                            
                            <div class="form-group">
                                <input type="text" name="email" placeholder="Usuário" class="form-control input-lg" />
                            </div>
                            
                            <div class="form-group">
                                <input type="password" class="form-control input-lg" id="password" placeholder="Senha" />
                            </div>

                            <button id="btnEntrar" type="submit" name="go" class="btn btn-lg btn-primary btn-block">Entrar</button>
                        </form>
                    </section>  
                </div>

                <div class="col-md-4"></div>
            </div> 
        </div>
    </body>
</html>
