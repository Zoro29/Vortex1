import { useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LocateFixed,
  Minus,
  Pause,
  Play,
  Plus,
  UserRound,
} from "lucide-react";
import "../css/Dashboard.css";
import OceanGlobe from "../components/globe/OceanGlobe";
import {
  argoObservations,
  filterArgoObservations,
} from "../data/argoObservations";

const COLOR_PALETTES = {
  Viridis: ["#440154", "#3b528b", "#21918c", "#5ec962", "#fde725"],
  Jet: ["#00007f", "#007fff", "#00ffff", "#ffff00", "#ff0000", "#7f0000"],
  Ocean: ["#031b4f", "#075985", "#0891b2", "#22d3ee", "#d9fbff"],
  Thermal: ["#1b103f", "#7b1fa2", "#e34873", "#ff9d3d", "#fff3a3"],
};

export default function Dashboard() {
  const globeRef = useRef(null);
  const [timeRange, setTimeRange] = useState("5");
  const [coords, setCoords] = useState({
    lat: 0,
    lon: 0,
  });

  const [dataSources, setDataSources] = useState({
    argo: true,
    bgc: true,
    ctd: false,
    gliders: false,
  });

  const [parameters, setParameters] = useState({
    temperature: true,
    salinity: true,
    currents: true,
    chlorophyll: false,
    oxygen: false,
  });

  const [dataType, setDataType] = useState("observation");
  const [depth, setDepth] = useState("surface");
  const [region, setRegion] = useState("global");
  const [quality, setQuality] = useState("all");

  const [filtersApplied, setFiltersApplied] = useState(false);
  const [isGlobeRotating, setIsGlobeRotating] = useState(true);
  const [showSurfaceCurrents, setShowSurfaceCurrents] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [colorPalette, setColorPalette] = useState("Viridis");
  const [colorMin, setColorMin] = useState("0");
  const [colorMax, setColorMax] = useState("300");
  const [colorScale, setColorScale] = useState("linear");
  const [verticalExaggeration, setVerticalExaggeration] = useState(1);

  const toggleSource = (source) => {
    setDataSources((previous) => ({
      ...previous,
      [source]: !previous[source],
    }));
  };

  const toggleParameter = (parameter) => {
    setParameters((previous) => ({
      ...previous,
      [parameter]: !previous[parameter],
    }));
  };

  const resetFilters = () => {
    setTimeRange("5");

    setDataType("observation");

    setDataSources({
      argo: true,
      bgc: true,
      ctd: false,
      gliders: false,
    });

    setParameters({
      temperature: true,
      salinity: true,
      currents: true,
      chlorophyll: false,
      oxygen: false,
    });

    setDepth("surface");
    setRegion("global");
    setQuality("all");

    setFiltersApplied(false);
    setColorPalette("Viridis");
    setColorMin("0");
    setColorMax("300");
    setColorScale("linear");
    setVerticalExaggeration(1);
  };

  const applyFilters = () => {
    setFiltersApplied(true);
  };

  const colorRange = useMemo(() => {
    const min = Number(colorMin);
    const max = Number(colorMax);
    return Number.isFinite(min) && Number.isFinite(max) && max > min
      ? { min, max }
      : { min: 0, max: 300 };
  }, [colorMax, colorMin]);

  const liveFilters = useMemo(
    () => ({
      timeRange,
      dataType,
      dataSources,
      parameters,
      depth,
      region,
      quality,
    }),
    [timeRange, dataType, dataSources, parameters, depth, region, quality],
  );

  const filteredObservations = useMemo(
    () => filterArgoObservations(argoObservations, liveFilters)
      .filter(({ levels }) => levels >= colorRange.min && levels <= colorRange.max),
    [colorRange, liveFilters],
  );

  return (
    <main className="dashboard">
      {/* =====================================================
                FILTER PANEL
            ===================================================== */}

      <aside className={`filter-panel${isSidebarCollapsed ? " is-collapsed" : ""}`}>
        <button
          type="button"
          className="filter-panel-toggle"
          aria-label={isSidebarCollapsed ? "Expand research filters" : "Collapse research filters"}
          aria-expanded={!isSidebarCollapsed}
          title={isSidebarCollapsed ? "Expand research filters" : "Collapse research filters"}
          onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
        >
          {isSidebarCollapsed ? <ChevronRight aria-hidden="true" /> : <ChevronLeft aria-hidden="true" />}
        </button>

        {/* HEADER */}

        <div className="filter-panel-header">
          <div className="brand">VORTEX</div>

          <div className="brand-description">OCEAN DATA EXPLORER</div>
        </div>

        {/* TITLE */}

        <div className="filter-title">
          <span>RESEARCH WORKSPACE</span>

          <h1>Filters</h1>
        </div>

        {/* SCROLL AREA */}

        <div className="filters">
          {/* =================================================
                        TIME RANGE
                    ================================================= */}

          <section className="filter-group">
            <div className="filter-heading">
              <span>01</span>

              <h2>TIME RANGE</h2>
            </div>

            <div className="radio-group">
              {[
                ["1", "Last 1 year"],
                ["3", "Last 3 years"],
                ["5", "Last 5 years"],
                ["10", "Last 10 years"],
                ["all", "All available"],
              ].map(([value, label]) => (
                <label key={value} className="radio-row">
                  <input
                    type="radio"
                    name="timeRange"
                    value={value}
                    checked={timeRange === value}
                    onChange={(e) => setTimeRange(e.target.value)}
                  />

                  <span className="radio-mark"></span>

                  <span>{label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* =================================================
                        DATA TYPE
                    ================================================= */}

          <section className="filter-group">
            <div className="filter-heading">
              <span>02</span>

              <h2>DATA TYPE</h2>
            </div>

            <div className="segmented-control">
              <button
                className={dataType === "observation" ? "selected" : ""}
                onClick={() => setDataType("observation")}
              >
                Observation
              </button>

              <button
                className={dataType === "model" ? "selected" : ""}
                onClick={() => setDataType("model")}
              >
                Model
              </button>

              <button
                className={dataType === "combined" ? "selected" : ""}
                onClick={() => setDataType("combined")}
              >
                Combined
              </button>
            </div>
          </section>

          {/* =================================================
                        DATA SOURCES
                    ================================================= */}

          <section className="filter-group">
            <div className="filter-heading">
              <span>03</span>

              <h2>OBSERVATION SOURCES</h2>
            </div>

            <div className="source-list">
              {[
                ["argo", "ARGO", "Profiling floats"],
                ["bgc", "BGC-ARGO", "Biogeochemical floats"],
                ["ctd", "CTD", "Ship-based observations"],
                [
                  "gliders",
                  "Underwater gliders",
                  "Autonomous underwater profiles",
                ],
              ].map(([key, name, description]) => (
                <label key={key} className="source-row">
                  <input
                    type="checkbox"
                    checked={dataSources[key]}
                    onChange={() => toggleSource(key)}
                  />

                  <span className="checkbox-mark">✓</span>

                  <div className="source-information">
                    <strong>{name}</strong>

                    <small>{description}</small>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* =================================================
                        PARAMETERS
                    ================================================= */}

          <section className="filter-group">
            <div className="filter-heading">
              <span>04</span>

              <h2>PARAMETERS</h2>
            </div>

            <div className="parameter-list">
              {[
                ["temperature", "Temperature"],
                ["salinity", "Salinity"],
                ["currents", "Current vectors"],
                ["chlorophyll", "Chlorophyll"],
                ["oxygen", "Dissolved oxygen"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={
                    parameters[key] ? "parameter selected" : "parameter"
                  }
                  onClick={() => toggleParameter(key)}
                >
                  <span>{parameters[key] ? "✓" : ""}</span>

                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="filter-group colorbar-editor">
            <div className="filter-heading">
              <span>05</span>
              <h2>COLORBAR EDITOR</h2>
            </div>

            <p className="colorbar-description">PROFILE LEVELS</p>

            <div className="palette-list" role="radiogroup" aria-label="Color palette">
              {Object.entries(COLOR_PALETTES).map(([name, colors]) => (
                <button
                  key={name}
                  type="button"
                  role="radio"
                  aria-checked={colorPalette === name}
                  className={colorPalette === name ? "palette-option selected" : "palette-option"}
                  onClick={() => setColorPalette(name)}
                >
                  <span className="palette-swatch" aria-hidden="true">
                    {colors.map((color) => <i key={color} style={{ backgroundColor: color }} />)}
                  </span>
                  {name}
                </button>
              ))}
            </div>

            <div className="color-range-inputs">
              <label>
                <span>MIN</span>
                <input type="number" value={colorMin} min="0" onChange={(event) => setColorMin(event.target.value)} />
              </label>
              <label>
                <span>MAX</span>
                <input type="number" value={colorMax} min="1" onChange={(event) => setColorMax(event.target.value)} />
              </label>
            </div>

            <div className="color-scale-control" role="radiogroup" aria-label="Color scale">
              <button type="button" role="radio" aria-checked={colorScale === "linear"} className={colorScale === "linear" ? "selected" : ""} onClick={() => setColorScale("linear")}>Linear</button>
              <button type="button" role="radio" aria-checked={colorScale === "log"} className={colorScale === "log" ? "selected" : ""} onClick={() => setColorScale("log")}>Log</button>
            </div>
          </section>

          {/* =================================================
                        DEPTH
                    ================================================= */}

          <section className="filter-group">
            <div className="filter-heading">
              <span>05</span>

              <h2>DEPTH RANGE</h2>
            </div>

            <select
              className="filter-select"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
            >
              <option value="surface">Surface · 0–10 m</option>

              <option value="shallow">Shallow · 10–200 m</option>

              <option value="twilight">Twilight · 200–1000 m</option>

              <option value="deep">Deep · 1000–4000 m</option>

              <option value="abyss">Abyssal · 4000 m+</option>

              <option value="column">Entire water column</option>
            </select>
          </section>

          <section className="filter-group vertical-exaggeration-control">
            <div className="filter-heading">
              <span>07</span>
              <h2>VERTICAL EXAGGERATION</h2>
            </div>

            <div className="exaggeration-reading">
              <span>OVERLAY ELEVATION</span>
              <strong>{verticalExaggeration.toFixed(1)}x</strong>
            </div>
            <input
              className="exaggeration-slider"
              type="range"
              min="1"
              max="6"
              step="0.5"
              value={verticalExaggeration}
              onChange={(event) => setVerticalExaggeration(Number(event.target.value))}
              aria-label="Vertical exaggeration"
            />
            <div className="exaggeration-scale" aria-hidden="true"><span>1x</span><span>6x</span></div>
          </section>

          {/* =================================================
                        REGION
                    ================================================= */}

          <section className="filter-group">
            <div className="filter-heading">
              <span>06</span>

              <h2>REGION</h2>
            </div>

            <select
              className="filter-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="global">Global ocean</option>

              <option value="indian">Indian Ocean</option>

              <option value="arabian">Arabian Sea</option>

              <option value="bengal">Bay of Bengal</option>

              <option value="pacific">Pacific Ocean</option>

              <option value="atlantic">Atlantic Ocean</option>

              <option value="southern">Southern Ocean</option>

              <option value="arctic">Arctic Ocean</option>
            </select>
          </section>

          {/* =================================================
                        QUALITY
                    ================================================= */}

          <section className="filter-group">
            <div className="filter-heading">
              <span>07</span>

              <h2>QUALITY CONTROL</h2>
            </div>

            <select
              className="filter-select"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option value="all">All observations</option>

              <option value="good">Good quality</option>

              <option value="adjusted">Adjusted</option>

              <option value="delayed">Delayed mode</option>

              <option value="realtime">Real time</option>
            </select>
          </section>
        </div>

        {/* =====================================================
                    ACTIONS
                ===================================================== */}

        <div className="filter-actions">
          <button className="reset" onClick={resetFilters}>
            Reset
          </button>

          <button className="apply" onClick={applyFilters}>
            Apply filters
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </aside>

      {/* =====================================================
                MAIN RESEARCH AREA
            ===================================================== */}

      <section className="research-area">
        {/* TOP BAR */}

        <header className="research-header">
          <div>
            <span className="workspace-label">VORTEX / RESEARCH</span>

            <h2>Ocean Explorer</h2>
          </div>

          <div className="header-right">
            <div className="dataset-status">
              <span></span>
              DATA READY
            </div>

            <button type="button" className="header-button">
              <BookOpen aria-hidden="true" />
              Documentation
            </button>

            <button type="button" className="header-button profile-button" aria-label="Open profile">
              <UserRound aria-hidden="true" />
              Profile
            </button>
          </div>
        </header>

        {/* =================================================
                    MAP AREA
                ================================================= */}

        <div className="map-area">
          {/* MAP HEADER */}

          <div className="map-header">
            <div>
              <span>CURRENT VIEW</span>

              <strong>
                {liveFilters.region === "global"
                  ? "Global Ocean"
                  : liveFilters.region === "arabian"
                    ? "Arabian Sea"
                    : liveFilters.region === "bengal"
                      ? "Bay of Bengal"
                      : `${liveFilters.region[0].toUpperCase()}${liveFilters.region.slice(1)} Ocean`}
              </strong>
            </div>

            <div className="coordinates">
              <span>LAT</span>

              <strong>{coords.lat.toFixed(4)}°</strong>

              <span>LON</span>

              <strong>{coords.lon.toFixed(4)}°</strong>
            </div>
          </div>

          {/* =================================================
                        GLOBE PLACEHOLDER
                    ================================================= */}

          <div className="globe-container">
            <OceanGlobe
              globeRef={globeRef}
              isRotationEnabled={isGlobeRotating}
              filters={liveFilters}
              data={filteredObservations}
              colorbar={{ palette: colorPalette, ...colorRange, scale: colorScale }}
              showSurfaceCurrents={showSurfaceCurrents}
              verticalExaggeration={verticalExaggeration}
              setCoords={setCoords}
            />
          </div>

          {/* =================================================
                        MAP CONTROLS
                    ================================================= */}

          <div className="map-controls">
            <button
              type="button"
              className={showSurfaceCurrents ? "current-toggle active" : "current-toggle"}
              aria-label={showSurfaceCurrents ? "Hide surface currents" : "Show surface currents"}
              title={showSurfaceCurrents ? "Hide surface currents" : "Show surface currents"}
              onClick={() => setShowSurfaceCurrents((visible) => !visible)}
            >
              FLOW
            </button>

            <button
              type="button"
              className="rotation-toggle"
              aria-label={isGlobeRotating ? "Pause globe rotation" : "Resume globe rotation"}
              title={isGlobeRotating ? "Pause globe rotation" : "Resume globe rotation"}
              onClick={() => setIsGlobeRotating((rotating) => !rotating)}
            >
              {isGlobeRotating ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            </button>

            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => globeRef.current?.zoomIn()}
            >
              <Plus aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => globeRef.current?.zoomOut()}
            >
              <Minus aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label="Reset globe view"
              onClick={() => globeRef.current?.reset()}
            >
              <LocateFixed aria-hidden="true" />
            </button>
          </div>

          {/* =================================================
                        LEGEND
                    ================================================= */}

          <div className="map-legend">
            <div className="legend-title">ACTIVE PARAMETERS</div>
            {Object.entries(liveFilters.parameters)
              .filter(([, active]) => active)
              .map(([parameter]) => (
                <div className="legend-row" key={parameter}>
                  <span></span>
                  {parameter === "currents"
                    ? "Current vectors"
                    : parameter === "chlorophyll"
                      ? "Chlorophyll"
                      : parameter === "oxygen"
                        ? "Dissolved oxygen"
                        : `${parameter[0].toUpperCase()}${parameter.slice(1)}`}
                </div>
              ))}
          </div>

          {/* =================================================
                        BOTTOM STATUS
                    ================================================= */}

          <div className="map-footer">
            <div>
              <span>TIME</span>

              <strong>
                Last{" "}
                {liveFilters.timeRange === "all"
                  ? "available"
                  : `${liveFilters.timeRange} years`}
              </strong>
            </div>

            <div>
              <span>SOURCES</span>

              <strong>
                {Object.values(liveFilters.dataSources).filter(Boolean).length}
              </strong>
            </div>

            <div>
              <span>PARAMETERS</span>

              <strong>
                {Object.values(liveFilters.parameters).filter(Boolean).length}
              </strong>
            </div>

            <div>
              <span>DATA TYPE</span>

              <strong>{liveFilters.dataType}</strong>
            </div>

            <div>
              <span>RECORDS</span>
              <strong>{filteredObservations.length}</strong>
            </div>

            {filtersApplied && <div className="applied">Filters applied</div>}
          </div>
        </div>
      </section>
    </main>
  );
}
