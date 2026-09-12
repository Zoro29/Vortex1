import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import "../css/About.css";

gsap.registerPlugin(ScrollTrigger);

const institutionalDirectory = [
    {
        category: "Primary Indian Government & INCOIS Data Portals",
        categoryKey: "incois",
        items: [
            ["Indian National Centre for Ocean Information Services", "INCOIS / MoES", "Central autonomous body under the Ministry of Earth Sciences delivering operational ocean forecasts and tsunami early warnings.", "https://incois.gov.in/", "OPERATIONAL HEADQUARTERS", "17.52° N, 78.37° E"],
            ["Ocean Data and Information System (ODIS)", "ODIS ARCHIVE", "National marine repository for in-situ streams including Argo floats, moored buoys, wave riders, XBT/XCTD, and coastal radars.", "https://incois.gov.in/portal/datainfo/odis.jsp", "NATIONAL ARCHIVE", "INDIAN OCEAN"],
            ["INCOIS Argo National Data Centre", "ARGO NDC", "Monitoring gateway for Indian Ocean profiling floats, serving quality-controlled vertical hydrographic profiles.", "https://incois.gov.in/portal/argo.jsp", "LAGRANGIAN PROFILING", "BASIN-WIDE DRIFT"],
            ["Moored Buoy Data Gateway (OMNI)", "OMNI / NIOT", "Distribution interface for the Ocean Moored buoy Network, providing surface meteorology and subsurface CTD/ADCP measurements.", "https://incois.gov.in/moored_buoy/", "AIR-SEA OBSERVATORY", "ARABIAN SEA / BoB"],
            ["Ocean State Forecast (OSF) Portal", "OSF ENGINE", "Operational engine producing forecasts for wave height, swell period, sea surface temperature, and cyclone heat potential.", "https://incois.gov.in/portal/osf/", "NUMERICAL FORECASTS", "HOURLY INFERENCE"],
            ["Potential Fishing Zone (PFZ) WebGIS", "PFZ ADVISORY", "Geospatial advisory system derived from satellite-detected sea-surface-temperature fronts and chlorophyll gradients.", "https://incois.gov.in/portal/pfz/", "SATELLITE ADVISORY", "1,223 COASTAL NODES"],
            ["Regional Analysis of Indian Ocean (RAIN) Model", "ROMS-LETKF", "High-resolution hydrodynamic assimilation platform coupling ROMS with a Local Ensemble Transform Kalman Filter.", "https://incois.gov.in/marine_fisheries/", "4D ASSIMILATION", "9KM BASIN GRID"],
            ["INCOIS ERDDAP Scientific Data Server", "ERDDAP / OPeNDAP", "Machine-to-machine server supporting data subsetting and tabular downloads for marine platforms and gridded fields.", "https://erddap.incois.gov.in/", "DATA PROTOCOL", "REST API ENDPOINT"]
        ]
    },
    {
        category: "International Observing Systems & Modeling Initiatives",
        categoryKey: "global",
        items: [
            ["NOAA PMEL Global Tropical Moored Buoy Array", "RAMA-2.0 / NOAA", "International mooring array monitoring monsoon dynamics, upper-ocean heat content, and air-sea fluxes.", "https://www.pmel.noaa.gov/gtmba/", "BASIN MOORING", "TROPICAL EQUATORIAL"],
            ["OceanGliders Global Observing Steering Team", "OceanGliders", "International program standardizing global glider trajectories, metadata conventions, and data exchange for AUVs.", "https://www.oceangliders.org/", "GLIDER STANDARDS", "0–1000M TRANSECTS"],
            ["NASA Estimating the Circulation of the Ocean", "NASA ECCO", "State-estimation framework synthesizing satellite observations and in-situ records into consistent 4D ocean reconstructions.", "https://www.ecco-group.org/", "STATE ESTIMATION", "GLOBAL SYNTHESIS"],
            ["European Digital Twin Ocean", "EDITO / COPERNICUS", "EU infrastructure for cloud-native visualization, high-performance ocean models, and interactive digital twins.", "https://edito-ocean.eu/", "DIGITAL TWIN", "EU CLOUD EDGE"]
        ]
    },
    {
        category: "Open-Source Data Access Libraries & Toolkits",
        categoryKey: "tools",
        items: [
            ["Euro-Argo argopy Python Library Documentation", "ARGOPY DOCS", "Open-source Python library for querying, filtering, quality-controlling, and transforming NetCDF Argo profiles.", "https://argopy.readthedocs.io/", "DATA PIPELINE", "PYPI / CONDA"],
            ["argopy Official GitHub Source Repository", "ARGOPY GITHUB", "Open-source repository containing documentation, issue tracking, and notebooks for Argo data routines.", "https://github.com/euroargodev/argopy", "SOURCE CODE", "OPEN SOURCE"]
        ]
    }
];

const problemCards = [
    ["01", "DIMENSIONALITY", "Spatial & Temporal Dimensionality Barrier", "Oceanographic phenomena are inherently four-dimensional (x, y, z, t). Physical and biogeochemical properties vary horizontally across ocean basins, vertically through density-stratified layers, and dynamically across diurnal to interannual timescales.", "THE FLAW IN STANDARD GIS", "Traditional Web GIS flattens these processes into 2D surface rasters, discarding vertical velocity shears, thermocline gradients, and subsurface heat budgets."],
    ["02", "HETEROGENEITY", "Format Friction & Data Heterogeneity", "INCOIS hydrodynamic models compute momentum, temperature, and salinity in dense NetCDF-4 arrays, while Argo floats, gliders, and moored buoys produce asynchronous observations and trajectories.", "THE BOTTLENECK", "Harmonizing point and trajectory measurements with continuous 4D grids demands extensive data wrangling and prevents real-time model evaluation."],
    ["03", "CLIENT BANDWIDTH", "Web Client Bandwidth & Hardware Limits", "Standard browsers cannot ingest raw petascale ocean datasets without memory depletion, UI freezes, or severe frame drops.", "THE VORTEX RESOLUTION", "Heavy array slicing and spatial clipping move to high-performance cloud backends, delivering analysis-ready chunked data optimized for GPU acceleration."]
];

export default function About() {
    const pageRef = useRef(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const totalPortals = institutionalDirectory.reduce((count, group) => count + group.items.length, 0);
    const filteredDirectory = institutionalDirectory.filter((group) => activeFilter === "all" || group.categoryKey === activeFilter);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".about-hero-label, .about-hero-title, .about-hero-description, .about-scroll-indicator", {
                opacity: 0,
                y: 28,
                duration: 0.8,
                stagger: 0.13,
                ease: "power3.out"
            });
            gsap.utils.toArray(".reveal-card").forEach((card) => {
                gsap.from(card, { opacity: 0, y: 36, duration: 0.65, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 86%" } });
            });
        }, pageRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => { ScrollTrigger.refresh(); }, [activeFilter]);

    return (
        <>
            <Navbar />
            <main className="about-page about-light" ref={pageRef}>
                <div className="about-sand-texture" aria-hidden="true" />
                <section className="about-hero">
                    <div className="about-background" aria-hidden="true">
                        <video className="about-background-video" autoPlay loop muted playsInline preload="auto">
                            <source src="/video/about.mp4" type="video/mp4" />
                        </video>
                    </div>
                    <div className="about-overlay" aria-hidden="true" />
                    <div className="about-container about-hero-content">
                        <p className="about-hero-label">Operational specification · MoES / INCOIS</p>
                        <h1 className="about-hero-title">Two paradigms.<br /><em>One digital twin.</em></h1>
                        <p className="about-hero-description">Operational oceanography under the Ministry of Earth Sciences depends on continuous 4D hydrodynamic models and discrete in-situ observational networks. VORTEX-OCEAN unites both into a client-side WebGL2 digital twin.</p>
                    </div>
                    <div className="about-scroll-indicator"><span>Scroll to explore architecture</span></div>
                </section>

                <section className="about-exec-section section-space">
                    <div className="about-container exec-grid">
                        <article className="exec-card reveal-card">
                            <div className="card-top"><span>01 / Architectural friction</span><b>Current reality</b></div>
                            <h2>Reconciling incompatible oceans</h2>
                            <p>Numerical simulations such as ROMS and HYCOM provide predictive spatial coverage. In-situ platforms including Argo floats, OMNI, RAMA-2.0, and autonomous gliders deliver discrete physical measurements used as ground truth for state estimation.</p>
                            <small><strong>Data conflict:</strong> Multi-GB NetCDF-4 arrays vs. asynchronous Lagrangian trajectories.</small>
                        </article>
                        <article className="exec-card highlight reveal-card">
                            <div className="card-top"><span>02 / Client virtualization</span><b>Vortex resolution</b></div>
                            <h2>Serverless WebGL2 virtualization</h2>
                            <p>VORTEX-OCEAN dynamically virtualizes gridded arrays into multiscale chunked Zarr stores, streaming them beside live in-situ telemetry without local scientific software.</p>
                            <small><strong>Innovation:</strong> WebGL2 dual-core compute shaders + 60 FPS ray-marching.</small>
                        </article>
                    </div>
                </section>

                <section className="about-problems-section section-space">
                    <div className="about-container">
                        <header className="section-heading"><span>The operational problem statement</span><h2>Three fundamental computational barriers</h2></header>
                        <div className="problems-grid">
                            {problemCards.map(([number, pill, title, text, callout, calloutText]) => <article className="problem-card reveal-card" key={number}><div className="problem-card-top"><b>{number}</b><span>{pill}</span></div><h3>{title}</h3><p>{text}</p><div className="problem-callout"><small>{callout}</small><p>{calloutText}</p></div></article>)}
                        </div>
                    </div>
                </section>

                <section className="about-directory-section section-space">
                    <div className="about-container">
                        <header className="directory-header-row"><div className="section-heading"><span>Verified institutional reference directory</span><h2>Authoritative scientific data portals</h2><p>Official endpoints, operational data gateways, and scientific documentation governing the data pipelines integrated into VORTEX-OCEAN.</p></div><div className="directory-filters">{[["all", `All portals (${totalPortals})`], ["incois", "INCOIS & MoES (8)"], ["global", "Global arrays (4)"], ["tools", "Python toolkits (2)"]].map(([key, label]) => <button key={key} className={activeFilter === key ? "active" : ""} onClick={() => setActiveFilter(key)}>{label}</button>)}</div></header>
                        {filteredDirectory.map((group, groupIndex) => <div className="directory-group" key={group.categoryKey}><div className="directory-group-header"><h3><span>0{groupIndex + 1}</span>{group.category}</h3><small>{group.items.length} endpoints</small></div><div className="directory-grid">{group.items.map(([name, acronym, role, url, badge, coordinates]) => <a className="directory-card reveal-card" href={url} target="_blank" rel="noopener noreferrer" key={name}><div className="dir-card-header"><span>{badge}</span><small>{acronym}</small></div><h4>{name}</h4><p>{role}</p><footer><small>{coordinates}</small><b>Access portal ↗</b></footer></a>)}</div></div>)}
                    </div>
                </section>

                <section className="final-section"><div className="about-container final-inner"><span className="seal-badge">Verified technical specification</span><p className="seal-meta">Ministry of Earth Sciences (MoES) · INCOIS Hyderabad · Government of India</p><h2>The digital twin is live.</h2><p>VORTEX-OCEAN bridges 4D numerical ocean circulation models with discrete in-situ observational networks, creating a unified digital twin for marine scientists, disaster-management authorities, and maritime planners across the Indian Ocean basin.</p><div className="final-signature-strip"><div><small>Operational platform</small><b>VORTEX-OCEAN 4D</b></div><div><small>Coordination</small><b>INCOIS / MoES</b></div><div><small>Graphics pipeline</small><b>WEBGL2 DUAL-CORE COMPUTE</b></div><div><small>Data virtualization</small><b>ZARR / OPeNDAP / ERDDAP</b></div></div></div></section>
            </main>
        </>
    );
}
