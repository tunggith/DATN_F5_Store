export class XuatXu {
    id: number;
    ma: string;
    ten: string;

    constructor(id: number, ma: string, ten: string) {
        this.id = id;
        this.ma = ma;
        this.ten = ten;
    }
}

export class ThuongHieu {
    id: number;
    ma: string;
    ten: string;

    constructor(id: number, ma: string, ten: string) {
        this.id = id;
        this.ma = ma;
        this.ten = ten;
    }
}

export class ChatLieu {
    id: number;
    ma: string;
    ten: string;

    constructor(id: number, ma: string, ten: string) {
        this.id = id;
        this.ma = ma;
        this.ten = ten;
    }
}

export class SanPham {
    id: number;
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
