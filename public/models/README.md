# External dental geometry

The site now renders `refined-molar.glb` in real time with React Three Fiber / Three.js. This is an **external surface**, not internal tooth anatomy and not a patient result.

Source: Cristian Diaz, Carlos Andres Ferro Sanchez, Oscar Campo (2024), *Data of synthetic 3D models of the human jaw, including teeth, ligaments, and bone structures*, version 1.

- Primary dataset: https://data.mendeley.com/datasets/xjsx7nfhj8/1
- DOI: https://doi.org/10.17632/xjsx7nfhj8.1
- License: Creative Commons Attribution 4.0 International, https://creativecommons.org/licenses/by/4.0/
- Distribution adapter: https://github.com/choxos/OMFAtlas/tree/main/public/models/dental
- Extracted part: lower left second molar, FDI 37, `Human Lower Jaw Dataset/Teeth/STL/D37.stl`.
- Original STL SHA256: `a5f5488b4c300d02b51661def99df33b8a0397d55090810b2043a7decf3b0b36`.
- Retained source attribution/manifest/binary: `assets/models/`.

Changes: applied one Loop subdivision to the external surface to soften facets; exported positions and 16-bit triangle indices as GLB; centered, rotated and uniformly scaled in the renderer; recomputed smooth normals; assigned ivory and decorative scan materials. No internal structures were invented. The mesh has 13,854 vertices / 27,704 triangles and is 333,252 bytes without transport compression. No texture downloads or decoder dependency are needed. Enable Brotli/gzip for GLB/SVG/JS on the static host; at this size an extra Draco decoder is not justified.

The digital-arch SVG is an illustrative projection of the same dataset's external lower teeth. Its outlines, sampled triangles and surface points are derived by `qa/prepare-arch.py`; it is not a live scan or clinic equipment photograph. The panoramic SVG is an original abstract upper/lower arch graphic, explicitly labelled as not a patient radiograph.

Visible attribution links appear beneath the tooth story. Preserve these links and this attribution when redistributing the model and derivative arch graphic. The upstream noncommercial jaw datasets are not used.

Internal pulp, canals, dentin and restoration cutaways remain disabled until suitable licensed geometry and clinical review are available. Existing educational text remains ordinary HTML. Reduced motion, no JavaScript, model load failures and WebGL context loss retain static illustrations.


## Live technology studies

`dental-arch.glb` (907,568 bytes) contains the fourteen external lower teeth from the same Diaz CC BY 4.0 dataset. Both technology panels animate this genuine geometry, with different viewing angles, scan lighting and an orbit guide for the panoramic concept. They illustrate acquisition principles and external tooth surfaces, not a complete upper/lower diagnostic radiograph, patient anatomy validation, or the clinic's actual equipment. Animation runs continuously only while the card is visible and the document is active; reduced motion retains the static fallback. The source license and attribution above also cover this derivative.

Reproduce assets with `qa/refine-molar.py` and `qa/prepare-live-arch.py` against the retained source binary and manifest.
