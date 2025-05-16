import React, { useEffect, useRef, useState  } from 'react';
import { addMarkersToMap, createStartMarker, createEndMarker } from './MarkerUtils';
import { getLocation } from "@/utils/api/location"
import { getUserLocationWithMarker } from './getUserLocation';
import { getUserDestinationLocation } from './getUserDestinationLocation';
import { createPedestrianRoute } from './PedestrianRoute';
import { selectRouteFromCurrentLocation } from './selectRouteFromCurrentLocation';
import { setupInitialMarkers } from './handleMarkerSelection';
import { routeToLocation } from './routeToLocation';
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
  onLocationSelect?: (callback: (location_id: number) => void) => void;
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


        //Input location_id to userlocation
        const handleLocationSelect = async (location_id: number) => {
          if (!mapInstanceRef.current) return;
      
          try {
            await routeToLocation({
              map: mapInstanceRef.current,
              location_id,
              setStatus,
              startRef,
              endRef,
              startMarkerRef,
              endMarkerRef,
              routeObjectsRef,
            });
          } catch (error) {
            console.error('Error handling location selection:', error);
            setStatus('เกิดข้อผิดพลาดในการสร้างเส้นทาง');
          }
        };
      
        // ย้ายการเรียก handleLocationSelect ไปอยู่ใน useEffect
        useEffect(() => {
          // เรียกเมื่อ component mount และ map พร้อมใช้งาน
          if (mapInstanceRef.current) {
            handleLocationSelect(10); // inputlocationid
          }
        }, [mapInstanceRef.current]); // เรียกเมื่อ mapInstanceRef.current เปลี่ยน




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
  }}

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

        // สร้างปุ่มกลับมาที่ center
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.bottom = '20px';
        buttonContainer.style.left = '20px';
        buttonContainer.style.zIndex = '1000';
        buttonContainer.innerHTML = `
          <div style="
            background-color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: pointer;
            transition: background-color 0.2s;
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                fill="#1a73e8"/>
            </svg>
          </div>
        `;

        // เพิ่ม event listener สำหรับการคลิกปุ่ม
        buttonContainer.addEventListener('click', () => {
          map.setCenter({ lat: 13.651287687026441, lng: 100.494473986665 }, true);
        });

        // เพิ่ม hover effect
        buttonContainer.addEventListener('mouseover', () => {
          const div = buttonContainer.querySelector('div');
          if (div) div.style.backgroundColor = '#f8f9fa';
        });
        buttonContainer.addEventListener('mouseout', () => {
          const div = buttonContainer.querySelector('div');
          if (div) div.style.backgroundColor = 'white';
        });

        // เพิ่มปุ่มลงในแผนที่
        mapRef.current?.appendChild(buttonContainer);

        // ดึงข้อมูลตำแหน่งจาก API
        const locationData : any = await getLocation({flag_valid: true})
        console.log("locationData", locationData.data)
        setMarkers(locationData.data);
        
        console.log("New center:", map.getCenter());
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
        // selectRouteFromCurrentLocation({
        //   map: mapInstanceRef.current,
        //   setStatus,
        //   tryCreateRoute,
        //   startRef,
        //   endRef,
        //   startMarkerRef,
        //   endMarkerRef,
        // });



        // เพิ่ม markers ลงแผนที่
        // const markers = locationData.data;
        // console.log("markers", markers);

        // if (markers.length > 0) {
        //   addMarkersToMap(map, ui, markers, {
        //     setStatus,
        //     tryCreateRoute,
        //     startRef,
        //     endRef,
        //     startMarkerRef,
        //     endMarkerRef,
        //   });
        // }

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
