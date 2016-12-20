package br.com.geopixel.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import br.com.geopixel.model.User;

@Controller
public class IndexController {

    @RequestMapping("/")
    public RedirectView defaultHandler(HttpServletResponse response) {
        RedirectView redirectView = new RedirectView("inicio");
        redirectView.setStatusCode(HttpStatus.MOVED_PERMANENTLY);
        return redirectView;
    }

    @RequestMapping("/inicio")
    public ModelAndView operations(HttpServletRequest request) {
        User user = (User) request.getSession().getAttribute("user");
        ModelAndView mav = new ModelAndView("/index/index");
        mav.getModel().put("user", user);

        mav.getModel().put("userValidate", user.getLogin());
        if (user.isFirst()) {
            mav.getModel().put("userLogin", user.getLogin());
            user.setFirst(false);
        }
        
        return mav;
    }

    @RequestMapping("/sessao")
    public ResponseEntity<String> session(HttpServletRequest request) {
        String status = "true";
        if (request.getSession().getAttribute("user") == null) {
            status = "false";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json; charset=utf-8");
        return new ResponseEntity<String>("{ \"status\": " + status + " }", headers, HttpStatus.OK);
    }

}
