// import { useState, useEffect } from "react";
// import { createActivity, getActivityType } from "@/utils/api/activity";
// import { getRole} from "@/utils/api/roleData"
// import { getSubject } from "@/utils/api/subject";
// import { getUser } from "@/utils/api/userData";

// export default function ActivityForm() {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     start_date: "",
//     end_date: "",
//     status: "active",
//     contact: "",
//     user_count: 0,
//     price: 0,
//     user_property: "",
//     remark: "",
//     create_by: 0,
//     location_id: 0,
//     location_name: "",
//     location_type: "",
//     activity_type: {},
//     subject: {}
//   });
  
//   const [activityTypes, setActivityTypes] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
  
//   // Selected options for multiple select
//   const [selectedActivityTypes, setSelectedActivityTypes] = useState([]);
//   const [selectedSubjects, setSelectedSubjects] = useState([]);

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         // Fetch activity types
//         const activityTypeResponse = await getActivityType({ show: true });
//         if (activityTypeResponse && activityTypeResponse.result) {
//           setActivityTypes(activityTypeResponse.result);
//         }
        
//         // Fetch subjects
//         const subjectResponse = await getSubject({ show: true });
//         if (subjectResponse && subjectResponse.result) {
//           setSubjects(subjectResponse.result);
//         }
        
//         // Fetch roles for user property dropdown
//         const roleResponse = await getRole({ show: true });
//         if (roleResponse && roleResponse.result) {
//           setRoles(roleResponse.result);
//         }
        
//         // Fetch users
//         const userResponse = await getUser({});
//         if (userResponse && userResponse.result) {
//           setUsers(userResponse.result);
          
//           // Set current user (for demo purposes - in a real app this would come from auth)
//           // You would typically get the current user ID from your authentication system
//           if (userResponse.result.length > 0) {
//             const user = userResponse.result[0];
//             setCurrentUser(user);
//             setFormData(prev => ({
//               ...prev,
//               create_by: user.user_sys_id
//             }));
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//         setErrorMessage("Failed to load form data. Please try again.");
//       }
//     };

//     fetchInitialData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type } = e.target;
    
//     // Handle numeric inputs
//     if (type === "number") {
//       setFormData({
//         ...formData,
//         [name]: value === "" ? "" : Number(value)
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value
//       });
//     }
//   };
  
//   const handleActivityTypeChange = (e) => {
//     const activityTypeId = Number(e.target.value);
//     if (e.target.checked) {
//       // Add to selected list
//       setSelectedActivityTypes([...selectedActivityTypes, activityTypeId]);
//     } else {
//       // Remove from selected list
//       setSelectedActivityTypes(selectedActivityTypes.filter(id => id !== activityTypeId));
//     }
//   };
  
//   const handleSubjectChange = (e) => {
//     const subjectId = Number(e.target.value);
//     if (e.target.checked) {
//       // Add to selected list
//       setSelectedSubjects([...selectedSubjects, subjectId]);
//     } else {
//       // Remove from selected list
//       setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
//     }
//   };

//   const validateForm = () => {
//     const requiredFields = ['title', 'create_by', 'start_date', 'end_date', 'status', 'location_id', 'user_count'];
//     const missingFields = requiredFields.filter(field => !formData[field]);
    
//     if (missingFields.length > 0) {
//       setErrorMessage(`Please fill in the following required fields: ${missingFields.join(', ')}`);
//       return false;
//     }
    
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }
    
//     setLoading(true);
//     setSuccessMessage("");
//     setErrorMessage("");

//     try {
//       // Format activity_type and subject data as objects with keys 0, 1, 2, etc.
//       const activityTypeObj = {};
//       selectedActivityTypes.forEach((id, index) => {
//         activityTypeObj[index] = id;
//       });
      
//       const subjectObj = {};
//       selectedSubjects.forEach((id, index) => {
//         subjectObj[index] = id;
//       });
      
//       // Add create_date as current date and format the data
//       const dataToSubmit = {
//         ...formData,
//         create_date: new Date().toISOString().split("T")[0],
//         activity_type: activityTypeObj,
//         subject: subjectObj
//       };
      
//       const response = await createActivity(dataToSubmit);
      
//       if (response && response.result) {
//         setSuccessMessage("Activity created successfully!");
//         // Reset form
//         setFormData({
//           title: "",
//           description: "",
//           start_date: "",
//           end_date: "",
//           status: "active",
//           contact: "",
//           user_count: 0,
//           price: 0,
//           user_property: "",
//           remark: "",
//           create_by: currentUser ? currentUser.user_sys_id : 0,
//           location_id: 0,
//           location_name: "",
//           location_type: "",
//           activity_type: {},
//           subject: {}
//         });
//         setSelectedActivityTypes([]);
//         setSelectedSubjects([]);
//       } else {
//         setErrorMessage("Failed to create activity. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error creating activity:", error);
//       setErrorMessage("An error occurred while creating the activity.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">DSAT Open House 2025 - Create New Activity</h1>
      
//       {successMessage && (
//         <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
//           {successMessage}
//         </div>
//       )}
      
//       {errorMessage && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
//           {errorMessage}
//         </div>
//       )}
      
//       {currentUser && (
//         <div className="mb-6 p-4 bg-blue-50 rounded-md flex items-center">
//           <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
//             {currentUser.user_first_name ? currentUser.user_first_name.charAt(0) : "U"}
//           </div>
//           <div>
//             <p className="font-medium">Creating as:</p>
//             <p className="text-lg">{currentUser.user_first_name} {currentUser.user_last_name}</p>
//             <p className="text-sm text-gray-600">{currentUser.email}</p>
//           </div>
//         </div>
//       )}
      
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Title */}
//           <div className="col-span-2">
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//               Activity Title *
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="e.g. DSAT Open House 2025"
//             />
//           </div>
          
//           {/* Activity Types - Multiple Checkbox Selection */}
//           <div className="col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Activity Types *
//             </label>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//               {activityTypes.map((type) => (
//                 <div key={type.activity_type_id} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id={`activity_type_${type.activity_type_id}`}
//                     value={type.activity_type_id}
//                     checked={selectedActivityTypes.includes(type.activity_type_id)}
//                     onChange={handleActivityTypeChange}
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <label htmlFor={`activity_type_${type.activity_type_id}`} className="ml-2 text-sm text-gray-700">
//                     {type.activity_type_name}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {/* Subject - Multiple Checkbox Selection */}
//           <div className="col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Related Subjects
//             </label>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//               {subjects.map((subject) => (
//                 <div key={subject.subject_id} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id={`subject_${subject.subject_id}`}
//                     value={subject.subject_id}
//                     checked={selectedSubjects.includes(subject.subject_id)}
//                     onChange={handleSubjectChange}
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <label htmlFor={`subject_${subject.subject_id}`} className="ml-2 text-sm text-gray-700">
//                     {subject.subject_name}
//                   </label>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {/* Date Range */}
//           <div>
//             <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
//               Start Date *
//             </label>
//             <input
//               type="date"
//               id="start_date"
//               name="start_date"
//               value={formData.start_date}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <div>
//             <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
//               End Date *
//             </label>
//             <input
//               type="date"
//               id="end_date"
//               name="end_date"
//               value={formData.end_date}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           {/* Description */}
//           <div className="col-span-2">
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//               Description *
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows={4}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Describe the activity..."
//             />
//           </div>
          
//           {/* Contact Information */}
//           <div>
//             <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
//               Contact Information *
//             </label>
//             <input
//               type="text"
//               id="contact"
//               name="contact"
//               value={formData.contact}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Contact phone, email, etc."
//             />
//           </div>
          
//           {/* Status */}
//           <div>
//             <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
//               Status *
//             </label>
//             <select
//               id="status"
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="active">Active</option>
//               <option value="pending">Pending</option>
//               <option value="cancelled">Cancelled</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>
          
//           {/* User Count */}
//           <div>
//             <label htmlFor="user_count" className="block text-sm font-medium text-gray-700 mb-1">
//               Maximum Participants *
//             </label>
//             <input
//               type="number"
//               id="user_count"
//               name="user_count"
//               min="0"
//               value={formData.user_count}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Maximum number of participants"
//             />
//           </div>
          
//           {/* Price */}
//           <div>
//             <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
//               Price
//             </label>
//             <input
//               type="number"
//               id="price"
//               name="price"
//               min="0"
//               step="0.01"
//               value={formData.price}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Price in THB"
//             />
//           </div>
          
//           {/* User Property (Role) */}
//           <div>
//             <label htmlFor="user_property" className="block text-sm font-medium text-gray-700 mb-1">
//               Target Audience
//             </label>
//             <input
//               type="text"
//               id="user_property"
//               name="user_property"
//               value={formData.user_property}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="e.g. นักเรียน, นักศึกษา"
//             />
//           </div>
          
//           {/* Location Information */}
//           <div>
//             <label htmlFor="location_id" className="block text-sm font-medium text-gray-700 mb-1">
//               Location ID *
//             </label>
//             <input
//               type="number"
//               id="location_id"
//               name="location_id"
//               value={formData.location_id}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Location ID if available"
//             />
//           </div>
          
//           <div>
//             <label htmlFor="location_name" className="block text-sm font-medium text-gray-700 mb-1">
//               Location Name
//             </label>
//             <input
//               type="text"
//               id="location_name"
//               name="location_name"
//               value={formData.location_name}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="e.g. Mahidol University Salaya"
//             />
//           </div>
          
//           <div>
//             <label htmlFor="location_type" className="block text-sm font-medium text-gray-700 mb-1">
//               Location Type
//             </label>
//             <select
//               id="location_type"
//               name="location_type"
//               value={formData.location_type}
//               onChange={handleChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select Location Type</option>
//               <option value="university">University</option>
//               <option value="conference_hall">Conference Hall</option>
//               <option value="online">Online</option>
//               <option value="hybrid">Hybrid</option>
//               <option value="หอพัก">หอพัก</option>
//               <option value="other">Other</option>
//             </select>
//           </div>
          
//           {/* Additional Notes */}
//           <div className="col-span-2">
//             <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">
//               Additional Notes
//             </label>
//             <textarea
//               id="remark"
//               name="remark"
//               value={formData.remark}
//               onChange={handleChange}
//               rows={3}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Any additional information..."
//             />
//           </div>
//         </div>
        
//         <div className="flex justify-end space-x-4 mt-8">
//           <button
//             type="button"
//             onClick={() => window.history.back()}
//             className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={loading}
//             className="px-6 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
//           >
//             {loading ? "Creating..." : "Create Activity"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }