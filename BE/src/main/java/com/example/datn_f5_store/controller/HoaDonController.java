package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.request.ChiTietHoaDonRequest;
import com.example.datn_f5_store.request.HoaDonRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IHoaDonService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.datn_f5_store.response.PagingModel;

@RestController
@RequestMapping("/api/v1/hoa-don")
public class HoaDonController {
    @Autowired
    private IHoaDonService hoaDonService;
    @GetMapping("/getAll")
    private ResponseEntity<Object> getAll(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var hoaDonList = hoaDonService.getAll();
        dataResponse.setResult(new ResultModel<>(null,hoaDonList));
        return ResponseEntity.ok(dataResponse);
    }

    @GetMapping("/getAllHoaDon")
    private ResponseEntity<Object> getAll(@Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
                                          @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size) {
        DataResponse dataResponse = new com.example.datn_f5_store.response.DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
        var responseList = hoaDonService.getAllHoaDon(page, size); // Lấy danh sách Khuyen mai với phân trang
        // ham tự động cập nhập trạng thái Khuyến mãi khi hết hạn

        dataResponse.setResult(new ResultModel<>(null, responseList)); // Đặt kết quả vào response
        return ResponseEntity.ok(dataResponse);
    }

    @GetMapping("/get-chi-tiet-hoa-don/{id}")
    private ResponseEntity<Object> getChiTietHoaDon(@Parameter(name = "id")@PathVariable Integer id){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var chitietHoaDonList = hoaDonService.getChiTietHoaDon(id);
        dataResponse.setResult(new ResultModel<>(null,chitietHoaDonList));
        return ResponseEntity.ok(dataResponse);
    }
    @PostMapping("/create")
    private ResponseEntity<Object> create(@RequestBody HoaDonRequest request){
        return new ResponseEntity<>(hoaDonService.craete(request), HttpStatus.CREATED);
    }
    @PutMapping("/thanh-toan/{id}")
    private ResponseEntity<Object> thanhToan(@RequestBody HoaDonRequest request,
                                             @Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(hoaDonService.update(request,id),HttpStatus.OK);
    }
    @PutMapping("/huy-hoa-don/{id}")
    private ResponseEntity<Object> huyHoaDon(@Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(hoaDonService.huyHoaDon(id),HttpStatus.OK);
    }
    @PostMapping("/chon-san-pham/{idSanPham}")
    private ResponseEntity<Object> chonSanPham(@RequestBody ChiTietHoaDonRequest request,
                                               @Parameter(name = "idSanPham") @PathVariable Integer idSanPham){
        return new ResponseEntity<>(hoaDonService.chonSanPham(request,idSanPham),HttpStatus.OK);
    }
    @PutMapping("/delete-single-san-pham/{idHdct}")
    private  ResponseEntity<Object> deleteSingleSanPham(
            @Parameter(name = "idHdct")@PathVariable Integer idHdct
    ){
        return new ResponseEntity<>(hoaDonService.giamSoLuongSanPham(idHdct),HttpStatus.OK);
    }
    @DeleteMapping("/delete-hoa-don-chi-tiet/{id}")
    private ResponseEntity<Object> xoaHoaDonChiTiet(@Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(hoaDonService.deleteHoaDonChiTiet(id),HttpStatus.OK);
    }
    @PutMapping("/update-khach-hang/{idHoaDon}")
    private ResponseEntity<Object> updateKhachHang(
            @Parameter(name = "idHoaDon")@PathVariable Integer idHoaDon,
            @RequestParam(name = "idKhachHang")@PathVariable Integer idKhachHang
    ){
        return new ResponseEntity<>(hoaDonService.updateKhachhang(idHoaDon,idKhachHang),HttpStatus.OK);
    }
    @GetMapping("/find-by-trang-thai")
    private ResponseEntity<Object> findByTrangThai(
            @Parameter(name = "page")@RequestParam(defaultValue = "0")Integer page,
            @Parameter(name = "size")@RequestParam(defaultValue = "5")Integer size,
            @Parameter(name = "keyWord")@RequestParam(required = false)String keyWord
    ){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var pageHoaDon = hoaDonService.getByTrangThai(page,size,keyWord);
        dataResponse.setResult(
                new ResultModel<>(
                        new PagingModel(page,size,pageHoaDon.getTotalElements(),pageHoaDon.getTotalPages()),pageHoaDon
                ));
        return ResponseEntity.ok(dataResponse);
    }
    @GetMapping("/detail-hoa-don-cho/{id}")
    private ResponseEntity<Object> findDetailHoaDonCho(
            @Parameter(name = "id")@PathVariable Integer id
    ){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        dataResponse.setResult(new ResultModel<>(null,hoaDonService.getDetailHoaDonCho(id)));
        return ResponseEntity.ok(dataResponse);
    }
    @PutMapping("/update-trang-thai-don-hang/{id}")
    private ResponseEntity<Object> updateTrangThaiDonHang(
            @Parameter(name = "id")@PathVariable Integer id
    ){
        return new ResponseEntity<>(hoaDonService.updateTrangThaiHoaDon(id),HttpStatus.OK);
    }
    @PutMapping("/update-dia-chi-nhan-hang/{id}")
    private ResponseEntity<Object> updateDiaChiNhanHang(
            @Parameter(name = "id")@PathVariable Integer id,
            @RequestBody HoaDonRequest request
    ){
        return new ResponseEntity<>(hoaDonService.updateDiaChiNhanHang(id,request),HttpStatus.OK);
    }
    @GetMapping("/get-by-trang-thai-cho")
    private ResponseEntity<Object> getByTrangThaiCho(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var data = hoaDonService.getByTrangThaiCho();
        dataResponse.setResult(new ResultModel<>(null, data));
        return ResponseEntity.ok(dataResponse);
    }
    @PutMapping("/set-trang-thai")
    private ResponseEntity<Object> setTrangThai(
            @Parameter(name = "idCho")@RequestParam Integer idCho,
            @Parameter(name = "idDang")@RequestParam Integer idDang
    ){
      return new ResponseEntity<>(hoaDonService.editTrangThaiHoaDon(idCho,idDang),HttpStatus.OK);
    }
    @PutMapping("/cap-nhat-san-pham")
    private ResponseEntity<Object> capNhatSanPham(
            @Parameter(name = "id")@RequestParam Integer id,
            @Parameter(name = "tongTien")@RequestParam Double tongTien,
            @Parameter(name = "idNhanVien")@RequestParam Integer idNhanVien
    ){
        return new ResponseEntity<>(hoaDonService.updateHoaDon(id,tongTien,idNhanVien),HttpStatus.OK);
    }
    @GetMapping("/huy-cap-nhat/{id}")
    private ResponseEntity<Object> huyCapNhat(@Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(hoaDonService.huyUpdateHoaDon(id),HttpStatus.OK);
    }
}
