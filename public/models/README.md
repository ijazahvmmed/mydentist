# External dental geometry

The site now renders `refined-molar.glb` in real time with React Three Fiber / Three.js. This is an **external surface**, not internal tooth anatomy and not a patient result.

Source: Cristian Diaz, Carlos Andres Ferro Sanchez, Oscar Campo (2024), *Data of synthetic 3D models of the human jaw, including teeth, ligaments, and bone structures*, version 1.

- Primary dataset: https://data.mendeley.com/datasets/xjsx7nfhj8/1
- DOI: https://doi.org/10.17632/xjsx7nfhj8.1
- License: Creative Commons Attribution 4.0 International, https://creativecommons.org/licenses/by/4.0/
- Distribution adapter: https://github.com/choxos/OMFAtlas/tree/main/public/models/dental
- Extracted part: lower left first molar, FDI 36, `Human Lower Jaw Dataset/Teeth/STL/D36.stl`.
- Original STL SHA256: `2890fded32b03aaca71b00a0eb8c9fd04af0d6d0d1854ec11e4e10348f4ba7b4`.
- Retained source attribution/manifest/binary: `assets/models/`.

Changes: applied one Loop subdivision to the external surface to soften facets; exported positions and 16-bit triangle indices as GLB; centered, rotated and uniformly scaled in the renderer; recomputed smooth normals; assigned ivory and decorative scan materials. No internal structures were invented. The mesh has 15,102 vertices / 30,200 triangles and is 363,204 bytes without transport compression. No texture downloads or decoder dependency are needed. Enable Brotli/gzip for GLB/SVG/JS on the static host; at this size an extra Draco decoder is not justified.

The digital-arch SVG is an illustrative projection of the same dataset's external lower teeth. Its outlines, sampled triangles and surface points are derived by `qa/prepare-arch.py`; it is not a live scan or clinic equipment photograph. The panoramic SVG is an original abstract upper/lower arch graphic, explicitly labelled as not a patient radiograph.

Visible attribution links appear beneath the tooth story. Preserve these links and this attribution when redistributing the model and derivative arch graphic. The upstream noncommercial jaw datasets are not used.

Internal pulp, canals, dentin and restoration cutaways remain disabled until suitable licensed geometry and clinical review are available. Existing educational text remains ordinary HTML. Reduced motion, no JavaScript, model load failures and WebGL context loss retain static illustrations.


## Live technology studies

The scanner and wider-view cards now use the separately authored upper/lower dentition from MakeHuman Community's CC0 `teeth_base` system asset. Source OBJ and provenance are retained in `assets/models/makehuman/`. Official source and license: https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_assets.html and https://static.makehumancommunity.org/about/license.html.

- `technology-dentition.glb` (1,294,904 bytes): 32 teeth with fitted upper and lower gingiva.
- `technology-scan.glb` (636,844 bytes): 16 lower teeth and the corresponding gingiva.

The source tooth shapes and arrangement are preserved under common assembly transforms, with Catmull-Clark surface refinement and restrained authored posterior occlusal relief. Gingiva is trimmed to the display region. These graphics are illustrative external surfaces, not a validated upper/lower diagnostic radiograph, patient scan, clinic equipment photograph or measurement tool. The geometry derivatives remain CC0.

Both studies use orthographic cameras to avoid exaggerated front-to-back tooth proportions. Continuous scan overlays use matching projection math and a depth offset to prevent coplanar flicker. They pause when offscreen or hidden. Reduced-motion, no-JavaScript and loading-failure views use transparent WebP renders of the same models.

Reproduce with `python qa/prepare-authored-dentition.py` and `node qa/render-technology-posters.mjs`. The earlier Diaz-based `dental-arch.glb`, `dental-crowns.glb` and `dental-scan-crowns.glb` remain as historical derivatives with their original CC BY 4.0 attribution above; they no longer power the technology cards.

The hero retains the refined Diaz first molar (36), its existing studio lighting and animated tooth story.
