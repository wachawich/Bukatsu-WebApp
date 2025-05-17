import { getLocation } from "@/utils/api/location";
// import { createStartMarker, createEndMarker } from "./MarkerUtils";
// import { createPedestrianRoute } from "./PedestrianRoute";

interface FindAndRouteParams {
  startId: string | number;
  endId: string | number;
  map: any;
  startRef: React.MutableRefObject<any>;
  endRef: React.MutableRefObject<any>;
  startMarkerRef: React.MutableRefObject<any>;
  endMarkerRef: React.MutableRefObject<any>;
  routeObjectsRef: React.MutableRefObject<any[]>;
  apiKey: string;
}

export async function findAndRouteFromId({
  startId,
  endId,
  map,
  startRef,
  endRef,
  startMarkerRef,
  endMarkerRef,
  routeObjectsRef,
  apiKey,
}: FindAndRouteParams) {
  if (!startId || !endId || !map) return;

  // ดึงข้อมูล lat/lng ของ start และ end
  const [startLoc, endLoc] = await Promise.all([
    getLocation({ location_id: startId }),
    getLocation({ location_id: endId }),
  ]);

  const startData = startLoc.data?.[0];
  const endData = endLoc.data?.[0];

  if (!startData || !endData) return;

  // แปลง coordinates เป็น number
  const startLat = Number(startData.lat);
  const startLong = Number(startData.long);
  const endLat = Number(endData.lat);
  const endLong = Number(endData.long);

  // สร้าง Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLong}&destination=${endLat},${endLong}`;
  
  // Redirect to Google Maps
  window.location.href = googleMapsUrl;

  /* 
  // โค้ดเดิมสำหรับ HERE Maps
  // สร้าง marker
  startRef.current = createStartMarker({
    position: { lat: startData.lat, lng: startData.long },
    map,
    markerRef: startMarkerRef,
  });
  endRef.current = createEndMarker({
    position: { lat: endData.lat, lng: endData.long },
    map,
    markerRef: endMarkerRef,
  });

  // คำนวณเส้นทาง
  const platform = new window.H.service.Platform({
    apikey: apiKey,
  });
  createPedestrianRoute({
    map,
    platform,
    start: { lat: startData.lat, lng: startData.long },
    end: { lat: endData.lat, lng: endData.long },
    routeObjectsRef,
  });
  */
}
