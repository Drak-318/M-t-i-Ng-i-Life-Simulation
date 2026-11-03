# HANDOFF — Một Đời Người — Life Simulation

## Nếu AI hiện tại hết credit hoặc phải chuyển sang AI khác

### Bước 1 — Mở repository

Repository:
Drak-318/M-t-i-Ng-i-Life-Simulation

Branch chính:
main

### Bước 2 — Đọc theo thứ tự

1. `PROJECT_STATUS.md` — biết game đã làm tới đâu.
2. `README.md` — mục tiêu và nguyên tắc tổng quát.
3. `world/NeighborhoodLayout.md` — cấu trúc khu phố MVP.
4. Các file `scripts/*.gd` — hệ thống runtime hiện tại.
5. Các tài liệu thiết kế trong Project/Kho lưu trữ của dự án:
   - GAME_DESIGN.md
   - STORY_RULES.md
   - WORLD_SYSTEM.md
   - CHARACTER_SYSTEM.md
   - ROADMAP.md

### Bước 3 — Hiểu nguyên tắc quan trọng

- Đây là life simulation, không phải dating simulator.
- Người chơi là người bình thường.
- NPC có cuộc sống riêng.
- Không có lựa chọn đúng tuyệt đối.
- State, memory, relationship và delayed consequence là nền tảng.
- Không được biến relationship thành một thanh love duy nhất.
- Không được xây game theo cây lựa chọn tuyến tính.
- Ưu tiên gameplay và simulation trước cosmetic.

### Bước 4 — Không làm lại từ đầu

Không tạo repository mới.
Không xóa code hiện tại chỉ vì code còn đơn giản.
Không thay đổi concept Nguyễn Minh hoặc concept nhân vật nữ chính đã được chốt nếu người dùng chưa yêu cầu.

Hãy tiếp tục từ `PROJECT_STATUS.md` và Git history.

### Bước 5 — Việc tiếp theo

Ưu tiên:
1. kiểm tra runtime Godot;
2. sửa lỗi thực tế;
3. NPC schedule;
4. character simulation;
5. nữ chính có đời sống riêng;
6. event/scene selector;
7. dialogue/choices;
8. relationship + memory reaction;
9. save/load;
10. MVP content.

### Bước 6 — Cách làm việc với người dùng

Người dùng không phải IT. AI nên tự triển khai phần kỹ thuật, chỉ yêu cầu người dùng hậu kiểm những thứ cần chạy thực tế.

Sau mỗi mốc lớn phải báo rõ:
- Đã làm gì.
- Đã có sản phẩm gì.
- Cái gì chưa làm.
- Cái gì chưa thể kiểm tra runtime.

Không nói "đã hoàn thành" nếu mới chỉ tạo code mà chưa kiểm tra được phần tương ứng.
