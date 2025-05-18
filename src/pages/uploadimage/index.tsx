import React, { useState, useRef } from 'react';
import { IconUpload,   IconX } from '@tabler/icons-react';
import {uploadImage} from '@/utils/api/uploadimage'; 

export default function UploadPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFileName(file.name);
      setUploadSuccess(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFileName(file.name);
      setUploadSuccess(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setFileName(null);
    setUploadSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const data = await uploadImage(selectedImage);
      console.log('Upload success:', data);
    setFileUrl(data.fileUrl);
    setIsUploading(false);
    setUploadSuccess(true);
    } catch (error) {
    console.error('Upload error:', error);
    setIsUploading(false);
      setUploadSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">อัพโหลดรูปภาพ</h1>

        {!selectedImage ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center">
              <IconUpload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์
              </p>
              <p className="text-xs text-gray-500">
                รองรับไฟล์ JPG, PNG และ GIF ขนาดไม่เกิน 5MB
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden mb-4">
              <img
                src={previewUrl ?? ''}
                alt="Preview"
                className="w-full h-64 object-contain bg-gray-100"
              />
              <button
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-opacity"
                onClick={clearImage}
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {fileName && (
              <p className="text-sm text-gray-600 mb-4 text-center">{fileName}</p>
            )}

            {uploadSuccess ? (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center space-y-2">
                <div>อัพโหลดสำเร็จ!</div>
                {fileUrl && (
                <div className="text-sm break-all">
                    <span className="font-semibold">URL:</span>{' '}
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {fileUrl}
                    </a>
                </div>
                )}
            </div>
            ) : (
            <button
                className={`w-full py-3 px-4 rounded-lg text-white font-medium ${isUploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                onClick={handleUpload}
                disabled={isUploading} >
                {isUploading ? 'กำลังอัพโหลด...' : 'อัพโหลด'}
            </button>
            )}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
