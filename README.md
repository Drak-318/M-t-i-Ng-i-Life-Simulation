# Một Đời Người — Life Simulation

Game mô phỏng cuộc sống 3D trên **Web**, với cốt truyện phân nhánh và thế giới có trạng thái.

## Bản Web để chơi thử

**[Mở Một Đời Người — Web 3D](https://drak-318.github.io/M-t-i-Ng-i-Life-Simulation/)**

- WASD: di chuyển; kéo chuột: xoay camera; cuộn chuột: zoom.
- E: tương tác; N hoặc nút `+1 giờ`: tua thời gian.
- P: lưu; L: tải; R: bắt đầu lại.
- Bản hiện tại có Character System cho Linh và 12 NPC nền. Ngoại hình vẫn là procedural stylized placeholder.

## Bản Web để chơi thử

**[Mở Một Đời Người — Web 3D](https://drak-318.github.io/M-t-i-Ng-i-Life-Simulation/web.html?v=20261104-9)**

Bản thử nghiệm hiện tại dùng hình thể người 3D procedural cách điệu, có khuôn mặt, tóc, trang phục và chuyển động cơ bản. Đây vẫn là prototype đồ họa, chưa phải model nhân vật sản xuất cuối cùng.

## 3D Asset Lab — nền tảng nhân vật

**[Mở phòng kiểm tra model 3D](https://drak-318.github.io/M-t-i-Ng-i-Life-Simulation/art-pipeline-test.html)**

**[Mở phòng đánh giá Minh và Linh candidate](https://drak-318.github.io/M-t-i-Ng-i-Life-Simulation/character-candidates-test.html)**

Asset Lab là khu vực kỹ thuật tách biệt để kiểm tra GLB, humanoid skeleton, tỷ lệ model và animation. Model trong phòng lab là fixture kỹ thuật CC0, không phải Minh hoặc Linh. Nhân vật chính chỉ được gán model sau khi có asset phù hợp và vượt qua kiểm thử.

Tài liệu kỹ thuật: docs/ART_PIPELINE.md. Danh sách model chính thức: assets/characters/manifest.json.

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
- Dòng tiền cơ bản, thời tiết theo ngày, giao thông nền và ánh sáng ngày/đêm

Nhân vật người chơi: **Nguyễn Minh, 24 tuổi**, nhân viên văn phòng, sống tại TP.HCM.

## Công nghệ hiện tại

- **Web 3D hiện tại:** custom WebGL renderer (prototype, đang được thay thế theo từng giai đoạn)
- **Three.js + GLTFLoader:** asset lab độc lập để kiểm thử GLB, skeleton và animation; chưa thay thế renderer chính
- **HTML/CSS/JavaScript:** giao diện và gameplay runtime hiện tại
- **GitHub:** quản lý mã nguồn
- **GitHub Pages:** preview/deployment Web

Prototype Godot trước đây được giữ trong lịch sử Git như một bước thử nghiệm kỹ thuật, nhưng **hướng phát triển chính từ đây là Web**.

## Quy trình phát triển Web

1. Sửa code trên repository.
2. GitHub tự động triển khai bản Web mới.
3. Mở trình duyệt để test, không cần tải `.exe`.
4. Ghi nhận lỗi/feedback.
5. Sửa hệ thống.
6. Lặp lại cho đến khi vertical slice ổn định.

> Mục tiêu của quy trình là biến việc test thành: **sửa → refresh → test**.

## Web vertical slice hiện tại

Prototype Web đầu tiên đã có:

- Khu phố 3D procedural.
- Nguyễn Minh và camera góc nhìn thứ ba.
- WASD để di chuyển.
- Kéo chuột để xoay camera.
- Nhà, văn phòng, quán cà phê, công viên, cửa hàng, nhà hàng.
- NPC nền có chuyển động độc lập.
- Hệ thống thời gian bắt đầu từ Chủ nhật 07:42.
- HUD vị trí, thời gian và tiền.
- Tương tác bằng E.
- Khung state/memory cơ bản để tiếp tục mở rộng thành game loop hoàn chỉnh.

## Phát triển tiếp theo

Ưu tiên theo thứ tự:

1. Web runtime ổn định và responsive.
2. State/Memory/Relationship hoàn chỉnh.
3. NPC schedule và NPC agency.
4. Nhân vật nữ chính với lịch sống riêng.
5. Story/Event Engine.
6. Dialogue + choices.
7. Delayed consequences.
8. Save/load bằng local storage rồi mở rộng kiến trúc dữ liệu.
9. 20–30 scene MVP và 5–8 trạng thái kết thúc.
10. Art, animation, vehicles, audio, weather và city polish.

> Người chơi không phải trung tâm duy nhất của thế giới. Thế giới vẫn tiếp tục sống khi người chơi không nhìn thấy nó.
