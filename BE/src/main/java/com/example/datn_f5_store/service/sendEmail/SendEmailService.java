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
            String subject = "Chào mừng bạn đã đến với F5-Store – Nơi mua sắm lý tưởng của bạn!";
            message.setSubject(subject);
            String body = "Xin chào: "+toEmail+" ,\n" +
                    "\n" +
                    "Chúc mừng bạn đã đăng ký thành công tài khoản tại F5-Store"+
                    "\n"+
                    "Chúng tôi rất vui khi bạn đã tin tưởng và lựa chọn F5-Store làm điểm đến mua sắm của mình. \n" +
                    "Và đây là tài khoản và mật khẩu của bạn."+
                    "\n" +
                    "Tài khoản: "+username+" \n" +
                    "Mật khẩu: "+password+"\n" +
                    "Vui lòng đăng nhập vào hệ thống và thay đổi mật khẩu của bạn ngay khi có thể. Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi qua địa chỉ email này.\n" +
                    "\n" +
                    "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!\n" +
                    "\n" +
                    "Thân mến!\n"+
                    "Đội Ngũ F5-Store";
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
                    "Chúng tôi xin chân thành cảm ơn bạn vì đã tin tưởng mua hàng tại F5-store chúng tôi. Dưới đây là thông tin mã đơn hàng của bạn:\n" +
                    "\n" +
                    "Mã Đơn hàng: "+maHoaDon+" \n" +
                    "Bạn có thể truy cập vào trang web của chúng tôi để tra cứu mã đơn hàng.\n" +
                    "\n" +
                    "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!\n" +
                    "\n" +
                    "Thân mến!\n"
                    +"Đội ngũ F5-store";
            message.setText(body);
            mailSender.send(message);
            return new DataResponse(true, new ResultModel<>(null,"Send email successfully"));
        }catch (Exception e){
            e.printStackTrace();
            return new DataResponse(false,new ResultModel<>(null,"Send email exception"));
        }
    }


}
