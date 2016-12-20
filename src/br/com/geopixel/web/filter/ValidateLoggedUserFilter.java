/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.geopixel.web.filter;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class ValidateLoggedUserFilter extends HandlerInterceptorAdapter {

    private List<String> exclusions;

    public List<String> getExclusions() {
        return exclusions;
    }

    public void setExclusions(List<String> exclusions) {
        this.exclusions = exclusions;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getServletPath();
        for (String exclusion : exclusions) {
            if (path.equals(exclusion) || path.equals(exclusion.replaceAll("\\/?\\*$", ""))) {
                return true;
            } else if (exclusion.endsWith("*") && path.startsWith(exclusion.replaceAll("\\*$", ""))) {
                return true;
            }
        }

        if (request.getSession().getAttribute("user") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return false;
        }
        return true;
    }
}
