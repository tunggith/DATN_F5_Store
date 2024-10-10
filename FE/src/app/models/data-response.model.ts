export interface DataResponse<T> {
    status: boolean; // Trạng thái của phản hồi (true/false)
    result: ResultModel<T>; // Kết quả của phản hồi
  }
  
  export interface ResultModel<T> {
    pagination: any; // Bạn có thể thay đổi kiểu này nếu có thông tin phân trang
    content: T; // Nội dung chính của phản hồi
  }