import React, { useState } from 'react';
import { X, ImagePlus, Upload } from 'lucide-react';
import {ImageUploadModalProps} from '@/utils/api/club';


const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result ? reader.result.toString() : null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset state and close modal
  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  // Handle file upload
  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      handleClose();
    }
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

        <div className="mb-6">
          {previewUrl ? (
            <div className="relative">
              <img src={previewUrl} alt="Preview" className="w-full h-64 object-contain border rounded-lg" />
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <ImagePlus size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 mb-4">ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              <label className="inline-block">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <span className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                  เลือกรูปภาพ
                </span>
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={handleClose} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
            ยกเลิก
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              selectedFile ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
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

export default ImageUploadModal;
