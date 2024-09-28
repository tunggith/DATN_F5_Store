package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.SanPhamDto;
import com.example.datn_f5_store.entity.TheLoaiEntity;
import com.example.datn_f5_store.entity.SanPhamEntity;
import com.example.datn_f5_store.entity.ThuongHieuEntity;
import com.example.datn_f5_store.entity.XuatXuEntity;
import com.example.datn_f5_store.repository.ITheLoaiRepository;
import com.example.datn_f5_store.repository.ISanPhamRepository;
import com.example.datn_f5_store.repository.IThuongHieuRepository;
import com.example.datn_f5_store.repository.IXuatXuRepository;
import com.example.datn_f5_store.request.TheLoaiRequest;
import com.example.datn_f5_store.request.SanPhamRequest;
import com.example.datn_f5_store.request.XuatXuRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.ISanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class SanPhamServiceImpl implements ISanPhamService {

    // Inject các repository cần thiết cho sản phẩm, xuất xứ, thương hiệu và thể loại.
    @Autowired
    private ISanPhamRepository sanPhamRepo;

    @Autowired
    private IXuatXuRepository xuatXuRepo;

    @Autowired
    private IThuongHieuRepository thuongHieuRepo;

    @Autowired
    private ITheLoaiRepository theLoaiRepo;

    // Phương thức để lấy tất cả sản phẩm với phân trang
    @Override
    public Page<SanPhamDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SanPhamEntity> sanPhamPage = sanPhamRepo.findAll(pageable);

        // Chuyển đổi từ SanPhamEntity sang SanPhamDto
        return sanPhamPage.map(entity -> new SanPhamDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getXuatXu(),
                entity.getThuongHieu(),
                entity.getTheLoai(),
                entity.getTrangThai()
        ));
    }

    // Phương thức tìm sản phẩm theo tên hoặc mã với phân trang
    @Override
    public Page<SanPhamDto> findByTenOrMa(int page, int size, String ten, String ma) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SanPhamEntity> sanPhamPage;

        // Nếu cả tên và mã đều null, lấy tất cả sản phẩm
        if (ten == null && ma == null) {
            sanPhamPage = sanPhamRepo.findAll(pageable);
        } else {
            // Nếu có tên hoặc mã, tìm theo tên hoặc mã
            sanPhamPage = sanPhamRepo.getByTenContainingOrMaContaining(ten, ma, pageable);
        }

        // Chuyển đổi từ SanPhamEntity sang SanPhamDto
        return sanPhamPage.map(entity -> new SanPhamDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getXuatXu(),
                entity.getThuongHieu(),
                entity.getTheLoai(),
                entity.getTrangThai()
        ));
    }

    @Override
    public List<SanPhamDto> findById(Integer id) {
        // Tìm kiếm entity theo id
        Optional<SanPhamEntity> optionalEntity = sanPhamRepo.findById(id);

        // Nếu entity tồn tại, tạo danh sách và thêm vào
        if (optionalEntity.isPresent()) {
            SanPhamEntity entity = optionalEntity.get();
            // Tạo đối tượng SanPhamDto từ entity
            SanPhamDto dto = new SanPhamDto(
                    entity.getId(),
                    entity.getMa(),
                    entity.getTen(),
                    entity.getXuatXu(),
                    entity.getThuongHieu(),
                    entity.getTheLoai(),
                    entity.getTrangThai()
            );
            // Trả về danh sách chứa một phần tử duy nhất
            return Collections.singletonList(dto);
        } else {
            // Nếu không tìm thấy entity, trả về danh sách rỗng
            return new ArrayList<>(); // Hoặc ném ngoại lệ nếu cần thiết
        }
    }

    // Phương thức tạo mới sản phẩm
    @Override
    public DataResponse create(SanPhamRequest request) {
        // Kiểm tra dữ liệu đầu vào
        if (!this.checkSanPham(request)) {
            // Kiểm tra trùng lặp mã sản phẩm
            if (!this.checkDupicate(request)) {
                // Lưu hoặc cập nhật sản phẩm
                return this.saveOfUpdate(new SanPhamEntity(), request);
            } else {
                return new DataResponse(false, new ResultModel<>(null, "Mã Sản phẩm đã tồn tại!"));
            }
        } else {
            return new DataResponse(false, new ResultModel<>(null, "Dữ liệu đầu vào lỗi!"));
        }
    }

    // Phương thức cập nhật sản phẩm
    @Override
    public DataResponse update(SanPhamRequest request, Integer id) {
        // Kiểm tra dữ liệu đầu vào
        if (!this.checkSanPham(request)) {
            // Tìm sản phẩm theo id
            SanPhamEntity sanPham = sanPhamRepo.findById(id).orElse(null);
            if (sanPham == null) {
                return new DataResponse(false, new ResultModel<>(null, "Sản phẩm không tồn tại"));
            }
            request.setId(id);
            // Lưu hoặc cập nhật sản phẩm
            return this.saveOfUpdate(sanPham, request);
        } else {
            return new DataResponse(false, new ResultModel<>(null, "Lỗi dữ liệu đầu vào!"));
        }
    }

    // Phương thức lưu hoặc cập nhật sản phẩm
    private DataResponse saveOfUpdate(SanPhamEntity entity, SanPhamRequest request) {
        try {
            // Lưu sản phẩm vào database
            this.convertSanPham(entity, request);
            sanPhamRepo.save(entity);
            return new DataResponse(true, new ResultModel<>(null, "Thành công!"));
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResponse(false, new ResultModel<>(null, "Lỗi trong quá trình lưu/cập nhật"));
        }
    }

    // Phương thức kiểm tra dữ liệu đầu vào sản phẩm
    private boolean checkSanPham(SanPhamRequest request) {
        boolean check = false;
        // Kiểm tra mã sản phẩm
        if (request.getMa() == null || request.getMa().isEmpty()) {
            check = true;
        }
        // Kiểm tra tên sản phẩm
        if (request.getTen() == null || request.getTen().isEmpty()) {
            check = true;
        }
        // Kiểm tra xuất xứ sản phẩm
        if (request.getXuatXu().getId() == null) {
            check = true;
        }
        // Kiểm tra thương hiệu sản phẩm
        if (request.getThuongHieu().getId() == null) {
            check = true;
        }
        // Kiểm tra thể loại sản phẩm
        if (request.getTheLoai().getId() == null) {
            check = true;
        }
        return check;
    }

    // Phương thức kiểm tra trùng lặp mã sản phẩm
    private boolean checkDupicate(SanPhamRequest request) {
        boolean check = false;
        List<SanPhamEntity> sanPham = sanPhamRepo.findAll();
        // Kiểm tra mã sản phẩm có trùng lặp không
        for (SanPhamEntity x : sanPham) {
            if (x.getMa().equals(request.getMa())) {
                return true;
            }
        }
        return check;
    }

    // Phương thức chuyển đổi dữ liệu từ request sang entity của sản phẩm
    private void convertSanPham(SanPhamEntity entity, SanPhamRequest request) {
        entity.setId(request.getId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());

        // Tìm và set xuất xứ
        XuatXuEntity xuatXu = xuatXuRepo.findById(request.getXuatXu().getId()).orElse(null);
        entity.setXuatXu(xuatXu);

        // Tìm và set thương hiệu
        ThuongHieuEntity thuongHieu = thuongHieuRepo.findById(request.getThuongHieu().getId()).orElse(null);
        entity.setThuongHieu(thuongHieu);

        // Tìm và set thể loại
        TheLoaiEntity theLoai = theLoaiRepo.findById(request.getTheLoai().getId()).orElse(null);
        entity.setTheLoai(theLoai);
        entity.setTrangThai(request.getTrangThai());
    }

    // Phương thức chuyển đổi dữ liệu từ request sang entity của xuất xứ
    private void convertXuatXu(XuatXuEntity entity, XuatXuRequest request) {
        entity.setId(request.getId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
    }

    // Phương thức chuyển đổi dữ liệu từ request sang entity của thể loại
    private void convertTheLoai(TheLoaiEntity entity, TheLoaiRequest request) {
        entity.setId(request.getId());
        entity.setTen(request.getTen());
    }
}
