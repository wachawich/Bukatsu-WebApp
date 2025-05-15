// handleMarkerSelection.ts
import { createStartMarker, createEndMarker, createInfoBubble, addMarkersToMap } from './MarkerUtils';

interface MarkerData {
  lat: number;
  long: number;
  location_id: string;
  location_name?: string;
}

interface HandlerParams {
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
}

interface InitialSetupParams {
  map: any;
  ui: any;
  locationData: any[];
  setStatus: (status: string) => void;
  tryCreateRoute: () => void;
  startRef: React.MutableRefObject<any>;
  endRef: React.MutableRefObject<any>;
  startMarkerRef: React.MutableRefObject<any>;
  endMarkerRef: React.MutableRefObject<any>;
}

// ฟังก์ชันที่ bind event ให้ปุ่มใน InfoBubble
export function setupMarkerSelectionHandlers({
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
}: HandlerParams) {
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

// ฟังก์ชันสำหรับตั้งค่า marker เริ่มต้น
export function setupInitialMarkers({
  map,
  ui,
  locationData,
  setStatus,
  tryCreateRoute,
  startRef,
  endRef,
  startMarkerRef,
  endMarkerRef,
}: InitialSetupParams) {
  // 1. เพิ่ม markers ลงแผนที่
  if (locationData.length > 0) {
    addMarkersToMap(map, ui, locationData, {
      setStatus,
      tryCreateRoute,
      startRef,
      endRef,
      startMarkerRef,
      endMarkerRef,
    });
  }

  // 2. ตั้งค่า marker เริ่มต้นและสิ้นสุด (ถ้ามีข้อมูลมากกว่า 2 จุด)
  if (locationData.length >= 2) {
    // สร้าง marker เริ่มต้น
    startRef.current = createStartMarker({
      position: { lat: locationData[0].lat, lng: locationData[0].long },
      map,
      markerRef: startMarkerRef
    });
    setStatus('ตำแหน่งเริ่มต้นถูกตั้งค่าแล้ว');

    // สร้าง marker สิ้นสุด
    endRef.current = createEndMarker({
      position: { lat: locationData[1].lat, lng: locationData[1].long },
      map,
      markerRef: endMarkerRef
    });
    setStatus('ตำแหน่งสิ้นสุดถูกตั้งค่าแล้ว');

    // สร้างเส้นทาง
    tryCreateRoute();
  }
}

// Re-export functions from MarkerUtils
export { createStartMarker, createEndMarker, createInfoBubble, addMarkersToMap };
