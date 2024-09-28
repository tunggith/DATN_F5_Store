package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.LichSuHoaDonDto;
import com.example.datn_f5_store.entity.LichSuHoaDonEntity;
import com.example.datn_f5_store.repository.ILichSuHoaDonRepository;
import com.example.datn_f5_store.service.ILichSuHoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class LichSuHoaDonServiceImpl implements ILichSuHoaDonService {

    @Autowired
    private ILichSuHoaDonRepository lichSuHoaDonRepository;

    @Override
    public Page<LichSuHoaDonDto> getAllLichSuHoaDon(int page, int size, Date startDate, Date endDate) {
        // Tạo đối tượng Pageable để thực hiện phân trang
        Pageable pageable = PageRequest.of(page, size);

        // Khai báo Page để lưu danh sách LichSuHoaDonEntity đã phân trang
        Page<LichSuHoaDonEntity> lichSuHoaDonEntities;

        // Kiểm tra điều kiện ngày
        if (startDate != null && endDate != null) {
            lichSuHoaDonEntities = lichSuHoaDonRepository.findByThoiGianThucHienBetween(startDate, endDate, pageable);
        } else {
            lichSuHoaDonEntities = lichSuHoaDonRepository.findAll(pageable);
        }

        // Chuyển đổi từ LichSuHoaDonEntity sang LichSuHoaDonDto
        return lichSuHoaDonEntities.map(lichSuHoaDonEntity -> new LichSuHoaDonDto(
                lichSuHoaDonEntity.getId(),
                lichSuHoaDonEntity.getHoaDon(),
                lichSuHoaDonEntity.getNhanVien(),
                lichSuHoaDonEntity.getGhiChu(),
                lichSuHoaDonEntity.getThoiGianThucHien(),
                lichSuHoaDonEntity.getTrangThaiCu(),
                lichSuHoaDonEntity.getTrangThaiMoi(),
                lichSuHoaDonEntity.getLoaiThayDoi()
        ));
    }

//    @Override
//    public ByteArrayOutputStream exportLichSuHoaDonToExcel(List<LichSuHoaDonDto> lichSuHoaDonList) {
//        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
//        Workbook workbook = new XSSFWorkbook(); // Tạo một Workbook cho file Excel (định dạng XSSF dùng cho .xlsx)
//        Sheet sheet = workbook.createSheet("Lịch Sử Hóa Đơn"); // Tạo một sheet mới với tên là "Lịch Sử Hóa Đơn"
//
//        // Tạo CellStyle với border (đường viền cho ô)
//        CellStyle cellStyle = workbook.createCellStyle();
//        cellStyle.setBorderTop(BorderStyle.THIN); // Đường viền trên
//        cellStyle.setBorderBottom(BorderStyle.THIN); // Đường viền dưới
//        cellStyle.setBorderLeft(BorderStyle.THIN); // Đường viền trái
//        cellStyle.setBorderRight(BorderStyle.THIN); // Đường viền phải
//
//        // Tạo CellStyle cho tiêu đề (in đậm)
//        CellStyle headerStyle = workbook.createCellStyle();
//        Font headerFont = workbook.createFont();
//        headerFont.setBold(true); // Đặt font in đậm cho tiêu đề
//        headerStyle.setFont(headerFont); // Áp dụng font in đậm cho tiêu đề
//        // Thiết lập đường viền cho tiêu đề (tương tự cellStyle)
//        headerStyle.setBorderTop(BorderStyle.THIN);
//        headerStyle.setBorderBottom(BorderStyle.THIN);
//        headerStyle.setBorderLeft(BorderStyle.THIN);
//        headerStyle.setBorderRight(BorderStyle.THIN);
//
//        // Thêm tiêu đề cho các cột
//        Row headerRow = sheet.createRow(0); // Tạo dòng đầu tiên cho tiêu đề
//        String[] columnHeaders = {"ID", "Hóa Đơn", "Nhân Viên", "Ghi Chú", "Thời Gian Thực Hiện", "Trạng Thái Cũ", "Trạng Thái Mới"};
//        for (int i = 0; i < columnHeaders.length; i++) {
//            Cell cell = headerRow.createCell(i); // Tạo ô cho từng tiêu đề
//            cell.setCellValue(columnHeaders[i]); // Đặt tên tiêu đề cho từng ô
//            cell.setCellStyle(headerStyle); // Áp dụng style in đậm và border cho tiêu đề
//        }
//
//        // Định dạng ngày tháng theo kiểu yyyy-MM-dd HH:mm:ss
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//
//        // Duyệt qua danh sách và thêm dữ liệu vào sheet, chỉ hiển thị những hóa đơn có trạng thái mới là "Đã hoàn tất"
//        int rowIndex = 1; // Bắt đầu từ dòng thứ 2 (vì dòng 1 là tiêu đề)
//        for (int i = 0; i < lichSuHoaDonList.size(); i++) {
//            LichSuHoaDonDto lichSuHoaDon = lichSuHoaDonList.get(i);
//
//            // Kiểm tra nếu trạng thái mới của hóa đơn là "Đã hoàn tất" thì mới thêm vào bảng
//            if ("Đã hoàn tất".equals(lichSuHoaDon.getTrangThaiMoi())) {
//                Row row = sheet.createRow(rowIndex++); // Tạo dòng mới để thêm dữ liệu
//
//                // Thêm dữ liệu vào các ô tương ứng và áp dụng style có border
//                Cell cell0 = row.createCell(0);
//                cell0.setCellValue(lichSuHoaDon.getId());
//                cell0.setCellStyle(cellStyle); // Áp dụng style có border
//
//                Cell cell1 = row.createCell(1);
//                cell1.setCellValue(String.valueOf(lichSuHoaDon.getHoaDon().getMa())); // Lấy mã hóa đơn
//                cell1.setCellStyle(cellStyle);
//
//                Cell cell2 = row.createCell(2);
//                cell2.setCellValue(String.valueOf(lichSuHoaDon.getNhanVien().getTen())); // Lấy tên nhân viên
//                cell2.setCellStyle(cellStyle);
//
//                Cell cell3 = row.createCell(3);
//                cell3.setCellValue(lichSuHoaDon.getGhiChu()); // Lấy ghi chú
//                cell3.setCellStyle(cellStyle);
//
//                Cell cell4 = row.createCell(4);
//                cell4.setCellValue(sdf.format(lichSuHoaDon.getThoiGianThucHien())); // Lấy thời gian thực hiện và định dạng
//                cell4.setCellStyle(cellStyle);
//
//                Cell cell5 = row.createCell(5);
//                cell5.setCellValue(lichSuHoaDon.getTrangThaiCu()); // Lấy trạng thái cũ
//                cell5.setCellStyle(cellStyle);
//
//                Cell cell6 = row.createCell(6);
//                cell6.setCellValue(lichSuHoaDon.getTrangThaiMoi()); // Lấy trạng thái mới
//                cell6.setCellStyle(cellStyle);
//            }
//        }
//
//        // Tự động điều chỉnh độ rộng cột dựa trên nội dung của cột
//        for (int i = 0; i < columnHeaders.length; i++) {
//            sheet.autoSizeColumn(i); // Tự động chỉnh kích thước cột
//        }
//
//        // Ghi dữ liệu vào ByteArrayOutputStream (ghi vào bộ nhớ tạm)
//        try {
//            workbook.write(byteArrayOutputStream); // Ghi workbook vào byteArrayOutputStream
//            workbook.close(); // Đóng workbook để giải phóng tài nguyên
//        } catch (IOException e) {
//            e.printStackTrace(); // Xử lý ngoại lệ nếu có lỗi khi ghi dữ liệu
//        }
//
//        return byteArrayOutputStream; // Trả về ByteArrayOutputStream chứa nội dung Excel
//    }
//
//}
}


