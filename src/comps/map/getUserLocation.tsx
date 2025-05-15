// getUserLocationWithMarker.ts
export function getUserLocationWithMarker(map: any): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (map) {
          // 🔵 Marker ตำแหน่ง
          const marker = new window.H.map.Marker(userPos);

          // 🟢 วงกลมแสดงขอบเขตตำแหน่ง
          const accuracyCircle = new window.H.map.Circle(userPos, 50, {
            style: {
              fillColor: 'rgba(0, 128, 255, 0.3)',  // สีพื้นวงกลม
              strokeColor: '#0078D7',               // สีขอบวงกลม
              lineWidth: 2,
            },
          });

          // เพิ่ม marker และวงกลมลงในแผนที่
          map.addObjects([accuracyCircle, marker]);
        }

        resolve(userPos);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
