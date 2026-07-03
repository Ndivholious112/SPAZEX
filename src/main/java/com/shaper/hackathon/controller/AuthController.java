
package com.shaper.hackathon.controller;

        import com.shaper.hackathon.entity.User;
        //import com.shaper.hackathon.repositories.UserRepository;
        import com.shaper.hackathon.services.CustomUserDetailsService;
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.security.crypto.password.PasswordEncoder;
        import org.springframework.stereotype.Controller;
        import org.springframework.ui.Model;
        import org.springframework.web.bind.annotation.GetMapping;
        import org.springframework.web.bind.annotation.ModelAttribute;
        import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AuthController {

    private final CustomUserDetailsService customUserDetailsService;

    // Constructor Injection (Best Practice)
    public AuthController(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }
    @GetMapping("/login")
    public String showLoginPage(){
        return "login";
    }

    @GetMapping("/register")
    public String showRegisterPage(Model model){
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser (@ModelAttribute("user") User user, Model model){
        try {
            customUserDetailsService.registerUser(user);
            return "redirect:/login?registered";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "register";
        }
    }


    @GetMapping("/landing")
    public String showLandingPage() {
        return "landing";
    }
}