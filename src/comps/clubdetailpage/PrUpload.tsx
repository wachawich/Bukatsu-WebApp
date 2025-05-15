import React, { useState } from 'react';
import { X, ImagePlus, Upload } from 'lucide-react';
import {PRUploadModalProps} from '@/utils/api/club';


const PRUploadModal: React.FC<PRUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [squareFile, setSquareFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [squarePreview, setSquarePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'square') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'banner') {
          setBannerFile(file);
          setBannerPreview(reader.result?.toString() || null);
        } else {
          setSquareFile(file);
          setSquarePreview(reader.result?.toString() || null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setBannerFile(null);
    setSquareFile(null);
    setBannerPreview(null);
    setSquarePreview(null);
    onClose();
  };

  const handleUpload = () => {
    onUpload({ banner: bannerFile, square: squareFile });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium">เพิ่มรูปภาพ</h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Banner Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">รูป Banner</label>
          {bannerPreview ? (
            <div className="relative mb-4">
              <img src={bannerPreview} alt="Banner Preview" className="w-full h-40 object-contain border rounded-lg" />
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                onClick={() => {
                  setBannerFile(null);
                  setBannerPreview(null);
                }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImagePlus size={36} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 mb-2">เลือกรูป Banner</p>
              <label className="inline-block">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'banner')} />
                <span className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded cursor-pointer">
                  เลือกรูปภาพ
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Square Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">รูป Square</label>
          {squarePreview ? (
            <div className="relative mb-4">
              <img src={squarePreview} alt="Square Preview" className="w-full h-40 object-contain border rounded-lg" />
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                onClick={() => {
                  setSquareFile(null);
                  setSquarePreview(null);
                }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImagePlus size={36} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 mb-2">เลือกรูป Square</p>
              <label className="inline-block">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'square')} />
                <span className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded cursor-pointer">
                  เลือกรูปภาพ
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button onClick={handleClose} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
            ยกเลิก
          </button>
          <button
            onClick={handleUpload}
            disabled={!bannerFile && !squareFile}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              bannerFile || squareFile
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Upload size={16} />
            อัพโหลด
          </button>
        </div>
      </div>
    </div>
  );
};

export default PRUploadModal;
