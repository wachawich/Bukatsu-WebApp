import React, { useState, useEffect } from "react";
import { getLocation } from "@/utils/api/location"; 
import { sendDataApiAI } from "@/utils/callAPI";

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
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<number | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; long: number } | null>(null);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (open) {
      getLocation({ flag_valid: true }).then(res => {
        setLocations(res.data || []);
      });
    }
  }, [open]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (uploading && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [uploading, countdown]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadStatus(null);
      setCoordinates(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setCountdown(30);
    setUploadStatus(null);
    setCoordinates(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await sendDataApiAI('POST', 'location.predict.ai', formData);
      setUploadStatus(201);
      setCoordinates({
        lat: response.lat,
        long: response.lon
      });
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus(500);
    } finally {
      setUploading(false);
    }
  };

  const openGoogleMaps = () => {
    if (coordinates) {
      const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.long}`;
      window.open(url, '_blank');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "route" && start && end) {
      onSubmit(start, end);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 min-w-[350px] min-h-[420px] shadow-2xl relative">
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
            <div className="mb-4 text-center text-lg text-gray-700">
              <div className="mb-4 flex flex-col items-center">
                <label
                  htmlFor="file-upload"
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl w-96 h-32 cursor-pointer transition
                    ${file ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100 hover:border-blue-400 hover:bg-blue-50"}`}
                >
                  <span className="text-gray-500 mb-2">
                    {file ? file.name : "อัพโหลดรูปภาพเพื่อค้นหา"}
                  </span>
                  <span className="text-2xl text-blue-400">+</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className={`mt-4 w-64 px-4 py-2 rounded-lg ${
                    uploading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  {uploading 
                    ? `กำลังอัพโหลด... (${countdown}s)` 
                    : uploadStatus === 201 
                      ? 'อัพโหลดสำเร็จ' 
                      : 'อัพโหลด'}
                </button>
                {uploadStatus === 201 && coordinates && (
                  <button
                    type="button"
                    onClick={openGoogleMaps}
                    className="mt-4 w-64 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    เปิด Google Maps
                  </button>
                )}
              </div>
            </div>
          )}
          {mode === "route" && (
          <button
            type="submit"
            className="w-full mt-6 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
          >
              สร้างเส้นทาง
          </button>
          )}
        </form>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700"
        >×</button>
      </div>
    </div>
  );
}