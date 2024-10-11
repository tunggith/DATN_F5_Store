
package com.example.datn_f5_store.Response;




import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietSanPhamReponse {


    private Integer id;

    private String Ten_san_pham;

    private String  mauSac;

    private String size;

    private String ma;

    private String ten;

    private Double donGia;

    private Integer soLuong;

    private String trangThai;
}
