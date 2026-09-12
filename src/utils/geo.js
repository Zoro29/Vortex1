export function latLonToVector3(latitude, longitude, radius = 2) {
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = (longitude + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);

  const y = radius * Math.cos(phi);

  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}
