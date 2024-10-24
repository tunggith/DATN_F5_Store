USE DATN_F5_STORE
INSERT INTO XUAT_XU(MA, TEN) VALUES
('VN', N'Việt Nam'),
('US', N'Hoa Kỳ'),
('JP', N'Nhật Bản'),
('CN', N'Trung Quốc'),
('KR', N'Hàn Quốc'),
('FR', N'Pháp'),
('DE', N'Đức'),
('IT', N'Ý'),
('UK', N'Anh'),
('TH', N'Thái Lan');


INSERT INTO THUONG_HIEU (MA, TEN) VALUES
('NIKE', N'Nike'),
('ADID', N'Adidas'),
('PUMA', N'Puma'),
('GUCCI', N'Gucci'),
('LV', N'Louis Vuitton'),
('HM', N'H&M'),
('ZARA', N'Zara'),
('UNIQ', N'Uniqlo'),
('CK', N'Calvin Klein'),
('DG', N'Dolce & Gabbana');


INSERT INTO GIOI_TINH (TEN) VALUES
(N'Nam'),
(N'Nữ');


INSERT INTO [SIZE] (MA, TEN) VALUES
('XS', N'Extra Small'),
('S', N'Small'),
('M', N'Medium'),
('L', N'Large'),
('XL', N'Extra Large'),
('XXL', N'Double Extra Large'),
('3XL', N'Triple Extra Large'),
('4XL', N'Four Extra Large'),
('5XL', N'Five Extra Large'),
('FREE', N'Free Size');

INSERT INTO MAU_SAC (MA, TEN) VALUES
('RED', N'Đỏ'),
('BLU', N'Xanh dương'),
('GRN', N'Xanh lá'),
('BLK', N'Đen'),
('WHT', N'Tráng'),
('YEL', N'Vàng'),
('PUR', N'Tím'),
('PINK', N'Hồng'),
('ORG', N'Cam'),
('GRY', N'Xám');

INSERT INTO PHUONG_THUC_THANH_TOAN (TEN_PHUONG_THUC, TRANG_THAI) 
VALUES
(N'Chuyển Khoản', N'Hoạt động'),
(N'Tiền mặt', N'Hoạt động')



INSERT INTO SAN_PHAM (ID_XUAT_XU, ID_THUONG_HIEU, ID_GIOI_TINH, MA, TEN, TRANG_THAI) VALUES
(1, 1, 1, 'SP001', N'Áo thun Nike', N'Đang hoạt động'),
(2, 2, 1, 'SP002', N'Quần short Adidas', N'Đang hoạt động'),
(3, 3, 1, 'SP003', N'Áo khoác Puma', N'Đang hoạt động'),
(4, 4, 1, 'SP004', N'Áo sơ mi Gucci', N'Đang hoạt động'),
(5, 5, 2, 'SP005', N'Váy Louis Vuitton', N'Đang hoạt động'),
(6, 6, 2, 'SP006', N'Quần jean H&M', N'Đang hoạt động'),
(7, 7, 1, 'SP007', N'Áo khoác ZARA', N'Đang hoạt động'),
(8, 8, 1, 'SP008', N'Áo len Uniqlo', N'Đang hoạt động'),
(9, 9, 1, 'SP009', N'Quần âu Calvin Klein', N'Đang hoạt động'),
(10, 10, 1, 'SP010', N'Áo sơ mi Dolce & Gabbana', N'Đang hoạt động');
select*from SAN_PHAM


INSERT INTO CHI_TIET_SAN_PHAM (ID_SAN_PHAM, ID_MAU_SAC, ID_SIZE, MA, TEN, DON_GIA, SO_LUONG, TRANG_THAI) VALUES
(1, 1, 1, 'CTSP001', N'Áo thun Nike - Đỏ - XS', 200000, 100, N'Còn hàng'),
(2, 2, 2, 'CTSP002', N'Quần short Adidas - Xanh - S', 300000, 50, N'Còn hàng'),
(3, 3, 3, 'CTSP003', N'Áo khoác Puma - Xanh lá - M', 500000, 30, N'Hết hàng'),
(4, 4, 4, 'CTSP004', N'Áo sơ mi Gucci - Đen - L', 800000, 20, N'Còn hàng'),
(5, 5, 5, 'CTSP005', N'Váy Louis Vuitton - Trắng - XL', 1200000, 10, N'Hết hàng'),
(6, 6, 6, 'CTSP006', N'Quần jean H&M - Xanh dương - XXL', 600000, 15, N'Còn hàng'),
(7, 7, 7, 'CTSP007', N'Áo khoác ZARA - Đỏ - 3XL', 700000, 40, N'Còn hàng'),
(8, 8, 8, 'CTSP008', N'Áo len Uniqlo - Xanh dương - S', 400000, 25, N'Hết hàng'),
(9, 9, 9, 'CTSP009', N'Quần âu Calvin Klein - Đen - L', 550000, 50, N'Còn hàng'),
(10, 10, 10, 'CTSP010', N'Áo sơ mi Dolce & Gabbana - Trắng - M', 950000, 30, N'Còn hàng');
select*from CHI_TIET_SAN_PHAM


INSERT INTO ANH_CHI_TIET_SAN_PHAM (ID_CHI_TIET_SAN_PHAM, URL_ANH) VALUES
(1, 'https://example.com/images/ctsp001.jpg'),
(2, 'https://example.com/images/ctsp002.jpg'),
(3, 'https://example.com/images/ctsp003.jpg'),
(4, 'https://example.com/images/ctsp004.jpg'),
(5, 'https://example.com/images/ctsp005.jpg'),
(6, 'https://example.com/images/ctsp006.jpg'),
(7, 'https://example.com/images/ctsp007.jpg'),
(8, 'https://example.com/images/ctsp008.jpg'),
(9, 'https://example.com/images/ctsp009.jpg'),
(10, 'https://example.com/images/ctsp010.jpg');
select*from ANH_CHI_TIET_SAN_PHAM

INSERT INTO KHACH_HANG ( MA, HO_TEN, GIOI_TINH, NGAY_THANG_NAM_SINH, EMAIL, ANH, SDT,ROLES, USERNAME, [PASSWORD], TRANG_THAI) VALUES
('KH001', 'Khách vãng lai', null,null, null, null, null, null,null ,null,null),
('KH002', 'Tran Thi B', 0, '1992-02-02', N'tranthib@example.com', 'anh2.jpg', '0987654321','CUSTOMER', N'tranthib', 'password456', N'đang hoạt động'),
('KH003', 'Pham Van C', 1, '1985-03-03', N'phamvanc@example.com', 'anh3.jpg', '0909123456','CUSTOMER', N'phamvanc', 'password789', N'đang hoạt động'),
('KH004', 'Le Thi D', 0, '1993-04-04', N'lethid@example.com', 'anh4.jpg', '0911223344', N'lethid','CUSTOMER', 'password101', N'đang hoạt động'),
('KH005', 'Vo Van E', 1, '1988-05-05', N'vovane@example.com', 'anh5.jpg', '0933445566', N'vovane','CUSTOMER', 'password202', N'đang hoạt động');

INSERT INTO DIA_CHI_KHACH_HANG (ID_KHACH_HANG,SO_NHA, DUONG, PHUONG_XA, QUAN_HUYEN, TINH_THANH, QUOC_GIA, LOAI_DIA_CHI, TRANG_THAI) VALUES
(2, N'123', N'Nguyễn Trãi', N'Phường 1', N'Quận 1', N'TP. Hồ Chí Minh', N'Việt Nam', N'Nhà riêng', N'Còn sử dụng'),
(2, N'456', N'Lê Lợi', N'Phường 2', N'Quận 3', N'Hà Nội', N'Việt Nam', N'Công ty', N'Còn sử dụng'),
(2, N'789', N'Phan Xích Long', N'Phường 3', N'Quận 5', N'Đà Nẵng', N'Việt Nam', N'Nhà riêng', N'Còn sử dụng'),
(3, N'321', N'Trường Chinh', N'Phường 4', N'Quận 2', N'Hải Phòng', N'Việt Nam', N'Công ty', N'Còn sử dụng'),
(4, N'654', N'Quang Trung', N'Phường 5', N'Quận 7', N'Cần Thơ', N'Việt Nam', N'Nhà riêng', N'Còn sử dụng');


INSERT INTO NHAN_VIEN (MA, HO_TEN, GIOI_TINH, NGAY_THANG_NAM_SINH, EMAIL, SDT, DIA_CHI, ANH,ROLES, USERNAME, [PASSWORD], THOI_GIAN_TAO, NGUOI_TAO, THOI_GIAN_SUA, NGUOI_SUA, TRANG_THAI) VALUES
('NV001', N'HÀ THANH TÙNG', 1, '1980-06-06', N'tunght@gmail.com', '0944556677', N'123 Hoàng Hoa Thám, Quận 1, TP. Hồ Chí Minh', 'anhnv1.jpg','ADMIN', N'tunght@gmail.com', '123', GETDATE(), N'Admin', GETDATE(), N'Admin', N'Hoạt động'),
('NV002', N'NGUYỄN HỮU HẬU', 0, '1983-07-07', N'hau@gmail.com', '0955667788', N'456 Lê Văn Sỹ, Quận 3, TP. Hồ Chí Minh', 'anhnv2.jpg','USER', N'hau@gmail.com', '123', GETDATE(), N'Admin', GETDATE(), N'Admin', N'Hoạt động'),
('NV003', N'NGUYỄN NGỌC HIỂN', 1, '1990-08-08', N'hien@gmail.com', '0966778899', N'789 Điện Biên Phủ, Quận 5, TP. Hồ Chí Minh', 'anhnv3.jpg','USER', N'hien@gmail.com', '123', GETDATE(), N'Admin', GETDATE(), N'Admin', N'Hoạt động'),
('NV004', N'PHAN THANH CHUYỀN', 0, '1985-09-09', N'chuyen@gmail.com', '0977889900', N'321 Nguyễn Văn Cừ, Quận 2, TP. Hồ Chí Minh', 'anhnv4.jpg','USER', N'chuyen@gmail.com', '123', GETDATE(), N'Admin', GETDATE(), N'Admin', N'Hoạt động'),
('NV005', N'TRẦN TIẾN DŨNG', 1, '1995-10-10', N'dung@gmail.com', '0988990011', N'654 Tôn Đức Thắng, Quận 7, TP. Hồ Chí Minh', 'anhnv5.jpg','USER', N'dung@gmail.com', '123', GETDATE(), N'Admin', GETDATE(), N'Admin', N'Hoạt động');


INSERT INTO VOUCHER (MA, TEN, GIA_TRI_VOUCHER, KIEU_GIAM_GIA, THOI_GIAN_TAO, GIA_TRI_HOA_DON_TOI_THIEU, GIA_TRI_GIAM_TOI_DA, THOI_GIAN_BAT_DAU, THOI_GIAN_KET_THUC, MOTA, SO_LUONG, NGUOI_TAO, THOI_GIAN_SUA, NGUOI_SUA, TRANG_THAI) VALUES
('VC001', N'Voucher Giảm 10%', 10, '%', GETDATE(), 50000, 100000, GETDATE(), DATEADD(MONTH, 1, GETDATE()), N'Giảm giá 10% cho đơn hàng trên 500.000 VNĐ', 100, N'Admin', GETDATE(), N'Admin', N'Đang diễn ra'),
('VC002', N'Voucher Giảm 50.000 VNĐ', 50000, '$', GETDATE(), 0, 50000, GETDATE(), DATEADD(MONTH, 2, GETDATE()), N'Giảm 50.000 VNĐ cho đơn hàng trên 200.000 VNĐ', 200, N'Admin', GETDATE(), N'Admin', N'Đang diễn ra'),
('VC003', N'Voucher Giảm 20%', 20, '%', GETDATE(), 1000000, 300000, GETDATE(), DATEADD(MONTH, 3, GETDATE()), N'Giảm giá 20% cho đơn hàng trên 1.000.000 VNĐ', 50, N'Admin', GETDATE(), N'Admin', N'Đang diễn ra'),
('VC004', N'Voucher Giảm 100.000 VNĐ', 100000, '$', GETDATE(), 0, 100000, GETDATE(), DATEADD(MONTH, 1, GETDATE()), N'Giảm 100.000 VNĐ cho đơn hàng trên 500.000 VNĐ', 80, N'Admin', GETDATE(), N'Admin', N'Đang diễn ra'),
('VC005', N'Voucher Giảm 5%', 5, '%', GETDATE(), 15000, 30000, GETDATE(), DATEADD(MONTH, 1, GETDATE()), N'Giảm giá 5% cho đơn hàng trên 300.000 VNĐ', 150, N'Admin', GETDATE(), N'Admin', N'Đang diễn ra');

INSERT INTO HOA_DON (ID_NHAN_VIEN, ID_KHACH_HANG, ID_VOUCHER, ID_PHUONG_THUC_THANH_TOAN,HINH_THUC_THANH_TOAN, MA, TONG_TIEN_BAN_DAU,PHI_SHIP, TONG_TIEN_THANH_TOAN, TEN_NGUOI_NHAN, SDT_NGUOI_NHAN, EMAIL_NGUOI_NHAN, DIA_CHI_NHAN_HANG, NGAY_NHAN_DU_KIEN, THOI_GIAN_TAO,GIAO_HANG, GHI_CHU, TRANG_THAI) 
VALUES
(1, 1, 1, 1,0, N'HD001', 500000,10000, 450000, N'Nguyễn Văn A', '0912345678', 'nguyenvana@gmail.com', N'Số 1, Đường ABC, Quận 1, TP.HCM', '2024-09-30', GETDATE(),1, N'Giao hàng trước 12h', N'Hoàn thành'),
(2, 2, 2, 1,0, N'HD002', 1000000,10000, 900000, N'Trần Thị B', '0987654321', 'tranthib@gmail.com', N'Số 10, Đường XYZ, Quận 2, TP.HCM', '2024-09-25', GETDATE(),0, N'Giao hàng nhanh', N'Hoàn thành'),
(3, 3, 3, 2,0, N'HD003', 750000,10000, 700000, N'Phạm Văn C', '0909123456', 'phamvanc@gmail.com', N'Số 5, Đường LMN, Quận 3, TP.HCM', '2024-10-01', GETDATE(),0, N'Không yêu cầu đặc biệt', N'Đã hủy'),
(4, 4, 4, 1,0, N'HD004', 1500000,10000, 1350000, N'Vũ Thị D', '0934567890', 'vuthid@gmail.com', N'Số 20, Đường OPQ, Quận 4, TP.HCM', '2024-09-27', GETDATE(),0, N'Giao hàng sau 18h', N'Đã hủy'),
(5, 5, 5, 1,0, N'HD005', 2000000,10000, 1800000, N'Lê Văn E', '0912340000', 'levane@gmail.com', N'Số 25, Đường RST, Quận 5, TP.HCM', '2024-09-28', GETDATE(),0, N'Yêu cầu liên lạc trước', N'Hoàn thành');


INSERT INTO LICH_SU_HOA_DON (ID_HOA_DON, ID_NHAN_VIEN, GHI_CHU, THOI_GIAN_THUC_HIEN, TRANG_THAI_CU, TRANG_THAI_MOI, LOAI_THAY_DOI) VALUES
(1, 1, N'Xác nhận đơn hàng', GETDATE(), N'Chưa xử lý', N'Đang xử lý', N'Chuyển trạng thái'),
(2, 2, N'Cập nhật thông tin khách hàng', GETDATE(), N'Chưa xử lý', N'Đang xử lý', N'Chỉnh sửa thông tin'),
(3, 3, N'Áp dụng voucher', GETDATE(), N'Chưa xử lý', N'Đã xử lý', N'Áp dụng giảm giá'),
(4, 4, N'Thay đổi ngày giao hàng', GETDATE(), N'Đang xử lý', N'Đã hoàn tất', N'Cập nhật ngày giao'),
(5, 5, N'Gửi thông báo giao hàng', GETDATE(), N'Đang xử lý', N'Đã hoàn tất', N'Thông báo giao hàng');


INSERT INTO CHI_TIET_HOA_DON (ID_HOA_DON, ID_CHI_TIET_SAN_PHAM, MA, SO_LUONG, GIA_SPCT_HIEN_TAI, TRANG_THAI) VALUES
(1, 1, 1, 2, 200000, N'Còn hàng'),
(2, 2, 2, 1, 300000, N'Còn hàng'),
(3, 3, 3, 3, 500000, N'Hết hàng'),
(4, 4, 4, 1, 800000, N'Còn hàng'),
(5, 5, 5, 4, 100000, N'Còn hàng');


INSERT INTO KHUYEN_MAI (MA, TEN, KIEU_KHUYEN_MAI, MOTA, SO_LUONG, GIA_TRI_KHUYEN_MAI, THOI_GIAN_BAT_DAU, THOI_GIAN_KET_THUC, THOI_GIAN_TAO, THOI_GIAN_SUA, NGUOI_TAO, NGUOI_SUA, TRANG_THAI) VALUES
('KM001', N'Khuyến mãi Giảm 10%', '%', N'Giảm giá 10% cho tất cả sản phẩm', 100, 10, GETDATE(), DATEADD(MONTH, 1, GETDATE()), GETDATE(), NULL, N'Admin', NULL, N'Đang diễn ra'),
('KM002', N'Khuyến mãi Giảm 50.000 VNĐ', '$', N'Giảm 50.000 VNĐ cho đơn hàng trên 300.000 VNĐ', 200, 50000, GETDATE(), DATEADD(MONTH, 2, GETDATE()), GETDATE(), NULL, N'Admin', NULL, N'Đang diễn ra'),
('KM003', N'Khuyến mãi Mua 1 Tặng 1', '%', N'Mua 1 sản phẩm, tặng 1 sản phẩm cùng loại', 50, 10, GETDATE(), DATEADD(MONTH, 1, GETDATE()), GETDATE(), NULL, N'Admin', NULL, N'HĐang diễn ra'),
('KM004', N'Khuyến mãi Giảm 20%', '%', N'Giảm giá 20% cho đơn hàng trên 500.000 VNĐ', 150, 20, GETDATE(), DATEADD(MONTH, 3, GETDATE()), GETDATE(), NULL, N'Admin', NULL, N'Đang diễn ra'),
('KM005', N'Khuyến mãi Giảm 100.000 VNĐ','$', N'Giảm 100.000 VNĐ cho đơn hàng trên 1.000.000 VNĐ', 75, 100000, GETDATE(), DATEADD(MONTH, 3, GETDATE()), GETDATE(), NULL, N'Admin', NULL, N'Đang diễn ra');
INSERT INTO KHUYEN_MAI_CHI_TIET_SAN_PHAM (ID_KHUYEN_MAI, ID_CHI_TIET_SAN_PHAM, TRANG_THAI) 
VALUES
(1, 1, N'Hoạt động'),
(1, 2, N'Hoạt động'),
(2, 3, N'Không hoạt động'),
(2, 4, N'Hoạt động'),
(3, 5, N'Không hoạt động');




INSERT INTO GIO_HANG (ID_KHACH_HANG, THOI_GIAN_TAO) VALUES
(1, GETDATE()),
(2, GETDATE()),
(3, GETDATE()),
(4, GETDATE()),
(5, GETDATE());


INSERT INTO CHI_TIET_GIO_HANG (ID_CHI_TIET_SAN_PHAM, ID_GIO_HANG, SO_LUONG) VALUES
(1, 1, 2),
(2, 2, 1),
(3, 3, 3),
(4, 4, 1),
(5, 5, 4);

SELECT * FROM XUAT_XU;
SELECT * FROM THUONG_HIEU;
SELECT * FROM GIOI_TINH;
SELECT * FROM [SIZE];
SELECT * FROM MAU_SAC;
SELECT * FROM PHUONG_THUC_THANH_TOAN;
SELECT * FROM SAN_PHAM;
SELECT * FROM CHI_TIET_SAN_PHAM;
SELECT * FROM ANH_CHI_TIET_SAN_PHAM;
SELECT * FROM DIA_CHI_KHACH_HANG;
SELECT * FROM KHACH_HANG;
SELECT * FROM NHAN_VIEN;
SELECT * FROM VOUCHER;
SELECT * FROM HOA_DON;
SELECT * FROM LICH_SU_HOA_DON;
SELECT * FROM CHI_TIET_HOA_DON;
SELECT * FROM KHUYEN_MAI;
SELECT * FROM KHUYEN_MAI_CHI_TIET_SAN_PHAM;
SELECT * FROM GIO_HANG;
SELECT * FROM CHI_TIET_GIO_HANG;