package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.PagingModel;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.request.SanPhamRequest;
import com.example.datn_f5_store.service.ISanPhamService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200") // Cho phép các yêu cầu từ nguồn khác (ở đây là Angular frontend) truy cập vào API
@RestController // Đánh dấu lớp này là một Rest Controller cho phép xử lý các yêu cầu HTTP
@RequestMapping("/api/v1/san-pham") // Định nghĩa đường dẫn gốc cho tất cả các API thuộc lớp này
public class SanPhamController {

    @Autowired
    private ISanPhamService sanPhamService; // Tự động tiêm (inject) SanPhamService để sử dụng các chức năng liên quan đến sản phẩm

    /**
     * API để lấy danh sách tất cả các sản phẩm với tính năng phân trang.
     *
     * @param page Số trang bắt đầu từ 0 (mặc định là 0)
     * @param size Kích thước trang, số lượng sản phẩm hiển thị mỗi trang (mặc định là 3)
     * @return ResponseEntity chứa danh sách các sản phẩm và thông tin phân trang
     */
    @GetMapping("/getAll")
    private ResponseEntity<Object> getAll(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page, // Số trang hiện tại
            @Parameter(name = "size") @RequestParam(defaultValue = "3") Integer size // Kích thước trang
    ) {
        DataResponse dataResponse = new DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
        var responseList = sanPhamService.getAll(page, size); // Lấy danh sách sản phẩm với phân trang
        dataResponse.setResult(new ResultModel<>(null, responseList)); // Đặt kết quả vào response
        return ResponseEntity.ok(dataResponse); // Trả về phản hồi HTTP 200 OK với dữ liệu
    }

    /**
     * API để tìm kiếm sản phẩm theo tên hoặc mã với tính năng phân trang.
     *
     * @param page Số trang bắt đầu từ 0 (mặc định là 0)
     * @param size Kích thước trang, số lượng sản phẩm hiển thị mỗi trang (mặc định là 3)
     * @param ten Tên sản phẩm (tùy chọn)
     * @param ma Mã sản phẩm (tùy chọn)
     * @return ResponseEntity chứa danh sách sản phẩm tìm được và thông tin phân trang
     */
    @GetMapping("/find-by-ten-or-ma")
    private ResponseEntity<Object> findByTenorMa(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page, // Số trang hiện tại
            @Parameter(name = "size") @RequestParam(defaultValue = "3") Integer size, // Kích thước trang
            @Parameter(name = "ten") @RequestParam(required = false) String ten, // Tên sản phẩm cần tìm kiếm (tùy chọn)
            @Parameter(name = "ma") @RequestParam(required = false) String ma // Mã sản phẩm cần tìm kiếm (tùy chọn)
    ) {
        DataResponse dataResponse = new DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
        var responseList = sanPhamService.findByTenOrMa(page, size, ten, ma); // Tìm sản phẩm theo tên hoặc mã
        dataResponse.setResult(
                new ResultModel<>(
                        new PagingModel(page, size, responseList.getTotalElements(), responseList.getTotalPages()), responseList
                ) // Đặt kết quả vào response với thông tin phân trang
        );
        return ResponseEntity.ok(dataResponse); // Trả về phản hồi HTTP 200 OK với dữ liệu
    }
    @GetMapping("/details/{id}")
    private ResponseEntity<?> detail(@Parameter(name = "id") @PathVariable Integer id){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var sanPham = sanPhamService.findById(id);
        dataResponse.setResult(new ResultModel<>(null,sanPham));
        return ResponseEntity.ok(dataResponse);
    }

    /**
     * API để tạo mới một sản phẩm.
     *
     * @param request Yêu cầu chứa thông tin sản phẩm cần tạo
     * @return ResponseEntity chứa thông tin sản phẩm vừa tạo và trạng thái HTTP 201 CREATED
     */
    @PostMapping("/create")
    private ResponseEntity<Object> create(@RequestBody SanPhamRequest request){
        return new ResponseEntity<>(sanPhamService.create(request), HttpStatus.CREATED); // Trả về HTTP 201 CREATED sau khi tạo sản phẩm thành công
    }

    /**
     * API để cập nhật thông tin sản phẩm dựa trên ID sản phẩm.
     *
     * @param request Yêu cầu chứa thông tin sản phẩm cần cập nhật
     * @param id ID của sản phẩm cần cập nhật
     * @return ResponseEntity chứa thông tin sản phẩm đã cập nhật và trạng thái HTTP 200 OK
     */
    @PutMapping("/update/{id}")
    private ResponseEntity<Object> update(@RequestBody SanPhamRequest request, @PathVariable Integer id){
        return new ResponseEntity<>(sanPhamService.update(request, id), HttpStatus.OK); // Trả về HTTP 200 OK sau khi cập nhật thành công
    }
}
