CREATE Database DATN_F5_STORE
USE DATN_F5_STORE

CREATE TABLE XUAT_XU(
ID iNT IDENTITY(1,1) PRIMARY KEY,
MA VARCHAR(50),
TEN NVARCHAR(255)
)
CREATE TABLE THUONG_HIEU(
ID iNT IDENTITY(1,1) PRIMARY KEY,
MA VARCHAR(50),
TEN NVARCHAR(255)
)
CREATE TABLE GIOI_TINH(
ID iNT IDENTITY(1,1) PRIMARY KEY,
TEN NVARCHAR(255)
)
CREATE TABLE [SIZE](
ID iNT IDENTITY(1,1) PRIMARY KEY,
MA VARCHAR(50),
TEN NVARCHAR(255)
)
CREATE TABLE MAU_SAC(
ID iNT IDENTITY(1,1) PRIMARY KEY,
MA VARCHAR(50),
TEN NVARCHAR(255)
)

CREATE TABLE PHUONG_THUC_THANH_TOAN(
ID iNT IDENTITY(1,1) PRIMARY KEY, 
TEN_PHUONG_THUC NVARCHAR(50),
TRANG_THAI NVARCHAR(30)
)
CREATE table SAN_PHAM(
ID INT IDENTITY(1,1) PRIMARY KEY,
ID_XUAT_XU INT,
ID_THUONG_HIEU INT,
ID_GIOI_TINH INT,
MA VARCHAR(50),
TEN NVARCHAR(255),
TRANG_THAI NVARCHAR(50)

FOREIGN KEY(ID_XUAT_XU) REFERENCES XUAT_XU(ID),
FOREIGN KEY(ID_THUONG_HIEU) REFERENCES THUONG_HIEU(ID),
FOREIGN KEY(ID_GIOI_TINH) REFERENCES GIOI_TINH(ID)
)

CREATE table CHI_TIET_SAN_PHAM(
ID INT IDENTITY(1,1) PRIMARY KEY,
ID_SAN_PHAM INT,
ID_MAU_SAC INT,
ID_SIZE INT,
MA VARCHAR(50),
TEN NVARCHAR(255),
DON_GIA MONEY,
SO_LUONG INT,
TRANG_THAI NVARCHAR(50)
FOREIGN KEY(ID_SAN_PHAM) REFERENCES SAN_PHAM(ID),
FOREIGN KEY(ID_MAU_SAC) REFERENCES MAU_SAC(ID),
FOREIGN KEY(ID_SIZE) REFERENCES [SIZE](ID)
)

CREATE TABLE ANH_CHI_TIET_SAN_PHAM(
ID iNT IDENTITY(1,1) PRIMARY KEY,
ID_CHI_TIET_SAN_PHAM INT,
URL_ANH VARCHAR(max)
FOREIGN KEY(ID_CHI_TIET_SAN_PHAM) REFERENCES CHI_TIET_SAN_PHAM(ID)
) 



CREATE TABLE KHACH_HANG(
ID iNT IDENTITY(1,1) PRIMARY KEY,
MA VARCHAR(50),
HO_TEN NVARCHAR(255),
GIOI_TINH INT,
NGAY_THANG_NAM_SINH DATE,
EMAIL NVARCHAR(150),
ANH VARCHAR(max),
SDT VARCHAR(15),
ROLES VARCHAR(100),
USERNAME NVARCHAR(150),
[PASSWORD] VARCHAR(255),
TRANG_THAI NVARCHAR(50)
) 

CREATE TABLE DIA_CHI_KHACH_HANG(
ID iNT IDENTITY(1,1) PRIMARY KEY,
ID_KHACH_HANG INT,
SDT VARCHAR(15),
SO_NHA NVARCHAR(50),
DUONG NVARCHAR(150),
PHUONG_XA NVARCHAR(150),
QUAN_HUYEN NVARCHAR(150),
TINH_THANH NVARCHAR(150),
QUOC_GIA NVARCHAR(150),
LOAI_DIA_CHI NVARCHAR(150),
TRANG_THAI NVARCHAR(50)
FOREIGN KEY(ID_KHACH_HANG) REFERENCES KHACH_HANG(ID)
)

CREATE TABLE NHAN_VIEN(
ID iNT IDENTITY(1,1) PRIMARY KEY,
MA VARCHAR(50),  
HO_TEN NVARCHAR(255),
GIOI_TINH INT,
NGAY_THANG_NAM_SINH DATE,
EMAIL NVARCHAR(150),
SDT VARCHAR(15),
DIA_CHI NVARCHAR(300),
ANH VARCHAR(max),
ROLES VARCHAR(100),
USERNAME NVARCHAR(150),
[PASSWORD] VARCHAR(255),
THOI_GIAN_TAO DATETIME,
NGUOI_TAO NVARCHAR(255),
THOI_GIAN_SUA DATETIME,
NGUOI_SUA NVARCHAR(255),
TRANG_THAI NVARCHAR(50)
) 
CREATE TABLE VOUCHER(
ID iNT IDENTITY(1,1) PRIMARY KEY,
MA VARCHAR(50),
TEN NVARCHAR(255),
GIA_TRI_VOUCHER INT,
KIEU_GIAM_GIA VARCHAR(5), --kiểu giảm giá - % hay $
THOI_GIAN_TAO DATETIME,
GIA_TRI_HOA_DON_TOI_THIEU INT,
GIA_TRI_GIAM_TOI_DA INT,
THOI_GIAN_BAT_DAU DATETIME,
THOI_GIAN_KET_THUC DATETIME,
MOTA NVARCHAR(255),
SO_LUONG INT,
NGUOI_TAO NVARCHAR(255),
THOI_GIAN_SUA DATETIME,
NGUOI_SUA NVARCHAR(255),
TRANG_THAI NVARCHAR(50)
) 

CREATE TABLE HOA_DON(
ID INT IDENTITY(1,1) PRIMARY KEY,
ID_NHAN_VIEN INT,
ID_KHACH_HANG INT,
ID_VOUCHER INT,
ID_PHUONG_THUC_THANH_TOAN INT,
HINH_THUC_THANH_TOAN INT,
MA NVARCHAR(50),
TONG_TIEN_BAN_DAU MONEY,
PHI_SHIP MONEY,
TONG_TIEN_THANH_TOAN MONEY,
TEN_NGUOI_NHAN NVARCHAR(255),
SDT_NGUOI_NHAN VARCHAR(15),
EMAIL_NGUOI_NHAN VARCHAR(255),
DIA_CHI_NHAN_HANG NVARCHAR(300),
NGAY_NHAN_DU_KIEN DATE,
THOI_GIAN_TAO DATETIME,
GIAO_HANG INT,
GHI_CHU NVARCHAR(255),
TRANG_THAI NVARCHAR(50),
CONSTRAINT FK_HOA_DON_NHAN_VIEN FOREIGN KEY(ID_NHAN_VIEN) REFERENCES NHAN_VIEN(ID),
CONSTRAINT FK_HOA_DON_KHACH_HANG FOREIGN KEY(ID_KHACH_HANG) REFERENCES KHACH_HANG(ID),
CONSTRAINT FK_HOA_DON_VOUCHER FOREIGN KEY(ID_VOUCHER) REFERENCES VOUCHER(ID),
CONSTRAINT FK_HOA_DON_PHUONG_THUC_THANH_TOAN FOREIGN KEY(ID_PHUONG_THUC_THANH_TOAN) REFERENCES PHUONG_THUC_THANH_TOAN(ID)
);

CREATE TABLE LICH_SU_HOA_DON(
ID INT IDENTITY(1,1) PRIMARY KEY,
ID_HOA_DON INT,
ID_NHAN_VIEN INT,
GHI_CHU NVARCHAR(255),
THOI_GIAN_THUC_HIEN DATETIME,
TRANG_THAI_CU NVARCHAR(100),
TRANG_THAI_MOI NVARCHAR(100),
LOAI_THAY_DOI NVARCHAR(100),
 FOREIGN KEY(ID_HOA_DON) REFERENCES HOA_DON(ID),
 FOREIGN KEY(ID_NHAN_VIEN) REFERENCES NHAN_VIEN(ID),
)


CREATE TABLE CHI_TIET_HOA_DON(
ID INT IDENTITY(1,1) PRIMARY KEY,
ID_HOA_DON INT,
ID_CHI_TIET_SAN_PHAM INT,
MA VARCHAR(50),
SO_LUONG INT,
GIA_SPCT_HIEN_TAI MONEY,
TRANG_THAI NVARCHAR(50),
 FOREIGN KEY(ID_HOA_DON) REFERENCES HOA_DON(ID),
 FOREIGN KEY(ID_CHI_TIET_SAN_PHAM) REFERENCES CHI_TIET_SAN_PHAM(ID),
)

CREATE TABLE KHUYEN_MAI(
ID iNT IDENTITY(1,1) PRIMARY KEY,
MA VARCHAR(50),
TEN NVARCHAR(255),
KIEU_KHUYEN_MAI VARCHAR(5), --kiểu giảm giá - % hay VND
MOTA NVARCHAR(255),
SO_LUONG INT,
GIA_TRI_KHUYEN_MAI INT,
THOI_GIAN_BAT_DAU DATETIME,
THOI_GIAN_KET_THUC DATETIME,
THOI_GIAN_TAO DATETIME,
THOI_GIAN_SUA DATETIME,
NGUOI_TAO NVARCHAR(255),
NGUOI_SUA NVARCHAR(255),
TRANG_THAI NVARCHAR(50)
)

CREATE TABLE KHUYEN_MAI_CHI_TIET_SAN_PHAM(
ID iNT IDENTITY(1,1) PRIMARY KEY,
ID_KHUYEN_MAI INT,
ID_CHI_TIET_SAN_PHAM INT,
TRANG_THAI NVARCHAR(50)
 FOREIGN KEY(ID_KHUYEN_MAI) REFERENCES KHUYEN_MAI(ID),
 FOREIGN KEY(ID_CHI_TIET_SAN_PHAM) REFERENCES CHI_TIET_SAN_PHAM(ID),
)

CREATE TABLE GIO_HANG(
ID iNT IDENTITY(1,1) PRIMARY KEY,
ID_KHACH_HANG INT,
THOI_GIAN_TAO DATETIME,
 FOREIGN KEY(ID_KHACH_HANG) REFERENCES KHACH_HANG(ID),
)

CREATE TABLE CHI_TIET_GIO_HANG(
ID iNT IDENTITY(1,1) PRIMARY KEY,
ID_CHI_TIET_SAN_PHAM INT,
ID_GIO_HANG INT,
SO_LUONG INT,
 FOREIGN KEY(ID_CHI_TIET_SAN_PHAM) REFERENCES CHI_TIET_SAN_PHAM(ID),
 FOREIGN KEY(ID_GIO_HANG) REFERENCES GIO_HANG(ID)
)