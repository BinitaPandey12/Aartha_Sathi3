package com.arthasathi.arthasathi.DTO;

import org.springframework.web.multipart.MultipartFile;

public class Registration {
    private String name;
    private String email;
    private String password;
    private String address;
    private String idNumber;
    private MultipartFile idDocument;
    private String role;


    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public MultipartFile getIdDocument() {
        return idDocument;
    }

    public void setIdDocument(MultipartFile idDocument) {
        this.idDocument = idDocument;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }




}

