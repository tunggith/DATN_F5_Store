
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

export interface ChatLieu {
    id: number;
    ma: string;
    ten: string;
}

