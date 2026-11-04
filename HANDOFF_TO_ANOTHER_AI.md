# HANDOFF — Một Đời Người — Life Simulation

## Cập nhật mới nhất — 2026-11-04

### Visual Upgrade
- src/web3d_v5.js: reusable UV sphere mesh and ellipsoid-based detailed humanoid construction for Minh, Linh and background NPCs; facial features, hair, clothing layers, arms/hands, legs/shoes.
- Environment pass: more detailed building façades, windows, doors/signs, sidewalks, crosswalks, lamps, park paths/benches/flower beds, fuller trees and vehicles.
- Procedural stylized geometry is an improved prototype art pass, not production GLB characters or skeletal animation. Exact matching to earlier visual references still needs a direct side-by-side review.
- web.html cache token 20261104-5; Web smoke test and Pages deploy PASS; Godot validation and Windows playable build PASS.
- Test: https://drak-318.github.io/M-t-i-Ng-i-Life-Simulation/web.html?v=20261104-5.


- Character System Web v5 đã được tách thành `src/character-system.js` và tích hợp vào `src/web3d_v5.js`.
- Có Linh + 12 NPC nền, profile cá nhân, lịch sống, mood/needs, relationship nhiều lớp, memory và save/load.
- Unit test Character System PASS; Web 3D smoke test PASS; Godot Validation PASS; Playable Build PASS; GitHub Pages deployment PASS.
- Bản Web để người dùng test: https://drak-318.github.io/M-t-i-Ng-i-Life-Simulation/.
- Model hiện tại vẫn là procedural stylized placeholder, chưa phải model production/rig.



## 3D asset pipeline foundation — 2026-11-04

A repository audit found the active Web v5 renderer is hand-written WebGL, not Three.js. The production preview still draws procedural geometry. A separate Three.js asset lab and GLB loader foundation have now been added:
- docs/ART_PIPELINE.md
- assets/characters/manifest.json
- src/three-character-pipeline.mjs
- art-pipeline-test.html
- assets/dev-fixtures/README.md and CC0 license record
- tests/asset-pipeline.test.mjs
- GitHub Pages workflow downloads a pinned GLB test fixture into the deployment artifact and checks its glTF 2.0 header.

The lab fixture is a Quaternius superhero male rig used only for technical validation. It is not Minh, Linh, or an approved character design. Minh and Linh remain unassigned in the manifest. Do not claim the production game has migrated to Three.js until the world adapter and browser visual tests are complete.

Next technical gates:
1. Verify the deployed asset lab renders the GLB and reports a valid skeleton.
2. Obtain/approve suitable ordinary contemporary adult character models for Minh and Linh, with documented license and matching humanoid rigs.
3. Validate idle/walk/run animation clips and foot contact.
4. Migrate the active renderer in stages while preserving CharacterSystem, time, story, relationships, save/load and NPC schedules.
5. Add environment GLB/PBR assets and collision proxies.
6. Add browser screenshot/visual regression coverage before declaring the art milestone complete.

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


## Milestone handoff — 2026-11-04

Stage 1 (reusable 3D asset foundation) is implementation-complete: Three.js adapter, GLTFLoader, isolated lab, pinned GLB fixture and CI validation are committed. This is not a claim of manual browser visual approval or production renderer migration.

Stage 2 is now active: source ordinary adult male/female models, verify CC0 provenance, prepare everyday clothing/hair/materials, validate skeleton and animation compatibility, and visually inspect both before assigning them to Minh/Linh. Quaternius Universal Base Characters and Universal Animation Library are candidate CC0 sources. Do not ship naked/base-only meshes or use the superhero fixture as a production character.


### Stage 2 implementation update

- Added `character-candidates-test.html` to review two everyday Quaternius pedestrian candidates side-by-side.
- Pages workflow downloads the candidate GLBs from pinned source revision `5716dcc99c3f00391ea67d8ca080529d195d2889` and validates glTF 2.0 container, visible mesh and humanoid skeleton joint count.
- Candidate provenance is recorded in `assets/characters/manifest.json`; production Minh/Linh manifest asset fields remain null.
- Next: wait for CI/deployment, inspect actual browser render, verify motion clips, then decide whether to customize/retarget or reject either candidate. Do not migrate to production renderer until both visuals and movement pass.


## Staged Three.js gameplay integration — 2026-11-04

- Runtime exports `window.__lifeVisualBridge.getSnapshot()` with read-only main actor positions, yaw, walk state and view-projection matrix.
- `src/three-character-overlay.mjs` loads the two candidate GLBs and syncs imported actors to the game.
- `web.html?threeCharacters=1` enables the opt-in overlay. Default page still uses the legacy renderer.
- Playwright test `tests/game-three-overlay-browser.mjs` verifies both actors attach to the game and captures a screenshot; workflow runs this after candidate asset downloads.
- Next: inspect screenshots/CI, tune forward axis and scale, confirm idle/walk timing and collision/ground contact. Only after visual acceptance should the imported models become default. Do not alter CharacterSystem/save schema for renderer work.


### Candidate quality findings

Do not promote the current two pedestrian models to final character art: Man is 1,852 tris/6 material slots/no textures; Woman Casual is 2,776 tris/8 slots/no textures. Both have 31 joints and 11 clips and are useful only for validating the rig/animation/gameplay bridge. Seek better detailed textured everyday-human assets or schedule a custom art pass; keep manifest production asset fields null.
