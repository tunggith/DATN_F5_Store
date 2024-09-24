package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IChatLieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/v1/chat-lieu")
public class ChatLieuController {
    @Autowired
    private IChatLieuService chatLieuService;
    @GetMapping("/getAll")
    private ResponseEntity<Object> getAll(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var chatLieuList = chatLieuService.getAll();
        dataResponse.setResult(new ResultModel<>(null,chatLieuList));
        return ResponseEntity.ok(dataResponse);
    }
}
