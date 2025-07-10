package com.arthasathi.arthasathi.services;

import com.arthasathi.arthasathi.Security.JwtUtil;
import com.arthasathi.arthasathi.controller.UserController.UserSignUpRequest;
import com.arthasathi.arthasathi.entities.User;
import com.arthasathi.arthasathi.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Registers a new user with ID document upload.
     * @param request User registration data
     * @param file Uploaded ID document file
     * @return Saved User entity
     */
    public User registerUser(UserSignUpRequest request, MultipartFile file) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        // Configure upload directory - absolute path for reliability
        // You can externalize this to application.properties with @Value injection
        String uploadDir = System.getProperty("user.home") + "/arthasathi-uploads";

        Path uploadPath = Paths.get(uploadDir);

        // Create directory if it doesn't exist
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadDir, e);
        }

        // Sanitize original filename (remove spaces and unsafe chars)
        String originalFilename = file.getOriginalFilename();
        String safeFilename = originalFilename == null ? "unknown-file" :
                originalFilename.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");

        // Create unique filename to avoid collisions
        String uniqueFileName = UUID.randomUUID().toString() + "_" + safeFilename;
        Path filePath = uploadPath.resolve(uniqueFileName);

        // Save file to disk
        try {
            file.transferTo(filePath.toFile());
        } catch (IOException e) {
            throw new RuntimeException("Failed to save uploaded file: " + uniqueFileName, e);
        }

        // Create and save user entity
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setAddress(request.getAddress());
        user.setIdNumber(request.getIdNumber());
        user.setIdDocumentPath(filePath.toString());
        user.setRole(request.getRole());

        return userRepository.save(user);
    }

    /**
     * Authenticates user and returns JWT token and user info.
     * @param email User email
     * @param password Raw password input
     * @return Map containing JWT token and user details
     */
    public Map<String, Object> loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("id", user.getId());
        response.put("id num",user.getIdNumber());
        response.put("role", user.getRole());
        response.put("Address", user.getAddress());
        response.put("filepath", user.getIdDocumentPath());
        response.put("name",user.getName());


        return response;
    }
}
