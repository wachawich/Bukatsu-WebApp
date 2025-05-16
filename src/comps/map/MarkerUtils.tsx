// MarkerUtils.tsx

interface MarkerData {
  lat: number;
  long: number;
  location_id: string;
  location_name?: string;
}

interface MarkerParams {
  position: any;
  map: any;
  markerRef: React.MutableRefObject<any>;
}

interface InfoBubbleParams {
  position: any;
  location_name: string;
  map: any;
  ui: any;
  handlers: {
    setStatus: (status: string) => void;
    tryCreateRoute: () => void;
    startRef: React.MutableRefObject<any>;
    endRef: React.MutableRefObject<any>;
    startMarkerRef: React.MutableRefObject<any>;
    endMarkerRef: React.MutableRefObject<any>;
  };
}

// ฟังก์ชันสำหรับสร้าง marker เริ่มต้น
export function createStartMarker({ position, map, markerRef }: MarkerParams) {
  if (markerRef.current) {
    map.removeObject(markerRef.current);
    markerRef.current = null;
  }

  const icon = new window.H.map.Icon(
    `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C8.268 0 2 6.268 2 14c0 9.941 12.09 24.36 12.6 24.96a2 2 0 0 0 2.8 0C17.91 38.36 30 23.941 30 14 30 6.268 23.732 0 16 0z" fill="#00bcd4"/>
      <circle cx="16" cy="14" r="6" fill="white"/>
    </svg>`
  );

  const marker = new window.H.map.Marker(position, { icon });
  map.addObject(marker);
  markerRef.current = marker;

  return { lat: position.lat, lng: position.lng };
}

// ฟังก์ชันสำหรับสร้าง marker สิ้นสุด
export function createEndMarker({ position, map, markerRef }: MarkerParams) {
  if (markerRef.current) {
    map.removeObject(markerRef.current);
    markerRef.current = null;
  }

  const redIcon = new window.H.map.Icon(
    `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C8.268 0 2 6.268 2 14c0 9.941 12.09 24.36 12.6 24.96a2 2 0 0 0 2.8 0C17.91 38.36 30 23.941 30 14 30 6.268 23.732 0 16 0z" fill="#00d431"/>
      <circle cx="16" cy="14" r="6" fill="white"/>
    </svg>`
  );

  const marker = new window.H.map.Marker(position, { icon: redIcon });
  map.addObject(marker);
  markerRef.current = marker;

  return { lat: position.lat, lng: position.lng };
}

// ฟังก์ชันสำหรับสร้าง InfoBubble
export function createInfoBubble({ position, location_name, map, ui, handlers }: InfoBubbleParams) {
  const content = `
    <div style="font-family: 'Kanit', 'Prompt', -apple-system, sans-serif; padding: 12px; width: 220px; animation: fadeIn 0.2s ease-out;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div style="font-size: 16px; font-weight: 500; color: #1a73e8;">${location_name}</div>
        <div style="cursor: pointer; padding: 4px;"></div>
      </div>
      
      <button id="set-start-btn" style="display: flex; align-items: center; width: 100%; margin-bottom: 8px; padding: 8px 12px; background-color: #f8f9fa; border: 1px solid #dadce0; border-radius: 6px; font-size: 14px; color: #1e8e3e; cursor: pointer; text-align: left;">
        <svg style="margin-right: 8px; width: 16px; height: 16px; fill: currentColor;" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        สถานที่เริ่มต้น
      </button>
      
      <button id="set-end-btn" style="display: flex; align-items: center; width: 100%; padding: 8px 12px; background-color: #f8f9fa; border: 1px solid #dadce0; border-radius: 6px; font-size: 14px; color: #d93025; cursor: pointer; text-align: left;">
        <svg style="margin-right: 8px; width: 16px; height: 16px; fill: currentColor;" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        สถานที่สิ้นสุด
      </button>
      
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </div>
  `;

  const bubble = new window.H.ui.InfoBubble(position, { content });
  ui.addBubble(bubble);

  // รอให้ DOM ใน InfoBubble โหลดก่อน แล้วผูก event ให้ปุ่ม
  setTimeout(() => {
    setupMarkerSelectionHandlers({
      position,
      map,
      ui,
      bubble,
      setStatus: handlers.setStatus,
      tryCreateRoute: handlers.tryCreateRoute,
      startRef: handlers.startRef,
      endRef: handlers.endRef,
      startMarkerRef: handlers.startMarkerRef,
      endMarkerRef: handlers.endMarkerRef,
    });
  }, 100);
}

// ฟังก์ชันที่ bind event ให้ปุ่มใน InfoBubble
function setupMarkerSelectionHandlers({
  position,
  map,
  ui,
  bubble,
  setStatus,
  tryCreateRoute,
  startRef,
  endRef,
  startMarkerRef,
  endMarkerRef,
}: {
  position: any;
  map: any;
  ui: any;
  bubble: any;
  setStatus: (status: string) => void;
  tryCreateRoute: () => void;
  startRef: React.MutableRefObject<any>;
  endRef: React.MutableRefObject<any>;
  startMarkerRef: React.MutableRefObject<any>;
  endMarkerRef: React.MutableRefObject<any>;
}) {
  const setStartBtn = document.getElementById('set-start-btn');
  const setEndBtn = document.getElementById('set-end-btn');

  if (setStartBtn) {
    setStartBtn.onclick = () => {
      startRef.current = createStartMarker({ position, map, markerRef: startMarkerRef });
      setStatus('เลือกจุดเริ่มต้นแล้ว');
      ui.removeBubble(bubble);
      tryCreateRoute();
    };
  }

  if (setEndBtn) {
    setEndBtn.onclick = () => {
      endRef.current = createEndMarker({ position, map, markerRef: endMarkerRef });
      setStatus('เลือกจุดสิ้นสุดแล้ว');
      ui.removeBubble(bubble);
      tryCreateRoute();
    };
  }
}

// ฟังก์ชันหลักสำหรับเพิ่ม markers ลงแผนที่และจัดการ event
export function addMarkersToMap(
  map: any,
  ui: any,
  markers: MarkerData[],
  handlers: {
    setStatus: (status: string) => void;
    tryCreateRoute: () => void;
    startRef: React.MutableRefObject<any>;
    endRef: React.MutableRefObject<any>;
    startMarkerRef: React.MutableRefObject<any>;
    endMarkerRef: React.MutableRefObject<any>;
  }
) {
  markers.forEach(({ lat, long, location_id, location_name }) => {
    const marker = new window.H.map.Marker({ lat, lng: long });

    if (location_name) {
      marker.setData(location_name);

      marker.addEventListener('tap', (evt) => {
        const position = evt.target.getGeometry();
        createInfoBubble({
          position,
          location_name,
          map,
          ui,
          handlers
        });
      });
    }

    map.addObject(marker);
  });
} 