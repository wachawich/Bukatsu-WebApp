import React, { useEffect, useRef, useState  } from 'react';
import { addMarkersToMap, createStartMarker, createEndMarker } from './MarkerUtils';
import { getLocation } from "@/utils/api/location"
import { getUserLocationWithMarker } from './getUserLocation';
import { getUserDestinationLocation } from './getUserDestinationLocation';
import { createPedestrianRoute } from './PedestrianRoute';
import { selectRouteFromCurrentLocation } from './selectRouteFromCurrentLocation';
import { setupInitialMarkers } from './handleMarkerSelection';
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

const HereMap: React.FC<HereMapProps> = ({ onShowModal, onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const startRef = useRef<{ lat: number; lng: number } | null>(null);
  const endRef = useRef<{ lat: number; lng: number } | null>(null);
  const routeObjectsRef = useRef<any[]>([]);
  const [map, setMap] = useState<any>(null);
  const [ui, setUi] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [status, setStatus] = useState("กรุณาเลือกจุดเริ่มต้น");
  const startMarkerRef = useRef<any>(null);
  const endMarkerRef = useRef<any>(null);

  const tryCreateRoute = () => {
    if (startRef.current && endRef.current && mapInstanceRef.current) {
      const platform = new window.H.service.Platform({
        apikey: 'fAnmdyEh8EyRxpTms7faftupQenGyqHL63ckLKQRDKc',
      });

    createPedestrianRoute({
      map: mapInstanceRef.current,
      platform,
      start: startRef.current,
      end: endRef.current,
      routeObjectsRef,
    });
  }
};

  useEffect(() => {
    if (!mapRef.current) return;

    const scriptLoader = async () => {
      try {
        console.log('Start loading HERE Maps SDK...');
        await loadHereMaps();
        await waitForHereSDK();
        await waitForHereUI();

        console.log('HERE Maps SDK loaded successfully');

        if (mapInstanceRef.current) {
          console.log('Reusing the existing map instance');
          return;
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

        mapInstanceRef.current = map;

        window.addEventListener('resize', () => map.getViewPort().resize());

        // เปิดใช้งานการโต้ตอบกับแผนที่
        const behavior = new window.H.mapevents.Behavior(
          new window.H.mapevents.MapEvents(map)
        );

        // UI เริ่มต้น
        const ui = window.H.ui.UI.createDefault(map, defaultLayers);
        setMap(map);
        setUi(ui);

        // ดึงข้อมูลตำแหน่งจาก API
        const locationData : any = await getLocation({flag_valid: true})
        console.log("locationData", locationData.data)
        setMarkers(locationData.data);

        // ตั้งค่าตำแหน่งเริ่มต้นของแผนที่
        // const latCenter = locationData.data[0].lat
        // const lngCenter = locationData.data[0].long;
        map.setCenter({ lat: 13.651287687026441 , lng: 100.494473986665 }, true);

        // const defaultCenter = { lat: latCenter, lng: lngCenter };



        // ===== ฟังก์ชันสำหรับเลือกเส้นทาง =====
        // ฟังก์ชันที่ 1: เลือกจุดเริ่มต้นและจุดสิ้นสุดเอง
        // setupInitialMarkers({
        //   map,
        //   ui,
        //   locationData: locationData.data,
        //   setStatus,
        //   tryCreateRoute,
        //   startRef,
        //   endRef,
        //   startMarkerRef,
        //   endMarkerRef,
        // });

        // ฟังก์ชันที่ 2: เลือกเฉพาะจุดสิ้นสุด (เริ่มต้นจากตำแหน่งปัจจุบัน)
        selectRouteFromCurrentLocation({
          map: mapInstanceRef.current,
          setStatus,
          tryCreateRoute,
          startRef,
          endRef,
          startMarkerRef,
          endMarkerRef,
        });
        // ===== จบส่วนของฟังก์ชันสำหรับเลือกเส้นทาง =====

        const markers = locationData.data
        console.log("markers", markers)

        // เพิ่ม markers ลงแผนที่
        if (markers.length > 0) {
          addMarkersToMap(map, ui, markers, {
            setStatus,
            tryCreateRoute,
            startRef,
            endRef,
            startMarkerRef,
            endMarkerRef,
          });
        }

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
