package br.com.geopixel.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

import br.com.geopixel.model.User;

import java.io.*;
import java.net.*;
import java.util.List;
import java.util.ArrayList;

import flexjson.JSONDeserializer;

@Controller
@RequestMapping("/login")
public class LoginController {

    @RequestMapping("")
    public ModelAndView index(HttpServletRequest request) {
        if (request.getSession().getAttribute("user") != null) {
            return new ModelAndView("redirect:/");
        }
        return new ModelAndView("/login/login");
    }

    @ResponseBody
    @RequestMapping("/autenticar")
    public ResponseEntity<String> index(HttpServletRequest request, @RequestParam() String login, @RequestParam() String password) {
        boolean authenticated = false;
        
        try {
        	
        	//Alterar url para serverhost:porta/NomeDoWebService/rest/...
            //String url = "http://geopx.mine.nu:8888/RotasBR_v2/rest/json/selectData?tablename=usuarios&columns=*&whereclause=nome='" + login + "'";
        	String url = "http://localhost:8080/RotasBR_v2/rest/json/selectData?tablename=usuarios&columns=*&whereclause=nome='" + login + "'";
        	
        	
            
            List<User> userList = getUserByWebService(url);
            for(User user : userList){
                if (user.getNome().equals(login) && user.getSenha().equals(password)) {
                    request.getSession().setAttribute("user", user);
                    authenticated = true;
                }
            }
        } catch (Exception ex) {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json; charset=utf-8");
            return new ResponseEntity<>("{authenticated: " + Boolean.toString(authenticated) + "}", headers, HttpStatus.OK);
        }
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=utf-8");
        return new ResponseEntity<>("{authenticated: " + Boolean.toString(authenticated) + "}", headers, HttpStatus.OK);
    }
    
    public List<User> getUserByWebService(String urlUser) throws Exception {
      StringBuilder result = new StringBuilder();
      URL url = new URL(urlUser);
      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("GET");
      BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
      String line;
      while ((line = rd.readLine()) != null) {
         result.append(line);
      }
      rd.close();
      
      String r = result.toString().replace("NOME", "nome").replace("SENHA", "senha");
      
      List<User> userList = new JSONDeserializer<List<User> >()
        .use(null, ArrayList.class).use("values",User.class).deserialize(r);        
      
      return userList;
   }

    @RequestMapping("/exit")
    @ResponseStatus(HttpStatus.OK)
    public String exit(HttpServletRequest request, HttpServletResponse response) {
        request.getSession().invalidate();
        request.getSession().removeAttribute("user");
        response.addHeader("Pragma", "no-cache");
        response.addHeader("Cache-control", "no-cache");
        response.setStatus(HttpStatus.OK.value());

        return "redirect:/login";
    }
}
