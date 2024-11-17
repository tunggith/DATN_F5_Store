package com.example.datn_f5_store.controller.clientController;

import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.request.DiaChiKhachHangResquest;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.service.client.UserClientService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/customer")
public class UserClientController {
    @Autowired
    private UserClientService userClientService;
    @PostMapping("/login")
    private ResponseEntity<Object> login(
            @Parameter(name = "username")@RequestParam String username,
            @Parameter(name = "password")@RequestParam String password
    ){
        return new ResponseEntity<>(userClientService.loginClient(username,password), HttpStatus.OK);
    }
    @PostMapping("/register")
    private ResponseEntity<Object> register(@RequestBody KhachHangRequest request){
        return new ResponseEntity<>(userClientService.registerClient(request),HttpStatus.CREATED);
    }
    @GetMapping("/detail/{id}")
    private ResponseEntity<Object> detail(@Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(userClientService.detailclient(id),HttpStatus.OK);
    }
    @PostMapping("/add-dia-chi")
    private ResponseEntity<Object> addDiaChi(DiaChiKhachHangResquest resquest){
        return new ResponseEntity<>(userClientService.createDiaChiClient(resquest),HttpStatus.CREATED);
    }
    @PutMapping("/update/{id}")
    private ResponseEntity<Object> updateAnh(
            @Parameter(name = "id")@PathVariable Integer id,
            @RequestBody KhachHangRequest request
    ){
        return new ResponseEntity<>(userClientService.updateAnh(id,request),HttpStatus.OK);
    }
    @PutMapping("/change-password")
    private ResponseEntity<Object> changePassword(
            @Parameter(name = "username")@RequestParam String username,
            @Parameter(name = "passwordOld")@RequestParam String passwordOld,
            @Parameter(name = "passwordNew")@RequestParam String passwordNew
    ){
        return new ResponseEntity<>(userClientService.changePassword(username,passwordOld,passwordNew),HttpStatus.OK);
    }
    @GetMapping("/detail-dia-chi/{id}")
    private ResponseEntity<Object> detailDiaChi(@Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(userClientService.detailDiaChi(id),HttpStatus.OK);
    }
    @GetMapping("/get-all-dia-chi/{id}")
    private ResponseEntity<Object> getAll(@Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(userClientService.getDiaChiByKhachHang(id),HttpStatus.OK);
    }

}
