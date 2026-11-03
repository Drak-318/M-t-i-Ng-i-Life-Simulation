# Một Đời Người — Life Simulation

Game mô phỏng cuộc sống 3D với cốt truyện phân nhánh.

## Mục tiêu

Tạo một thế giới hiện đại nơi người chơi là một người trưởng thành bình thường. Người chơi lựa chọn dựa trên những gì mình biết ở thời điểm đó; thế giới, NPC và các mối quan hệ phản ứng theo thời gian.

## Nguyên tắc cốt lõi

- Không có lựa chọn đúng tuyệt đối.
- NPC có cuộc sống và quyết định riêng.
- Hậu quả có thể xuất hiện rất lâu sau lựa chọn ban đầu.
- Quan hệ có nhiều lớp: thiện cảm, tin tưởng, thấu hiểu, tổn thương, tương thích...
- Mục tiêu là tạo cảm giác một cuộc đời đang diễn ra, không phải một cây lựa chọn tuyến tính.

## MVP đầu tiên

Một khu phố nhỏ tại TP.HCM gồm:

- Nhà/căn hộ của Nguyễn Minh
- Văn phòng
- Quán cà phê
- Công viên
- Cửa hàng tiện lợi
- Nhà hàng
- Đường phố và bãi đỗ xe
- NPC nền và một NPC quan trọng có lịch sống riêng
- Chu kỳ thời gian ngày/tuần
- Story/Event Engine, dialogue, choices, memories, relationships
- Save/load và các trạng thái kết thúc của tuần đầu tiên

Nhân vật người chơi: **Nguyễn Minh, 24 tuổi**, nhân viên văn phòng, sống tại TP.HCM.

## Công nghệ

Engine: **Godot 4.x**.

Repository này là nơi lưu mã nguồn game. Các tài liệu thiết kế chi tiết được quản lý trong Project/Kho lưu trữ của dự án và được chuyển thành hệ thống/code theo từng giai đoạn.

## Quy trình phát triển

1. Dựng vertical slice có thể chơi.
2. Kiểm tra hệ thống nền tảng.
3. Thêm NPC và lịch sinh hoạt.
4. Thêm state/memory/relationship.
5. Thêm Story/Event Engine, dialogue, save/load và hậu quả trì hoãn.
6. Playtest thực tế và sửa các điểm thiếu tự nhiên.
7. Mở rộng art, audio, vehicles, weather và các life systems sau khi MVP ổn định.

> Người chơi không phải trung tâm duy nhất của thế giới. Thế giới vẫn tiếp tục sống khi người chơi không nhìn thấy nó.

CI của repository tự động chạy Godot headless để kiểm tra project có thể parse và boot hay không.
