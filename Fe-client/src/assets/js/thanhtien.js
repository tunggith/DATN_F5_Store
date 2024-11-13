
  $(function() {
    // Khởi tạo thanh kéo với 2 tay cầm
    $("#slider-range").slider({
      range: true, // Cho phép có 2 tay cầm
      min: 0, // Giá trị tối thiểu
      max: 1000000, // Giá trị tối đa
      step: 10000, // Bước nhảy của thanh kéo
      values: [300000, 700000], // Giá trị mặc định cho các tay cầm
      slide: function(event, ui) {
        // Cập nhật các ô nhập liệu khi kéo thanh
        $("#min-price").val(ui.values[0].toLocaleString() + "đ");
        $("#max-price").val(ui.values[1].toLocaleString() + "đ");

        // Kiểm tra điều kiện hoán đổi giá trị
        if (ui.values[0] > ui.values[1]) {
          // Hoán đổi giá trị của a và b nếu a > b
          let temp = ui.values[0];
          ui.values[0] = ui.values[1];
          ui.values[1] = temp;
          $("#slider-range").slider("values", ui.values);
        }
      }
    });

    // Cập nhật giá trị ô nhập liệu khi trang đầu tiên được tải
    $("#min-price").val($("#slider-range").slider("values", 0).toLocaleString() + "đ");
    $("#max-price").val($("#slider-range").slider("values", 1).toLocaleString() + "đ");
  });