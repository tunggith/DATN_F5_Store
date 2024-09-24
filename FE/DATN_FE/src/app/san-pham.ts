import { ChatLieu } from "./chat-lieu";
import { ThuongHieu } from "./thuong-hieu";
import { XuatXu } from "./xuat-xu";


export class SanPham {
    id?: number;
    ma: string;
    ten: string;
    xuatXu: XuatXu;
    thuongHieu: ThuongHieu;
    chatLieu: ChatLieu;
    trangThai: string;

    constructor(id: number, ma: string, ten: string, xuatXu: XuatXu, thuongHieu: ThuongHieu, chatLieu: ChatLieu, trangThai: string) {
        this.id = id;
        this.ma = ma;
        this.ten = ten;
        this.xuatXu = xuatXu;
        this.thuongHieu = thuongHieu;
        this.chatLieu = chatLieu;
        this.trangThai = trangThai;
    }
}
export interface SanPham {
    id?: number;
    ma: string;
    ten: string;
    xuatXu: XuatXu;
    thuongHieu: ThuongHieu;
    chatLieu: ChatLieu;
    trangThai: string;
}
