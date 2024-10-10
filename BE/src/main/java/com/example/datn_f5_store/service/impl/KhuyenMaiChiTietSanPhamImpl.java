package com.example.datn_f5_store.service.impl;
import com.example.datn_f5_store.dto.KhuyenMaiChiTietSanPhamDto;
import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.KhuyenMaiChiTietSanPham;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.exceptions.DataNotFoundException;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IKhuyenMaiChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IKhuyenMaiRepository;
import com.example.datn_f5_store.request.KhuyenMaiChiTietSanPhamRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.service.KhuyenMaiChiTietSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import  com.example.datn_f5_store.response.ResultModel;

import java.util.Date;
import java.util.List;
import java.util.Optional;

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

    // hàm bỏ khuyến mãi khỏi sản phẩm
    @Override
    public DataResponse capNhapTrangThaiKhuyenMaiSpct(Integer id) {
        try {
            KhuyenMaiChiTietSanPham khuyenMaiChiTietSanPham = iKhuyenMaiChiTietSanPhamRepository.findById(id).get();
            ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(khuyenMaiChiTietSanPham.getChiTietSanPham().getId()).get();
            KhuyenMaiEntity khuyenMai = khuyenMaiRepository.findById(khuyenMaiChiTietSanPham.getKhuyenMai().getId()).get();
            if (khuyenMaiChiTietSanPham.getTrangThai().equalsIgnoreCase("Đang hoạt động")) {
                if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("$")) {
                    chiTietSanPham.setDonGia(chiTietSanPham.getDonGia() + khuyenMai.getGiaTriKhuyenMai());
                } else if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("%")) {
                    chiTietSanPham.setDonGia(chiTietSanPham.getDonGia() / (1 - ((double) khuyenMai.getGiaTriKhuyenMai() / 100)));
                }
                chiTietSanPhamRepository.save(chiTietSanPham);  // Cập nhật lại giá trong DB
                khuyenMaiChiTietSanPham.setTrangThai("Không hoạt động");
                iKhuyenMaiChiTietSanPhamRepository.save(khuyenMaiChiTietSanPham);
                return new DataResponse(true, new ResultModel<>(null, "Gỡ khuyến mãi thành công, " + chiTietSanPham.getTen() + "đã khôi phục giá ban đầu"));
            }
            if (khuyenMaiChiTietSanPham.getTrangThai().equalsIgnoreCase("Không hoạt động")) {
                if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("%")) {
                    double soTienDuocGiam = chiTietSanPham.getDonGia() * (khuyenMai.getGiaTriKhuyenMai() / 100.0);
                    chiTietSanPham.setDonGia(chiTietSanPham.getDonGia() - soTienDuocGiam);
                } else if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("$")) {
                    chiTietSanPham.setDonGia(chiTietSanPham.getDonGia() - khuyenMai.getGiaTriKhuyenMai());
                }
                chiTietSanPhamRepository.save(chiTietSanPham);  // Cập nhật lại giá trong DB
                khuyenMaiChiTietSanPham.setTrangThai("Đang hoạt động");
                iKhuyenMaiChiTietSanPhamRepository.save(khuyenMaiChiTietSanPham);
                return new DataResponse(true, new ResultModel<>(null, "Thêm khuyến mãi cho sản phẩm " + chiTietSanPham.getTen() + " thành công"));
            }
            return new DataResponse(false, new ResultModel<>(null, "Gỡ khuyến mãi không thành công, vui lòng thừ lại"));
        } catch (Exception e) {
            return new DataResponse(false, new ResultModel<>(null, "Gỡ khuyến mãi thất bại với lỗi : "+ e));
        }
    }

    @Override
    public DataResponse XoaKhuyenMaictsp(Integer id) {
        try {
            KhuyenMaiChiTietSanPham khuyenMaiChiTietSanPham = iKhuyenMaiChiTietSanPhamRepository.findById(id).get();
            ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(khuyenMaiChiTietSanPham.getChiTietSanPham().getId()).orElseThrow();
            KhuyenMaiEntity khuyenMai = khuyenMaiRepository.findById(khuyenMaiChiTietSanPham.getKhuyenMai().getId()).orElseThrow();
            if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("$")) {
                chiTietSanPham.setDonGia(chiTietSanPham.getDonGia() + khuyenMai.getGiaTriKhuyenMai());
            } else if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("%")) {
                chiTietSanPham.setDonGia(chiTietSanPham.getDonGia() / (1 - ((double) (khuyenMai.getGiaTriKhuyenMai() / 100))));
            }
            chiTietSanPhamRepository.save(chiTietSanPham);  // Cập nhật lại giá trong DB
            iKhuyenMaiChiTietSanPhamRepository.deleteById(id);
            return new DataResponse(true, new ResultModel<>(null, "Xóa khuyến mãi thành công, "+ chiTietSanPham.getTen() + "đã khôi phục giá ban đầu"));
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
        try {
            // kiểm tra sản phẩm đã có khuyến mãi hay chưa
            if (checkSpct.isPresent()) {
                return new DataResponse(false, new ResultModel<>(null, chiTietSanPham.getTen() +" đã có khuyến mãi, không thể thêm khuyến mãi khác")); // nếu sản phẩm đã có khuyến mãi rồi, thông báo lỗi
            }
            if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("$") &&  chiTietSanPham.getDonGia() < khuyenMai.getGiaTriKhuyenMai()) {
                return new DataResponse(false, new ResultModel<>(null, "Xin lỗi, Khuyến mãi không áp dụng cho sản phẩm này"));
            }
            if(khuyenMai.getTrangThai().equalsIgnoreCase("Đã hết hạn")){
                return new DataResponse(false, new ResultModel<>(null, "Mã khuyến mãi "+ khuyenMai.getMa() +" đã hết hạn, không thể áp dụng"));
            }
            if(khuyenMai.getTrangThai().equalsIgnoreCase("Không hoạt động")){
                return new DataResponse(false, new ResultModel<>(null, "Mã khuyến mãi "+ khuyenMai.getMa() +" không hoạt động, không thể áp dụng"));
            }
            if (khuyenMai.getSoLuong() == 0 || khuyenMai.getSoLuong() == null){
                return new DataResponse(false, new ResultModel<>(null, "Số lượng mã "+ khuyenMai.getMa() +" đã hết, vui lòng chọn mã khuyến mãi khác"));
            }
            // Lưu khuyến mãi chi tiết
            KhuyenMaiChiTietSanPham khuyenMaiChiTietSanPham = new KhuyenMaiChiTietSanPham();
            khuyenMaiChiTietSanPham.setKhuyenMai(khuyenMaiChiTietSanPhamRequest.getKhuyenMai());
            khuyenMaiChiTietSanPham.setChiTietSanPham(khuyenMaiChiTietSanPhamRequest.getChiTietSanPham());
            khuyenMaiChiTietSanPham.setTrangThai("Đang hoạt động");
            iKhuyenMaiChiTietSanPhamRepository.save(khuyenMaiChiTietSanPham);
                 // Cập nhật giá sản phẩm chi tiết
                if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("%")) {
                    double soTienDuocGiam = chiTietSanPham.getDonGia() * (khuyenMai.getGiaTriKhuyenMai() / 100.0);
                    chiTietSanPham.setDonGia(chiTietSanPham.getDonGia() - soTienDuocGiam);
                } else if (khuyenMai.getKieuKhuyenMai().equalsIgnoreCase("$")) {
                    chiTietSanPham.setDonGia(chiTietSanPham.getDonGia() - khuyenMai.getGiaTriKhuyenMai());
                }
            chiTietSanPhamRepository.save(chiTietSanPham);
            // Trừ số lượng bên Khuyến mãi
            khuyenMai.setSoLuong(khuyenMai.getSoLuong() - 1);
            khuyenMaiRepository.save(khuyenMai);
            return new DataResponse(true, new ResultModel<>(null, "Thêm Khuyến mãi cho "+ chiTietSanPham.getTen() + " thành công!!"));
        }catch (Exception e){
            return new DataResponse(false, new ResultModel<>(null, "Lỗi Thêm Khuyến mãi cho sản phẩm là :" + e));
        }
    }

    @Scheduled(cron = "0 0 12 * * ?")
    public void CapNhapTrangThaiKhuyenMaiCtSpDhh() {
        try {
            // khai báo thời gian hiện tại
            Date currentDate = new Date();
            // lấy ra tất cả Khuyến mãi
            List<KhuyenMaiChiTietSanPham> khuyenMaiChiTietSanPhams = iKhuyenMaiChiTietSanPhamRepository.findAll();

            for (KhuyenMaiChiTietSanPham khuyenMaictsp : khuyenMaiChiTietSanPhams) {
                // Kiểm tra nếu có Khuyến mãi nào có Thời gian kết thúc nhỏ hơn so với thời gian hiện tại thì cập nhập lại trạng thái
                if (khuyenMaictsp.getKhuyenMai().getThoiGianKetThuc() != null && khuyenMaictsp.getKhuyenMai().getThoiGianKetThuc().before(currentDate)) {
                    if (khuyenMaictsp.getKhuyenMai().getKieuKhuyenMai().equalsIgnoreCase("$")) {
                        khuyenMaictsp.getChiTietSanPham().setDonGia(khuyenMaictsp.getChiTietSanPham().getDonGia() + khuyenMaictsp.getKhuyenMai().getGiaTriKhuyenMai());
                    } else if (khuyenMaictsp.getKhuyenMai().getKieuKhuyenMai().equalsIgnoreCase("%")) {
                        khuyenMaictsp.getChiTietSanPham().setDonGia(khuyenMaictsp.getChiTietSanPham().getDonGia() / (1 - khuyenMaictsp.getKhuyenMai().getGiaTriKhuyenMai() / 100));
                    }
                    chiTietSanPhamRepository.save(khuyenMaictsp.getChiTietSanPham());
                    khuyenMaictsp.getKhuyenMai().setTrangThai("Đã hết hạn");
                    khuyenMaiRepository.save(khuyenMaictsp.getKhuyenMai());
                    khuyenMaictsp.setTrangThai("Đã hết hạn");
                    iKhuyenMaiChiTietSanPhamRepository.save(khuyenMaictsp);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
