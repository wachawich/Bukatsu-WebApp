import React, { useState, useEffect } from "react";
import { getLocation } from "@/utils/api/location"; 

type LocationType = { location_id: string | number; location_name: string };

interface MapRouteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (start: string, end: string) => void;
}

export default function MapRouteModal({ open, onClose, onSubmit }: MapRouteModalProps) {
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [mode, setMode] = useState("route"); // 'route' หรือ 'whereami'

  useEffect(() => {
    if (open) {
      getLocation({ flag_valid: true }).then(res => {
        setLocations(res.data || []);
      });
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "route" && start && end) {
      onSubmit(start, end);
      onClose();
    }
    // ถ้า mode เป็น 'whereami' สามารถเพิ่ม logic ได้ที่นี่
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 min-w-[350px] shadow-2xl relative">
        <h2 className="text-center text-xl font-bold mb-6 text-black">Map Application</h2>
        {/* Dropdown ด้านล่างหัวข้อ */}
        <select
          className="w-full p-3 rounded-lg border border-gray-400 text-center text-xl font-semibold mb-6 text-black"
          value={mode}
          onChange={e => setMode(e.target.value)}
        >
          <option value="route">สร้างเส้นทาง</option>
          <option value="whereami">ฉันอยู่ไหน</option>
        </select>
        <form onSubmit={handleSubmit}>
          {mode === "route" && (
            <>
              <div className="mb-4">
                <label className="font-semibold mb-1 block text-black">เลือกจุดเริ่มต้น</label>
                <select
                  value={start}
                  onChange={e => setStart(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                >
                  <option value="">เลือกจุดเริ่มต้น...</option>
                  {locations.map(loc => (
                    <option key={loc.location_id} value={loc.location_id}>{loc.location_name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="font-semibold mb-1 block text-black">เลือกจุดสิ้นสุด</label>
                <select
                  value={end}
                  onChange={e => setEnd(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                >
                  <option value="">เลือกจุดสิ้นสุด...</option>
                  {locations.map(loc => (
                    <option key={loc.location_id} value={loc.location_id}>{loc.location_name}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          {mode === "whereami" && (
            <div className="mb-4 text-center text-lg text-gray-700">แสดงตำแหน่งปัจจุบันของคุณ</div>
          )}
          <button
            type="submit"
            className="w-full mt-6 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
          >
            {mode === "route" ? "สร้างเส้นทาง" : "ดูตำแหน่งของฉัน"}
          </button>
        </form>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700"
        >×</button>
      </div>
    </div>
  );
}