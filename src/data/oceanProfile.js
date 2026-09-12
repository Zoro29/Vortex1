/**
 * Depth zones and the vertical profiles drawn through them.
 *
 * Values are representative open-ocean profiles (low-latitude Atlantic/Indian
 * Ocean), rounded for narrative use. They are not observations from a specific
 * cast, and they are not meant to be read as one.
 */

export const ZONES = [
  {
    depth: 0,
    zone: "Epipelagic",
    title: "The skin of the world.",
    subtitle:
      "Wind and sunlight mix the top of the ocean into a warm, well-stirred slab. Everything below is shaped by what happens here.",
    // Light reaching this depth, 0-1. Drives the shafts and caustics.
    light: 1,
    color: "#1a7a97",
    insights: [
      ["Key insight", "The mixed layer holds more heat than the entire atmosphere above it."],
      ["Finding", "Ninety percent of the ocean's photosynthesis happens in the top hundred metres."],
      ["Observation", "Surface temperature has risen roughly 0.9 °C since pre-industrial records began."],
    ],
  },
  {
    depth: 200,
    zone: "Mesopelagic",
    title: "Where the light gives up.",
    subtitle:
      "Temperature falls off a cliff. Blue is the last colour to survive, and then that goes too. This is where the mixed layer loses its grip on the water below.",
    light: 0.32,
    color: "#0f5473",
    insights: [
      ["Key insight", "The thermocline acts as a lid, slowing the exchange of heat and gas with the deep."],
      ["Finding", "The largest daily migration on Earth crosses this layer twice every day."],
      ["Observation", "Oxygen reaches its minimum here, consumed by decay faster than it is resupplied."],
    ],
  },
  {
    depth: 1000,
    zone: "Bathypelagic",
    title: "The drifting shift.",
    subtitle:
      "Neutrally buoyant instruments settle here and travel with the deep flow for days at a time before climbing back towards the light.",
    light: 0.06,
    color: "#093a54",
    insights: [
      ["Key insight", "At this depth an instrument is carried by currents nobody can see from a ship."],
      ["Finding", "Sound travels furthest here; the SOFAR channel carries a call for thousands of kilometres."],
      ["Observation", "Carbon that sinks past this depth is out of the atmosphere for centuries."],
    ],
  },
  {
    depth: 2000,
    zone: "Bathypelagic",
    title: "Two hundred atmospheres.",
    subtitle:
      "The standard turning point of a deep profile, and a water mass that has not touched the sky in hundreds of years.",
    light: 0.015,
    color: "#062639",
    insights: [
      ["Key insight", "Pressure here would crush an unprotected hull; instruments are built as pressure cases first."],
      ["Finding", "Temperature and salinity become almost flat, which is what makes small anomalies readable."],
      ["Observation", "Water arriving here left the surface before the industrial revolution."],
    ],
  },
  {
    depth: 4000,
    zone: "Abyssopelagic",
    title: "The long, cold conveyor.",
    subtitle:
      "Antarctic Bottom Water creeps north through fracture zones. Temperature sits near freezing and barely changes across thousands of kilometres.",
    light: 0.004,
    color: "#04182a",
    insights: [
      ["Key insight", "The abyssal circulation closes a loop that takes roughly a thousand years to complete."],
      ["Finding", "Most of the seafloor lies at this depth, and most of it has never been surveyed in detail."],
      ["Observation", "Warming has now been measured even here, in water once assumed to be steady."],
    ],
  },
  {
    depth: 6000,
    zone: "Hadal",
    title: "The boundary layer.",
    subtitle:
      "The last few metres above the seabed, where currents scour sediment and the water column finally ends.",
    light: 0,
    color: "#020b16",
    insights: [
      ["Key insight", "The benthic boundary layer is where the ocean hands its carbon to the sediment."],
      ["Finding", "Sediment cores taken here read as a continuous climate record going back millions of years."],
      ["Observation", "Plastic fibres have been recovered from trench sediment at full ocean depth."],
    ],
  },
];

/**
 * One entry per measured parameter. `values` is indexed by zone, and `null`
 * means the instrument has nothing meaningful to report at that depth.
 */
export const PARAMETERS = {
  temperature: {
    label: "Temperature",
    unit: "°C",
    values: [28.4, 12.6, 4.1, 2.4, 1.6, 1.2],
  },
  salinity: {
    label: "Salinity",
    unit: "PSU",
    values: [34.62, 35.14, 34.71, 34.72, 34.7, 34.69],
  },
  pressure: {
    label: "Pressure",
    unit: "dbar",
    values: [0, 201, 1008, 2019, 4045, 6072],
  },
  density: {
    label: "Density",
    unit: "kg/m³",
    values: [22.1, 26.5, 27.6, 27.8, 27.85, 27.88],
  },
  oxygen: {
    label: "Oxygen",
    unit: "µmol/kg",
    values: [214, 78, 142, 168, 182, 188],
  },
  chlorophyll: {
    label: "Chlorophyll a",
    unit: "mg/m³",
    values: [0.42, 0.06, 0.01, null, null, null],
  },
  nitrate: {
    label: "Nitrate",
    unit: "µmol/kg",
    values: [0.8, 18.4, 34.2, 36.1, 35.4, 34.9],
  },
  conductivity: {
    label: "Conductivity",
    unit: "S/m",
    values: [5.62, 3.98, 3.28, 3.21, 3.19, 3.18],
  },
  current: {
    label: "Current",
    unit: "m/s",
    values: [0.42, 0.18, 0.06, 0.04, 0.03, 0.02],
  },
};

export const SOURCES = {
  "argo-floats": {
    name: "Argo Floats",
    label: "Core Argo",
    intro:
      "A core Argo float spends nine days adrift at a thousand metres, sinks to two thousand, and reads the water column on the way back up. Four thousand of them are doing it right now.",
    parameters: ["temperature", "salinity", "pressure", "density"],
    // One line per zone, in the voice of this platform.
    notes: [
      "The float surfaces here, fixes its position and transmits the profile it just recorded.",
      "Descending through the thermocline, the CTD samples fastest where the gradient is steepest.",
      "Parking depth. The float trims its buoyancy and drifts with whatever the deep current is doing.",
      "The turning point. The float pumps oil into its bladder and begins the climb.",
      "Below the standard Argo envelope; only Deep Argo floats report from here.",
      "Out of reach for a core float. This depth belongs to landers and full-ocean-depth vehicles.",
    ],
  },
  "bgc-argo": {
    name: "BGC-Argo",
    label: "Biogeochemical Argo",
    intro:
      "The same platform, carrying chemistry. Oxygen, nitrate and chlorophyll turn a physical profile into a record of how the ocean breathes and feeds itself.",
    parameters: ["temperature", "salinity", "oxygen", "chlorophyll", "nitrate"],
    notes: [
      "Chlorophyll peaks near the surface, and nitrate is drawn almost to zero by the bloom consuming it.",
      "The oxygen minimum. Sinking organic matter is being respired faster than water can resupply it.",
      "Nitrate is fully regenerated. Everything the surface consumed has been broken back down here.",
      "Optical sensors read almost nothing. The chemistry is the only signal left.",
      "Oxygen recovers, carried down from the poles rather than produced locally.",
      "Sediment chemistry begins. The water column's last measurements before the seabed.",
    ],
  },
  ctd: {
    name: "CTD",
    label: "Shipboard cast",
    intro:
      "Conductivity, temperature and depth, lowered on a wire from a stopped ship. The slowest way to measure the ocean, and the reference every autonomous platform is calibrated against.",
    parameters: ["conductivity", "temperature", "pressure", "salinity", "density"],
    notes: [
      "The rosette enters the water. Sensors need minutes to equilibrate before the cast is trusted.",
      "Bottles are fired on the upcast here, capturing water for laboratory salinity analysis.",
      "Conductivity flattens. From here down, precision matters more than range.",
      "Standard deep bottle depth. These samples anchor the calibration of the whole fleet.",
      "Only full-depth wire and a hardened rosette reach this far.",
      "Metres above the seabed, taken carefully. A rosette on the bottom is a lost rosette.",
    ],
  },
  gliders: {
    name: "Gliders",
    label: "Autonomous glider",
    intro:
      "A glider converts buoyancy into forward motion and flies saw-tooth transects for weeks, resolving the fronts and eddies a drifting float passes straight through.",
    parameters: ["temperature", "salinity", "oxygen", "current"],
    notes: [
      "Surfacing between dives, the glider reports its track and receives its next waypoint.",
      "Mid-flight through the thermocline, where the glider's transect resolves fronts a float would miss.",
      "Approaching the limit of a deep-rated glider. Wings are trimmed for descent, not depth.",
      "Beyond the operating envelope. Below this, the water column belongs to other platforms.",
      "Depth-averaged currents from the glider's dead-reckoning end well above here.",
      "Unreachable. The glider's record ends far above the seabed.",
    ],
  },
};
