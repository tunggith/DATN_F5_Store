package com.example.datn_f5_store.service.sendEmail;

import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.stereotype.Service;

@Service
public class SendEmailService {
    @Autowired
    private JavaMailSender mailSender;

    public DataResponse sendSimpleEmail(String toEmail,String username,String password){
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("f5storefall24@gmail.com");
            message.setTo(toEmail);
            String subject = "Thông báo cấp tài khoản đăng nhập tại F5-store";
            message.setSubject(subject);
            String body = "Kính gửi: "+toEmail+" ,\n" +
                    "\n" +
                    "Chúng tôi xin thông báo rằng tài khoản của bạn đã được tạo thành công. Dưới đây là thông tin tài khoản của bạn:\n" +
                    "\n" +
                    "username: "+username+" \n" +
                    "Mật khẩu: "+password+"\n" +
                    "Vui lòng đăng nhập vào hệ thống và thay đổi mật khẩu của bạn ngay khi có thể. Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi qua địa chỉ email này.\n" +
                    "\n" +
                    "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!\n" +
                    "\n" +
                    "Trân trọng!\n";
            message.setText(body);
            mailSender.send(message);
            return new DataResponse(true, new ResultModel<>(null,"Send email successfully"));
        }catch (Exception e){
            e.printStackTrace();
            return new DataResponse(false,new ResultModel<>(null,"Send email exception"));
        }
    }
    public DataResponse sendSimpleEmailCamOn(String toEmail,String maHoaDon){
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("f5storefall24@gmail.com");
            message.setTo(toEmail);
            String subject = "Cảm ơn vì đã mua hàng tại F5-store";
            message.setSubject(subject);
            String body = "Kính gửi: "+toEmail+" ,\n" +
                    "\n" +
                    "Chúng tôi xin chan thành cảm ơn bạn vì đã tin tưởng mua hàng tại F5-store chúng tôi. Dưới đây là thông tin mã đơn hàng của bạn:\n" +
                    "\n" +
                    "Mã Đơn hàng: "+maHoaDon+" \n" +
                    "Bạn có thể truy cập vào trang web của chúng tôi để tra cứu mã đơn hàng.\n" +
                    "\n" +
                    "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!\n" +
                    "\n" +
                    "Trân trọng!\n";
            message.setText(body);
            mailSender.send(message);
            return new DataResponse(true, new ResultModel<>(null,"Send email successfully"));
        }catch (Exception e){
            e.printStackTrace();
            return new DataResponse(false,new ResultModel<>(null,"Send email exception"));
        }
    }


}
