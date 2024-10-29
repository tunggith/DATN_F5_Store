package com.example.datn_f5_store.controller.sendEmail;

import com.example.datn_f5_store.service.sendEmail.SendEmailService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class SendEmailController {
    @Autowired
    private SendEmailService sendEmailService;

    @GetMapping("/send-email")
    public ResponseEntity<Object> sendEmail(
            @Parameter(name = "toEmail") @RequestParam String toEmail,
            @Parameter(name = "username") @RequestParam String username,
            @Parameter(name = "password") @RequestParam String password
    ) {
        return new ResponseEntity<>(sendEmailService.sendSimpleEmail(toEmail,username,password), HttpStatus.OK);
    }
}
