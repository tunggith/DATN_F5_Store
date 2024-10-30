package com.example.datn_f5_store.jwt;

import com.example.datn_f5_store.until.validate.ValidationUtils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
@Slf4j
public class JwtUtil {
    @Value("${jwt.secret}")
    private String SECRET_KEY;
    @Value("${jwt.expiration}")
    private long EXPIRATION_TIME;
    /**
     * Trích xuất tên người dùng từ token JWT.
     *
     * @param token Token JWT cần trích xuất tên người dùng.
     * @return Tên người dùng từ token.
     */
    public String extractUsername(String token) {
        ValidationUtils.validateString(token);
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Trích xuất thời gian hết hạn từ token JWT.
     *
     * @param token Token JWT cần trích xuất thời gian hết hạn.
     * @return Thời gian hết hạn của token.
     */
    public Date extractExpiration(String token) {
        ValidationUtils.validateString(token);
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Trích xuất các thông tin từ token JWT dựa trên hàm giải quyết yêu cầu.
     *
     * @param token          Token JWT cần trích xuất thông tin.
     * @param claimsResolver Hàm giải quyết thông tin từ các claims.
     * @param <T>            Loại thông tin cần trích xuất.
     * @return Thông tin trích xuất từ token.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        ValidationUtils.validateString(token);
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Trích xuất tất cả các claims từ token JWT.
     *
     * @param token Token JWT cần trích xuất claims.
     * @return Các claims từ token.
     * @throws JwtException Nếu token không hợp lệ.
     */
    private Claims extractAllClaims(String token) {
        ValidationUtils.validateString(token);
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | IllegalArgumentException e) {
            throw new JwtException("Invalid JWT token: " + e.getMessage());
        }
    }

    /**
     * Kiểm tra xem token JWT có hết hạn hay không.
     *
     * @param token Token JWT cần kiểm tra.
     * @return True nếu token đã hết hạn, false nếu chưa hết hạn.
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Tạo token JWT cho người dùng.
     *
     * @param userDetails Chi tiết người dùng để tạo token.
     * @return Token JWT được tạo.
     */
    public String generateToken(UserDetails userDetails, boolean authMethod) {
        ValidationUtils.validateObject(userDetails);
        Map<String, Object> claims = new HashMap<>();

        claims.put("isLdap", authMethod);

        return createToken(claims, userDetails.getUsername());
    }

    public boolean extractLdap(String token) {
        // Xác thực token và lấy claims
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();

        // Trích xuất giá trị của "auth_method"
        return (boolean) claims.get("isLdap");
    }

    /**
     * Tạo token JWT với các claims và chủ đề.
     *
     * @param claims  Các claims cần thêm vào token.
     * @param subject Chủ đề của token.
     * @return Token JWT được tạo.
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    /**
     * Lấy danh sách các quyền từ token JWT.
     *
     * @param token Token JWT chứa thông tin quyền.
     * @return Danh sách các quyền từ token.
     */
    public List<String> getPermissionsFromToken(String token) {
        ValidationUtils.validateString(token);
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
        return claims.get("permissions", List.class);
    }

    /**
     * Xác thực token JWT dựa trên thông tin người dùng.
     *
     * @param token       Token JWT cần xác thực.
     * @param userDetails Thông tin người dùng để so sánh.
     * @return True nếu token hợp lệ, false nếu không hợp lệ.
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        ValidationUtils.validateObject(userDetails);
        ValidationUtils.validateString(token);

        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT Token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT Token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT Token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty");
        }
        return false;
    }

    /**
     * Kiểm tra xem token có thể được làm mới hay không.
     *
     * @param token Token JWT cần kiểm tra.
     * @return True nếu token có thể làm mới, false nếu không thể.
     */
    public boolean canTokenBeRefreshed(String token) {
        return (!isTokenExpired(token) || ignoreTokenExpiration(token));
    }

    /**
     * Kiểm tra xem có bỏ qua thời gian hết hạn của token hay không.
     *
     * @param token Token JWT cần kiểm tra.
     * @return True nếu bỏ qua thời gian hết hạn, false nếu không.
     */
    private boolean ignoreTokenExpiration(String token) {
        // Ở đây bạn có thể xác định các token mà thời gian hết hạn bị bỏ qua
        return false;
    }

    /**
     * Làm mới token JWT.
     *
     * @param token Token JWT cần làm mới.
     * @return Token JWT đã được làm mới.
     */
    public String refreshToken(String token) {

        ValidationUtils.validateString(token);

        final Date createdDate = new Date();
        final Date expirationDate = calculateExpirationDate(createdDate);

        final Claims claims = extractAllClaims(token);
        claims.setIssuedAt(createdDate);
        claims.setExpiration(expirationDate);

        return Jwts.builder()
                .setClaims(claims)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    /**
     * Tính toán thời gian hết hạn dựa trên thời gian tạo.
     *
     * @param createdDate Thời gian tạo token.
     * @return Thời gian hết hạn của token.
     */
    private Date calculateExpirationDate(Date createdDate) {
        return new Date(createdDate.getTime() + EXPIRATION_TIME);
    }
}
