import React from 'react';
import { useState,useEffect } from "react";
import { useRouter } from 'next/router'
import { Users, Globe, X, Upload, ImagePlus } from "lucide-react";
import ImageUploadModal from './ImageUploadModal';
import { getClubImages,uploadClubImage,uploadPRImage,FormattedClubImage } from '@/utils/api/club';
import PRUploadModal from './PrUpload';


const ClubDetailCard = ({ club }:any) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPRUploadModal, setPRShowUploadModal] = useState(false);
  const [clubItems, setClubItems] = useState<FormattedClubImage[]>([]);
  const router = useRouter()
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const formatted = await getClubImages();
        setClubItems(formatted);
      } catch (error) {
        console.error('Failed to fetch clubs:', error);
      }
    };
  
    fetchImages();
  }, []);

  // Handle file uploa
  const handleUpload = async (file: File) => {
    try {
      const data = await uploadClubImage(file, club.club_id);
      console.log('Upload success:', data);
      router.reload();
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleUploadPR = async (files: { banner: File | null; square: File | null }) => {
    try {
      if (files.banner) {
        await uploadPRImage(files.banner, club.club_id, 'banner');
      }
      if (files.square) {
        await uploadPRImage(files.square, club.club_id, 'square');
      }
      console.log("Upload complete");
      // router.reload();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden p-6 mb-6">
        {/* Header Section with PR image and Club info */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* PR image or fallback */}
                <div
        className="cursor-pointer bg-fuchsia-500 text-black min-h-48 md:w-96 flex items-center justify-center rounded-lg overflow-hidden"
        onClick={() => setPRShowUploadModal(true)}
      >
        {club?.club_image_path ? (
        <img
          src={(club.club_image_path)?.banner} 
          alt={club?.club_name || 'Club Image'}
          className="w-full h-full object-cover"
        />
        ) : (
          <span className="text-2xl font-bold">PR</span>
        )}
      </div>
          
          {/* Club details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
            <h1 className="text-2xl font-bold mb-4">{club?.club_name || 'Club Name'}</h1>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-gray-700" />
                  <span>ชมรม</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-gray-700" />
                  <a
                    href={club?.club_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {club?.club_link || 'Website'}
                  </a>
                </div>
              </div>
            </div>
            
            {/* Tag and button */}
            <div className="flex justify-between items-center mt-4">
              <span className="bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-md">
                {club?.club_timestamp ? new Date(club.club_timestamp).toLocaleDateString() : 'TAG'}
              </span>
              <a
                href={club?.club_link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
              >
                ดูเพิ่มเติม
              </a>
            </div>
          </div>
        </div>
        
        {/* Detail Section with Add Image button */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
            <h2 className="text-lg font-medium">Detail</h2>
            <button className="text-gray-700 hover:text-gray-900 flex items-center" onClick={() => setShowUploadModal(true)}>
              <span className="text-sm mr-1">+</span> เพิ่มรูปภาพ
            </button>
          </div>
          <p className="text-gray-700">{club?.club_description || 'No description available'}</p>
        </div>
        {/* Three gray boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {clubItems
  .filter(item => String(item.id) === String(club.club_id))
  .map((item, index) => (
    <div key={index} className="bg-gray-200 rounded-lg h-52 overflow-hidden">
      <img
        src={item.link}
        alt={`Club Image ${index + 1}`}
        className="w-full h-full object-cover"
      />
    </div>
))}
</div>

      </div>
      <ImageUploadModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />
      <PRUploadModal
        isOpen={showPRUploadModal}
        onClose={() => setPRShowUploadModal(false)}
        onUpload={handleUploadPR}
      />
    </div>
  );
};

export default ClubDetailCard;
