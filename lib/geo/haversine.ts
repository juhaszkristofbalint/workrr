export type GeoPoint = {
  lat: number;
  lng: number;
};

export function haversineKm(from: GeoPoint, to: GeoPoint) {
  const earthKm = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const lat1 = toRad(from.lat);
  const lat2 = toRad(to.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const km = earthKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return Math.round(km * 10) / 10;
}

function toRad(degrees: number) {
  return (degrees * Math.PI) / 180;
}
