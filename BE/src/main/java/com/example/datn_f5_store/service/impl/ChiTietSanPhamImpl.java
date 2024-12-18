package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.repository.IAnhChiTietSanPhamRepository;
import com.example.datn_f5_store.response.ChiTietSanPhamReponse;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.MauSacEntity;
import com.example.datn_f5_store.entity.SanPhamEntity;
import com.example.datn_f5_store.entity.SizeEntity;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IMauSacRepository;
import com.example.datn_f5_store.repository.ISanPhamRepository;
import com.example.datn_f5_store.repository.ISizeRepository;
import com.example.datn_f5_store.request.ChiTietSanphamRequest;
import com.example.datn_f5_store.utils.QrCodeUtil;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChiTietSanPhamImpl {
    @Autowired
    IChiTietSanPhamRepository repo_ctsp;
    @Autowired
    IMauSacRepository repo_mauSac;
    @Autowired
    ISizeRepository repo_size;
    @Autowired
    ISanPhamRepository repo_sanPham;

    @Autowired
    IAnhChiTietSanPhamRepository repo_anh;

    @Autowired
    QrCodeUtil qrCodeUtil;

    public ResponseEntity<?> getallPhanTrang(
            Integer currentPage
    ) {
        int size = 3;
        Pageable pageable = PageRequest.of(currentPage, size);

        // Lấy kết quả phân trang từ repository
        var pageResult = repo_ctsp.getALLPhanTrang(pageable);

        // Trả về danh sách kết quả
        return ResponseEntity.ok(pageResult.getContent());
    }

    public Page<?> getallPhanTrangbyidSP(Integer id, Integer currentPage) {
        int size = 5;
        Pageable pageable = PageRequest.of(currentPage, size);

        // Lấy kết quả phân trang từ repository
        var pageResult = repo_ctsp.getALLByIDSPCTPhanTrang(id, pageable);

        // Trả về kết quả phân trang gồm cả nội dung và thông tin phân trang
        return pageResult;
    }


    public ResponseEntity<?> saveChiTietSanPham(ChiTietSanphamRequest ctspRequet, BindingResult result) {
        // Kiểm tra nếu có lỗi
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errors);
        }

        // Kiểm tra sản phẩm có trùng không
        boolean exists = repo_ctsp.checkTrung(
                ctspRequet.getIdSanPham(),
                ctspRequet.getIdMauSac(),
                ctspRequet.getIdSize(),
                ctspRequet.getMa(),
                ctspRequet.getMoTa()
        );

        if (exists) {
            return ResponseEntity.status(409).body("Sản phẩm đã tồn tại với các thông tin đã nhập!");
        }

        // Tìm thực thể từ database
        SanPhamEntity sanPham = repo_sanPham.findById(ctspRequet.getIdSanPham())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + ctspRequet.getIdSanPham()));

        MauSacEntity mauSac = repo_mauSac.findById(ctspRequet.getIdMauSac())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy màu sắc với id: " + ctspRequet.getIdMauSac()));

        SizeEntity size = repo_size.findById(ctspRequet.getIdSize())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kích thước với id: " + ctspRequet.getIdSize()));

        // Tạo mới chi tiết sản phẩm và sao chép thuộc tính
        ChiTietSanPhamEntity chiTietSanPham = new ChiTietSanPhamEntity();
        BeanUtils.copyProperties(ctspRequet, chiTietSanPham);

        // Gán các thực thể vào chi tiết sản phẩm
        chiTietSanPham.setSanPham(sanPham);
        chiTietSanPham.setMauSac(mauSac);
        chiTietSanPham.setSize(size);
        chiTietSanPham.setDonGiaBanDau(ctspRequet.getDonGia());
        chiTietSanPham.setCheckKm(false);

        // Lưu chi tiết sản phẩm
        ChiTietSanPhamEntity chiTietSanPhamResult = repo_ctsp.save(chiTietSanPham);

        String qrCode = this.generateQrCode(chiTietSanPhamResult.getId().toString());
        chiTietSanPhamResult.setQrCode(qrCode);
        repo_ctsp.save(chiTietSanPhamResult);
        // Trả về thông báo thành công kèm theo HTTP 201 Created
        return ResponseEntity.status(201).body("Lưu chi tiết sản phẩm thành công!");
    }

    public ResponseEntity<?> updateChiTietSanPham(Integer id, ChiTietSanphamRequest ctspRequest, BindingResult result) {
        // Kiểm tra nếu có lỗi
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errors);
        }

        // Tìm chi tiết sản phẩm theo ID
        ChiTietSanPhamEntity chiTietSanPham = repo_ctsp.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết sản phẩm với id: " + id));

        // Tìm thực thể từ database
        SanPhamEntity sanPham = repo_sanPham.findById(ctspRequest.getIdSanPham())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + ctspRequest.getIdSanPham()));

        MauSacEntity mauSac = repo_mauSac.findById(ctspRequest.getIdMauSac())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy màu sắc với id: " + ctspRequest.getIdMauSac()));

        SizeEntity size = repo_size.findById(ctspRequest.getIdSize())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kích thước với id: " + ctspRequest.getIdSize()));

        // Sao chép các thuộc tính từ request sang chi tiết sản phẩm
        BeanUtils.copyProperties(ctspRequest, chiTietSanPham);

        // Gán các thực thể vào chi tiết sản phẩm
        chiTietSanPham.setSanPham(sanPham);
        chiTietSanPham.setMauSac(mauSac);
        chiTietSanPham.setSize(size);
        chiTietSanPham.setDonGiaBanDau(ctspRequest.getDonGia());
        chiTietSanPham.setCheckKm(false);

        // Lưu cập nhật chi tiết sản phẩm
        repo_ctsp.save(chiTietSanPham);

        // Trả về thông báo thành công kèm theo HTTP 200 OK
        return ResponseEntity.ok("Cập nhật chi tiết sản phẩm thành công!");
    }

    public Page<ChiTietSanPhamReponse> searchByTenOrMa(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repo_ctsp.searchByTenOrMa(keyword, pageable);
    }

    public Page<ChiTietSanPhamEntity> searchByTenOrMaManKm(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repo_ctsp.searchByTenOrMa1(keyword, pageable);
    }


    public Page<ChiTietSanPhamReponse> filterBySanPhamAndPriceAndAttributes(Long sanPhamId, Double donGia, Long mauSacId, Long sizeId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repo_ctsp.filterBySanPhamAndPriceAndAttributes(sanPhamId, donGia, mauSacId, sizeId, pageable);
    }


    public Page<ChiTietSanPhamReponse> getByTrangThaiSanPhamAndTrangThai(
            int page, int size, String keyword,
            String mauSac, String sizeSpct, String thuongHieu,
            String xuatXu, String gioiTinh) {
        this.updateTrangThai();
        Pageable pageable = PageRequest.of(page, size);
        Page<ChiTietSanPhamEntity> chiTietSanPham;
        if (keyword == null || keyword.trim().isEmpty()) {
            // Nếu keyword là null hoặc chuỗi trống, chỉ lọc theo trạng thái
            chiTietSanPham = repo_ctsp.findByTrangThaiAndSanPhamTrangThai(
                    "Còn hàng",
                    "Đang hoạt động",
                    mauSac,
                    sizeSpct,
                    thuongHieu,
                    xuatXu,
                    gioiTinh,
                    pageable);
        } else {
            // Nếu có keyword, thêm điều kiện tìm kiếm theo keyword
            chiTietSanPham = repo_ctsp.getByTrangThai(
                    "Còn hàng",
                    "Đang hoạt động",
                    keyword,
                    mauSac,
                    sizeSpct,
                    thuongHieu,
                    xuatXu,
                    gioiTinh,
                    pageable);
        }

        // Chuyển từ ChiTietSanPhamEntity sang ChiTietSanPhamReponse
        return chiTietSanPham.map(entity -> new ChiTietSanPhamReponse(
                entity.getId(),
                entity.getSanPham(),
                entity.getMauSac(),
                entity.getSize(),
                entity.getMa(),
                entity.getMoTa(),
                entity.getDonGia(),
                entity.getSoLuong(),
                entity.getTrangThai(),
                entity.getCheckKm(),
                entity.getDonGiaBanDau(),
                entity.getQrCode()
        ));
    }

    public Page<ChiTietSanPhamEntity> getAllPhanTrangKm(int currentPage, int pageSize) {
        Pageable pageable = PageRequest.of(currentPage, pageSize);
        return repo_ctsp.findAll(pageable);
    }

    public ChiTietSanPhamEntity getChiTietSanPhamById(Integer id) {
        return repo_ctsp.findById(id).get();
    }


    public boolean isDuplicate(Long idSanPham, Long idMauSac, Long idSize) {
        return repo_ctsp.existsBySanPhamIdAndMauSacIdAndSizeId(idSanPham, idMauSac, idSize);
    }

    public boolean isDuplicateChiTietSanPham(Long sanPhamId, Long mauSacId, Long sizeId, Long chiTietSanPhamId) {
        return repo_ctsp.existsBySanPhamIdAndMauSacIdAndSizeIdAndNotId(sanPhamId, mauSacId, sizeId, chiTietSanPhamId);
    }

    public Integer getSanPhambyidSP(Integer idSanPham) {
        return repo_ctsp.getSoLuongByidSP(idSanPham);
    }

    public List<MauSacEntity> getGroupByMauSac(Integer idSanPham) {
        try {
            // Gọi repository để lấy danh sách các màu sắc
            return repo_ctsp.groupByMauSac(idSanPham);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Có lỗi xảy ra khi lấy danh sách màu sắc: " + e.getMessage());
        }
    }


    /**
     * Thêm danh sách ảnh cho tất cả các Spct của một sản phẩm theo màu sắc.
     *
     * @param idSanPham ID sản phẩm
     * @param idMauSac  ID màu sắc
     * @param urls      Danh sách URL ảnh
     */
    @Transactional
    public void addImagesByProductAndColor(Integer idSanPham, Integer idMauSac, List<String> urls) {
        // Tìm tất cả các Spct theo sản phẩm và màu sắc
        List<ChiTietSanPhamEntity> spctList = repo_ctsp.findBySanPhamIdAndMauSacId(idSanPham, idMauSac);

        if (spctList.isEmpty()) {
            throw new RuntimeException("Không tìm thấy sản phẩm chi tiết với màu sắc tương ứng.");
        }

        // Duyệt qua danh sách Spct và thêm ảnh
        for (ChiTietSanPhamEntity spct : spctList) {
            for (String url : urls) {
                AnhChiTietSanPham anhSpct = new AnhChiTietSanPham();
                anhSpct.setChiTietSanPham(spct);
                anhSpct.setUrlAnh(url);
                repo_anh.save(anhSpct);
            }
        }
    }

    public static String generateQrCode(String data) {
        StringBuilder result = new StringBuilder();
        if (!data.isEmpty()) {
            ByteArrayOutputStream os = new ByteArrayOutputStream();

            try {
                QRCodeWriter writer = new QRCodeWriter();
                BitMatrix bitMatrix = writer.encode(data, BarcodeFormat.QR_CODE, 300, 300);

                BufferedImage bufferedImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
                ImageIO.write(bufferedImage, "png", os);
                result.append("data:image/png;base64,");
                result.append(new String(Base64.getEncoder().encode(os.toByteArray())));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return result.toString();
    }

    private String updateTrangThai() {
        // Lấy tất cả các sản phẩm chi tiết
        List<ChiTietSanPhamEntity> listChiTietSanPham = repo_ctsp.findAll();

        // Duyệt qua danh sách và cập nhật trạng thái dựa trên số lượng tồn
        listChiTietSanPham.forEach(entity -> {
            if (entity.getSoLuong() > 0) {
                // Nếu số lượng tồn > 0, trạng thái là "Còn hàng"
                if (!entity.getTrangThai().equals("Còn hàng")) {
                    entity.setTrangThai("Còn hàng");
                }
            } else {
                // Nếu số lượng tồn <= 0, trạng thái là "Hết hàng"
                if (!entity.getTrangThai().equals("Hết hàng")) {
                    entity.setTrangThai("Hết hàng");
                }
            }
        });

        // Lưu lại toàn bộ danh sách đã cập nhật
        repo_ctsp.saveAll(listChiTietSanPham);

        // Trả về thông báo thành công
        return "Cập nhật trạng thái thành công!";
    }

}
