// import React, { useState, useEffect } from "react";
// import { createActivity, ActivityField } from "@/utils/api/activity";
// import { getLocation, LocationField } from "@/utils/api/location";

// const Createactivity = () => {
//   const [locations, setLocations] = useState<LocationField[]>([]);

//   const [formData, setFormData] = useState<ActivityField>({
//     title: "",
//     description: "",
//     start_date: "",
//     end_date: "",
//     status: "",
//     contact: "",
//     user_count: 0,
//     price: 0,
//     user_property: "",
//     remark: "",
//     create_by: "",
//     location_id: 0,
//   });

//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const locationRes = await getLocation({ flag_valid: true }); // ✅ เพิ่มเงื่อนไขให้ fetch location ที่ valid เท่านั้น

//         if (locationRes?.success && Array.isArray(locationRes.data)) {
//           setLocations(locationRes.data);
//         } else {
//           console.warn("Location fetch returned invalid data:", locationRes);
//         }
//       } catch (error) {
//         console.error("Error fetching locations:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: ["user_count", "price", "location_id"].includes(name)
//         ? Number(value)
//         : value,
//     }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const fakeUrl = URL.createObjectURL(file);
//       // สามารถเพิ่ม logic upload file จริงได้ที่นี่
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const { title, start_date, end_date, status, create_by, location_id, user_count } = formData;

//     if (!title || !start_date || !end_date || !status || !create_by || !location_id || !user_count) {
//       alert("Please fill in all required fields.");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await createActivity(formData);
//       if (response.success) {
//         alert("Activity created successfully!");
//         setFormData({
//           title: "",
//           description: "",
//           start_date: "",
//           end_date: "",
//           status: "",
//           contact: "",
//           user_count: 0,
//           price: 0,
//           user_property: "",
//           remark: "",
//           create_by: "",
//           location_id: 0,
//         });
//       } else {
//         alert("An error occurred while creating the activity.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("An error occurred while submitting the form.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-[#f9f9ff] px-4 md:px-32 py-10">
//       <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:p-12">
//         <h1 className="text-3xl font-semibold text-center mb-8 font-cherry">Activity Information</h1>
//         <form onSubmit={handleSubmit}>
//           {/* Section 1: Basic Info */}
//           <section className="mb-8">
//             <div className="grid gap-4">
//               <div>
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                   Activity Title
//                 </label>
//                 <input
//                   type="text"
//                   id="title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   placeholder="Enter activity title"
//                   className="rounded-full p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
//                   required
//                 />
//               </div>

//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                   Description
//                 </label>
//                 <textarea
//                   id="description"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   placeholder="Describe your activity"
//                   className="h-24 rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
//                     Start Date
//                   </label>
//                   <input
//                     type="date"
//                     id="start_date"
//                     name="start_date"
//                     value={formData.start_date}
//                     onChange={handleChange}
//                     className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
//                     End Date
//                   </label>
//                   <input
//                     type="date"
//                     id="end_date"
//                     name="end_date"
//                     value={formData.end_date}
//                     onChange={handleChange}
//                     className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Section 2: Participants and Price */}
//           <section className="mb-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="user_count" className="block text-sm font-medium text-gray-700 mb-1">
//                   Number of Participants
//                 </label>
//                 <input
//                   type="number"
//                   id="user_count"
//                   name="user_count"
//                   value={formData.user_count}
//                   onChange={handleChange}
//                   placeholder="Max number of participants"
//                   min="0"
//                   className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
//                   Price
//                 </label>
//                 <input
//                   type="number"
//                   id="price"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleChange}
//                   placeholder="Cost to participate (0 for free)"
//                   min="0"
//                   className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
//                 />
//               </div>
//             </div>

//             <div className="mt-4">
//               <label htmlFor="user_property" className="block text-sm font-medium text-gray-700 mb-1">
//                 Participant Requirements
//               </label>
//               <input
//                 id="user_property"
//                 name="user_property"
//                 value={formData.user_property}
//                 onChange={handleChange}
//                 className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
//               />
//             </div>
//           </section>

//           {/* Section 3: Location and Contact */}
//           <section className="mb-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="location_id" className="block text-sm font-medium text-gray-700 mb-1">
//                   Location
//                 </label>
//                 <select
//                   id="location_id"
//                   name="location_id"
//                   value={formData.location_id}
//                   onChange={handleChange}
//                   required
//                   className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
//                 >
//                   <option value="">-- Select Location --</option>
//                   {locations.map((loc) => (
//                     <option key={loc.location_id} value={loc.location_id}>
//                       {loc.location_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
//                   Contact Information
//                 </label>
//                 <input
//                   type="text"
//                   id="contact"
//                   name="contact"
//                   value={formData.contact}
//                   onChange={handleChange}
//                   placeholder="Phone number or email"
//                   className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Section 4: Creator Info & Remarks */}
//           <section className="mb-8">
//             <div>
//               <label htmlFor="create_by" className="block text-sm font-medium text-gray-700 mb-1">
//                 Created By
//               </label>
//               <input
//                 type="text"
//                 id="create_by"
//                 name="create_by"
//                 value={formData.create_by}
//                 onChange={handleChange}
//                 placeholder="Your name or organization"
//                 className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
//                 required
//               />
//             </div>

//             <div className="mt-4">
//               <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">
//                 Remarks
//               </label>
//               <textarea
//                 id="remark"
//                 name="remark"
//                 value={formData.remark}
//                 onChange={handleChange}
//                 placeholder="Any additional notes or remarks"
//                 className="h-16 rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
//               />
//             </div>

//             <div className="mt-4">
//               <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
//                 Status
//               </label>
//               <select
//                 id="status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="rounded-2xl p-2 w-full pl-5 border-2 border-orange-300 focus:outline-none focus:border-orange-500"
//                 required
//               >
//                 <option value="">-- Select Status --</option>
//                 <option value="active">Active</option>
//                 <option value="closed">Closed</option>
//               </select>
//             </div>
//           </section>

//           {/* Section 5: Upload */}
//           <section className="mb-8">
//             <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="block w-full text-sm text-gray-500
//                 file:mr-4 file:py-2 file:px-4
//                 file:rounded-full file:border-0
//                 file:text-sm file:font-semibold
//                 file:bg-orange-50 file:text-orange-700
//                 hover:file:bg-orange-100"
//             />
//           </section>

//           <div className="text-center mt-8">
//             <button
//               type="submit"
//               className="px-8 py-3 bg-orange-300 font-bold text-xl hover:bg-orange-600 text-white rounded-full transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
//               disabled={isLoading}
//             >
//               {isLoading ? "Creating..." : "Create Activity"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Createactivity;
import React, { useState, useEffect } from 'react';
import { createActivity, getActivityType, ActivityField, ActivityTypeField } from '@/utils/api/activity';
import{SubjectField,getSubject} from "@/utils/api/subject";
// Subject interface
interface SubjectField {
  subject_id?: number;
  subject_name?: string;
  show?: boolean;
}

const CreateActivityPage = () => {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active');
  const [contact, setContact] = useState('');
  const [userCount, setUserCount] = useState<number | ''>('');
  const [price, setPrice] = useState<number | ''>('');
  const [userProperty, setUserProperty] = useState('');
  const [remark, setRemark] = useState('');
  const [createBy, setCreateBy] = useState<number | ''>('');
  const [locationId, setLocationId] = useState<number | ''>('');
  
  // Activity types and subjects selection
  const [activityTypes, setActivityTypes] = useState<ActivityTypeField[]>([]);
  const [subjects, setSubjects] = useState<SubjectField[]>([]);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<number[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch activity types on component mount
  useEffect(() => {
    const fetchActivityTypes = async () => {
      try {
        const response = await getActivityType({});
        if (response && response.success && response.data) {
          setActivityTypes(response.data);
        }
      } catch (error) {
        console.error('Error fetching activity types:', error);
      }
    };

    // Fetch subjects (mock implementation - replace with actual API)
    const fetchSubjects = async () => {
      try {
        const response = await getSubject();
        if (response && response.success && response.data) {
          setSubjects(response.data);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchActivityTypes();
    fetchSubjects();
  }, []);

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title) newErrors.title = 'กรุณาระบุชื่อกิจกรรม';
    if (!createBy) newErrors.createBy = 'กรุณาระบุผู้สร้างกิจกรรม';
    if (!startDate) newErrors.startDate = 'กรุณาระบุวันที่เริ่มกิจกรรม';
    if (!endDate) newErrors.endDate = 'กรุณาระบุวันที่สิ้นสุดกิจกรรม';
    if (!status) newErrors.status = 'กรุณาระบุสถานะกิจกรรม';
    if (!locationId) newErrors.locationId = 'กรุณาระบุสถานที่';
    if (!userCount) newErrors.userCount = 'กรุณาระบุจำนวนผู้เข้าร่วม';
    
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        newErrors.endDate = 'วันที่สิ้นสุดต้องมาหลังวันที่เริ่มกิจกรรม';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError('');
      
      try {
        // Prepare activity_type object
        const activityType: Record<string, number> = {};
        selectedActivityTypes.forEach((typeId, index) => {
          activityType[index.toString()] = typeId;
        });
        
        // Prepare subject object
        const subject: Record<string, number> = {};
        selectedSubjects.forEach((subjectId, index) => {
          subject[index.toString()] = subjectId;
        });
        
        // Prepare activity data
        const activityField: ActivityField = {
          title,
          description,
          start_date: startDate,
          end_date: endDate,
          status,
          contact,
          user_count: userCount as number,
          price: price as number,
          user_property: userProperty,
          remark,
          create_by: createBy as string,
          location_id: locationId as number,
          activity_type: activityType,
          subject
        };
        
        const response = await createActivity(activityField);
        
        if (response && response.success) {
          setSubmitSuccess(true);
          resetForm();
        } else {
          setSubmitError('เกิดข้อผิดพลาดในการสร้างกิจกรรม: ' + (response?.message || 'ไม่ทราบสาเหตุ'));
        }
      } catch (error) {
        console.error('Error creating activity:', error);
        setSubmitError('เกิดข้อผิดพลาด: ' + (error instanceof Error ? error.message : 'ไม่ทราบสาเหตุ'));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setStatus('active');
    setContact('');
    setUserCount('');
    setPrice('');
    setUserProperty('');
    setRemark('');
    setCreateBy('');
    setLocationId('');
    setSelectedActivityTypes([]);
    setSelectedSubjects([]);
  };

  // Handle activity type selection
  const handleActivityTypeChange = (typeId: number) => {
    setSelectedActivityTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  // Handle subject selection
  const handleSubjectChange = (subjectId: number) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subjectId)) {
        return prev.filter(id => id !== subjectId);
      } else {
        return [...prev, subjectId];
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">สร้างกิจกรรมใหม่</h1>
      
      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          สร้างกิจกรรมสำเร็จ!
        </div>
      )}
      
      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ชื่อกิจกรรม */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อกิจกรรม <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="กรอกชื่อกิจกรรม"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          
          {/* รายละเอียด */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รายละเอียด
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder="กรอกรายละเอียดกิจกรรม"
            />
          </div>
          
          {/* วันที่เริ่มกิจกรรม */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วันที่เริ่มกิจกรรม <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full p-2 border rounded-md ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
          </div>
          
          {/* วันที่สิ้นสุดกิจกรรม */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วันที่สิ้นสุดกิจกรรม <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full p-2 border rounded-md ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
          </div>
          
          {/* สถานะ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สถานะ <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full p-2 border rounded-md ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
              <option value="pending">pending</option>
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
          </div>
          
          {/* ผู้สร้างกิจกรรม */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ผู้สร้างกิจกรรม (ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={createBy}
              onChange={(e) => setCreateBy(parseInt(e.target.value) || '')}
              className={`w-full p-2 border rounded-md ${errors.createBy ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="กรอก ID ผู้สร้าง"
            />
            {errors.createBy && <p className="text-red-500 text-xs mt-1">{errors.createBy}</p>}
          </div>
          
          {/* ช่องทางการติดต่อ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ช่องทางการติดต่อ
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="เช่น เบอร์โทร, อีเมล"
            />
          </div>
          
          {/* สถานที่จัดกิจกรรม */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              สถานที่จัดกิจกรรม (ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={locationId}
              onChange={(e) => setLocationId(parseInt(e.target.value) || '')}
              className={`w-full p-2 border rounded-md ${errors.locationId ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="กรอก ID สถานที่"
            />
            {errors.locationId && <p className="text-red-500 text-xs mt-1">{errors.locationId}</p>}
          </div>
          
          {/* จำนวนผู้เข้าร่วม */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              จำนวนผู้เข้าร่วม <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={userCount}
              onChange={(e) => setUserCount(parseInt(e.target.value) || '')}
              className={`w-full p-2 border rounded-md ${errors.userCount ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="กรอกจำนวนผู้เข้าร่วม"
              min="1"
            />
            {errors.userCount && <p className="text-red-500 text-xs mt-1">{errors.userCount}</p>}
          </div>
          
          {/* ราคา */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ราคา
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value) || '')}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="กรอกราคา"
              min="0"
            />
          </div>
          
          {/* คุณสมบัติผู้เข้าร่วม */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              คุณสมบัติผู้เข้าร่วม
            </label>
            <input
              type="text"
              value={userProperty}
              onChange={(e) => setUserProperty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="เช่น นักเรียน, นักศึกษา"
            />
          </div>
          
          {/* หมายเหตุ */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              หมายเหตุ
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              placeholder="หมายเหตุเพิ่มเติม"
            />
          </div>
          
          {/* ประเภทกิจกรรม */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ประเภทกิจกรรม
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {activityTypes.filter(type => type.show).map((type) => (
                <div key={type.activity_type_id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`type-${type.activity_type_id}`}
                    checked={selectedActivityTypes.includes(type.activity_type_id as number)}
                    onChange={() => handleActivityTypeChange(type.activity_type_id as number)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`type-${type.activity_type_id}`} className="ml-2 text-sm text-gray-700">
                    {type.activity_type_name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* หัวข้อที่เกี่ยวข้อง */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หัวข้อที่เกี่ยวข้อง
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {subjects.filter(sub => sub.show).map((subject) => (
                <div key={subject.subject_id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`subject-${subject.subject_id}`}
                    checked={selectedSubjects.includes(subject.subject_id as number)}
                    onChange={() => handleSubjectChange(subject.subject_id as number)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor={`subject-${subject.subject_id}`} className="ml-2 text-sm text-gray-700">
                    {subject.subject_name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'กำลังสร้างกิจกรรม...' : 'สร้างกิจกรรม'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateActivityPage;