# HANDOFF — Một Đời Người — Life Simulation

## Cập nhật mới nhất — 2026-11-04

- Character System Web v5 đã được tách thành `src/character-system.js` và tích hợp vào `src/web3d_v5.js`.
- Có Linh + 12 NPC nền, profile cá nhân, lịch sống, mood/needs, relationship nhiều lớp, memory và save/load.
- Unit test Character System PASS; Web 3D smoke test PASS; Godot Validation PASS; Playable Build PASS; GitHub Pages deployment PASS.
- Bản Web để người dùng test: https://drak-318.github.io/M-t-i-Ng-i-Life-Simulation/.
- Model hiện tại vẫn là procedural stylized placeholder, chưa phải model production/rig.



## Trạng thái hiện tại

MVP gameplay vertical slice đã hoàn thành về mặt hệ thống và đã được GitHub Actions kiểm tra bằng Godot 4.3 headless:
- project parse: PASS
- game boot: PASS
- scene-based gameplay logic smoke test: PASS

## Nếu AI hiện tại hết credit hoặc phải chuyển sang AI khác

### Bước 1 — Mở repository

Repository:
Drak-318/M-t-i-Ng-i-Life-Simulation

Branch chính:
main

### Bước 2 — Đọc theo thứ tự

1. `PROJECT_STATUS.md` — trạng thái mới nhất.
2. `README.md` — mục tiêu và nguyên tắc.
3. `world/NeighborhoodLayout.md` — cấu trúc khu phố MVP.
4. `scripts/*.gd` — hệ thống runtime hiện tại.
5. `tests/LogicSmoke.gd` và `tests/LogicSmoke.tscn` — smoke test gameplay.
6. Tài liệu thiết kế trong Project/Kho:
   - GAME_DESIGN.md
   - STORY_RULES.md
   - WORLD_SYSTEM.md
   - CHARACTER_SYSTEM.md
   - ROADMAP.md

### Bước 3 — Nguyên tắc không được phá

- Đây là life simulation, không phải dating simulator.
- Người chơi là người bình thường.
- NPC có cuộc sống riêng.
- Không có lựa chọn đúng tuyệt đối.
- State, memory, relationship và delayed consequence là nền tảng.
- Không biến relationship thành một thanh love duy nhất.
- Không xây game theo cây lựa chọn tuyến tính.
- Ưu tiên gameplay và simulation trước cosmetic.
- Không thay đổi concept Nguyễn Minh hoặc concept nữ chính đã chốt nếu người dùng chưa yêu cầu.

### Bước 4 — Không làm lại từ đầu

Không tạo repository mới.
Không xóa code hiện tại chỉ vì code còn đơn giản.
Tiếp tục từ `PROJECT_STATUS.md` và Git history.

### Bước 5 — Việc tiếp theo

1. Playtest thủ công bản Web tại https://drak-318.github.io/M-t-i-Ng-i-Life-Simulation/.
2. Sửa lỗi UX/logic từ playtest thực tế.
3. Nâng cấp model/animation nhân vật.
4. Nâng cấp traffic/vehicles, audio và weather effects.
5. Mở rộng work/money/family/friends/hobbies/social media.
6. Mở rộng NPC-NPC simulation.
7. Replayability, hidden consequences và nhiều tuần sống.
8. Sau khi gameplay ổn định mới làm mobile/cloud/expansion.

### Bước 6 — Cách làm việc với người dùng

Người dùng không phải IT. AI phải tự triển khai phần kỹ thuật và để người dùng làm hậu kiểm.

Khi báo cáo một mốc lớn, nói rõ:
- Đã làm gì.
- Sản phẩm nào đã có.
- Cái gì chưa làm.
- Cái gì đã được runtime/CI kiểm tra.

Không nói "hoàn thành" nếu phần tương ứng chưa được kiểm tra.
