# Ocean Data Visualization System - Requirement Status

Assessment basis: supplied problem statement and the current repository implementation.

Legend: `[x]` implemented, `[~]` partially implemented or prototype-only, `[ ]` not implemented.

## Platform and interaction

- [x] Browser-native React dashboard with a Three.js / React Three Fiber globe.
- [x] Interactive globe orbit, zoom in/out, reset, and rotation pause/play controls.
- [x] Space background, atmosphere, and research-console dashboard UI.
- [x] Collapsible/expandable filter sidebar.
- [x] Geographic cursor coordinates (latitude/longitude) shown in the map header.
- [x] Timeline date slider with previous/next day and play/pause controls.
- [x] Time-range, region, depth, quality, data-type, source, and parameter filter controls.

## Observational data and instruments

- [x] ARGO profile-index CSV files are loaded from the bundled `src/data/argo_data` directory.
- [x] ARGO markers are positioned using their recorded latitude and longitude.
- [x] Selecting an ARGO float shows platform metadata, date, position, institution, profiler type, and number of profile levels.
- [x] Selecting an ARGO float displays its recorded track history on the globe.
- [~] ARGO quality, date, region, and depth controls filter the profile-index catalogue. Depth is currently metadata-level filtering, not a scientific vertical profile slice.
- [~] BGC-ARGO, CTD, and Glider options exist in the UI and have marker models, but the bundled data loader currently supplies ARGO records only.
- [ ] Clickable depth-vs-variable profile charts with timestamps.
- [ ] Display of measured temperature, salinity, chlorophyll, oxygen, or velocity profiles from the individual NetCDF profile files.
- [ ] Real-time or delayed-mode observational data ingestion from an external service.

## Model fields and 3D ocean rendering

- [x] 3D globe rendering via WebGL / Three.js.
- [~] A visual ocean-current layer can be enabled. It uses predefined illustrative surface current paths with animated particles; it is **not** derived from ocean-model velocity data.
- [ ] Volumetric model-field rendering for temperature, salinity, currents, chlorophyll, or other variables.
- [ ] Full-water-column / depth-resolved 3D field visualization.
- [ ] Depth-slice rendering from model grids.
- [ ] Isosurface extraction.
- [ ] Time-step animation of model-field data.
- [ ] Co-visualization of real model fields with observations.

## Colorbar and scientific controls

- [x] Colorbar Editor UI with Viridis, Jet, Ocean, and Thermal palettes.
- [x] Min and max inputs plus Linear / Log scale controls.
- [~] The palette recolors ARGO markers using `n_levels` (number of profile levels), and the min/max values filter records by that metadata. It does **not** yet color scientific variable values such as temperature or salinity.
- [x] Variable selection controls for temperature, salinity, current vectors, chlorophyll, and oxygen.
- [ ] Variable-specific color mapping using actual observed or model values.
- [ ] Layer opacity controls.
- [~] Vertical-exaggeration slider for surface overlays and instrument markers. It provides visual separation; true subsurface exaggeration requires depth-resolved model/profile data.

## Data ingestion, architecture, and interoperability

- [~] Delimited-text / CSV parsing is implemented at build time for bundled ARGO profile-index data.
- [ ] Automated NetCDF ingestion or parsing (for example, xarray/PyNIO backend or a browser-compatible parser).
- [ ] Backend REST or OPeNDAP API.
- [ ] Deployment-ready scalable data service for INCOIS infrastructure.
- [ ] Runtime ingestion of new observation streams without rebuilding the frontend.
- [ ] Plugin-style sensor/data-source extension mechanism.
- [ ] OGC WMS/WCS support.
- [ ] CF-Conventions / NetCDF interoperability pipeline.

## Important implementation notes

- [x] Production build currently succeeds with `npm run build`.
- [~] The app contains CSV metadata for ARGO profiles, not the corresponding scientific profile data values. This is the main blocker for true depth profiles, variable color maps, and data-driven currents.
- [ ] Validation against operational oceanographic datasets and domain-scientist review.

## Recommended next milestones

1. Add a backend endpoint that reads NetCDF profile/model files and serves variable arrays plus metadata.
2. Replace prototype current paths with vectors calculated from model `u`/`v` current fields.
3. Build a selectable depth-profile chart for each ARGO float.
4. Apply colorbar min/max, scale, and palette to selected scientific variables rather than `n_levels`.
5. Add model grid rendering, depth slices, opacity, and vertical exaggeration.
