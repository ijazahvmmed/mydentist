# Technology dentition source

Source: MakeHuman Community system asset `teeth_base` (Data Collection AB, Joel Palmius and Jonas Hauquier). The source OBJ explicitly dedicates the asset to CC0 in September 2020.

- Official asset listing: https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_assets.html
- Downloaded archive: https://files2.makehumancommunity.org/asset_packs/makehuman_system_assets/makehuman_system_assets_cc0.zip
- Source members: `teeth/teeth_base/teeth_base.obj` and `teeth/teeth_base/teeth_base.mhclo`
- OBJ SHA256: `f55198069e55d360c4b4cc7ecb1cc292b2c7665753ab8b65eabf46a8783f2875`
- License explanation: https://static.makehumancommunity.org/about/license.html
- License: CC0 1.0 Universal, https://creativecommons.org/publicdomain/zero/1.0/

The archive was read using HTTP range requests and only these two source members were extracted. The source header and its attribution remain intact.

The website derivative keeps the separately authored upper and lower tooth forms and native arrangement, rotates the complete assembly into its display pose, applies two Catmull-Clark subdivision steps to teeth, adds restrained illustrative posterior occlusal relief, separates the two arches slightly, and trims the source gingiva to the dental study. The source is a graphics asset, not a clinically validated model, patient scan, or equipment image. No anatomical or measurement accuracy guarantee is implied.

Reproduce with `python qa/prepare-authored-dentition.py`; regenerate transparent reduced-motion posters with `node qa/render-technology-posters.mjs` while the development preview runs on port 4323. The runtime models retain CC0 status. The homepage labels them as illustrative visuals.
