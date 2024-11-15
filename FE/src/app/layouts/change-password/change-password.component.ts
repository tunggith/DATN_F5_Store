import {Component, OnInit} from '@angular/core';
import {SecurityService} from '../security/security.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {error} from 'console';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    username: string = '';
    passwordOld: string = '';
    passwordNew: string = '';
    passwordRequier: string = '';
    checkUsername: boolean = false;
    checkPasswordOld: boolean = false;
    checkPasswordNew: boolean = false;
    checkPasswordRequier: boolean = false;

    constructor(private securityService: SecurityService, private router: Router) {
    }

    ngOnInit(): void {
    }

    exit(): void {
        this.router.navigate(['/login']);
    }

    getPassword(passwordRequier: string) {
        this.passwordRequier = passwordRequier;
    }

    changePassword(): void {
        if (!this.isCheck()) {
            return;
        }
        this.securityService.changePassword(this.username, this.passwordOld, this.passwordNew).subscribe(
            response => {
                this.showSuccessMessage('Đổi mật khẩu thành công');
                this.router.navigate(['/login']);
            },
            error => {
                this.handleError(error);
            }
        )
    }

    private isCheck(): boolean {
        // Reset all check flags to false
        this.checkUsername = false;
        this.checkPasswordNew = false;
        this.checkPasswordOld = false;
        this.checkPasswordRequier = false;

        let isValid = true; // Assume valid initially

        if (!this.username) {
            this.checkUsername = true;
            isValid = false;
        }
        if (!this.passwordNew) {
            this.checkPasswordNew = true;
            isValid = false;
        } else {
            // Kiểm tra độ dài mật khẩu
            if (!this.isPasswordLengthValid(this.passwordNew)) {
                this.checkPasswordNew = true;
                isValid = false;
            } else {
                // Kiểm tra mật khẩu có chứa chữ cái và số
                if (!this.isPasswordContainsLetterAndNumber(this.passwordNew)) {
                    this.checkPasswordNew = true;
                    isValid = false;
                }
            }
        }
        if (!this.passwordOld) {
            this.checkPasswordOld = true;
            isValid = false;
        }
        if (!this.passwordRequier) {
            this.checkPasswordRequier = true;
            isValid = false;
        } else if (this.passwordNew !== this.passwordRequier) {
            this.checkPasswordRequier = true;
            isValid = false;
        }

        return isValid;
    }

    public isPasswordLengthValid(password: string): boolean {
        // Kiểm tra mật khẩu có độ dài từ 6-20 ký tự
        return password.length >= 6 && password.length <= 20;
    }

    public isPasswordContainsLetterAndNumber(password: string): boolean {
        // Kiểm tra mật khẩu có chứa ít nhất một chữ cái và một số
        const pattern = /^(?=.*[a-zA-Z])(?=.*\d)/;
        return pattern.test(password);
    }


    private handleError(error: any): void {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Lỗi:${error.message}`;
        } else {
            errorMessage = `${error.error}`;
        }
        this.showErrorMessage(errorMessage);
    }

    showSuccessMessage(message: string) {
        Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: message,
            showConfirmButton: false,
            timer: 1500
        });
    }

    showErrorMessage(message: string) {
        Swal.fire({
            icon: 'error',
            title: 'Thất bại!',
            text: message,
            showConfirmButton: false,
            timer: 1500
        });
    }

    showWarningMessage(message: string) {
        Swal.fire({
            icon: 'warning',
            title: 'Thất bại!',
            text: message,
            showConfirmButton: false,
            timer: 1500
        });
    }
}
