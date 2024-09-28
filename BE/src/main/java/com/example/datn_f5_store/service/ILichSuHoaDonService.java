package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.LichSuHoaDonDto;
import org.springframework.data.domain.Page;
import java.util.Date;

public interface ILichSuHoaDonService {
    Page<LichSuHoaDonDto> getAllLichSuHoaDon(int page, int size, Date startDate, Date endDate);

}
