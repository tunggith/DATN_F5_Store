package com.example.datn_f5_store.service.impl;
import com.example.datn_f5_store.dto.KhuyenMaiChiTietSanPhamDto;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.KhuyenMaiChiTietSanPham;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IKhuyenMaiChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IKhuyenMaiRepository;
import com.example.datn_f5_store.request.KhuyenMaiChiTietSanPhamRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.service.KhuyenMaiChiTietSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import  com.example.datn_f5_store.response.ResultModel;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class KhuyenMaiChiTietSanPhamImpl implements KhuyenMaiChiTietSanPhamService {
    @Autowired
    IKhuyenMaiChiTietSanPhamRepository iKhuyenMaiChiTietSanPhamRepository;

    @Autowired
    IChiTietSanPhamRepository chiTietSanPhamRepository;
    @Autowired
    IKhuyenMaiRepository khuyenMaiRepository;

    @Override
    public Page<KhuyenMaiChiTietSanPhamDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<KhuyenMaiChiTietSanPham> khuyenMaiSpEntities = iKhuyenMaiChiTietSanPhamRepository.findAll(pageable);

        return khuyenMaiSpEntities.map(entity -> new KhuyenMaiChiTietSanPhamDto(
                entity.getId(),
                entity.getKhuyenMai(),
                entity.getChiTietSanPham(),
                entity.getTrangThai()
        ));
    }
    @Override
    public Page<KhuyenMaiChiTietSanPhamDto> getByKhuyenMai(int page, int size, int idKm) {
        Pageable pageable = PageRequest.of(page, size);

        // Lấy kết quả từ repository
        Page<KhuyenMaiChiTietSanPham> khuyenMaiChiTietList = iKhuyenMaiChiTietSanPhamRepository.findByKhuyenMai(pageable,idKm);

        // Chuyển đổi danh sách từ KhuyenMaiChiTietSanPham sang KhuyenMaiChiTietSanPhamDto
        List<KhuyenMaiChiTietSanPhamDto> dtoList = khuyenMaiChiTietList.getContent().stream()
                .map(khuyenMaiChiTiet -> new KhuyenMaiChiTietSanPhamDto(
                        khuyenMaiChiTiet.getId(),
                        khuyenMaiChiTiet.getKhuyenMai(), // Thay thế bằng các thuộc tính thực tế
                        khuyenMaiChiTiet.getChiTietSanPham(),
                        khuyenMaiChiTiet.getTrangThai()// Thay thế bằng các thuộc tính thực tế
                        // Thêm các thuộc tính khác nếu có
                ))
                .collect(Collectors.toList());

        // Trả về Page của KhuyenMaiChiTietSanPhamDto
        return new PageImpl<>(dtoList, pageable, khuyenMaiChiTietList.getTotalElements());
    }


    @Override
    public DataResponse XoaKhuyenMaictsp(Integer id) {
        try {
            ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(id).get();
            KhuyenMaiChiTietSanPham khuyenMaiChiTietSanPham = iKhuyenMaiChiTietSanPhamRepository.findByChiTietSanPhamId(chiTietSanPham.getId()).get();
            KhuyenMaiEntity khuyenMai = khuyenMaiRepository.findById(khuyenMaiChiTietSanPham.getKhuyenMai().getId()).get();
            if (khuyenMaiChiTietSanPham.getTrangThai().equalsIgnoreCase("Chưa áp dụng") || khuyenMai.getTrangThai().equalsIgnoreCase("Sắp diễn ra")){
                iKhuyenMaiChiTietSanPhamRepository.deleteById(khuyenMaiChiTietSanPham.getId());
            } if(khuyenMaiChiTietSanPham.getTrangThai().equalsIgnoreCase("Đã kết thúc") || khuyenMai.getTrangThai().equalsIgnoreCase("Đã kết thúc")){

                iKhuyenMaiChiTietSanPhamRepository.deleteById(khuyenMaiChiTietSanPham.getId());
            }
            else {

                if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("$")) {
                    chiTietSanPham.setDonGia(chiTietSanPham.getDonGia() + khuyenMai.getGiaTriKhuyenMai());
                } else if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("%")) {
                    double giaTriGiam = ((double) khuyenMai.getGiaTriKhuyenMai() / 100);
                    chiTietSanPham.setDonGia(chiTietSanPham.getDonGia() / (1 - giaTriGiam));
                }
                chiTietSanPhamRepository.save(chiTietSanPham);  // Cập nhật lại giá trong DB
                iKhuyenMaiChiTietSanPhamRepository.deleteById(khuyenMaiChiTietSanPham.getId());
            }
            return new DataResponse(true, new ResultModel<>(null, "Xóa khuyến mãi thành công, "+ chiTietSanPham.getTen() + " đã khôi phục giá ban đầu"));
        } catch (Exception e) {
            return new DataResponse(false, new ResultModel<>(null, "Xóa khuyến mãi thất bại với lỗi : "+ e));
        }
    }

    // hàm thêm khuyến mãi vào sản phẩm
    @Override
    public DataResponse createKhuyenMaictsp(KhuyenMaiChiTietSanPhamRequest khuyenMaiChiTietSanPhamRequest) {
        // Lấy ra Khuyến mãi và Sản Phầm Chi tiết theo id
        KhuyenMaiEntity khuyenMai = khuyenMaiRepository.findById(khuyenMaiChiTietSanPhamRequest.getKhuyenMai().getId()).orElseThrow(() -> new RuntimeException("Khuyến mãi không tồn tại"));
        ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(khuyenMaiChiTietSanPhamRequest.getChiTietSanPham().getId()).orElseThrow(() -> new RuntimeException("Chi tiết sản phẩm không tồn tại"));
        Optional<KhuyenMaiChiTietSanPham> checkSpct = iKhuyenMaiChiTietSanPhamRepository.findFirstByChiTietSanPham(chiTietSanPham);
        KhuyenMaiChiTietSanPham khuyenMaiChiTietSanPham = new KhuyenMaiChiTietSanPham();
        try {
            // kiểm tra sản phẩm đã có khuyến mãi hay chưa
            if (checkSpct.isPresent()) {
                return new DataResponse(false, new ResultModel<>(null, chiTietSanPham.getTen() +" đã có khuyến mãi, không thể thêm khuyến mãi khác")); // nếu sản phẩm đã có khuyến mãi rồi, thông báo lỗi
            }
            if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("$") &&  chiTietSanPham.getDonGia() < khuyenMai.getGiaTriKhuyenMai()) {
                return new DataResponse(false, new ResultModel<>(null, "Xin lỗi, Khuyến mãi không áp dụng cho sản phẩm này"));
            }
            if(khuyenMai.getTrangThai().equalsIgnoreCase("Đã kết thúc")){
                return new DataResponse(false, new ResultModel<>(null, "Mã khuyến mãi "+ khuyenMai.getMa() +" đã kết thúc, không thể áp dụng"));
            }
            if (khuyenMai.getSoLuong() == 0 || khuyenMai.getSoLuong() == null){
                return new DataResponse(false, new ResultModel<>(null, "Số lượng khuyến mãi "+ khuyenMai.getMa() +" đã hết, vui lòng chọn mã khuyến mãi khác"));
            }
            if (chiTietSanPham.getSoLuong() <= 0 || chiTietSanPham.getSoLuong() == null){
                return new DataResponse(false, new ResultModel<>(null, "Sản phẩm "+ chiTietSanPham.getTen() +" đã hết, vui lòng chọn sản phẩm khác"));
            }
            if (chiTietSanPham.getTrangThai().equalsIgnoreCase("Hết hàng")){
                return new DataResponse(false, new ResultModel<>(null, "Sản phẩm "+ chiTietSanPham.getTen() +" đã hết, vui lòng chọn sản phẩm khác"));
            }
            if(khuyenMai.getTrangThai().equalsIgnoreCase("Sắp diễn ra")){
                khuyenMai.setSoLuong(khuyenMai.getSoLuong() - 1);
                khuyenMaiRepository.save(khuyenMai);
                khuyenMaiChiTietSanPham.setTrangThai("Chưa áp dụng");
                khuyenMaiChiTietSanPham.setKhuyenMai(khuyenMai);
                khuyenMaiChiTietSanPham.setChiTietSanPham(chiTietSanPham);
                iKhuyenMaiChiTietSanPhamRepository.save(khuyenMaiChiTietSanPham);
            }
            if(khuyenMai.getTrangThai().equalsIgnoreCase("Đang diễn ra")) {
                // Cập nhật giá sản phẩm chi tiết
                if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("%")) {
                    double soTienDuocGiam = chiTietSanPham.getDonGia() * (khuyenMai.getGiaTriKhuyenMai() / 100.0);
                    chiTietSanPham.setDonGia(chiTietSanPham.getDonGia() - soTienDuocGiam);
                } else if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("$")) {
                    chiTietSanPham.setDonGia(chiTietSanPham.getDonGia() - khuyenMai.getGiaTriKhuyenMai());
                }
                chiTietSanPhamRepository.save(chiTietSanPham);
                khuyenMai.setSoLuong(khuyenMai.getSoLuong() - 1);
                khuyenMaiRepository.save(khuyenMai);
                khuyenMaiChiTietSanPham.setTrangThai("Đang áp dụng");
                khuyenMaiChiTietSanPham.setKhuyenMai(khuyenMai);
                khuyenMaiChiTietSanPham.setChiTietSanPham(chiTietSanPham);
                iKhuyenMaiChiTietSanPhamRepository.save(khuyenMaiChiTietSanPham);
            }
            return new DataResponse(true, new ResultModel<>(null, "Thêm Khuyến mãi cho " + chiTietSanPham.getTen() + " thành công!!"));
        }catch (Exception e){
            return new DataResponse(false, new ResultModel<>(null, "Lỗi Thêm Khuyến mãi cho sản phẩm là :" + e));
        }
    }

    @Scheduled(cron = "0 0 12 * * ?")
    public void upDateTrangThaiKhuyenMaiCtSp() {
        try {
            // Khai báo thời gian hiện tại
            LocalDateTime currentDateTime = LocalDateTime.now(ZoneId.systemDefault());

            List<KhuyenMaiChiTietSanPham> khuyenMaiChiTietSanPhams = iKhuyenMaiChiTietSanPhamRepository.findAll();
            for (KhuyenMaiChiTietSanPham khuyenMaictsp : khuyenMaiChiTietSanPhams) {
                // Lấy thời gian bắt đầu và kết thúc của khuyến mãi
                LocalDateTime thoiGianBatDau = khuyenMaictsp.getKhuyenMai().getThoiGianBatDau();
                LocalDateTime thoiGianKetThuc = khuyenMaictsp.getKhuyenMai().getThoiGianKetThuc();

                // Kiểm tra nếu có Khuyến mãi nào có trạng thái là "Chưa áp dụng" và Thời gian bắt đầu bằng hoặc nhỏ hơn với thời gian hiện tại
                if (khuyenMaictsp.getTrangThai().equalsIgnoreCase("Chưa áp dụng") &&
                        thoiGianBatDau != null && !thoiGianBatDau.isAfter(currentDateTime)) {
                    if (khuyenMaictsp.getKhuyenMai().getKieuKhuyenMai().equalsIgnoreCase("%")) {
                        double soTienDuocGiam = khuyenMaictsp.getChiTietSanPham().getDonGia() * (khuyenMaictsp.getKhuyenMai().getGiaTriKhuyenMai() / 100.0);
                        khuyenMaictsp.getChiTietSanPham().setDonGia(khuyenMaictsp.getChiTietSanPham().getDonGia() - soTienDuocGiam);
                    } else if (khuyenMaictsp.getKhuyenMai().getKieuKhuyenMai().equalsIgnoreCase("$")) {
                        khuyenMaictsp.getChiTietSanPham().setDonGia(khuyenMaictsp.getChiTietSanPham().getDonGia() - khuyenMaictsp.getKhuyenMai().getGiaTriKhuyenMai());
                    }

                    khuyenMaictsp.setTrangThai("Đang áp dụng");
                    iKhuyenMaiChiTietSanPhamRepository.save(khuyenMaictsp);
                    khuyenMaiRepository.save(khuyenMaictsp.getKhuyenMai());
                    khuyenMaictsp.setTrangThai("Đang diễn ra");
                    chiTietSanPhamRepository.save(khuyenMaictsp.getChiTietSanPham());
                }


                // Kiểm tra nếu có Khuyến mãi nào có Thời gian kết thúc nhỏ hơn so với thời gian hiện tại
                if (thoiGianKetThuc != null && thoiGianKetThuc.isBefore(currentDateTime)) {
                    if (khuyenMaictsp.getKhuyenMai().getKieuKhuyenMai().equalsIgnoreCase("$")) {
                        khuyenMaictsp.getChiTietSanPham().setDonGia(khuyenMaictsp.getChiTietSanPham().getDonGia() + khuyenMaictsp.getKhuyenMai().getGiaTriKhuyenMai());
                    } else if (khuyenMaictsp.getKhuyenMai().getKieuKhuyenMai().equalsIgnoreCase("%")) {
                        double giaTriGiam = ((double) khuyenMaictsp.getKhuyenMai().getGiaTriKhuyenMai() / 100);
                        khuyenMaictsp.getChiTietSanPham().setDonGia(khuyenMaictsp.getChiTietSanPham().getDonGia() / (1 - giaTriGiam));
                    }
                    chiTietSanPhamRepository.save(khuyenMaictsp.getChiTietSanPham());
                    iKhuyenMaiChiTietSanPhamRepository.deleteById(khuyenMaictsp.getId());
                }
                if (khuyenMaictsp.getKhuyenMai().getTrangThai().equalsIgnoreCase("Đã kết thúc")) {
                    if (khuyenMaictsp.getKhuyenMai().getKieuKhuyenMai().equalsIgnoreCase("$")) {
                        khuyenMaictsp.getChiTietSanPham().setDonGia(khuyenMaictsp.getChiTietSanPham().getDonGia() + khuyenMaictsp.getKhuyenMai().getGiaTriKhuyenMai());
                    } else if (khuyenMaictsp.getKhuyenMai().getKieuKhuyenMai().equalsIgnoreCase("%")) {
                        double giaTriGiam = ((double) khuyenMaictsp.getKhuyenMai().getGiaTriKhuyenMai() / 100);
                        khuyenMaictsp.getChiTietSanPham().setDonGia(khuyenMaictsp.getChiTietSanPham().getDonGia() / (1 - giaTriGiam));
                    }
                    chiTietSanPhamRepository.save(khuyenMaictsp.getChiTietSanPham());
                    iKhuyenMaiChiTietSanPhamRepository.deleteById(khuyenMaictsp.getId());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }



}
