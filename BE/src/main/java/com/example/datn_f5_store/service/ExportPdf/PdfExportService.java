package com.example.datn_f5_store.service.ExportPdf;

import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.DiaChiKhachHangEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.repository.IChiTietHoaDonRepository;
import com.example.datn_f5_store.repository.IDiaChiKhachHangRepository;
import com.example.datn_f5_store.repository.IHoaDonRepository;
import com.example.datn_f5_store.repository.IKhachHangRepository;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class PdfExportService {
    @Autowired
    IHoaDonRepository hoaDonRepository;
    @Autowired
    IChiTietHoaDonRepository chiTietHoaDonRepository;
    @Autowired
    IDiaChiKhachHangRepository diaChiRepository;

    public ByteArrayInputStream exportPdf(Integer id) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            HoaDonEntity hoaDon = hoaDonRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Hóa đơn không tồn tại"));
            List<ChiTietHoaDonEntity> chiTietHoaDon = chiTietHoaDonRepository.getChiTietHoaDonEntityByHoaDon(hoaDon);
            // Khởi tạo PDF Writer
            PdfWriter writer = new PdfWriter(out);

            // Load font hỗ trợ Unicode từ hệ thống
            PdfFont font = PdfFontFactory.createFont("C:/Windows/Fonts/arial.ttf", PdfEncodings.IDENTITY_H);
            PdfFont boldFont = PdfFontFactory.createFont("C:/Windows/Fonts/arialbd.ttf", PdfEncodings.IDENTITY_H); // Arial-Bold.ttf hoặc arialbd.ttf
            String pathImage = "D:\\DATN_F5_Store\\qr_banking.jpg";
            String pathLogo = "D:\\DATN_F5_Store\\Logo_hd.png";

            // Tạo Document với writer đã khởi tạo
            Document document = new Document(new com.itextpdf.kernel.pdf.PdfDocument(writer));

            // Áp dụng font cho document
            document.setFont(font);
            Table table2 = new Table(3);
            table2.setWidth(UnitValue.createPercentValue(100));
            ImageData data = ImageDataFactory.create(pathImage);
            Image img = new Image(data);
            img.setHeight(50);
            img.setWidth(50);
            ImageData dataLogo = ImageDataFactory.create(pathLogo);
            Image imgLogo = new Image(dataLogo);
            imgLogo.setWidth(50);
            imgLogo.setHeight(50);
            Cell column2Cell = new Cell()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBorder(Border.NO_BORDER);

            column2Cell.add(new Paragraph("HÓA ĐƠN BÁN HÀNG")
                    .setFontSize(24)
                    .setFont(boldFont));
            column2Cell.add(new Paragraph("F5-STORE"));

            table2.addCell(new Cell().add(imgLogo).setTextAlignment(TextAlignment.CENTER).setBorder(Border.NO_BORDER));
            table2.addCell(column2Cell);
            table2.addCell(new Cell().add(img).setTextAlignment(TextAlignment.CENTER).setBorder(Border.NO_BORDER));

            document.add(table2);

            // thông tin hóa đơn
            String khachHang = hoaDon.getKhachHang().getTen();
            Date thoiGianTao = hoaDon.getThoiGianTao();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(thoiGianTao);

            int ngay = calendar.get(Calendar.DAY_OF_MONTH);
            int thang = calendar.get(Calendar.MONTH) + 1;
            int nam = calendar.get(Calendar.YEAR);
            String maHoaDon = hoaDon.getMa();
            double tongTien = 0;
            if(hoaDon.getGiaoHang()==0&&hoaDon.getVoucher()==null){
                tongTien  = hoaDon.getTongTienSauVoucher();
            }else if(hoaDon.getGiaoHang()!=0&&hoaDon.getVoucher()==null){
                tongTien  = hoaDon.getTongTienSauVoucher()+ hoaDon.getPhiShip();
            }else if(hoaDon.getGiaoHang()==0&&hoaDon.getVoucher()!=null){
                tongTien  = hoaDon.getTongTienSauVoucher()- hoaDon.getGiaTriGiam();
            }else{
                tongTien  = hoaDon.getTongTienSauVoucher()+hoaDon.getPhiShip()- hoaDon.getGiaTriGiam();
            }
            String email = "";
            String sdt = "";
            String diaChi = "";
            DecimalFormat df = new DecimalFormat("#,###");
            List<DiaChiKhachHangEntity> diaChiKhachHang = diaChiRepository.findByKhackHang_Id(hoaDon.getKhachHang().getId());
            if (hoaDon.getGiaoHang() == 0) {
                if (diaChiKhachHang.size() > 0) {
                    DiaChiKhachHangEntity diaChiActive = diaChiKhachHang.get(0);
                    email = hoaDon.getKhachHang().getEmail();
                    sdt = hoaDon.getKhachHang().getSdt();
                    diaChi = diaChiActive.getSoNha() + ","
                            + diaChiActive.getDuong() + ","
                            + diaChiActive.getQuanHuyen() + ","
                            + diaChiActive.getPhuongXa() + ","
                            + diaChiActive.getTinhThanh();
                } else {
                    diaChi = "";
                }
            } else {
                email = hoaDon.getEmailNguoiNhan();
                sdt = hoaDon.getSdtNguoiNhan();
                diaChi = hoaDon.getDiaChiNhanHang();
            }
            document.add(new Paragraph("Ngày " + ngay + ",tháng " + thang + ",năm " + nam)
                    .setTextAlignment(TextAlignment.RIGHT));
            document.add(new Paragraph("Khách hàng:" + khachHang)
                    .setTextAlignment(TextAlignment.LEFT));
            document.add(new Paragraph("Nhân viên thanh toán:" + hoaDon.getNhanVien().getTen())
                    .setTextAlignment(TextAlignment.LEFT));
            document.add(new Paragraph("Mã hóa đơn:" + maHoaDon)
                    .setTextAlignment(TextAlignment.LEFT));
            document.add(new Paragraph("Số điện thoại:" + sdt)
                    .setTextAlignment(TextAlignment.LEFT));
            document.add(new Paragraph("Email:" + email)
                    .setTextAlignment(TextAlignment.LEFT));
            document.add(new Paragraph("Địa chỉ:" + diaChi)
                    .setTextAlignment(TextAlignment.LEFT));
            // Tạo bảng với 3 cột
            Table table = new Table(5);
            table.setHorizontalAlignment(HorizontalAlignment.CENTER);
            // Thêm tiêu đề cho các cột
            table.addCell(new Cell().add(new Paragraph("Stt")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            table.addCell(new Cell().add(new Paragraph("Tên sản phẩm")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            table.addCell(new Cell().add(new Paragraph("Số lượng")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            table.addCell(new Cell().add(new Paragraph("Đơn giá")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            table.addCell(new Cell().add(new Paragraph("Thành tiền")).setTextAlignment(TextAlignment.CENTER)
                    .setBackgroundColor(new DeviceRgb(192, 192, 192)));
            int stt = 1;
            for (ChiTietHoaDonEntity x : chiTietHoaDon) {
                table.addCell(new Cell().add(new Paragraph(String.valueOf(stt++)))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell().add(new Paragraph(
                        String.valueOf(x.getChiTietSanPham().getSanPham().getTen()) + " - " +
                                String.valueOf(x.getChiTietSanPham().getSize().getTen()) + " - " +
                                String.valueOf(x.getChiTietSanPham().getMauSac().getTen()) + " - " +
                                String.valueOf(x.getChiTietSanPham().getSanPham().getGioiTinh().getTen())
                ).setTextAlignment(TextAlignment.CENTER)));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(x.getSoLuong())))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(df.format(x.getChiTietSanPham().getDonGia()) + " VNĐ")))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(df.format(x.getGiaSpctHienTai()) + " VNĐ")))
                        .setTextAlignment(TextAlignment.CENTER));
            }
            // Thêm bảng vào document
            document.add(table);
            document.add(new Paragraph("").setTextAlignment(TextAlignment.CENTER));
            Table table1 = new Table(2);
            table1.setBorder(Border.NO_BORDER);
            table1.setWidth(UnitValue.createPercentValue(100));
            table1.addCell(new Cell().setWidth(UnitValue.createPercentValue(50)).setBorder(Border.NO_BORDER));
            Cell cell = new Cell();
            cell.setBorder(Border.NO_BORDER);
            cell.setTextAlignment(TextAlignment.CENTER);
            cell.add(new Paragraph("Tổng tiền: " + df.format(hoaDon.getTongTienBanDau()) + "VNĐ"));
            if (hoaDon.getVoucher() != null) {
                cell.add(new Paragraph("Giảm giá: " + hoaDon.getVoucher().getGiaTriVoucher() + " " + hoaDon.getVoucher().getKieuGiamGia()));
                if (hoaDon.getGiaoHang() == 0) {
                    cell.add(new Paragraph("Đã giảm: " + (df.format(hoaDon.getGiaTriGiam())) + "VNĐ"));
                } else {
                    cell.add(new Paragraph("Đã giảm: " + (df.format(hoaDon.getGiaTriGiam())) + "VNĐ"));
                }
            }
            cell.add(new Paragraph("Phí vận chuyển: " + df.format(hoaDon.getPhiShip()) + "VNĐ"));
            cell.add(new Paragraph("Tổng tiền phải thanh toán: " + df.format(tongTien) + "VNĐ"));
            cell.add(new Paragraph("Nhân viên thanh toán").setFont(boldFont));
            cell.add(new Paragraph(hoaDon.getNhanVien().getTen()));

            table1.addCell(cell);
            document.add(table1);

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
