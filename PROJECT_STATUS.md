# PROJECT STATUS — Một Đời Người

Cập nhật: 2026-11-03

## 1. Trạng thái hiện tại

**MVP gameplay vertical slice: HOÀN THÀNH VỀ MẶT HỆ THỐNG.**

Repository đã có một vòng chơi 1 tuần có thể chạy: người chơi điều khiển Nguyễn Minh trong khu phố 3D, thời gian tự trôi, NPC quan trọng có lịch riêng, sự kiện xuất hiện theo bối cảnh, người chơi lựa chọn, state/memory/relationship thay đổi, hậu quả có thể trì hoãn, có save/load và có nhiều trạng thái kết thúc.

CI đã chạy Godot 4.3 headless thành công cho project parse và boot.

## 2. Đã triển khai

### 3D vertical slice
- Ground + collision.
- Đường phố MVP.
- HOME, OFFICE, CAFE, STORE, RESTAURANT, PARK, PARKING.
- Nguyễn Minh 24 tuổi.
- Third-person camera.
- WASD movement, gravity, collision.
- 4 NPC nền có chuyển động.
- Location detection.
- Một NPC quan trọng có lịch sống riêng và di chuyển theo ngày/giờ.
- Nhân vật nữ MVP tên Linh: 24 tuổi, nhân viên thiết kế nội dung, có profile, nhu cầu, ranh giới, mục tiêu và lịch riêng.

### Life simulation
- TimeSystem: ngày/giờ/phút, bắt đầu Chủ Nhật 07:42.
- Có thể pause thời gian khi đang lựa chọn.
- StateManager: energy, money, stress, confidence, social_energy, work_pressure.
- MemoryManager: memory, source, game_minute, emotional_weight, tags, triggerable.
- RelationshipManager: affection, trust, understanding, closeness, respect, hurt, irritation, compatibility, willingness_to_continue.
- CharacterProfile: personality, needs, boundaries, communication style, goals, mood, energy, workload, family pressure, social energy.

### Story engine
- EventSystem chọn scene theo location + giờ + memory + relationship + state conditions.
- 25 scene MVP.
- Choice system.
- State effects.
- Relationship effects.
- Memory creation.
- Delayed consequence system.
- Có scene bị khóa/mở dựa trên lịch sử trước đó.

### UX
- Dialogue panel.
- Choice buttons.
- System narration.
- Clock/location/state HUD.
- Save: P.
- Load: L.

### Endings
- EndingSystem với 6 trạng thái kết thúc khác nhau, không dùng Good/Bad Ending.
- Kết thúc được quyết định từ relationship + state + memory.

### Validation
- GitHub Actions cài Godot 4.3.
- Headless editor parse: PASS.
- Headless game boot: PASS.

## 3. Những gì CHƯA phải sản phẩm cuối

- Model 3D nhân vật cuối cùng chưa có; hiện vẫn dùng primitive placeholder.
- Chưa có animation nhân vật chất lượng cao.
- Chưa có xe cộ giao thông thực.
- Chưa có audio/music/SFX hoàn chỉnh.
- Chưa có weather system hoàn chỉnh.
- Chưa có art direction/city assets chất lượng production.
- Chưa có hệ thống công việc/tài chính/gia đình/mạng xã hội ở độ sâu production.
- Chưa có nhiều thành phố, nghề nghiệp hoặc nhiều nhân vật quan trọng.
- Chưa có mobile build.

Đây là phạm vi **MVP**, không phải bản commercial production hoàn chỉnh.

## 4. Thứ tự phát triển sau MVP

1. Playtest thủ công trên máy có Godot.
2. Sửa lỗi UX/logic sau playtest.
3. Nâng cấp character art + animation.
4. Xe cộ, traffic, audio, weather, day/night lighting.
5. Mở rộng life systems: work, money, family, friends, hobbies, social media.
6. Mở rộng character simulation và quan hệ giữa NPC.
7. Tăng replayability và hidden consequences.
8. Sau khi gameplay ổn định mới cân nhắc mobile/cloud/expansion.

## 5. Quy tắc bàn giao

GitHub repository là nguồn kỹ thuật hiện tại. Project/Kho là nguồn thiết kế. AI tiếp theo phải đọc file này, README, HANDOFF_TO_ANOTHER_AI.md và các tài liệu thiết kế trước khi thay đổi kiến trúc.

Không được coi placeholder là sản phẩm cuối.
