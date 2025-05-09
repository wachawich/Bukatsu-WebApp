
import React, { useState, useEffect } from 'react';
import { createActivity, getActivityType, ActivityField, ActivityTypeField } from '@/utils/api/activity';
import { fetchDataApi } from '@/utils/callAPI';

// Define interfaces for subjects and locations
interface Subject {
  subject_id: string | number;
  subject_name: string;
}

interface Location {
  location_id: number;
  location_name: string;
  location_type?: string;
}

// API functions for fetching subjects and locations
export const getSubjects = async () => {
  try {
    const data = await fetchDataApi("POST", "subject.get", {});
    console.log("Subjects data:", data);
    return data.success && data.data ? data.data : [];
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
};

export const getLocations = async () => {
  try {
    const data = await fetchDataApi("POST", "location.get", {});
    console.log("Locations data:", data);
    return data.success && data.data ? data.data : [];
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

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
  const [createBy, setCreateBy] = useState('');
  const [locationId, setLocationId] = useState<number | ''>('');
  
  // Activity types, subjects, and locations
  const [activityTypes, setActivityTypes] = useState<ActivityTypeField[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<number[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<(string | number)[]>([]);
  
  // Loading states
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  
  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch activity types
        const activityTypeResponse = await getActivityType({});
        if (activityTypeResponse && activityTypeResponse.success && activityTypeResponse.data) {
          console.log("Activity types:", activityTypeResponse.data);
          setActivityTypes(activityTypeResponse.data);
        }

        // Fetch subjects
        setLoadingSubjects(true);
        const subjectsResponse = await getSubjects();
        console.log("Subjects response:", subjectsResponse);
        if (Array.isArray(subjectsResponse)) {
          setSubjects(subjectsResponse);
        }
        setLoadingSubjects(false);

        // Fetch locations
        setLoadingLocations(true);
        const locationsResponse = await getLocations();
        console.log("Locations response:", locationsResponse);
        if (Array.isArray(locationsResponse)) {
          setLocations(locationsResponse);
        }
        setLoadingLocations(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoadingSubjects(false);
        setLoadingLocations(false);
      }
    };

    fetchData();
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
        const subject: Record<string, number | string> = {};
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
          user_count: Number(userCount), // ensure number
          price: Number(price) || 0,     // fallback เป็น 0
          user_property: userProperty,
          remark,
          create_by: createBy,
          location_id: Number(locationId), // ensure number
          activity_type: activityType,
          subject,
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
  const handleSubjectChange = (subjectId: string | number) => {
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
          
         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
            ผู้สร้างกิจกรรม (ID) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={createBy}
              onChange={(e) => setCreateBy(e.target.value)}
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
              สถานที่จัดกิจกรรม <span className="text-red-500">*</span>
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(parseInt(e.target.value) || '')}
              className={`w-full p-2 border rounded-md ${errors.locationId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">เลือกสถานที่</option>
              {loadingLocations ? (
                <option value="" disabled>กำลังโหลดข้อมูลสถานที่...</option>
              ) : locations && locations.length > 0 ? (
                locations.map((location) => (
                  <option key={location.location_id} value={location.location_id}>
                    {location.location_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>ไม่พบข้อมูลสถานที่</option>
              )}
            </select>
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
            />
            {errors.userCount && <p className="text-red-500 text-xs mt-1">{errors.userCount}</p>}
          </div>

          {/* ราคา */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ราคา (บาท)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || '')}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="เช่น 0 หรือ 100"
            />
          </div>

          {/* คุณสมบัติผู้เข้าร่วม */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              คุณสมบัติผู้เข้าร่วม
            </label>
            <textarea
              value={userProperty}
              onChange={(e) => setUserProperty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              placeholder="ระบุคุณสมบัติผู้เข้าร่วมกิจกรรม"
            />
          </div>

          {/* หมายเหตุ */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              หมายเหตุเพิ่มเติม
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={2}
              placeholder="หมายเหตุอื่น ๆ"
            />
          </div>

          {/* ประเภทกิจกรรม */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ประเภทกิจกรรม
            </label>
            <div className="grid grid-cols-4 gap-2">
              {activityTypes.map((type) => (
                <label key={type.activity_type_id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedActivityTypes.includes(type.activity_type_id)}
                    onChange={() => handleActivityTypeChange(type.activity_type_id)}
                  />
                  <span>{type.activity_type_name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* รายวิชาที่เกี่ยวข้อง */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รายวิชาที่เกี่ยวข้อง
            </label>
            <div className="grid grid-cols-4 gap-2">
              {loadingSubjects ? (
                <span className="text-sm text-gray-500">กำลังโหลดข้อมูลวิชา...</span>
              ) : (
                subjects.map((subject) => (
                  <label key={subject.subject_id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject.subject_id)}
                      onChange={() => handleSubjectChange(subject.subject_id)}
                    />
                    <span>{subject.subject_name}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-2 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 text-white rounded-md ${isSubmitting ? 'bg-gray-500' : 'bg-blue-600'}`}
          >
            {isSubmitting ? 'กำลังสร้างกิจกรรม...' : 'สร้างกิจกรรม'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateActivityPage;
