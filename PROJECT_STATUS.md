# PROJECT STATUS — Một Đời Người

Cập nhật: 2026-11-04

## 1. Trạng thái hiện tại

**MVP gameplay vertical slice: HOÀN THÀNH VỀ MẶT HỆ THỐNG.**

Repository có một vòng chơi 1 tuần: Nguyễn Minh sống trong khu phố 3D, thời gian tự trôi, NPC quan trọng có lịch riêng, sự kiện xuất hiện theo bối cảnh, người chơi lựa chọn, state/memory/relationship thay đổi, hậu quả có thể trì hoãn, có save/load và nhiều trạng thái kết thúc.

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
- NPC quan trọng có lịch sống riêng và di chuyển theo ngày/giờ.
- Linh: 24 tuổi, nhân viên thiết kế nội dung, có profile, nhu cầu, ranh giới, mục tiêu và lịch riêng.
- Traffic nền.
- Chu kỳ ánh sáng ngày/đêm.

### Visual Upgrade — Character & Neighborhood (2026-11-04)
- WebGL renderer now creates reusable UV-sphere geometry and uses ellipsoid meshes for heads, faces, hair masses, necks, torsos, arms, hands, legs and shoes; Minh and Linh have distinct clothing/hair palettes and facial details.
- Neighborhood pass adds façade/window/door/sign details, sidewalk paving, crosswalks, street lamps, richer tree canopies, park paths, benches, flower beds and more detailed vehicles.
- This is a procedural stylized 3D art pass, not final sculpted GLB assets or production skeletal animation. Exact visual matching to the earlier two image references still needs a direct side-by-side review.
- web.html cache version: 20261104-5.
- JavaScript syntax check: PASS; Web 3D smoke test: PASS; GitHub Pages deployment: PASS; Godot Validation: PASS; Windows Playable Build: PASS.
- Test URL: https://drak-318.github.io/M-t-i-Ng-i-Life-Simulation/web.html?v=20261104-5.
### Character System — Web v5 (2026-11-04)
- `src/character-system.js` quản lý hồ sơ dữ liệu độc lập cho Linh và 12 NPC nền.
- Hồ sơ gồm tuổi (đều là người trưởng thành), nghề nghiệp, tính cách, nhu cầu, ranh giới, cách giao tiếp, sở thích ẩn, mục tiêu, lịch sinh hoạt và ngoại hình.
- Trạng thái sống: mood, energy, workload, family pressure, social energy, emotional availability và hoạt động hiện tại.
- NPC di chuyển theo lịch cá nhân; trạng thái mệt mỏi/áp lực ảnh hưởng nhịp di chuyển và cách trò chuyện.
- Tương tác tạo phản ứng theo cảm xúc và ký ức; relationship lưu riêng theo từng nhân vật với nhiều lớp.
- Save/load lưu thêm trạng thái tâm lý, relationship và memories của từng nhân vật.
- Ngoại hình Web v5 hiện là procedural stylized model với bảng màu/trang phục/tóc khác nhau; chưa phải model 3D production hoặc skeletal rig.

### Life simulation
- TimeSystem: ngày/giờ/phút, bắt đầu Chủ Nhật 07:42.
- Pause khi người chơi đang lựa chọn.
- StateManager: energy, money, stress, confidence, social_energy, work_pressure.
- LifeSystems: chi phí sinh hoạt, dòng tiền, áp lực công việc cơ bản.
- WeatherSystem: thời tiết theo ngày và nhiệt độ.
- MemoryManager: memory, source, game_minute, emotional_weight, tags, triggerable.
- RelationshipManager: affection, trust, understanding, closeness, respect, hurt, irritation, compatibility, willingness_to_continue.
- CharacterProfile: personality, needs, boundaries, communication style, goals, mood, energy, workload, family pressure, social energy.

### Story engine
- EventSystem chọn scene theo location + giờ + memory + relationship + điều kiện state.
- 25 scene MVP.
- Choice system.
- State effects.
- Relationship effects.
- Memory creation.
- Delayed consequence system.
- Scene có thể mở/khóa theo lịch sử.

### UX / persistence
- Dialogue panel.
- Choice buttons.
- System narration.
- Clock/location/weather/state HUD.
- Save: P.
- Load: L.
- Save chứa time, state, memories, relationships, story progress, weather và vị trí người chơi.

### Endings
- EndingSystem với 6 trạng thái kết thúc khác nhau, không dùng Good/Bad Ending.
- Kết thúc dựa trên relationship + state + memory.

### Validation
- GitHub Actions kiểm tra Web v5 runtime thực tế, Character System syntax và unit tests: PASS (2026-11-04).
- Character System unit tests: profile, schedule, mood, interaction, relationship, memory, save/restore: PASS.
- GitHub Pages deployment: PASS; bản thử nghiệm: https://drak-318.github.io/M-t-i-Ng-i-Life-Simulation/.
- GitHub Actions cài Godot 4.3.
- Headless editor parse: PASS.
- Headless game boot: PASS.
- Scene-based gameplay logic smoke test: PASS.

## 2A. 3D Art Pipeline Foundation — 2026-11-04

Audit confirmed that the active Web v5 renderer is custom WebGL, not Three.js. It renders procedural boxes/ellipsoids and does not load external character GLB files. The README's previous Three.js description was inaccurate and has been corrected.

Foundation added:
- assets/characters/manifest.json: production character contract; Minh and Linh intentionally remain unassigned.
- src/three-character-pipeline.mjs: Three.js GLTFLoader wrapper, skinned-mesh/skeleton inspection, scale/ground normalization, AnimationMixer and motion cross-fade interface.
- art-pipeline-test.html: isolated Three.js GLB lab, separate from the live gameplay renderer.
- docs/ART_PIPELINE.md: character art direction, asset requirements, environment pipeline and acceptance gates.
- assets/dev-fixtures: CC0 fixture provenance and license record.
- GitHub Pages workflow downloads a pinned development-only GLB fixture and validates its glTF 2.0 header before deployment.

Important limitation:
- The GLB fixture is a superhero male model used only to prove the loader/rig pipeline. It is not Minh, Linh or an approved art direction.
- The asset lab is not yet a migration of the production renderer.
- Production GLB files for Minh/Linh, their final outfits/hair, full animation clips, environment kit and browser visual regression remain outstanding.
- The new loader is syntax-checked and has static/binary fixture tests; actual browser rendering still requires visual verification.

## 2B. Milestone ledger — 2026-11-04

- **Stage 1 — Reusable 3D asset foundation: implementation complete.** Three.js adapter, GLTFLoader wrapper, isolated asset lab, pinned technical GLB fixture and CI validation are committed. Latest recorded validation: Web 3D smoke test + asset pipeline tests + GitHub Pages deployment PASS.
- Stage 1 is limited to the technical foundation. Manual visual review is still pending; production Minh/Linh assets have not been assigned; the active gameplay renderer is still custom WebGL.
- **Stage 2 — Production character assets: in progress.** Two clothed Quaternius pedestrian candidates (Man and Woman Casual) are now fetched from a pinned source revision into the Pages artifact. Their source credit ledger identifies them as CC0 1.0. CI now checks the GLB container, visible mesh and humanoid skeleton; an isolated review page loads both with the Three.js pipeline. They remain candidates only: visual inspection, animation compatibility and fit with Minh/Linh's identity are not yet approved. The superhero GLB remains test-only.

## 3. Những gì CHƯA phải sản phẩm cuối

- Model 3D nhân vật production, facial rig và skeletal animation; hiện dùng procedural stylized primitives với màu sắc/tóc/trang phục phân biệt.
- Animation nhân vật chất lượng production.
- Xe cộ/traffic chưa có va chạm và luật giao thông gameplay.
- Audio/music/SFX.
- Weather mới ở mức gameplay/state, chưa có hiệu ứng mưa 3D.
- Art direction/city assets chất lượng production.
- Work/money/family/friends/hobbies/social media chưa ở độ sâu production.
- Nhiều thành phố, nghề nghiệp và nhiều nhân vật quan trọng.
- Mobile build.

Đây là phạm vi **MVP hoàn chỉnh về gameplay**, chưa phải bản commercial production cuối.

## 4. Giai đoạn tiếp theo

1. Playtest thủ công bản Web v5 trên trình duyệt: https://drak-318.github.io/M-t-i-Ng-i-Life-Simulation/.
2. Ghi nhận và sửa lỗi UX/logic; cân bằng phản ứng của từng nhân vật.
3. Nâng cấp character art bằng model 3D, rig và animation chuyên dụng.
4. Hoàn thiện xe cộ/traffic gameplay, audio và hiệu ứng thời tiết.
5. Mở rộng work/money/family/friends/hobbies/social media.
6. Mở rộng mô phỏng quan hệ NPC-NPC và các quyết định độc lập.
7. Replayability, hidden consequences và nhiều tuần sống.
8. Sau khi gameplay ổn định mới cân nhắc mobile/cloud/expansion.

## 5. Quy tắc bàn giao

GitHub repository là nguồn kỹ thuật hiện tại. Project/Kho là nguồn thiết kế. AI tiếp theo phải đọc file này, README, HANDOFF_TO_ANOTHER_AI.md và các tài liệu thiết kế trước khi thay đổi kiến trúc.

Không được coi placeholder là sản phẩm cuối.
