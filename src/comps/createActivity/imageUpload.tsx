import React, { useState, useRef } from 'react';
import {
  IconUpload,
  IconLoader2,
  IconX,
  IconCheck,
  IconExternalLink
} from '@tabler/icons-react';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  onDeleteImage: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, onDeleteImage }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image')) {
      handleFileInput(file);
    }
  };

  const handleFileInput = async (file: File) => {
    setUploading(true);
    // Simulate image upload, replace with your upload logic
    setTimeout(() => {
      setUploading(false);
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
      setUploadSuccess(true);
      onImageUpload(imageUrl);
    }, 2000);
  };

  const handleDeleteImage = () => {
    setImageUrl(null);
    setUploadSuccess(false);
    onDeleteImage();
  };

  return (
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">รูปภาพกิจกรรม</label>
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all cursor-pointer h-[200px] flex items-center justify-center ${
          isDragging ? 'border-gray-400 bg-gray-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onClick={handleClickUpload}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && e.target.files[0] && handleFileInput(e.target.files[0])}
          accept="image/*"
          className="hidden"
        />
        
        {uploading ? (
          <div className="text-center space-y-2">
            <IconLoader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" />
            <p className="text-blue-500 font-medium">กำลังอัปโหลด...</p>
            <p className="text-sm text-gray-500">กรุณารอสักครู่</p>
          </div>
        ) : imageUrl ? (
          <div className="space-y-2">
            <div className="relative w-36 h-36 mx-auto">
              <img 
                src={imageUrl} 
                alt="รูปกิจกรรม" 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteImage();
                }}
                className="absolute top-1 right-1 p-1 bg-orange-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
            {uploadSuccess && (
              <div className="flex items-center justify-center space-x-1 text-green-600">
                <IconCheck className="w-4 h-4" />
                <span className="text-sm">อัปโหลดสำเร็จ</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center">
              <IconUpload className="w-10 h-10 text-gray-400" />
            </div>
            <div className="mt-4">
              <p className="text-gray-700 font-medium">ลากและวางไฟล์ที่นี่</p>
              <p className="text-sm text-gray-500 mt-1">หรือคลิกเพื่อเลือกไฟล์</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
