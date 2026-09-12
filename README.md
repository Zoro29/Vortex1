# VORTEX — 3D Ocean Data Visualization Platform

> **Interactive 3D visualization and analysis platform for integrating numerical ocean model outputs with real-world in-situ observations.**

VORTEX is a browser-native oceanographic visualization platform designed to help researchers, operational oceanographers, students, and decision-makers explore complex ocean data through an interactive 3D environment.

The platform brings together **numerical ocean model outputs, Argo profiling floats, BGC-Argo observations, Gliders, CTD measurements, and other oceanographic datasets** into a unified research workspace.

Instead of switching between multiple desktop tools and 2D visualization systems, VORTEX provides a single web-based environment for exploring ocean conditions across **space, depth, time, and physical/biogeochemical variables**.

---

## 🌊 Problem Statement

### Develop a web-based interactive 3D visualization platform that integrates numerical ocean model outputs and in-situ observations.

India's vast Exclusive Economic Zone (EEZ) and coastline require continuous monitoring of ocean state variables.

INCOIS generates and archives large volumes of oceanographic data, including:

* Temperature
* Salinity
* Current velocity and direction
* Chlorophyll
* Dissolved oxygen
* Other physical and biogeochemical variables

These datasets originate from numerical ocean models as well as observational platforms such as:

* Argo profiling floats
* BGC-Argo floats
* Underwater Gliders
* CTD instruments
* Moorings
* Drifters
* Satellite observations

The data is distributed across formats such as **NetCDF, ASCII, and delimited text**, with multiple spatial grids, depth levels, and time steps.

Despite the availability of these datasets, there is a significant gap in having a unified, browser-based 3D environment capable of visualizing model outputs and observational data simultaneously.

Operational oceanographers may therefore need to work across multiple software packages and visualization systems, making rapid comparison between **model predictions and real observations** difficult.

---

# 🎯 VORTEX Objectives

VORTEX aims to provide a unified research environment capable of:

1. Visualizing ocean model fields in 3D.
2. Displaying real-world observational platforms geographically.
3. Comparing model predictions with observations.
4. Exploring ocean variables across depth.
5. Navigating historical and time-dependent datasets.
6. Inspecting individual instrument profiles.
7. Supporting multiple oceanographic data sources.
8. Providing researcher-oriented filtering and analysis tools.
9. Making complex ocean data accessible through a browser.
10. Creating a foundation for future ocean forecasting and decision-support systems.

---

# 🔬 Core Capabilities

## 1. Interactive 3D Ocean Visualization

VORTEX is designed around a browser-native 3D visualization environment.

The visualization layer can represent:

* Temperature fields
* Salinity fields
* Current vectors
* Chlorophyll concentration
* Dissolved oxygen
* Depth-dependent ocean properties
* Model grids
* Observation locations

Researchers can navigate the ocean environment spatially instead of being restricted to conventional 2D maps.

### Planned visualization capabilities

* 3D volumetric rendering
* Depth slicing
* Isosurfaces
* Vertical profiles
* Vector-field visualization
* Time-step animation
* Adjustable opacity
* Vertical exaggeration
* Dynamic scientific color scales

---

# 🛰️ 2. Observation Platform Integration

VORTEX provides a unified spatial environment for ocean observation platforms.

### Supported / Planned Platforms

| Platform      | Description                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| **ARGO**      | Autonomous profiling floats measuring temperature, salinity and pressure/depth |
| **BGC-ARGO**  | Biogeochemical profiling floats                                                |
| **Gliders**   | Autonomous underwater vehicles collecting ocean profiles                       |
| **CTD**       | Conductivity, Temperature and Depth observations                               |
| **Moorings**  | Fixed-location continuous observations                                         |
| **Drifters**  | Surface ocean trajectory observations                                          |
| **Satellite** | Remote-sensing ocean observations                                              |

Each observation platform can be represented spatially and inspected individually.

For example, selecting an ARGO float can provide:

```text
Float ID
Latitude
Longitude
Observation Time
Depth
Temperature
Salinity
Pressure
```

with the possibility of displaying the corresponding **depth-vs-variable profile**.

---

# 🌡️ 3. Ocean Variable Exploration

VORTEX is designed to support multiple physical and biogeochemical variables.

### Physical Variables

* Sea temperature
* Salinity
* Pressure
* Depth
* Current velocity
* Current direction
* Sea level

### Biogeochemical Variables

* Chlorophyll-a
* Dissolved oxygen
* Nitrate
* pH
* Other BGC variables

The architecture is intended to allow new variables to be integrated without requiring major changes to the visualization system.

---

# ⏱️ 4. Time-Based Exploration

Oceanographic conditions change continuously.

VORTEX therefore provides temporal filtering and visualization capabilities.

Researchers can explore:

* Last 1 year
* Last 3 years
* Last 5 years
* Last 10 years
* Complete available dataset

Future versions will support:

* Exact date ranges
* Time-step navigation
* Play/pause animation
* Temporal interpolation
* Dataset comparison across different periods

Example:

```text
2021 ───── 2022 ───── 2023 ───── 2024 ───── 2025 ───── 2026
                         ▲
                     Current Step
```

---

# 🌊 5. Depth-Aware Analysis

Ocean processes vary significantly with depth.

VORTEX therefore treats depth as a first-class dimension of the visualization.

Researchers can investigate:

```text
Surface
0–10 m

Shallow
10–200 m

Twilight
200–1000 m

Deep
1000–4000 m

Abyssal
4000 m+
```

Future versions will support arbitrary depth ranges and interactive depth slicing.

---

# 🗺️ 6. Geographic Filtering

The platform supports geographic exploration at multiple scales.

### Planned geographic regions

* Global Ocean
* Indian Ocean
* Arabian Sea
* Bay of Bengal
* Pacific Ocean
* Atlantic Ocean
* Southern Ocean
* Arctic Ocean

Future versions will support:

* Custom bounding boxes
* Latitude/longitude filtering
* User-defined regions
* EEZ boundaries
* Coastal zones
* Marine protected areas

---

# 🧪 7. Data Quality & Metadata

Scientific visualization requires information about data quality and provenance.

VORTEX is designed to expose relevant metadata such as:

* Dataset name
* Observation source
* Instrument/platform
* Observation timestamp
* Latitude/longitude
* Depth
* Variable
* Units
* Quality-control status
* Processing mode
* Data version

Possible quality states include:

* Real-time
* Delayed mode
* Adjusted
* Quality controlled
* Unprocessed/raw

This allows researchers to understand not only **what they are seeing**, but also **where the data came from**.

---

# 📊 8. Scientific Color Mapping

VORTEX separates **UI colors** from **scientific visualization colors**.

The interface uses restrained colors for usability, while the visualization layer can use scientifically meaningful scales.

Examples:

### Temperature

```text
Low Temperature ───────────────── High Temperature
      Blue → Cyan → Yellow → Orange → Red
```

### Salinity

```text
Low ─────────────────────────────── High
Blue → Cyan → Green → Yellow
```

### Chlorophyll

```text
Low ─────────────────────────────── High
Dark Blue → Cyan → Green → Yellow
```

Color scales will support:

* Minimum / maximum values
* Linear scale
* Logarithmic scale
* Custom palettes
* Dataset-specific ranges

---

# 📁 Data Sources

VORTEX is designed to work with publicly available oceanographic datasets and standards.

## Numerical Ocean Model Outputs

### INCOIS LAS

https://las.incois.gov.in/

### Copernicus Marine Service

https://data.marine.copernicus.eu/product/GLOBAL_MULTIYEAR_PHY_001_030/description

---

## 🌐 Argo Global Data

IFREMER Argo data repository:

```text
ftp://ftp.ifremer.fr/ifremer/argo
```

Argo provides global profiling-float observations including variables such as:

* Temperature
* Salinity
* Pressure
* Position
* Time

---

## 🤿 Glider Data

IFREMER Glider repository:

```text
ftp://ftp.ifremer.fr/ifremer/glider/v2/
```

Glider datasets can provide high-resolution measurements along underwater trajectories.

---

## 📡 In-Situ Data

VORTEX is designed to support additional in-situ data sources as the platform evolves.

Potential sources include:

* CTD
* Moorings
* Drifters
* ADCP
* HF Radar
* Additional BGC platforms

---

# 🧬 Data Formats

The platform is designed around common scientific data formats and standards.

### Primary Formats

* NetCDF
* ASCII
* CSV
* Delimited text
* JSON

### Scientific Standards

VORTEX aims to follow:

* **CF Conventions for NetCDF**
* **OGC WMS**
* **OGC WCS**
* OPeNDAP-compatible services

This improves interoperability with existing oceanographic infrastructure.

---
---

# 🖥️ Technology Stack

## Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Three.js
* WebGL
* GSAP
* React Router

## Scientific Data Processing

Planned / supported technologies include:

* Python
* xarray
* NetCDF
* NumPy
* Pandas

## Backend

Designed to support lightweight APIs for:

* Dataset discovery
* Spatial queries
* Temporal queries
* Variable selection
* Observation retrieval
* Metadata
* Scientific data processing

Potential backend technologies include:

* FastAPI
* REST APIs
* OPeNDAP

---

# 🧭 Research Workspace

The VORTEX research workspace is designed around a researcher-first workflow.

```text
┌─────────────────┬─────────────────────────────────────────────┐
│                 │                                             │
│    FILTERS      │              3D OCEAN VIEW                  │
│                 │                                             │
│ Time            │                                             │
│ Data Source     │                  Ocean Model                │
│ Parameter       │                                             │
│ Depth           │             + Observation Data              │
│ Region          │                                             │
│ Quality         │                                             │
│                 │                                             │
│ Apply Filters   │                                             │
│                 │                                             │
└─────────────────┴─────────────────────────────────────────────┘
```

Researchers can progressively narrow datasets using combinations of:

* Time
* Observation platform
* Parameter
* Depth
* Region
* Data type
* Quality control
* Dataset

---

# 🔍 Model vs Observation Comparison

One of the primary objectives of VORTEX is to enable direct comparison between numerical models and observations.

For example:

```text
MODEL
Temperature at 100 m
        │
        │
        ▼
   3D Ocean Field
        │
        │
        ├──────────── ARGO Observation
        │
        ├──────────── CTD Observation
        │
        └──────────── Glider Observation
```

A researcher can inspect whether observed values correspond with model predictions at comparable:

* Location
* Depth
* Time
* Variable

This can support model validation and operational analysis.

---

# ⚡ Performance Strategy

Large ocean datasets can contain millions of measurements.

VORTEX therefore aims to avoid sending unnecessary raw data directly to the browser.

The architecture is designed to support:

* Server-side filtering
* Spatial subsetting
* Temporal subsetting
* Variable selection
* Depth selection
* Data tiling
* Lazy loading
* Dataset caching
* Progressive visualization
* Level-of-detail rendering

The browser should receive only the data required for the current visualization state.

---

# 🔌 Extensibility

VORTEX is designed as a modular platform rather than a fixed visualization.

Future data sources can include:

* CTD
* ADCP
* HF Radar
* Moorings
* Drifters
* Gliders
* Satellite products
* Additional BGC sensors
* New numerical models
* Reanalysis datasets
* Machine-learning-derived products

New variables should be integrated through a modular data-definition and visualization architecture.

---

# 🚨 Disaster Management Applications

Oceanographic information plays an important role in operational decision-making.

VORTEX can potentially support:

### 🌪️ Cyclone & Storm Analysis

Understanding:

* Temperature structure
* Ocean heat content
* Currents
* Upper-ocean conditions

### 🛟 Search & Rescue

Ocean current information can help understand the movement of floating objects and assist operational analysis.

### 🎣 Fisheries

Oceanographic variables such as temperature, chlorophyll and currents can support marine ecosystem and fisheries analysis.

### 🌊 Coastal Hazard Assessment

Visualization of ocean state variables can assist with understanding changing marine conditions.

### 🌍 Climate Monitoring

Long-term ocean observations can be explored to investigate changes in:

* Temperature
* Salinity
* Ocean circulation
* Biogeochemical conditions

---

# 🎓 Public Outreach & Education

VORTEX is not limited to researchers.

The same visualization infrastructure can transform complex numerical ocean data into accessible interactive experiences.

Potential applications include:

* School education
* University teaching
* Ocean awareness campaigns
* Science exhibitions
* Public demonstrations
* E-learning
* Policy communication

Instead of presenting ocean models as inaccessible scientific files, VORTEX can allow users to visually explore the ocean and understand how its physical and biological systems behave.

---

# 🔮 Future Roadmap

## Phase 1 — Research & Foundation

* [x] Project architecture
* [x] VORTEX interface
* [x] Research dashboard
* [x] Data filtering architecture
* [ ] Dataset metadata model
* [ ] Scientific data ingestion pipeline

## Phase 2 — Visualization

* [ ] Interactive 3D globe
* [ ] Ocean model rendering
* [ ] Depth slicing
* [ ] Observation markers
* [ ] ARGO profiles
* [ ] BGC-ARGO visualization
* [ ] Glider trajectories
* [ ] CTD visualization

## Phase 3 — Scientific Analysis

* [ ] Time-step animation
* [ ] Model/observation comparison
* [ ] Interactive profile charts
* [ ] Custom colorbars
* [ ] Isosurfaces
* [ ] Current vectors
* [ ] Vertical exaggeration
* [ ] Data-quality visualization

## Phase 4 — Advanced Platform

* [ ] OPeNDAP integration
* [ ] WMS/WCS support
* [ ] Large-scale dataset optimization
* [ ] Advanced spatial queries
* [ ] Dataset comparison
* [ ] Model validation tools
* [ ] Additional observation platforms

## Phase 5 — Intelligence & Decision Support

* [ ] Automated anomaly detection
* [ ] Ocean event detection
* [ ] ML-derived ocean products
* [ ] Forecast comparison
* [ ] Decision-support workflows
* [ ] Operational dashboards

---

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

Check your versions:

```bash
node --version
npm --version
git --version
```

---

## Installation

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd VORTEX
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

# 🏭 Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

# 🌐 Deployment

VORTEX can be deployed as a modern web application using platforms such as Vercel or institutional infrastructure.

For production deployment, configure:

* Environment variables
* API endpoints
* Dataset services
* CORS policies
* Large-data processing infrastructure
* Authentication
* WebGL/browser compatibility

For institutional deployment, the backend and scientific datasets can be hosted within the organization's infrastructure.

---

# 🔐 Data & Security

VORTEX should separate public scientific datasets from user-specific functionality.

Future production deployments can include:

* Authentication
* Researcher accounts
* Dataset permissions
* API authentication
* Request throttling
* Audit logs
* Secure environment variables
* Server-side data access

Sensitive credentials and API keys should **never be committed to the repository**.

Use environment variables instead.

---

# 📜 Standards & Interoperability

The platform is designed with interoperability in mind.

Relevant standards include:

### CF Conventions

Used for describing multidimensional scientific data in NetCDF datasets.

### OGC WMS

Web Map Service for interoperable geospatial visualization.

### OGC WCS

Web Coverage Service for multidimensional coverage data.

### OPeNDAP

Remote access to scientific datasets without requiring users to download entire datasets.

These standards can allow VORTEX to connect with existing oceanographic infrastructure rather than requiring every dataset to be converted into a proprietary format.

---

# 🧠 Why VORTEX?

Traditional ocean-data workflows often require researchers to work across several tools:

```text
Model Data
     ↓
Desktop Software
     ↓
2D Visualization
     ↓
Separate Observation Tool
     ↓
Profile Analysis
     ↓
Manual Comparison
```

VORTEX aims to simplify this workflow:

```text
             ┌──────────────────┐
             │   OCEAN DATA     │
             └────────┬─────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
      MODEL DATA            OBSERVATIONS
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
             ┌──────────────────┐
             │     VORTEX       │
             │                  │
             │  3D Visualization│
             │  Time            │
             │  Depth           │
             │  Space           │
             │  Profiles        │
             │  Comparison      │
             └──────────────────┘
                      │
                      ▼
              RESEARCH INSIGHT
```

The goal is not simply to create another map.

**The goal is to create an interactive research environment for understanding the ocean.**

---

# 🌍 Vision

VORTEX aims to bridge the gap between **large-scale oceanographic datasets and intuitive scientific understanding**.

By combining numerical models, observational platforms, multidimensional data, and browser-native 3D visualization, the platform can provide researchers with a more direct way to investigate the ocean across:

**Space × Time × Depth × Variables**

---

# 🏛️ Problem Statement Information

| Field                 | Details                                                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Problem Statement** | Develop a web-based interactive 3D visualization platform that integrates numerical ocean model outputs and in-situ observations |
| **Organization**      | Ministry of Earth Sciences (MoES)                                                                                                |
| **Department**        | Indian National Centre for Ocean Information Services (INCOIS)                                                                   |
| **Category**          | Software                                                                                                                         |
| **Theme**             | Disaster Management                                                                                                              |
| **Project**           | VORTEX                                                                                                                           |
| **Platform**          | Web-based                                                                                                                        |
| **Primary Domain**    | Oceanographic Data Visualization                                                                                                 |

---

# 📚 Dataset References

### Numerical Ocean Model Outputs

INCOIS LAS
https://las.incois.gov.in/

Copernicus Marine Service — Global Multi-Year Physical Product
https://data.marine.copernicus.eu/product/GLOBAL_MULTIYEAR_PHY_001_030/description

### Argo

IFREMER Argo Global Data Repository

```text
ftp://ftp.ifremer.fr/ifremer/argo
```

### Glider

IFREMER Glider Data Repository

```text
ftp://ftp.ifremer.fr/ifremer/glider/v2/
```

---

# 👥 Target Users

VORTEX is designed for:

* Operational oceanographers
* Ocean scientists
* Marine researchers
* Climate researchers
* Disaster-management teams
* Ocean forecasters
* Academic institutions
* Students
* Science communicators
* Policymakers

---

# ⚠️ Current Status

> **VORTEX is an actively developing research and visualization platform.**

The current version focuses on establishing the browser-based interface, research workspace, visualization architecture, and filtering system.

Scientific data ingestion, 3D ocean rendering, model-observation comparison, and advanced analytical capabilities are being developed progressively.

---

# 📄 License

Add the project's license here before making the repository public.

Example:

```text
MIT License
```

---

# 🌊 VORTEX

### Visualizing the Ocean. Understanding the Data.

**A browser-native 3D ocean research environment connecting numerical models with real-world observations.**
