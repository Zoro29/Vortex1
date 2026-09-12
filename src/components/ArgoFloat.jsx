/**
 * The float itself, deployed in the water column.
 *
 * Presentational only: the Explore timeline owns its depth, tilt and which
 * component is called out, so the float stays on the same clock as the
 * narration and the environment.
 *
 * Hotspot coordinates are percentages of the sprite box, tuned against the
 * artwork. Adjust them here if the image is ever replaced.
 */

const HOTSPOTS = {
  antenna: { top: "7%", label: "Iridium antenna" },
  sensors: { top: "26%", label: "CTD sensor package" },
  hull: { top: "52%", label: "Pressure case" },
  pump: { top: "78%", label: "Buoyancy engine" },
};

export default function ArgoFloat({ variant }) {
  return (
    <div className="argo" aria-hidden="true">
      <div className="argo-inner">
        <img className="argo-sprite" src="/imgs/argo.png" alt="" />

        {Object.entries(HOTSPOTS).map(([key, spot]) => (
          <div className="argo-hotspot" data-part={key} key={key} style={{ top: spot.top }}>
            <i className="argo-pin" />
            <span className="argo-leader" />
            <span className="argo-tag">
              <b>{key === "sensors" && variant === "bgc" ? "Optode + optics" : spot.label}</b>
              <em />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
