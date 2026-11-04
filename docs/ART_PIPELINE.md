# 3D Art & Asset Pipeline — Một Đời Người

## Audit finding

The active browser game is not currently using Three.js, despite the README saying so. The active src/web3d_v5.js is a hand-written WebGL renderer built from boxes and ellipsoids. The repository had no production GLB character files, no GLTFLoader, no imported humanoid skeleton, no skeletal-animation mixer, no asset manifest, and no visual render test.

The gameplay systems are more mature than the visual layer. They must be preserved while the renderer is upgraded.

## Technical direction

- Web remains the primary playable target.
- Use Three.js for the Web 3D renderer and glTF 2.0 / GLB for characters and environment assets.
- Keep simulation state (time, needs, schedules, memories, relationships, events) independent from visual objects.
- CharacterSystem owns identity and life state. A visual actor owns mesh, skeleton, materials and animation.
- A missing/invalid model must show a diagnostic. Do not silently substitute ellipsoids and claim the character is complete.
- Store production assets locally in the repository or the deployed build. Do not hotlink production character models.

## Required foundations

| Area | Audit state | Foundation now required |
|---|---|---|
| Renderer | Custom WebGL only | Pinned Three.js runtime and staged migration |
| Model loading | No glTF loader | GLTFLoader module |
| Character assets | No production GLB files | Asset manifest and provenance ledger |
| Rigging | No imported humanoid rig | Validate SkinnedMesh, Skeleton and bone count |
| Animation | Procedural movement only | AnimationMixer, clip discovery and cross-fades |
| Scale/orientation | No import contract | Normalize height, ground pivot and forward axis |
| Materials | Flat primitive colors | glTF PBR materials and texture handling |
| Environment | Primitive blockout | Modular buildings, street props, vegetation and collision proxies |
| Licensing | No complete asset ledger | Record author, source, license and modifications |
| QA | Source-string smoke tests only | Browser load/render checks and screenshot review |

## Character art target

### Minh
- Vietnamese adult man, 24; ordinary office employee.
- Contemporary, understated everyday clothes suitable for a warm city.
- Natural human proportions, readable face, hair silhouette, hands and shoes.
- Idle, walk and run first; later add sitting, phone use, conversation and work gestures.

### Linh
- Vietnamese adult woman, 24; content designer with an independent daily routine.
- Contemporary everyday clothes and a distinct silhouette/hair style without exaggerated proportions.
- Prefer the same humanoid skeleton contract as Minh so animation clips can be reused.
- Idle, walk and run first; later add sitting, phone use, conversation and work gestures.

### Background NPCs
- Reuse a small number of optimized base rigs with variations in hair, clothing, materials and proportions.
- Do not create twelve unique high-cost rigs before Minh and Linh are approved.
- NPC identity and schedule remain in CharacterSystem; visual variations are data-driven.

## Character asset contract

Every production character must:
1. Be GLB/glTF 2.0 and load locally from the project.
2. Contain at least one SkinnedMesh and a valid humanoid Skeleton.
3. Document forward axis, ground origin, target height and reference pose.
4. Include named clips: idle and walk minimum; run strongly preferred.
5. Use PBR materials with embedded textures or files stored beside the model.
6. Be optimized for WebGL and have a source/license record.
7. Pass browser loading, skeleton, animation and screenshot checks.

A filename alone does not make a model compatible. Bone names, bind pose, axes, root motion and animation tracks must be checked.

## Environment pipeline

- Build a coherent neighborhood kit: apartment/home, office frontage, café, convenience store, restaurant, park, sidewalks, street furniture, vehicles and vegetation.
- Buildings need readable entrances, windows, signage and façade details; avoid single untextured boxes.
- Keep collision proxies separate from detailed visual meshes.
- Use PBR materials, warm daylight, contact shadows and consistent real-world scale.
- Use instancing or pooling for repeated trees, lamps, chairs and background NPCs.
- Keep collision and navigation independent of render meshes.

## Integration order

1. Make the isolated GLB asset lab load and inspect a real rigged model.
2. Validate normalization, materials, skeleton and animation playback.
3. Build a Three.js world adapter while keeping simulation state untouched.
4. Replace Minh first; prove idle/walk/run transitions and movement alignment.
5. Replace Linh with the same rig contract and her own visual identity.
6. Replace background NPCs using pooled actors.
7. Replace environment props in small batches.
8. Remove the old ellipsoid character renderer only after visual and gameplay acceptance.

## Acceptance gates

- No red console errors on cold load or refresh.
- Asset lab displays a real skinned 3D mesh.
- Imported model scale and ground contact are stable.
- Skeleton and clips are detected and reported.
- Idle/walk transitions work without sliding or snapping.
- Main game still saves/loads and preserves time, story, relationship and NPC schedule systems.
- A screenshot at normal desktop resolution is reviewed before calling a visual milestone complete.

## Development fixture limitation

The Quaternius model used in the asset lab is a CC0 superhero male rig fixture. It exists only to test GLB loading and skeleton inspection. It is not Minh, Linh, the final art style, or an approved production character. Production character assets remain unassigned in assets/characters/manifest.json.


## Milestone ledger — 2026-11-04

### Stage 1 — Reusable 3D asset foundation: implementation complete

Completed and committed:
- Three.js world adapter and GLTFLoader-based character loader are isolated from the active gameplay renderer.
- GLB fixture is fetched from a pinned upstream commit during Pages deployment; the workflow validates glTF 2.0 container integrity.
- Automated tests cover manifest structure, loader/skeleton requirements, animation mixer hooks, world adapter, asset lab wiring and GLB header.
- CI has passed for the current main revision, including Web 3D smoke test and GitHub Pages deployment.

Acceptance boundary: Stage 1 means the technical foundation and automated checks are in place. It does **not** claim that the browser has been visually inspected, that Minh/Linh production models exist, or that the active game renderer has migrated. The fixture remains development-only.

### Stage 2 — Production character asset selection and preparation: in progress

Candidate source identified: Quaternius Universal Base Characters (CC0), which documents six rigged humanoid bases, male/female proportions and compatibility with its animation library. The pack's regular-proportion models are a better starting point for ordinary adult characters than the superhero development fixture. Before any model is assigned to Minh or Linh, the pipeline must verify clothing coverage, hair, textures, skeleton hierarchy, forward axis, scale and browser appearance. Do not ship an undressed base mesh as a finished character.

Candidate animation source: Quaternius Universal Animation Library (CC0), with 120+ humanoid animations. Retarget compatibility must be proven against the selected character skeleton; do not assume identical rigs from marketing descriptions alone.

Stage 2 exit criteria:
1. Choose an everyday adult male and female base that fit the game's art direction.
2. Add appropriate contemporary everyday outfits and distinct hair/face styling.
3. Preserve local assets and a complete source/license ledger.
4. Verify both characters load in the lab, with valid skeletons and suitable animation clips.
5. Review screenshots at game camera distance before assigning either asset to production.

Official source references:
- https://quaternius.com/packs/universalbasecharacters.html
- https://quaternius.com/packs/universalanimationlibrary.html
