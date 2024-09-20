package com.example.datn_f5_store.contanst;

import org.springframework.format.number.PercentStyleFormatter;

import java.lang.reflect.Parameter;

public class ConfigContanst {
    public static class ChiTietGioHang{
        public static final String TABLE = "CHI_TIET_GIO_HANG";
        public static final String ID_GIO_HANG = "ID_GIO_HANG";
        public static final String ID_CHI_TIET_SAN_PHAM = "ID_CHI_TIET_SAN_PHAM";
        public static final String SO_LUONG = "SO_LUONG";
    }

    public static class ChiTietHoaDon{
        public static final String TABLE = "CHI_TIET_HOA_DON";
        public static final String ID_HOA_DON = "ID_HOA_DON";
        public static final String ID_CHI_TIET_SAN_PHAM = "ID_CHI_TIET_SAN_PHAM";
        public static final String MA = "MA";
        public static final String SO_LUONG = "SO_LUONG";
        public static final String GIA_SPCT_HIEN_TAI = "GIA_SPCT_HIEN_TAI";
        public static final String TRANG_THAI = "TRANG_THAI";
    }
    public static class ChiTietSanPham{
        public static final String TABLE = "CHI_TIET_SAN_PHAM";
        public static final String ID_SAN_PHAM = "ID_SAN_PHAM";
        public static final String ID_MAU_SAC = "ID_MAU_SAC";
        public static final String ID_SIZE = "ID_SIZE";
        public static final String MA = "MA";
        public static final String TEN = "TEN";
        public static final String DON_GIA = "DON_GIA";
        public static final String SO_LUONG = "SO_LUONG";
        public static final String NGAY_NHAP = "NGAY_NHAP";
        public static final String TRANG_THAI = "TRANG_THAI";
    }
    public static class ChucVu{
        public static final String TABLE = "chuc_vu";
        public static final String MA = "ma";
        public static final String TEN_CHUC_VU = "ten_chuc_vu";
        public static final String TRANG_THAI = "trang_thai";
    }
    public static class GiaoHang{
        public static final String TABLE = "giao_hang";
        public static final String NGAY_GIAO = "ngay_giao";
        public static final String NGAY_NHAN = "ngay_nhan";
        public static final String DIA_CHI = "dia_chi";
        public static final String PHI_GIAO_HANG = "phi_giao_hang";
        public static final String TRANG_THAI = "trang_thai";
    }
    public static class GioHang{
        public static final String TABLE = "GIO_HANG";
        public static final String ID_KHACH_HANG = "ID_KHACH_HANG";
        public static final String THOI_GIAN_TAO = "THOI_GIAN_TAO";
    }
    public static class HoaDon{
        public static final String TABLE = "HOA_DON";
        public static final String ID_KHACH_HANG = "ID_KHACH_HANG";
        public static final String ID_NHAN_VIEN = "ID_NHAN_VIEN";
        public static final String ID_VOUCHER = "ID_VOUCHER";
        public static final String ID_THANH_TOAN = "ID_THANH_TOAN";
        public static final String MA = "MA";
        public static final String TONG_TIEN_BAN_DAU = "TONG_TIEN_BAN_DAU";
        public static final String TONG_TIEN_SAU_VOUCHER = "TONG_TIEN_SAU_VOUCHER";
        public static final String TEN_NGUOI_NHAN = "TEN_NGUOI_NHAN";
        public static final String SDT_NGUOI_NHAN = "SDT_NGUOI_NHAN";
        public static final String EMAIL_NGUOI_NHAN = "EMAIL_NGUOI_NHAN";
        public static final String DIA_CHI_NHAN_HANG = "DIA_CHI_NHAN_HANG";
        public static final String NGAY_NHAN_DU_KIEN = "NGAY_NHAN_DU_KIEN";
        public static final String THOI_GIAN_TAO = "THOI_GIAN_TAO";
        public static final String GHI_CHU = "GHI_CHU";
        public static final String TRANG_THAI = "TRANG_THAI";
    }
    public static class KhachHang{
        public static final String TABLE = "KHACH_HANG";
        public static final String ID_DIA_CHI = "ID_DIA_CHI";
        public static final String MA = "MA";
        public static final String HO_TEN = "HO_TEN";
        public static final String GIOI_TINH = "GIOI_TINH";
        public static final String NGAY_THANG_NAM_SINH = "NGAY_THANG_NAM_SINH";
        public static final String EMAIL = "EMAIL";
        public static final String ANH = "ANH";
        public static final String SDT = "SDT";
        public static final String USERNAME = "USERNAME";
        public static final String PASSWORD = "PASSWORD";
        public static final String TRANG_THAI = "trang_thai";
    }
    public static class KhuyenMai{
        public static final String TABLE = "KHUYEN_MAI";
        public static final String MA = "MA";
        public static final String TEN = "TEN";
        public static final String GIA_TRI_VOUCHER = "GIA_TRI_VOUCHER";
        public static final String KIEU_KHUYEN_MAI = "KIEU_KHUYEN_MAI";
        public static final String MO_TA = "MOTA";
        public static final String SO_LUONG = "SO_LUONG";
        public static final String LOAI_KHUYEN_MAI = "LOAI_KHUYEN_MAI";
        public static final String GIA_TRI_KHUYEN_MAI = "GIA_TRI_KHUYEN_MAI";
        public static final String THOI_GIAN_BAT_DAU = "THOI_GIAN_BAT_DAU";
        public static final String THOI_GIAN_KET_THUC = "THOI_GIAN_KET_THUC";
        public static final String THOI_GIAN_TAO = "THOI_GIAN_TAO";
        public static final String THOI_GIAN_SUA = "THOI_GIAN_SUA";
        public static final String NGUOI_TAO = "NGUOI_TAO";
        public static final String NGUOI_SUA = "NGUOI_SUA";
        public static final String TRANG_THAI = "TRANG_THAI";
    }
    public static class MauSac{
        public static final String TABLE = "MAU_SAC";
        public static final String MA = "MA";
        public static final String TEN = "TEN";
    }
    public static class NhanVien{
        public static final String TABLE = "NHAN_VIEN";
        public static final String MA = "MA";
        public static final String HO_TEN = "HO_TEN";
        public static final String GIOI_TINH = "GIOI_TINH";
        public static final String NGAY_THANG_NAM_SINH = "NGAY_THANG_NAM_SINH";
        public static final String EMAIL = "EMAIL";
        public static final String SDT = "SDT";
        public static final String DIA_CHI = "DIA_CHI";
        public static final String ANH = "ANH";
        public static final String USERNAME = "USERNAME";
        public static final String PASSWORD = "PASSWORD";
        public static final String THOI_GIAN_TAO = "THOI_GIAN_TAO";
        public static final String NGUOI_TAO = "NGUOI_TAO";
        public static final String THOI_GIAN_SUA = "THOI_GIAN_SUA";
        public static final String NGUOI_SUA = "NGUOI_SUA";
        public static final String TRANG_THAI = "TRANG_THAI";
    }
    public static class SanPham{
        public static final String TABLE = "SAN_PHAM";
        public static final String ID_XUAT_XU = "ID_XUAT_XU";
        public static final String ID_THUONG_HIEU = "ID_THUONG_HIEU";
        public static final String ID_CHAT_LIEU = "ID_CHAT_LIEU";
        public static final String MA = "MA";
        public static final String TEN = "TEN";
        public static final String TRANG_THAI = "TRANG_THAI";
    }
    public static class Size{
        public static final String TABLE = "SIZE";
        public static final String MA = "MA";
        public static final String TEN = "TEN";
    }
    public static class ThanhToan{
        public static final String TABLE = "THANH_TOAN";
        public static final String TEN_PHUONG_THUC = "TEN_PHUONG_THUC";
        public static final String TEN = "TEN";
        public static final String THOI_GIAN_THANH_TOAN = "THOI_GIAN_THANH_TOAN";
        public static final String TRANG_THAI = "TRANG_THAI";
    }

}
