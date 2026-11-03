# PROJECT STATUS — Một Đời Người

Cập nhật: 2026-11-03

## 1. Mục tiêu dự án

Game mô phỏng cuộc sống 3D của một người trưởng thành bình thường tại TP.HCM.

Người chơi là Nguyễn Minh, 24 tuổi. Thế giới, NPC và các mối quan hệ có quyền tự vận động. Không thiết kế theo kiểu chọn đúng = thắng.

## 2. Đã triển khai

### Repository / nền tảng
- Godot 4.x project.
- Main scene.
- Input WASD + E.
- README và layout MVP.

### 3D vertical slice
- Ground có collision.
- Đường phố MVP.
- HOME.
- OFFICE.
- CAFE.
- STORE.
- RESTAURANT.
- PARK.
- PARKING.
- Player Nguyễn Minh.
- Third-person camera.
- Player collision + gravity.
- 4 NPC nền có chuyển động tự do đơn giản.
- Location Area nhận biết khi Player đi vào khu vực.

### Life Simulation foundation
- TimeSystem: ngày/giờ/phút, bắt đầu Chủ nhật 07:42.
- StateManager: energy, money, stress, confidence, social_energy, work_pressure.
- MemoryManager: memory có source, game_minute, emotional_weight, tags và trạng thái triggerable.
- RelationshipManager: affection, trust, understanding, closeness, respect, hurt, irritation, compatibility, willingness_to_continue.
- Main đã kết nối các hệ thống này.

## 3. Chưa coi là hoàn thành

- Chưa playtest runtime bằng Godot trong môi trường phát triển hiện tại.
- Đồ họa 3D vẫn là placeholder primitive.
- Chưa có model nhân vật cuối cùng.
- Chưa có xe cộ thực.
- Chưa có hệ thống lịch NPC theo ngày/giờ.
- Chưa có nhân vật nữ chính trong runtime.
- Chưa có Story/Event Selector hoàn chỉnh.
- Chưa có dialogue/choice UI.
- Chưa có save/load.
- Chưa có 20–30 scenes MVP.
- Chưa có 5–8 ending states.

## 4. Thứ tự triển khai tiếp theo

1. Runtime validation và sửa lỗi.
2. NPC schedule + daily routine.
3. Character data model.
4. Nhân vật nữ chính và đời sống riêng.
5. Event/Scene Selector.
6. Dialogue + choices.
7. Relationship reaction.
8. Memory-triggered delayed consequences.
9. Save/load.
10. 20–30 MVP scenes + 5–8 ending states.
11. Sau đó mới nâng cấp art, vehicles, audio, weather và thành phố.

## 5. Quy tắc bàn giao

GitHub repository là nguồn kỹ thuật hiện tại. Project/Kho lưu trữ là nguồn thiết kế. Khi tiếp tục, AI mới phải đọc file này và các file thiết kế trước khi thay đổi kiến trúc.

Không được coi placeholder là sản phẩm cuối.
