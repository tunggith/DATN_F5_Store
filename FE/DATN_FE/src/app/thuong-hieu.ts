
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


export interface ThuongHieu {
    id: number;
    ma: string;
    ten: string;
}