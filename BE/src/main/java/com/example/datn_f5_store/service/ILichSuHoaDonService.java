package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.LichSuHoaDonDto;
import com.example.datn_f5_store.entity.LichSuHoaDonEntity;
import com.example.datn_f5_store.response.DataResponse;
import org.springframework.data.domain.Page;
import java.util.Date;
import java.util.List;

public interface ILichSuHoaDonService {
    Page<LichSuHoaDonDto> getAllLichSuHoaDon(int page, int size, Date startDate, Date endDate);
    List<LichSuHoaDonDto> getByHoaDon(Integer idHoaDon);

}
