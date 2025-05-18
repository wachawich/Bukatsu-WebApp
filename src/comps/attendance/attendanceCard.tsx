// import React from 'react';

// type Participant = {
//   user_first_name: string;
//   user_last_name: string;
//   role_name: string;
//   sex: string;
//   phone: string;
// };

// const AttendanceCard: React.FC<{ participant: Participant; activeTab: 'joined' | 'applied' }> = ({
//   participant,
//   activeTab,
// }) => {
//   return (
//     <tr className="bg-white border-b hover:bg-gray-100">
//       <td className="p-2 border">
//         {participant.user_first_name} {participant.user_last_name}
//       </td>
//       <td className="p-2 border">{participant.role_name}</td>
//       <td className="p-2 border">{participant.sex}</td>
//       <td className="p-2 border">{participant.phone || '-'}</td>
//       {activeTab === 'applied' && (
//         <td className="border p-2 space-x-2 text-sm">
//           <button className="px-3 py-1 bg-green-600 text-white rounded">approved</button>
//           <button className="px-3 py-1 bg-red-600 text-white rounded">rejected</button>
//         </td>
//       )}
//     </tr>
//   );
// };

// export default AttendanceCard;
import React from 'react';

type Participant = {
  user_first_name: string;
  user_last_name: string;
  role_name: string;
  sex: string;
  phone: string;
};

interface AttendanceCardProps {
  participant: Participant;
  activeTab: 'joined' | 'applied';
}

const AttendanceCard: React.FC<{ participant: Participant; activeTab: 'joined' | 'applied'; onApprove: (userSysId: string) => void }> = ({
  participant,
  activeTab,
  onApprove,
}) => {
  return (
    <tr className="bg-white border-b hover:bg-gray-100">
      <td className="p-2 border">{participant.user_first_name} {participant.user_last_name}</td>
      <td className="p-2 border">{participant.role_name}</td>
      <td className="p-2 border">{participant.sex}</td>
      <td className="p-2 border">{participant.phone || '-'}</td>
      {activeTab === 'applied' && (
        <td className="border p-2 space-x-2 text-sm">
          <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => onApprove(participant.user_sys_id)}>
            Approved
          </button>
          <button className="px-3 py-1 bg-red-600 text-white rounded">Rejected</button>
        </td>
      )}
    </tr>
  );
};


export default AttendanceCard;
