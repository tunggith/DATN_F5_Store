package com.example.datn_f5_store.controller.exportPdf;

import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IHoaDonRepository;
import com.example.datn_f5_store.service.ExportPdf.PdfExportService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/v1/pdf")
public class exportPdfControler {
    @Autowired
    private PdfExportService pdfExportService;
    @Autowired
    private IHoaDonRepository hoaDonRepository;
    @Autowired
    private IChiTietSanPhamRepository chiTietSanPhamRepository;

    @GetMapping("/download")
    public ResponseEntity<?> downloadPdf(@Parameter(name = "id") @RequestParam Integer id) {
        ByteArrayInputStream pdf = pdfExportService.exportPdf(id);
        HoaDonEntity hoaDon = hoaDonRepository.findById(id).orElse(null);
        // Trả về file PDF với tiêu đề và nội dung
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + hoaDon.getMa() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }

    @GetMapping("/download-image")
    public ResponseEntity<?> downloadImage(@Parameter(name = "id") @RequestParam Integer id) {
        // Gọi phương thức downloadImage từ service
        ByteArrayInputStream imageStream = pdfExportService.downloadImage(id);

        // Kiểm tra xem có ảnh không
        if (imageStream == null) {
            return ResponseEntity.status(404).body("Image not found");  // Không tìm thấy ảnh
        }

        // Lấy chi tiết sản phẩm để lấy tên file
        ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(id).orElse(null);
        if (chiTietSanPham == null) {
            return ResponseEntity.status(404).body("Product not found");
        }

        // Trả về file ảnh với header thích hợp để tải về
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + chiTietSanPham.getMa() + ".png\"")
                .contentType(MediaType.IMAGE_PNG)  // Đặt content type là image/png
                .body(new InputStreamResource(imageStream));  // Trả về InputStreamResource chứa ảnh
    }

}
