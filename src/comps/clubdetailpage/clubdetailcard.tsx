import React from 'react';
import { Globe, Users } from 'lucide-react';

const ClubDetailPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 ">
      <div className="border border-gray-200 rounded-lg overflow-hidden p-6 mb-6">
        {/* Header Section with PR image and Club info */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Purple PR area */}
          <div className="bg-fuchsia-500 text-white min-h-48 md:w-96 flex items-center justify-center rounded-lg">
            <span className="text-2xl font-bold">PR</span>
          </div>
          
          {/* Club details column */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Club name and icons */}
            <div>
              <h1 className="text-2xl font-bold mb-4">Club Name</h1>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={20} className="text-white" />
                </div>
              </div>
            </div>
            
            {/* Tag and button */}
            <div className="flex justify-between items-center mt-4">
              <span className="bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-md">
                TAG
              </span>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md">
                ดูเพิ่มเติม
              </button>
            </div>
          </div>
        </div>
        
        {/* Detail Section */}
        <div className="mb-8">
          <p className="text-white">Detail</p>
        </div>
        
        {/* Three gray boxes at bottom */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-200 rounded-lg h-40"></div>
          <div className="bg-gray-200 rounded-lg h-40"></div>
          <div className="bg-gray-200 rounded-lg h-40"></div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetailPage;