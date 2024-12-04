USE DATN_F5_STORE
INSERT INTO XUAT_XU(MA, TEN) VALUES
('VN', N'Việt Nam'),
('US', N'Hoa Kỳ'),
('FR', N'Pháp'),
('DE', N'Đức'),
('UK', N'Anh');


INSERT INTO THUONG_HIEU (MA, TEN) VALUES
('GUCCI', N'Gucci'),
('HM', N'H&M'),
('UNIQ', N'Uniqlo'),
('CK', N'Calvin Klein'),
('DG', N'Dolce & Gabbana');


INSERT INTO GIOI_TINH (TEN) VALUES
(N'Nam'),
(N'Nữ');


INSERT INTO [SIZE] (MA, TEN) VALUES
('XS', N'XS'),
('S', N'S'),
('M', N'M'),
('L', N'L'),
('XL', N'XL'),
('XXL', N'XXL'),
('3XL', N'3XL');

INSERT INTO MAU_SAC (MA, TEN) VALUES
('RED', N'Đỏ'),
('BLU', N'Xanh dương'),
('BLK', N'Đen'),
('WHT', N'Trắng'),
('YEL', N'Vàng'),
('PINK', N'Hồng'),
('GRY', N'Xám');

INSERT INTO PHUONG_THUC_THANH_TOAN (TEN_PHUONG_THUC, TRANG_THAI) 
VALUES
(N'Tiền mặt', N'Hoạt động'),
(N'Chuyển khoản', N'Hoạt động')



INSERT INTO SAN_PHAM (ID_XUAT_XU, ID_THUONG_HIEU, ID_GIOI_TINH, MA, TEN, TRANG_THAI) VALUES
(1, 1, 1, 'SP001', N'Áo thun Gucci', N'Đang hoạt động'),
(2, 2, 1, 'SP002', N'Áo phông H&M', N'Đang hoạt động'),
(3, 3, 1, 'SP003', N'Áo phông trơn Uniqlo', N'Đang hoạt động'),
(4, 4, 1, 'SP004', N'Áo thun lạnh Gucci', N'Đang hoạt động'),
(5, 5, 2, 'SP005', N'Áo phông ngắn tay Dolce & Gabbana', N'Đang hoạt động'),
(1, 1, 2, 'SP006', N'Áo phông Gucci oversize', N'Đang hoạt động'),
(2, 2, 1, 'SP007', N'Áo phông H&M cổ tròn', N'Đang hoạt động'),
(3, 3, 1, 'SP008', N'Áo phông Uniqlo thể thao', N'Đang hoạt động'),
(4, 4, 1, 'SP009', N'Áo phông Calvin Klein cổ tim', N'Đang hoạt động'),
(5, 5, 1, 'SP010', N'Áo phông Dolce & Gabbana cao cấp', N'Đang hoạt động');
select*from SAN_PHAM


INSERT INTO CHI_TIET_SAN_PHAM (ID_SAN_PHAM, ID_MAU_SAC, ID_SIZE, MA, DON_GIA, SO_LUONG, TRANG_THAI,TRANG_THAI_KHUYEN_MAI,DON_GIA_BAN_DAU,QR_CODE) VALUES
(1, 1, 1, 'CTSP001', 200000, 100, N'Còn hàng',0,200000,''),
(2, 2, 2, 'CTSP002', 300000, 50, N'Còn hàng',0,300000,''),
(3, 3, 3, 'CTSP003', 500000, 30, N'Hết hàng',0,500000,''),
(4, 4, 4, 'CTSP004', 800000, 20, N'Còn hàng',0,800000,''),
(5, 5, 5, 'CTSP005', 1200000, 10, N'Hết hàng',0,1200000,''),
(6, 6, 6, 'CTSP006', 600000, 15, N'Còn hàng',0,600000,''),
(7, 7, 7, 'CTSP007', 700000, 40, N'Còn hàng',0,700000,''),
(8, 1, 3, 'CTSP008', 400000, 25, N'Hết hàng',0,400000,''),
(9, 2, 2, 'CTSP009', 550000, 50, N'Còn hàng',0,550000,''),
(10, 3, 1, 'CTSP010', 950000, 30, N'Còn hàng',0,950000,'');
select*from CHI_TIET_SAN_PHAM


INSERT INTO ANH_CHI_TIET_SAN_PHAM (ID_CHI_TIET_SAN_PHAM, URL_ANH) VALUES
(1, 'https://cdn.vuahanghieu.com/unsafe/0x900/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/11/ao-phong-nu-gucci-with-logo-printed-t-shirt-788093xjgl7-9074-mau-trang-size-s-672c4055039ad-07112024112141.jpg'),
(2, 'https://bizweb.dktcdn.net/100/347/212/products/165835169e2376d099b9bcd2a9f879bb49261d5c.jpg?v=1706174286703'),
(3, 'https://down-vn.img.susercontent.com/file/726623675382b001407d14477625fee1.webp'),
(4, 'https://product.hstatic.net/200000329007/product/bc9d6969-ae04-494f-9e8f-bd09b396564a_e37c2b80a5b5420f8f2584a3fcfb339d_master.jpg'),
(5, 'https://product.hstatic.net/1000205116/product/fdf9e99a-becd-4b04-ba64-d47cc4470df5_2af5b15d83114ddf9f60956372537e1c_1024x1024.jpeg'),
(6, 'https://bizweb.dktcdn.net/100/415/697/products/nta101-p5896d4x-1-pe31-hinh-mat-sau-0.jpg?v=1723446030133'),
(9, 'https://dongphucunicorn.com/wp-content/uploads/2019/10/ao-thun-co-tim.jpg'),
(10, 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lrvrpyror0sk73.webp'),
(7, 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgdayULm3RlrMPZU2JsZqP7nDb670GVCAvCWCPnBOzpvcO6CV1I2xiCaBvDQXTrMfJ-pNIDDFU6lO9BjsuLGc9uD8LPuUsb4gkaEW8KHN_RplRi1JCvlLCevI3Yz2acO2jE8sVXd8VRLGd1qQsSisXg_4BjLy3EGOeOjEQntGCh2fUW_gXNx0_pNYppCCY/s600/ao-thun-co-tron-thoi-trang.jpg'),
(8, 'https://dasbui.com/wp-content/uploads/2021/09/14_438274.jpg');
select*from ANH_CHI_TIET_SAN_PHAM

INSERT INTO KHACH_HANG ( MA, HO_TEN, GIOI_TINH, NGAY_THANG_NAM_SINH, EMAIL, ANH, SDT,ROLES, USERNAME, [PASSWORD], TRANG_THAI) VALUES
('KH001', N'Khách vãng lai', null,null, null, null, null, null,null ,null,null),
('KH002', N'Hà Thanh Tùng', 0, '1992-02-02', N'hatung18102004@gmail.com', 'anh2.jpg', '0987654321','CUSTOMER', N'hatung18102004@gmail.com', '123', N'Đang hoạt động'),
('KH003', N'Trần Tiến Dũng', 1, '1985-03-03', N'dyh01072004@gmail.com', 'anh3.jpg', '0909123456','CUSTOMER', N'dyh01072004@gmail.com', '123', N'Đang hoạt động'),
('KH004', N'Phan Thanh Chuyền', 0, '1993-04-04', N'chuyenphan09@gmail.com', 'anh4.jpg', '0911223344','CUSTOMER', N'chuyenphan09@gmail.com', '123', N'Đang hoạt động'),
('KH005', N'Nguyễn Hữu Hậu', 1, '1988-05-05', N'Hau2004sd@gmail.com', 'anh5.jpg', '0933445566','CUSTOMER', N'Hau2004sd@gmail.com', '123', N'Đang hoạt động'),
('KH006', N'Nguyễn Ngọc Hiển', 0, '1990-03-20', N'nguyenngochien9464@gmail.com', 'anh5.jpg', '0933445566','CUSTOMER', N'nguyenngochien9464@gmail.com', '123', N'Đang hoạt động');


INSERT INTO DIA_CHI_KHACH_HANG (ID_KHACH_HANG,SO_NHA, DUONG, PHUONG_XA, QUAN_HUYEN, TINH_THANH, QUOC_GIA, LOAI_DIA_CHI, TRANG_THAI) VALUES
(2, N'123', N'Nguyễn Trãi', N'Xã Long Hưng', N'Huyện Văn Giang', N'Hưng Yên', N'Việt Nam', N'Nhà riêng', N'Còn sử dụng'),
(2, N'456', N'Lê Lợi', N'Xã Liêm Phong', N'Huyện Thanh Liêm', N'Hà Nam', N'Việt Nam', N'Công ty', N'Còn sử dụng'),
(2, N'789', N'Phan Xích Long', N'Phường Tân Bình', N'Thành phố Tam Điệp', N'Ninh Bình', N'Việt Nam', N'Nhà riêng', N'Còn sử dụng'),
(3, N'321', N'Trường Chinh', N'Xã Hữu Sản', N'Huyện Sơn Động', N'Bắc Giang', N'Việt Nam', N'Công ty', N'Còn sử dụng'),
(4, N'654', N'Quang Trung', N'Xã Minh Phú', N'Huyện Sóc Sơn', N'Hà Nội', N'Việt Nam', N'Nhà riêng', N'Còn sử dụng');


INSERT INTO NHAN_VIEN (MA, HO_TEN, GIOI_TINH, NGAY_THANG_NAM_SINH, EMAIL, SDT, DIA_CHI, ANH,ROLES, USERNAME, [PASSWORD], THOI_GIAN_TAO, NGUOI_TAO, THOI_GIAN_SUA, NGUOI_SUA, TRANG_THAI) VALUES
('NV001', N'Hà Thanh Tùng', 1, '1980-06-06', N'hatung18102004@gmail.com', '0944556677', N'Xã Phú Kim, Huyện Thạch Thất, Hà Nội', 'anhnv1.jpg','ADMIN', N'hatung18102004@gmail.com', '123', GETDATE(), N'Admin', GETDATE(), N'Admin', N'Hoạt động'),
('NV002', N'Nguyễn Hữu Hậu', 0, '1983-07-07', N'Hau2004sd@gmail.com', '0955667788', N'Xã Phúc Thuận, Thị xã Phổ Yên, Thái Nguyên', 'anhnv2.jpg','USER', N'Hau2004sd@gmail.com', '123', GETDATE(), N'Admin', GETDATE(), N'Admin', N'Hoạt động'),
('NV003', N'Nguyễn Ngọc Hiển', 1, '1990-08-08', N'nguyenngochien9464@gmail.com', '0966778899', N'Xã Phú Lâm, Huyện Tiên Du,Bắc Ninh', 'anhnv3.jpg','USER', N'nguyenngochien9464@gmail.com', '123', GETDATE(), N'Admin', GETDATE(), N'Admin', N'Hoạt động'),
('NV004', N'Phan Thanh Chuyền', 0, '1985-09-09', N'chuyenphan09@gmail.com', '0977889900', N'Xã Nhân Hòa, Thị xã Mỹ Hào, Hưng Yên', 'anhnv4.jpg','USER', N'chuyenphan09@gmail.com', '123', GETDATE(), N'Admin', GETDATE(), N'Admin', N'Hoạt động'),
('NV005', N'Trần Tiến Dũng', 1, '1995-10-10', N'dyh01072004@gmail.com', '0988990011', N'Xã Thụy Lôi, Huyện Kim Bảng, Hà Nam', 'anhnv5.jpg','USER', N'dyh01072004@gmail.com', '123', GETDATE(), N'Admin', GETDATE(), N'Admin', N'Hoạt động');


INSERT INTO VOUCHER (MA, TEN, GIA_TRI_VOUCHER, KIEU_GIAM_GIA, THOI_GIAN_TAO, GIA_TRI_HOA_DON_TOI_THIEU, GIA_TRI_GIAM_TOI_DA, THOI_GIAN_BAT_DAU, THOI_GIAN_KET_THUC, MOTA, SO_LUONG, NGUOI_TAO, THOI_GIAN_SUA, NGUOI_SUA, TRANG_THAI) VALUES
('VC001', N'Voucher Giảm 10%', 10, '%', GETDATE(), 50000, 100000, GETDATE(), DATEADD(MONTH, 1, GETDATE()), N'Giảm giá 10% cho đơn hàng trên 500.000 VND', 100, N'Admin', GETDATE(), N'Admin', N'Đang diễn ra'),
('VC002', N'Voucher Giảm 50.000 VND', 50000, 'VND', GETDATE(), 0, 50000, GETDATE(), DATEADD(MONTH, 2, GETDATE()), N'Giảm 50.000 VND cho đơn hàng trên 200.000 VND', 200, N'Admin', GETDATE(), N'Admin', N'Đang diễn ra'),
('VC003', N'Voucher Giảm 20%', 20, '%', GETDATE(), 1000000, 300000, GETDATE(), DATEADD(MONTH, 3, GETDATE()), N'Giảm giá 20% cho đơn hàng trên 1.000.000 VND', 50, N'Admin', GETDATE(), N'Admin', N'Đang diễn ra'),
('VC004', N'Voucher Giảm 100.000 VND', 100000, 'VND', GETDATE(), 0, 100000, GETDATE(), DATEADD(MONTH, 1, GETDATE()), N'Giảm 100.000 VND cho đơn hàng trên 500.000 VND', 80, N'Admin', GETDATE(), N'Admin', N'Đang diễn ra'),
('VC005', N'Voucher Giảm 5%', 5, '%', GETDATE(), 15000, 30000, GETDATE(), DATEADD(MONTH, 1, GETDATE()), N'Giảm giá 5% cho đơn hàng trên 300.000 VND', 150, N'Admin', GETDATE(), N'Admin', N'Đang diễn ra');

INSERT INTO HOA_DON (ID_NHAN_VIEN, ID_KHACH_HANG, ID_VOUCHER, ID_PHUONG_THUC_THANH_TOAN,HINH_THUC_THANH_TOAN, MA, TONG_TIEN_BAN_DAU,PHI_SHIP, TONG_TIEN_THANH_TOAN, TEN_NGUOI_NHAN, SDT_NGUOI_NHAN, EMAIL_NGUOI_NHAN, DIA_CHI_NHAN_HANG, NGAY_NHAN_DU_KIEN, THOI_GIAN_TAO,GIA_TRI_GIAM,GIAO_HANG, GHI_CHU, TRANG_THAI) 
VALUES
(1, 1, 1, 1,0, N'HD001', 500000,10000, 450000, N'Hà Thanh Tùng', '0912345678', 'hatung18102004@gmail.com', N'Số 1,Xã Gia Vân , Huyện Gia Viễn, Ninh Bình', '2024-09-30', GETDATE(),0.0,1, N'Giao hàng trước 12h', N'Hoàn thành'),
(2, 2, 2, 1,0, N'HD002', 1000000,10000, 900000, N'Nguyễn Hữu Hậu', '0987654321', 'Hau2004sd@gmail.com', N'Số 10, Xã Sơn Hà, Huyện Thái Thụy, Thái Bình', '2024-09-25', GETDATE(),0.0,0, N'Giao hàng nhanh', N'Hoàn thành'),
(3, 3, 3, 2,0, N'HD003', 750000,10000, 700000, N'Nguyễn Ngọc Hiển', '0909123456', 'nguyenngochien9464@gmail.com', N'Số 5, Xã Đức Lý, Huyện Lý Nhân, Hà Nam', '2024-10-01', GETDATE(),0.0,0, N'Không yêu cầu đặc biệt', N'Đã hủy'),
(4, 4, 4, 1,0, N'HD004', 1500000,10000, 1350000, N'Phan Thanh Chuyền', '0934567890', 'chuyenphan09@gmail.com', N'Số 20, Xã Thanh Sơn, Huyện Kim Bảng, Hà Nam', '2024-09-27', GETDATE(),0.0,0, N'Giao hàng sau 18h', N'Đã hủy'),
(5, 5, 5, 1,0, N'HD005', 2000000,10000, 1800000, N'Trần Tiến Dũng', '0912340000', 'dyh01072004@gmail.com', N'Số 25, Xã Nam Tiến, Huyện Nam Trực, Nam Định', '2024-09-28', GETDATE(),0.0,0, N'Yêu cầu liên lạc trước', N'Hoàn thành');


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
('KM002', N'Khuyến mãi Giảm 50.000 VND', 'VND', N'Giảm 50.000 VND cho đơn hàng trên 300.000 VND', 200, 50000, GETDATE(), DATEADD(MONTH, 2, GETDATE()), GETDATE(), NULL, N'Admin', NULL, N'Đang diễn ra'),
('KM003', N'Khuyến mãi Mua 1 Tặng 1', '%', N'Mua 1 sản phẩm, tặng 1 sản phẩm cùng loại', 50, 10, GETDATE(), DATEADD(MONTH, 1, GETDATE()), GETDATE(), NULL, N'Admin', NULL, N'Đang diễn ra'),
('KM004', N'Khuyến mãi Giảm 20%', '%', N'Giảm giá 20% cho đơn hàng trên 500.000 VND', 150, 20, GETDATE(), DATEADD(MONTH, 3, GETDATE()), GETDATE(), NULL, N'Admin', NULL, N'Đang diễn ra'),
('KM005', N'Khuyến mãi Giảm 100.000 VND','VND', N'Giảm 100.000 VND cho đơn hàng trên 1.000.000 VND', 75, 100000, GETDATE(), DATEADD(MONTH, 3, GETDATE()), GETDATE(), NULL, N'Admin', NULL, N'Đang diễn ra');
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


INSERT INTO CHI_TIET_GIO_HANG (ID_CHI_TIET_SAN_PHAM, ID_GIO_HANG, SO_LUONG,TRANG_THAI) VALUES
(1, 1, 2,'active'),
(2, 2, 1,'active'),
(3, 3, 3,'active'),
(4, 4, 1,'active'),
(5, 5, 4,'active');

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