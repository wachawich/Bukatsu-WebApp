export function createPedestrianRoute({
  map,
  platform,
  start,
  end,
  routeObjectsRef,
}: {
  map: any;
  platform: any;
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  routeObjectsRef: React.MutableRefObject<any[]>;
}) {
  // ลบ route เดิมออกก่อน
  routeObjectsRef.current.forEach((obj) => {
    map.removeObject(obj);
  });
  routeObjectsRef.current = [];

  const router = platform.getRoutingService(null, 8);

  const routeRequestParams = {
    routingMode: 'fast',
    transportMode: 'pedestrian',
    origin: `${start.lat},${start.lng}`,
    destination: `${end.lat},${end.lng}`,
    return: 'polyline,summary,actions,instructions',
  };

  router.calculateRoute(
    routeRequestParams,
    (result: any) => {
      if (!result.routes || result.routes.length === 0) {
        console.warn("ไม่พบเส้นทาง");
        return;
      }

      const route = result.routes[0];

      route.sections.forEach((section: any) => {
        const linestring = window.H.geo.LineString.fromFlexiblePolyline(section.polyline);

        const routeLine = new window.H.map.Polyline(linestring, {
          style: { strokeColor: '#1e90ff', lineWidth: 5 },
        });

        const startMarker = new window.H.map.Marker(section.departure.place.location);
        const endMarker = new window.H.map.Marker(section.arrival.place.location);

        // บันทึกไว้เพื่อลบภายหลัง
        routeObjectsRef.current.push(routeLine, startMarker, endMarker);

        map.addObjects([routeLine, startMarker, endMarker]);

        //ขยับมุมกล้องใหม่
        // map.getViewModel().setLookAtData({
        //   bounds: routeLine.getBoundingBox(),
        // });
      });
    },
    (error: any) => {
      console.error("Routing error:", error);
    }
  );
}