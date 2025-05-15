import React, { useEffect, useRef } from 'react';

import { getLocation } from "@/utils/api/location"

// ฟังก์ชันโหลด script แบบเรียงลำดับ
function loadScriptSequentially(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
}

// ฟังก์ชันโหลด HERE Maps SDK
async function loadHereMaps(): Promise<void> {
  const cssHref = 'https://js.api.here.com/v3/3.1/mapsjs-ui.css';

  if (!document.querySelector(`link[href="${cssHref}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    document.head.appendChild(link);
  }

  const scripts = [
    'https://js.api.here.com/v3/3.1/mapsjs-core.js',
    'https://js.api.here.com/v3/3.1/mapsjs-service.js',
    'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js',
    'https://js.api.here.com/v3/3.1/mapsjs-ui.js'
  ];

  for (const src of scripts) {
    await loadScriptSequentially(src);
  }
}

// ฟังก์ชันตรวจสอบว่า window.H.ui พร้อมใช้งานหรือยัง
async function waitForHereUI(retries = 10, delay = 300): Promise<void> {
  for (let i = 0; i < retries; i++) {
    if (window.H && window.H.ui && window.H.ui.UI) return;
    await new Promise(res => setTimeout(res, delay));
  }
  throw new Error("HERE UI module (window.H.ui) didn't initialize in time");
}

// ฟังก์ชันตรวจสอบว่า HERE SDK พร้อมใช้งานหรือยัง
async function waitForHereSDK(retries = 10, delay = 300): Promise<void> {
  for (let i = 0; i < retries; i++) {
    if (window.H && window.H.service && window.H.Map) return;
    await new Promise(res => setTimeout(res, delay));
  }
  throw new Error("HERE SDK didn't initialize in time");
}

interface HereMapProps {
  onShowModal?: (content: React.ReactNode) => void;
  onLocationSelect?: (location_id: number) => void; // เพิ่มตรงนี้
}

//Route
const createPedestrianRoute = (map, platform, start, end) => {
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
    (result) => {
      if (result.routes.length === 0) {
        console.warn("No route found.");
        return;
      }

      const route = result.routes[0];

      route.sections.forEach((section) => {
        // ✅ Decode polyline
        const linestring = window.H.geo.LineString.fromFlexiblePolyline(section.polyline);

        // ✅ Create polyline route
        const routeLine = new window.H.map.Polyline(linestring, {
          style: { strokeColor: '#1e90ff', lineWidth: 5 },
        });

        // ✅ Create start/end markers
        const startMarker = new window.H.map.Marker(section.departure.place.location);
        const endMarker = new window.H.map.Marker(section.arrival.place.location);

        // ✅ Add all objects to map
        map.addObjects([routeLine, startMarker, endMarker]);

        // ✅ Auto zoom to fit the route
        map.getViewModel().setLookAtData({
          bounds: routeLine.getBoundingBox(),
        });

        console.log("Route line and markers added to map.");
      });
    },
    (error) => {
      console.error("Routing error:", error);
    }
  );
};





const HereMap: React.FC<HereMapProps> = ({ onShowModal, onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null); // ใช้เก็บ instance ของแผนที่

  useEffect(() => {
    if (!mapRef.current) return;

    const scriptLoader = async () => {
      try {
        console.log('Start loading HERE Maps SDK...');
        await loadHereMaps();
        await waitForHereSDK();
        await waitForHereUI();  // ตรวจสอบว่า UI พร้อมใช้งาน

        console.log('HERE Maps SDK loaded successfully');

        // ตรวจสอบว่า mapInstanceRef ถูกกำหนดแล้วหรือยัง
        if (mapInstanceRef.current) {
          console.log('Reusing the existing map instance');
          return; // ถ้ามีแผนที่แล้วไม่สร้างใหม่
        }

        const platform = new window.H.service.Platform({
          apikey: 'fAnmdyEh8EyRxpTms7faftupQenGyqHL63ckLKQRDKc',  // แทนที่ด้วย API Key ของคุณ
        });

        const defaultLayers = platform.createDefaultLayers();
        const map = new window.H.Map(
          mapRef.current,
          defaultLayers.vector.normal.map,
          {
            center: { lat: 13.650873296192813, lng: 100.49411584028002 },
            zoom: 17.5,
            pixelRatio: window.devicePixelRatio || 1,
          }
        );

        mapInstanceRef.current = map;  // เก็บแผนที่ที่สร้างใน ref
        
        //Route
        createPedestrianRoute(
          mapInstanceRef.current,
          platform,
          { lat: 13.6534596, lng: 100.4949939 },  // จุด A
          { lat: 13.6502076, lng: 100.4919385 }   // จุด B
        );

        
        // ฟังก์ชันรีไซส์เมื่อหน้าจอเปลี่ยนขนาด
        window.addEventListener('resize', () => map.getViewPort().resize());

        // เปิดใช้งานการโต้ตอบกับแผนที่
        const behavior = new window.H.mapevents.Behavior(
          new window.H.mapevents.MapEvents(map)
        );

        // UI เริ่มต้น
        const ui = window.H.ui.UI.createDefault(map, defaultLayers);

        const locationData : any = await getLocation({flag_valid: true})
        console.log("locationData", locationData.data)

        const latCenter = locationData.data[0].lat
        const lngCenter = locationData.data[0].long;
        map.setCenter({ lat: 13.651287687026441 , lng: 100.494473986665 }, true);

        const defaultCenter = { lat: latCenter, lng: lngCenter };

        // --- ใส่ event ที่นี่เลย ---
        map.addEventListener('mapviewchangeend', () => {
          const currentCenter = map.getCenter();

          const distanceLat = Math.abs(currentCenter.lat - defaultCenter.lat);
          const distanceLng = Math.abs(currentCenter.lng - defaultCenter.lng);

          const threshold = 0.005;
          if (distanceLat > threshold || distanceLng > threshold) {
            console.log('ดึงกลับมาที่ศูนย์กลาง');
            map.setCenter(defaultCenter, true);
          }
        });


        const markers = locationData.data

        console.log("markers", markers)

        // เพิ่ม marker บนแผนที่
        // const markers = [
        //   { lat: 13.652020693665033, lng: 100.49147180132398, info: 'จุดที่ 1' },
        //   { lat: 13.64800363730579, lng: 100.49356857256268, info: 'จุด2' }
        // ];

        markers.forEach(({ lat, long, location_id, location_name }) => {
            const marker = new window.H.map.Marker({ lat, lng: long });

          if (location_name) {
            marker.setData(location_name);
            marker.addEventListener('tap', evt => {
              console.log(location_name);
            //   onShowModal(<p>{location_name}</p>);
            //   onLocationSelect(parseInt(location_id))
            });
          }
          map.addObject(marker);
        });

      } catch (error) {
        console.error('Error loading HERE Maps:', error);
      }
    };

    scriptLoader();

    // ทำลายแผนที่เมื่อคอมโพเนนต์ unmount
    return () => {
      if (mapInstanceRef.current) {
        console.log('Cleaning up the map instance');
        mapInstanceRef.current.dispose(); // ทำลายแผนที่เก่าก่อน
      }
    };
  }, []);

  return (
    <div ref={mapRef} style={{ display: 'flex', width: '100vw', height: '93.7vh' }} />
  );
};

export default HereMap;
