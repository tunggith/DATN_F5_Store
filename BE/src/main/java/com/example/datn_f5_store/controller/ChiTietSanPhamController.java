package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.response.ChiTietSanPhamReponse;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;

import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IMauSacRepository;
import com.example.datn_f5_store.repository.ISanPhamRepository;
import com.example.datn_f5_store.repository.ISizeRepository;
import com.example.datn_f5_store.request.ChiTietSanphamRequest;
import com.example.datn_f5_store.service.impl.ChiTietSanPhamImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/chi_tiet_san_pham")
public class ChiTietSanPhamController
{

    @Autowired
    IChiTietSanPhamRepository repo_ctsp;
    @Autowired
    IMauSacRepository repo_mauSac;
    @Autowired
    ISizeRepository repo_size;
    @Autowired
    ISanPhamRepository repo_sanPham;
    @Autowired
    ChiTietSanPhamImpl ctsp_Sevice;

    @GetMapping("/getAll")
    public List<ChiTietSanPhamReponse> getall(){
        return repo_ctsp.getAllCTSP();
    }

    @GetMapping("/getall-phan_trang")
    public ResponseEntity<?> getallPhanTrang(
            @RequestParam(value = "currentPage" , defaultValue = "0") Integer curentPage

    ){


        DataResponse  dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = ctsp_Sevice.getallPhanTrang(curentPage);
        dataResponse.setResult(new ResultModel<>(null,responseList));
        return ResponseEntity.ok(dataResponse);
    }


    @GetMapping("/getall-phan_trang/{id}")
    public ResponseEntity<?> getallPhanTrang(
            @PathVariable("id") Integer id,
            @RequestParam(value = "currentPage" , defaultValue = "0") Integer curentPage

    ){


        DataResponse  dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = ctsp_Sevice.getallPhanTrangbyidSP(id,curentPage);
        dataResponse.setResult(new ResultModel<>(null, responseList));
        return ResponseEntity.ok(dataResponse);
    }
    @PostMapping("/Created")
    public ResponseEntity<?> saveChiTietSanPham(@Valid @RequestBody ChiTietSanphamRequest ctspRequet, BindingResult result,
                                                @RequestParam(value = "idSanpham") Integer idSanpham,
                                                @RequestParam(value = "idMau") Integer idMau,
                                                @RequestParam(value = "idSize") Integer idSize) {

        DataResponse  dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList =  ctsp_Sevice.saveChiTietSanPham(ctspRequet,result,idSanpham,idMau,idSize);
        dataResponse.setResult(new ResultModel<>(null, responseList));
        return ResponseEntity.ok(dataResponse);
    }



    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateChiTietSanPham(@PathVariable("id") Integer id,
                                                  @Valid @RequestBody ChiTietSanphamRequest ctspRequest, BindingResult result,
                                                  @RequestParam(value = "idSanpham") Integer idSanpham,
                                                  @RequestParam(value = "idMau") Integer idMau,
                                                  @RequestParam(value = "idSize") Integer idSize) {

        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = ctsp_Sevice.updateChiTietSanPham(id,ctspRequest, result, idSanpham, idMau, idSize);
        dataResponse.setResult(new ResultModel<>(null, responseList));
        return ResponseEntity.ok(dataResponse);

    }

    @GetMapping("/search")
    public ResponseEntity<?> searchChiTietSanPham(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Page<ChiTietSanPhamReponse> result = ctsp_Sevice.searchByTenOrMa(keyword, page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/filterByPrice")
    public ResponseEntity<?> filterByPrice(
            @RequestParam(value = "minPrice", defaultValue = "0") Double minPrice,
            @RequestParam(value = "maxPrice", required = false) Double maxPrice,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        // Nếu maxPrice không được cung cấp, mặc định là Double.MAX_VALUE
        if (maxPrice == null) {
            maxPrice = Double.MAX_VALUE;
        }

        // Gọi service để lọc theo giá
        Page<ChiTietSanPhamReponse> result = ctsp_Sevice.filterByPrice(minPrice, maxPrice, page, size);
        return ResponseEntity.ok(result);
    }

}
