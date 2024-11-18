package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.ChiTietGioHangDto;
import com.example.datn_f5_store.dto.GioHangChiTietDto;
import com.example.datn_f5_store.dto.GioHangDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.entity.ChiTietGioHangEntity;
import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.GioHangEntity;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.repository.IAnhChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IChiTietGioHangRepository;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IDiaChiKhachHangRepository;
import com.example.datn_f5_store.repository.IGioHangRepository;
import com.example.datn_f5_store.repository.IKhachHangRepository;
import com.example.datn_f5_store.request.ChiTietGioHangRequest;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IGioHangClientService;
import com.example.datn_f5_store.service.sendEmail.SendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GiohangClientImpl implements IGioHangClientService {
    @Autowired
    private IGioHangRepository gioHangRepository;
    @Autowired
    private IChiTietGioHangRepository chiTietGioHangRepository;
    @Autowired
    private IAnhChiTietSanPhamRepository anhChiTietSanPhamRepository;
    @Autowired
    private IChiTietSanPhamRepository chiTietSanPhamRepository;

    @Override
    public List<GioHangChiTietDto> getAllChiTietGioHang(Integer id) {
        // Lấy thông tin giỏ hàng theo ID khách hàng
        GioHangEntity gioHangEntity = gioHangRepository.findByKhachHang_Id(id);

        // Lấy danh sách chi tiết giỏ hàng liên quan đến giỏ hàng
        List<ChiTietGioHangEntity> listChiTietGioHang = chiTietGioHangRepository.findByGioHang_Id(gioHangEntity.getId());

        // Chuyển đổi danh sách ChiTietGioHangEntity thành ChiTietGioHangDto, bao gồm thêm ảnh
        return listChiTietGioHang.stream().map(entity -> {
            // Lấy danh sách ảnh liên quan đến chi tiết sản phẩm
            List<AnhChiTietSanPham> danhSachAnh = anhChiTietSanPhamRepository.getByChiTietSanPham_Id(entity.getChiTietSanPham().getId());

            // Kiểm tra nếu danh sách ảnh không rỗng, lấy ảnh đầu tiên, nếu không có ảnh thì gán null hoặc giá trị mặc định
            AnhChiTietSanPham anh = (danhSachAnh.isEmpty()) ? null : danhSachAnh.get(0);

            // Trả về DTO, bao gồm ảnh
            return new GioHangChiTietDto(
                    entity.getId(),
                    entity.getGioHang(),
                    entity.getChiTietSanPham(),
                    entity.getSoLuong(),
                    anh
            );
        }).collect(Collectors.toList());
    }


    @Override
    public DataResponse themSanPham(Integer idKhachHang,ChiTietGioHangRequest request) {
        // Tìm giỏ hàng và chi tiết sản phẩm
        GioHangEntity gioHangEntity = gioHangRepository.findByKhachHang_Id(idKhachHang);
        ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(request.getIdChiTietSanPham()).orElse(null);

        if (gioHangEntity == null || chiTietSanPham == null) {
            return new DataResponse(false, new ResultModel<>(null, "Giỏ hàng hoặc sản phẩm chi tiết không tồn tại!"));
        }

        // Kiểm tra sản phẩm chi tiết đã tồn tại trong giỏ hàng hay chưa
        ChiTietGioHangEntity existingChiTiet = chiTietGioHangRepository.findByGioHangAndChiTietSanPham(gioHangEntity, chiTietSanPham);

        if (existingChiTiet != null) {
            // Nếu tồn tại, cộng dồn số lượng
            existingChiTiet.setSoLuong(existingChiTiet.getSoLuong() + request.getSoLuong());
            chiTietGioHangRepository.save(existingChiTiet);
        } else {
            // Nếu không tồn tại, tạo mới
            ChiTietGioHangEntity chiTietGioHang = new ChiTietGioHangEntity();
            chiTietGioHang.setGioHang(gioHangEntity);
            chiTietGioHang.setChiTietSanPham(chiTietSanPham);
            chiTietGioHang.setSoLuong(request.getSoLuong());
            chiTietGioHangRepository.save(chiTietGioHang);
        }

        return new DataResponse(true, new ResultModel<>(null, "Thêm thành công!"));
    }


    @Override
    public DataResponse xoaSanPham(Integer id) {
        // Tìm sản phẩm chi tiết trong giỏ hàng theo ID
        ChiTietGioHangEntity chiTietGioHang = chiTietGioHangRepository.findById(id).orElse(null);

        if (chiTietGioHang == null) {
            return new DataResponse(false, new ResultModel<>(null, "Sản phẩm không tồn tại trong giỏ hàng!"));
        }

        // Giảm số lượng đi 1
        int soLuongMoi = chiTietGioHang.getSoLuong() - 1;

        if (soLuongMoi > 0) {
            // Nếu số lượng mới > 0, cập nhật số lượng
            chiTietGioHang.setSoLuong(soLuongMoi);
            chiTietGioHangRepository.save(chiTietGioHang);
            return new DataResponse(true, new ResultModel<>(null, "Giảm số lượng sản phẩm thành công!"));
        } else {
            // Nếu số lượng mới <= 0, xóa sản phẩm khỏi giỏ hàng
            chiTietGioHangRepository.delete(chiTietGioHang);
            return new DataResponse(true, new ResultModel<>(null, "Sản phẩm đã được xóa khỏi giỏ hàng!"));
        }
    }

    @Override
    public DataResponse xoaChiTietGioHang(Integer id) {
        // Tìm ChiTietGioHangEntity theo id
        ChiTietGioHangEntity chiTietGioHang = chiTietGioHangRepository.findById(id).orElse(null);

        // Kiểm tra xem chi tiết giỏ hàng có tồn tại hay không
        if (chiTietGioHang != null) {
            // Xóa chi tiết giỏ hàng
            chiTietGioHangRepository.delete(chiTietGioHang);

            // Trả về phản hồi thành công
            return new DataResponse(true, new ResultModel<>(null, "Xóa chi tiết giỏ hàng thành công!"));
        } else {
            // Trường hợp không tìm thấy chi tiết giỏ hàng
            return new DataResponse(false, new ResultModel<>(null, "Chi tiết giỏ hàng không tồn tại!"));
        }
    }
}
