import React, { useEffect, useRef, useState  } from 'react';
import { getLocation } from "@/utils/api/location"
import MapRouteModal from "./MapRouteModal"; // ปรับ path ตามจริง
import LocationPopup from "./LocationPopup";
import { useRouter } from "next/router";
import { findAndRouteFromId } from "./findAndRouteFromId";
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
  locationId: number;
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const router = useRouter();
  const { start, end } = router.query;


  useEffect(() => {
    // จะรันทุกครั้งที่ start หรือ end เปลี่ยน
    console.log("start:", start);
    console.log("end:", end);
  }, [start, end]);


  useEffect(() => {
    if (start && end && mapInstanceRef.current) {
      findAndRouteFromId({
        startId: start,
        endId: end,
              map: mapInstanceRef.current,
              startRef,
              endRef,
              startMarkerRef,
              endMarkerRef,
              routeObjectsRef,
        apiKey: 'fAnmdyEh8EyRxpTms7faftupQenGyqHL63ckLKQRDKc',
      });
    }
  }, [start, end, mapInstanceRef.current]);

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
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.bottom = '20px';
        buttonContainer.style.left = '20px';
        buttonContainer.style.zIndex = '3000';
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
          map.getViewModel().setLookAtData({
            position: { lat: 13.651287687026441, lng: 100.494473986665 },
            zoom: 17.5
          }, true);
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

        console.log("Add center button", buttonContainer);

        // ดึงข้อมูลตำแหน่งจาก API และสร้าง markers
        const locationData : any = await getLocation({flag_valid: true})
        console.log("locationData", locationData.data)
        
        // สร้าง markers สำหรับทุกตำแหน่ง
        locationData.data.forEach((location: any) => {
          const marker = new window.H.map.Marker({ 
            lat: Number(location.lat), 
            lng: Number(location.long) 
          });
          map.addObject(marker);

          let bubble: any = null;
          let bubbleTimeout: any = null;

          if (location.location_name) {
            marker.addEventListener('pointerenter', (evt: any) => {
              if (bubbleTimeout) {
                clearTimeout(bubbleTimeout);
                bubbleTimeout = null;
              }
              if (bubble) {
                ui.removeBubble(bubble);
                bubble = null;
              }
              bubble = new window.H.ui.InfoBubble(
                { lat: Number(location.lat), lng: Number(location.long) },
                { content: `
                  <div id="bubble-anim" class="fade-in" style="font-size:16px;font-weight:bold;">
                    ${location.location_name}
                    <style>
                      .fade-in { animation: fadeIn 0.3s; }
                      .fade-out { animation: fadeOut 0.3s; }
                      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none;} }
                      @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; transform: translateY(10px);} }
                    </style>
                  </div>
                `}
              );
              ui.addBubble(bubble);
            });

            marker.addEventListener('pointerleave', () => {
              // ใส่คลาส fade-out ก่อน remove จริง
              if (bubble) {
                const bubbleDom = document.querySelector('.H_ib_body #bubble-anim');
                setTimeout(() => {
                  if (bubbleDom) {
                    bubbleDom.classList.remove('fade-in');
                    bubbleDom.classList.add('fade-out');
                  }
                  bubbleTimeout = setTimeout(() => {
                    if (bubble) {
                      ui.removeBubble(bubble);
                      bubble = null;
                    }
                    bubbleTimeout = null;
                  }, 300); // 300ms fadeOut
                }, 2000); // 2 วิค้างไว้ก่อน fadeOut
              }
            });
          }
        });
        
        console.log("New center:", map.getCenter());
        map.setCenter({ lat: 13.651287687026441 , lng: 100.494473986665 }, true);

        // const defaultCenter = { lat: latCenter, lng: lngCenter };


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

  const handleRouteSubmit = (start: string, end: string) => {
    window.location.href = `/map?start=${start}&end=${end}`;
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <div ref={mapRef} style={{ position: 'relative', width: '100vw', height: '100vh' }} />
      <button
        onClick={() => setModalOpen(true)}
        style={{
          position: "fixed", right: 80, bottom: 40, zIndex: 1001,
          width: 56, height: 56, borderRadius: "50%", background: "#34c759",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)", border: "none", cursor: "pointer"
        }}
      >
        <span style={{ fontSize: 32, color: "#fff" }}>+</span>
      </button>
      <MapRouteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleRouteSubmit}
      />
      {selectedLocation && (
        <LocationPopup
          locationName={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </div>
  );
};

export default HereMap;
