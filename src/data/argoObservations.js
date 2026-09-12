// Browser-friendly catalogue generated from the official BGC-Argo S-profile
// NetCDF collection. The NetCDF files remain the authoritative source.
import netcdfSummaries from "./argoNetcdfSummaries.json";

// Core-Argo profile metadata remains a companion catalogue. BGC-Argo is the
// primary detailed source, while this index supplies the standard Argo fleet.
const argoFiles = import.meta.glob("./argo_data/**/*.csv", {
  eager: true,
  query: "?raw",
  import: "default",
});

const parseProfileDate = (value) => {
  const raw = String(value).split(".")[0].padEnd(14, "0");
  return new Date(Date.UTC(
    Number(raw.slice(0, 4)),
    Number(raw.slice(4, 6)) - 1,
    Number(raw.slice(6, 8)),
    Number(raw.slice(8, 10)),
    Number(raw.slice(10, 12)),
    Number(raw.slice(12, 14)),
  ));
};

const regionFor = (lat, lon, ocean) => {
  if (lat >= 4 && lat <= 28 && lon >= 44 && lon <= 78) return "arabian";
  if (lat >= 5 && lat <= 24 && lon >= 78 && lon <= 100) return "bengal";
  return ({ I: "indian", A: "atlantic", P: "pacific", S: "southern", N: "arctic" }[ocean] || "global");
};

const parseCsv = (csv) => {
  const [header, ...rows] = csv.trim().split(/\r?\n/);
  const fields = header.split(",");
  return rows.map((line) => Object.fromEntries(
    fields.map((field, index) => [field, line.split(",")[index] || ""]),
  ));
};

const coreProfiles = Object.values(argoFiles).flatMap(parseCsv);
const coreSampleStride = Math.max(1, Math.ceil(coreProfiles.length / 12000));

const coreArgoObservations = coreProfiles
  .filter((_, index) => index % coreSampleStride === 0)
  .map((profile, index) => {
    const lat = Number(profile.latitude);
    const lon = Number(profile.longitude);
    const observedAt = parseProfileDate(profile.date);

    return {
      id: `argo-${index}-${profile.file}`,
      platformId: profile.file.split("/")[1],
      lat,
      lon,
      source: "argo",
      dataType: "observation",
      depth: "column",
      region: regionFor(lat, lon, profile.ocean),
      quality: profile.file.includes("/D") ? "delayed" : "realtime",
      observedAt,
      temperature: profile.profile_temp_qc ? 1 : null,
      salinity: profile.profile_psal_qc ? 1 : null,
      currents: null,
      chlorophyll: null,
      oxygen: profile.profile_doxy_qc ? 1 : null,
      profilerType: profile.profiler_type,
      institution: profile.institution,
      levels: Number(profile.n_levels) || 0,
      maxPressure: null,
      meanTemperature: null,
      meanSalinity: null,
      dataFormat: "Core-Argo profile index",
    };
  })
  .filter(({ lat, lon, observedAt }) => (
    Number.isFinite(lat) && Number.isFinite(lon) && !Number.isNaN(observedAt.getTime())
  ));

const sampleStride = Math.max(1, Math.ceil(netcdfSummaries.length / 12000));

const bgcArgoObservations = netcdfSummaries
  .filter((_, index) => index % sampleStride === 0)
  .map((profile, index) => {
    const observedAt = new Date(profile.observedAt);
    return {
      id: `bgc-argo-${index}-${profile.platformId}`,
      platformId: profile.platformId,
      lat: profile.lat,
      lon: profile.lon,
      source: "bgc",
      dataType: "observation",
      depth: "column",
      region: regionFor(profile.lat, profile.lon, "I"),
      quality: "good",
      observedAt,
      temperature: profile.surfaceTemperature ?? profile.meanTemperature,
      salinity: profile.surfaceSalinity ?? profile.meanSalinity,
      currents: null,
      chlorophyll: profile.surfaceChlorophyll,
      oxygen: profile.surfaceOxygen,
      profilerType: null,
      institution: "Argo GDAC",
      levels: profile.levels,
      maxPressure: profile.maxPressure,
      meanTemperature: profile.meanTemperature,
      meanSalinity: profile.meanSalinity,
      dataFormat: "BGC-Argo S-profile NetCDF",
    };
  });

export const argoObservations = [...bgcArgoObservations, ...coreArgoObservations];

// The globe renders a sampled set of markers, but a selected float should use
// its complete profile history so its red route reflects the real working area.
export function getArgoTrack(platformId) {
  const bgcTrack = netcdfSummaries
    .filter((profile) => profile.platformId === platformId)
    .map((profile) => ({
      lat: profile.lat,
      lon: profile.lon,
      observedAt: new Date(profile.observedAt),
    }))
    .filter(({ lat, lon, observedAt }) => Number.isFinite(lat) && Number.isFinite(lon) && !Number.isNaN(observedAt.getTime()))
    .sort((first, second) => first.observedAt - second.observedAt);
  const coreTrack = coreProfiles
    .filter((profile) => profile.file.split("/")[1] === platformId)
    .map((profile) => ({
      lat: Number(profile.latitude),
      lon: Number(profile.longitude),
      observedAt: parseProfileDate(profile.date),
    }));

  return [...bgcTrack, ...coreTrack]
    .filter(({ lat, lon, observedAt }) => Number.isFinite(lat) && Number.isFinite(lon) && !Number.isNaN(observedAt.getTime()))
    .sort((first, second) => first.observedAt - second.observedAt);
}

export function filterArgoObservations(observations, filters) {
  const selectedSources = Object.entries(filters.dataSources)
    .filter(([, selected]) => selected)
    .map(([source]) => source);
  const selectedParameters = Object.entries(filters.parameters)
    .filter(([, selected]) => selected)
    .map(([parameter]) => parameter);
  const years = filters.timeRange === "all" ? null : Number(filters.timeRange);
  const now = new Date();

  return observations.filter((observation) => {
    const withinTimeRange = !years || observation.observedAt >= new Date(now.getFullYear() - years, now.getMonth(), now.getDate());
    const matchingType = filters.dataType === "combined" || observation.dataType === filters.dataType;
    const matchingRegion = filters.region === "global" || observation.region === filters.region;
    // An ARGO profile samples a vertical water column, so it is valid for every
    // selected depth range even though this index has no per-level depth values.
    const matchingDepth = filters.depth === "column" || observation.depth === "column" || observation.depth === filters.depth;
    const matchingQuality = filters.quality === "all" || observation.quality === filters.quality;
    const hasDataParameter = selectedParameters.some((parameter) => Number.isFinite(observation[parameter]));

    return withinTimeRange && matchingType && matchingRegion && matchingDepth && matchingQuality
      && selectedSources.includes(observation.source) && hasDataParameter;
  });
}
