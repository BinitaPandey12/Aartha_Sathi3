package com.arthasathi.arthasathi.controller;

import com.arthasathi.arthasathi.entities.User;
import com.arthasathi.arthasathi.entities.Role;
import com.arthasathi.arthasathi.services.UserService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RequestMapping("/api/auth")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    // 🔵 Signup endpoint for BORROWER (clicked "Join as Borrower")
    @PostMapping(value = "/signup/borrower", consumes = "multipart/form-data")
    public ResponseEntity<?> registerBorrower(
            @ModelAttribute UserSignUpRequest request,
            @RequestParam("file") MultipartFile file) {
        request.setRole(Role.BORROWER); // backend sets role
        User registeredUser = userService.registerUser(request, file);
        return ResponseEntity.ok(registeredUser);
    }

    // 🟣 Signup endpoint for LENDER (clicked "Join as Lender")
    @PostMapping(value = "/signup/lender", consumes = "multipart/form-data")
    public ResponseEntity<?> registerLender(
            @ModelAttribute UserSignUpRequest request,
            @RequestParam("file") MultipartFile file) {
        request.setRole(Role.LENDER); // backend sets role
        User registeredUser = userService.registerUser(request, file);
        return ResponseEntity.ok(registeredUser);
    }

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> result = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(result);
    }

    // ✅ LoginRequest DTO
    @Data
    public static class LoginRequest {
        private String email;
        private String password;

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    // ✅ UserSignUpRequest DTO
    @Data
    public static class UserSignUpRequest {
        private String email;
        private String password;
        private String address;
        private String idNumber;
        private Role role; // Enum
        private String name;
        public Role getRole() {
            return role;
        }


        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public void setRole(Role role) {
            this.role = role;
        }

        public String getIdNumber() {
            return idNumber;
        }

        public void setIdNumber(String idNumber) {
            this.idNumber = idNumber;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}
