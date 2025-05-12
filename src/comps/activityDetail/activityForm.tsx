// import React from 'react';
// import { Dialog } from '@headlessui/react';
// import FormBuilder from '@/comps/form/form-builder/form-builder';
// import { FormSchema } from '@/lib/types';

// interface ActivityFormModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (json: any) => void;
//   initialForm: FormSchema;
// }

// const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
//   isOpen,
//   onClose,
//   onSave,
//   initialForm,
// }) => {
//   return (
//     <Dialog open={isOpen} onClose={onClose} className="relative z-50">
//       <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <Dialog.Panel className="w-full max-w-[80%] rounded bg-white p-6 max-h-[80vh] overflow-y-auto">
//           <Dialog.Title className="text-xl font-semibold mb-4 text-black">
//             กรอกข้อมูลสมัครเข้าร่วมกิจกรรม
//           </Dialog.Title>
//           <FormBuilder initialForm={initialForm} onSave={onSave} />
//           <div className="mt-4 text-right">
//             <button
//               onClick={onClose}
//               className="text-sm text-gray-600 hover:text-gray-800"
//             >
//               ปิด
//             </button>
//           </div>
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   );
// };

// export default ActivityFormModal;