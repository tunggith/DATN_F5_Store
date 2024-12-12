package com.example.datn_f5_store.controller.clientController;

import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IGioiTinhService;
import com.example.datn_f5_store.service.IMauSacService;
import com.example.datn_f5_store.service.ISanPhamClientservice;
import com.example.datn_f5_store.service.ISizeService;
import com.example.datn_f5_store.service.IThuongHieuService;
import com.example.datn_f5_store.service.IXuatXuService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/customer")
public class SanPhamClientController {

    @Autowired
    private ISizeService iSizeService;

    @Autowired
    private IMauSacService iMauSacService;

    @Autowired
    private IXuatXuService iXuatXuService;

    @Autowired
    private IGioiTinhService iGioiTinhService;

    @Autowired
    private ISanPhamClientservice iSanPhamClientservice;

    @Autowired
    private IThuongHieuService iThuongHieuService;
    @GetMapping("/size-getAll")
    private ResponseEntity<Object> getAllSize(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var sizeList = iSizeService.getAll();
        dataResponse.setResult(new ResultModel<>(null,sizeList));
        return ResponseEntity.ok(dataResponse);
    }

    @GetMapping("/xuat-xu-getAll")
    private ResponseEntity<Object> getAllXuatXu(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var xuatXuList = iXuatXuService.getAll();
        dataResponse.setResult(new ResultModel<>(null,xuatXuList));
        return ResponseEntity.ok(dataResponse);
    }

    @GetMapping("/mau-sac-getAll")
    private ResponseEntity<Object> getAllmauSac(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var xuatXuList = iMauSacService.getAll();
        dataResponse.setResult(new ResultModel<>(null,xuatXuList));
        return ResponseEntity.ok(dataResponse);
    }


    @GetMapping("/gioi-tinh-getAll")
    private ResponseEntity<Object> getAllgioitinh(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var xuatXuList = iGioiTinhService.getAll();
        dataResponse.setResult(new ResultModel<>(null,xuatXuList));
        return ResponseEntity.ok(dataResponse);
    }

    @GetMapping("/thuong-hieu-getAll")
    private ResponseEntity<Object> getAll(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var thuongHieuList = iThuongHieuService.getAll();
        dataResponse.setResult(new ResultModel<>(null,thuongHieuList));
        return ResponseEntity.ok(dataResponse);
    }


    @GetMapping("/getSanPhamPhanTrang")
    public ResponseEntity<Page<AnhChiTietSanPham>> getSanPham(
            @RequestParam(value = "page" ,defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "9") int size) {
        if (page < 0) {
            page = 0; // Đảm bảo page luôn bắt đầu từ 0
        }
        Page<AnhChiTietSanPham> result = iSanPhamClientservice.getSanPham(page, size);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    /**
     * API để lấy danh sách sản phẩm với các bộ lọc tùy chọn và phân trang.
     *
     * @param gioiTinh    ID giới tính, có thể là null
     * @param thuongHieu  ID thương hiệu, có thể là null
     * @param xuatXu      ID xuất xứ, có thể là null
     * @param giaMin      Giá tối thiểu, mặc định là 0 nếu không được truyền vào
     * @param giaMax      Giá tối đa, mặc định là giá rất cao nếu không được truyền vào
     * @param mauSac      ID màu sắc, có thể là null
     * @param kichThuoc   ID kích thước, có thể là null
     * @param page        Số trang bắt đầu từ 0
     * @param size        Số lượng bản ghi mỗi trang
     * @return Danh sách sản phẩm sau khi lọc và phân trang
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<AnhChiTietSanPham>> getFilteredProducts(
            @RequestParam(value = "gioiTinh", required = false) Integer gioiTinh,
            @RequestParam(value = "thuongHieu", required = false) Integer thuongHieu,
            @RequestParam(value = "xuatXu", required = false) Integer xuatXu,
            @RequestParam(value = "giaMin", required = false) Double giaMin,
            @RequestParam(value = "giaMax", required = false) Double giaMax,
            @RequestParam(value = "mauSac", required = false) Integer mauSac,
            @RequestParam(value = "kichThuoc", required = false) Integer kichThuoc,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "9") int size
    ) {
        // Tạo đối tượng Pageable từ page và size
        Pageable pageable = PageRequest.of(page, size);

        // Gọi service để lấy danh sách sản phẩm đã được lọc và phân trang
        Page<AnhChiTietSanPham> result = iSanPhamClientservice.getFilteredProducts(
                gioiTinh, thuongHieu, xuatXu, giaMin, giaMax, mauSac, kichThuoc, pageable
        );

        // Trả về kết quả phân trang
        return ResponseEntity.ok(result);
    }
    @GetMapping("get-so-luong/{id}")
    public ResponseEntity<Object> getSoLuong(@Parameter(name = "id")@PathVariable Integer id){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var data = iSanPhamClientservice.getSoLuong(id);
        dataResponse.setResult(new ResultModel<>(null,data));
        return ResponseEntity.ok(dataResponse);
    }
    @GetMapping("/get-list-chi-tiet")
    public ResponseEntity<Object> getListChiTiet(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var data = iSanPhamClientservice.getListChiTietSanPham();
        dataResponse.setResult(new ResultModel<>(null,data));
        return ResponseEntity.ok(dataResponse);
    }

}
