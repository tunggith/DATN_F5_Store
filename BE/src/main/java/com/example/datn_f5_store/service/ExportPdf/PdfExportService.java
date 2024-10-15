package com.example.datn_f5_store.service.ExportPdf;

import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.repository.IChiTietHoaDonRepository;
import com.example.datn_f5_store.repository.IHoaDonRepository;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
public class PdfExportService {
    @Autowired
    IHoaDonRepository hoaDonRepository;
    @Autowired
    IChiTietHoaDonRepository chiTietHoaDonRepository;
    public ByteArrayInputStream exportPdf(Integer id) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            HoaDonEntity hoaDon = hoaDonRepository.findById(id)
                    .orElseThrow(()->new EntityNotFoundException("Hóa đơn không tồn tại"));
            List<ChiTietHoaDonEntity> chiTietHoaDon = chiTietHoaDonRepository.getChiTietHoaDonEntityByHoaDon(hoaDon);
            // Khởi tạo PDF Writer
            PdfWriter writer = new PdfWriter(out);

            // Load font hỗ trợ Unicode từ hệ thống
            PdfFont font = PdfFontFactory.createFont("C:/Windows/Fonts/arial.ttf", PdfEncodings.IDENTITY_H);
            PdfFont boldFont = PdfFontFactory.createFont("C:/Windows/Fonts/arialbd.ttf", PdfEncodings.IDENTITY_H); // Arial-Bold.ttf hoặc arialbd.ttf

            // Tạo Document với writer đã khởi tạo
            Document document = new Document(new com.itextpdf.kernel.pdf.PdfDocument(writer));

            // Áp dụng font cho document
            document.setFont(font);
            document.add(new Paragraph("HÓA ĐƠN BÁN HÀNG")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(24)
                    .setFont(boldFont));
            document.add(new Paragraph("F5-STORE")
                    .setTextAlignment(TextAlignment.CENTER));

            // thông tin hóa đơn
            String khachHang = hoaDon.getKhachHang().getTen();
            int ngay = hoaDon.getThoiGianTao().getDate();
            int thang = hoaDon.getThoiGianTao().getMonth();
            int nam = hoaDon.getThoiGianTao().getYear();
            String maHoaDon = hoaDon.getMa();
            double tongTien = hoaDon.getTongTienSauVoucher();
            String diaChi = "";
            if(hoaDon.getKhachHang().getDiaChiKhachHang()!=null) {
                diaChi = hoaDon.getKhachHang().getDiaChiKhachHang().getSoNha() + ", "
                        + hoaDon.getKhachHang().getDiaChiKhachHang().getDuong() + ","
                        + hoaDon.getKhachHang().getDiaChiKhachHang().getPhuongXa() + ", "
                        + hoaDon.getKhachHang().getDiaChiKhachHang().getQuanHuyen() + ", "
                        + hoaDon.getKhachHang().getDiaChiKhachHang().getTinhThanh() + ","
                        + hoaDon.getKhachHang().getDiaChiKhachHang().getQuocGia();
            }
            document.add(new Paragraph("Ngày "+ngay+",tháng "+thang+",năm "+2024)
                    .setTextAlignment(TextAlignment.RIGHT));
            document.add(new Paragraph("Khách hàng:"+khachHang)
                    .setTextAlignment(TextAlignment.LEFT));
            document.add(new Paragraph("Mã hóa đơn:"+maHoaDon)
                    .setTextAlignment(TextAlignment.LEFT));
            document.add(new Paragraph("Số điện thoại:"+hoaDon.getKhachHang().getSdt())
                    .setTextAlignment(TextAlignment.LEFT));
            document.add(new Paragraph("Email:"+hoaDon.getKhachHang().getEmail())
                    .setTextAlignment(TextAlignment.LEFT));
            document.add(new Paragraph("Địa chỉ:"+diaChi)
                    .setTextAlignment(TextAlignment.LEFT));
            // Tạo bảng với 3 cột
            Table table = new Table(9);
            // Thêm tiêu đề cho các cột
            table.addCell(new Cell().add(new Paragraph("Tên sản phẩm")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            table.addCell(new Cell().add(new Paragraph("Thương hiệu")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            table.addCell(new Cell().add(new Paragraph("xuất xứ")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            table.addCell(new Cell().add(new Paragraph("Size")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            table.addCell(new Cell().add(new Paragraph("Màu sắc")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            table.addCell(new Cell().add(new Paragraph("Thể loại")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            table.addCell(new Cell().add(new Paragraph("Số lượng")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            table.addCell(new Cell().add(new Paragraph("Đơn giá")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            table.addCell(new Cell().add(new Paragraph("Thành tiền")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            for(ChiTietHoaDonEntity x:chiTietHoaDon){
                table.addCell(new Cell().add(new Paragraph(String.valueOf(x.getChiTietSanPham().getSanPham().getTen())))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(x.getChiTietSanPham().getSanPham().getThuongHieu().getTen())))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(x.getChiTietSanPham().getSanPham().getXuatXu().getTen())))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(x.getChiTietSanPham().getSize().getTen())))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(x.getChiTietSanPham().getMauSac().getTen())))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(x.getChiTietSanPham().getSanPham().getGioiTinh().getTen())))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(x.getSoLuong())))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(x.getChiTietSanPham().getDonGia())))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(x.getGiaSpctHienTai())))
                        .setTextAlignment(TextAlignment.CENTER));
            }

            // Thêm bảng vào document
            document.add(table);
            document.add(new Paragraph("Tổng tiền:"+hoaDon.getTongTienBanDau())
                    .setTextAlignment(TextAlignment.RIGHT));
            if(hoaDon.getVoucher()!=null) {
                document.add(new Paragraph("giảm giá:" + hoaDon.getVoucher().getGiaTriVoucher() + hoaDon.getVoucher().getKieuGiamGia())
                        .setTextAlignment(TextAlignment.RIGHT));
            }else {
                document.add(new Paragraph("giảm giá:" + 0)
                        .setTextAlignment(TextAlignment.RIGHT));
            }
            document.add(new Paragraph("Tổng tiền phải thanh toán:"+tongTien)
                    .setTextAlignment(TextAlignment.RIGHT));
            document.add(new Paragraph("Nhân viên thanh toán")
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setFont(boldFont));
            document.add(new Paragraph(hoaDon.getNhanVien().getTen())
                    .setTextAlignment(TextAlignment.RIGHT));
            document.add(new Paragraph(String.valueOf(hoaDon.getTrangThai()))
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(18)
                    .setFontColor(new DeviceRgb(255, 0, 0))
                    .setFont(boldFont));

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
