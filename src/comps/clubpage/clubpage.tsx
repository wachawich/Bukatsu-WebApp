import React from 'react';

const ClubPage = () => {
  // Sample data for club members
  const members = [
    { id: 1, name: 'NAHEE' },
    { id: 2, name: 'NAHEE' },
    { id: 3, name: 'NAHEE' },
    { id: 4, name: 'NAHEE' },
    { id: 5, name: 'NAHEE' },
    { id: 6, name: 'NAHEE' },
    { id: 7, name: 'NAHEE' },
    { id: 8, name: 'NAHEE' },
    { id: 9, name: 'NAHEE' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Title with horizontal lines */}
      <div className="flex items-center justify-center mb-10">
        <div className="border-t border-gray-300 flex-grow"></div>
        <h1 className="text-4xl font-bold px-4 text-center">Club</h1>
        <div className="border-t border-gray-300 flex-grow"></div>
      </div>

      {/* Grid of club members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="rounded-lg overflow-hidden shadow-sm">
            {/* Purple area with PR text */}
            <div className="bg-fuchsia-500 text-white h-40 flex items-center justify-center">
              <span className="text-xl font-bold">PR</span>
            </div>
            {/* Gray area with NAME text */}
            <div className="bg-gray-200 py-4 text-black">
              <p className="text-center font-bold">{member.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClubPage;