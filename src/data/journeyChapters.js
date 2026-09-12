/**
 * The Journey, told as eight chapters of one continuous descent.
 *
 * `depth` and `light` place a chapter in the water column: `light` runs 1 at the
 * surface to 0 in the abyss and drives the whole environment, so the sea gets
 * darker and heavier as the story goes down. `color` is the water itself.
 *
 * Every chapter carries the same shape - label, title, subtitle, narrative,
 * insights, facts, params - so the composition never has to special-case one.
 */

export const CHAPTERS = [
  {
    id: "introduction",
    label: "Chapter I · Introduction",
    title: "Descend into the four-dimensional ocean.",
    subtitle: "SIH26067 · MoES / INCOIS operational digital twin.",
    narrative:
      "Every forecast, every advisory, every warning that reaches a fishing boat begins as a number measured somewhere in the water. This is the descent that collects them.",
    insights: [
      ["Scope", "Multi-source in-situ networks synthesised with 4D hydrodynamic models across the Indian Ocean basin."],
    ],
    facts: ["Latitude, longitude, depth, time — four axes, one moving fluid."],
    params: [
      ["Basin", "Indian Ocean", ""],
      ["Range", "0 – 6,000", "m"],
      ["Axes", "4", "D"],
    ],
    depth: 0,
    light: 1,
    color: "#14607d",
  },
  {
    id: "discovery",
    label: "Chapter II · Discovery",
    title: "The ocean is not a static map.",
    subtitle: "An unsteady four-dimensional fluid system.",
    narrative:
      "A map holds still. The ocean does not. It preserves its dynamics across latitude, longitude, vertical depth and time, from air–sea monsoon exchange down to abyssal benthic currents.",
    insights: [
      ["Insight", "A two-dimensional web map throws away the axis where most of the ocean lives."],
    ],
    facts: ["The vertical dimension holds 99% of the habitable volume on this planet."],
    params: [
      ["Dimensions", "x, y, z, t", ""],
      ["Volume", "1.3", "billion km³"],
    ],
    depth: 0,
    light: 0.92,
    color: "#125b78",
  },
  {
    id: "exploration",
    label: "Chapter III · Exploration",
    title: "Where atmosphere drives the sea.",
    subtitle: "000 m · air–sea boundary and monsoon observatories.",
    narrative:
      "Moored buoy networks — OMNI and RAMA-2.0 — carry three-metre meteorological towers above the waterline and inductive cable hundreds of metres below it. They watch the moment the sky hands its energy to the water.",
    insights: [
      ["Observation", "Wind stress, heat flux and cyclogenesis captured in real time across the Arabian Sea and Bay of Bengal."],
    ],
    facts: ["A cyclone draws its energy from the top hundred metres of the sea it crosses."],
    params: [
      ["Mast", "3", "m"],
      ["Winds", "±0.2", "m/s"],
      ["Cadence", "Hourly", "telemetry"],
    ],
    depth: 0,
    light: 0.78,
    color: "#0f5473",
  },
  {
    id: "observation",
    label: "Chapter IV · Observation",
    title: "Freshwater haloclines and barrier layers.",
    subtitle: "200 m · mesoscale transects through the thermocline.",
    narrative:
      "Autonomous gliders fly undulating saw-tooth transects through boundary currents, converting buoyancy into forward motion. They resolve the thin river-runoff layers a drifting float would pass straight through.",
    insights: [
      ["Structure", "Runoff layers under fifteen metres thick sit above the 20 °C isotherm and trap solar heat beneath them."],
    ],
    facts: ["A glider has no propeller. It falls forward for weeks at a time."],
    params: [
      ["Buoyancy", "±500", "cc"],
      ["Glide", "15 – 26", "°"],
      ["Schema", "NetCDF", "trajectory"],
    ],
    depth: 200,
    light: 0.4,
    color: "#0d4463",
  },
  {
    id: "analysis",
    label: "Chapter V · Analysis",
    title: "Nine days adrift, then a climb through the column.",
    subtitle: "1,000 m · Lagrangian profiling and the Argo array.",
    narrative:
      "Floats hold an isobaric parking depth of 1,000 decibars and drift with the deep flow. Then they sink to two thousand metres and read the entire water column on the way back to the light.",
    insights: [
      ["Instrument", "SBE CTD and optical sensors return salinity, dissolved oxygen and pH with research-grade quality flags."],
    ],
    facts: ["Four thousand floats are executing this cycle right now."],
    params: [
      ["Accuracy", "±0.002", "°C"],
      ["Salinity", "±0.003", "PSU"],
      ["Cycle", "10", "days"],
    ],
    depth: 1000,
    light: 0.14,
    color: "#093a54",
  },
  {
    id: "deep-ocean",
    label: "Chapter VI · Deep Ocean",
    title: "Cold bottom water and the crewed sphere.",
    subtitle: "4,000 – 6,000 m · abyssal plain to benthic boundary.",
    narrative:
      "Antarctic Bottom Water enters through deep fracture zones and creeps north under four hundred atmospheres. Deep Argo extends surveillance to six thousand metres, and Matsya-6000 takes people there.",
    insights: [
      ["Baseline", "Deep Argo establishes the planetary heat-uptake baseline beneath the reach of every other platform."],
    ],
    facts: ["Water arriving on the abyssal plain last touched the sky before the industrial revolution."],
    params: [
      ["Pressure", "≤400", "bar"],
      ["Hull", "Ti-6Al-4V", "sphere"],
      ["Support", "96", "hours"],
    ],
    depth: 4000,
    light: 0.03,
    color: "#04182a",
  },
  {
    id: "insights",
    label: "Chapter VII · Scientific Insights",
    title: "From raw telemetry to a living twin.",
    subtitle: "The pipeline that turns measurements into forecasts.",
    narrative:
      "Heterogeneous arrays arrive as files. They leave as a four-dimensional ocean anyone can fly through. Four stages stand between the two.",
    insights: [
      ["Variables", "Velocity vectors, thermal structure, salinity and ocean colour, resolved together rather than separately."],
    ],
    facts: ["Nothing in the pipeline discards the vertical axis."],
    params: [
      ["Resolution", "9", "km"],
      ["Ensemble", "80", "members"],
      ["Levels", "40", "sigma"],
    ],
    depth: 6000,
    light: 0.01,
    color: "#020d18",
    // This chapter is told sideways: the pipeline is a sequence, so it reads
    // as one.
    stages: [
      {
        index: "01",
        label: "Stage 01 · Ingestion",
        title: "Multi-source telemetry.",
        copy: "Automated ingestion of NetCDF-4, OPeNDAP and ERDDAP streams from the INCOIS Argo Data Centre, NOAA PMEL moored buoys and Oceansat-3 radiometers.",
        meta: "OPeNDAP / ERDDAP / WCS",
      },
      {
        index: "02",
        label: "Stage 02 · Assimilation",
        title: "Four-dimensional circulation.",
        copy: "Coupled ROMS Regional Analysis of the Indian Ocean running an 80-member Local Ensemble Transform Kalman Filter across 40 terrain-following sigma levels.",
        meta: "ROMS LETKF · 9 km basin",
      },
      {
        index: "03",
        label: "Stage 03 · Rendering",
        title: "Volumetric ray-marching.",
        copy: "CesiumJS ellipsoidal terrain paired with WebGL2 compute shaders, ray-marching 3D scalar fields and advecting particles in real time.",
        meta: "WebGL2 · 60 fps",
      },
      {
        index: "04",
        label: "Stage 04 · Advisory",
        title: "Coastal hazard intelligence.",
        copy: "WAVEWATCH-III wave heights and swell periods, and satellite Potential Fishing Zone advisories, delivered to the communities that work the shelf.",
        meta: "INCOIS OSF / PFZ",
      },
    ],
  },
  {
    id: "conclusion",
    label: "Chapter VIII · Conclusion",
    title: "Bridging models with ground truth.",
    subtitle: "Accessible scientific intelligence.",
    narrative:
      "Operational oceanography has to move past the static map. VORTEX unifies petascale simulation with real-time instruments, so researchers, mariners and coastal communities read from the same ocean.",
    insights: [
      ["Purpose", "Empowering the people whose work and safety depend on what the water is doing next."],
    ],
    facts: ["Every number in this journey came from an instrument that had to survive the trip."],
    params: [
      ["Depth", "6,000", "m"],
      ["Chapters", "VIII", ""],
    ],
    depth: 6000,
    light: 0,
    color: "#010912",
    closing: true,
  },
];
