# Generated character assets

The deploy workflow generates `Minh.glb` and `Linh.glb` from the versioned parameter files in `assets/characters/source/`. The binary GLBs are created in the Pages build artifact, not committed as generated binaries.

## Provenance and licensing

- Generator: [Ara 3D Gen](https://github.com/olatunde85/3d-gen), pinned to commit `a4947ffdd14acf2ff018cb3568c941595f86d86e`; generator code is MIT-licensed.
- Body mesh, morph targets, skin, hair, clothing and base character assets: MakeHuman data, CC0 1.0, as documented by Ara 3D Gen in `scripts/ASSETS_LICENSE.txt`.
- Motion clips: CMU Graphics Lab Motion Capture Database, as documented by Ara 3D Gen. Embedded retargeted clips may be used in products, but the motion data itself must not be resold as a standalone asset. Acknowledgement: “The data used in this project was obtained from mocap.cs.cmu.edu. The database was created with funding from NSF EIA-0196217.”
- Character generation parameters are project-authored. The generated people are fictional characters, not scans or likenesses of real people.

## Quality gates

The workflow validates glTF 2.0, embedded images, a game humanoid rig, idle/walk/run clips and the medium-detail triangle range. Browser tests then load the models inside the playable game.

A successful build and rig test do not by themselves mean final visual approval. Check face, hair, clothing fit, orientation, ground contact, animation, and appearance at the normal game camera distance before enabling these assets by default.
