import React, { useState, useEffect } from 'react';
import { createActivity, getActivityType, ActivityField, ActivityTypeField } from '@/utils/api/activity';
import { fetchDataApi } from '@/utils/callAPI';
import CheckboxGroup from './checkbox';
import { decodeToken } from '@/utils/auth/jwt';
import { getSubject } from "@/utils/api/subject";
import { getLocation } from "@/utils/api/location";
import Testform from "@/comps/testForm/testForm";
import { FormSchema } from "@/lib/types";

// Define interfaces for subjects and locations
interface Subject {
  subject_id: string | number;
  subject_name: string;
}

interface Location {
  location_id: number;
  location_name: string;
}

export const getSubjects = async () => {
  try {
    const data = await getSubject({});
    return data.success && data.data ? data.data : [];
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
};

export const getLocations = async () => {
  try {
    const data = await getLocation({});
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
  const [locationId, setLocationId] = useState<number | ''>('');
  // const [createBy, setCreateBy] = useState('');
  
  // Activity types, subjects, and locations
  const [activityTypes, setActivityTypes] = useState<ActivityTypeField[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<number[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<(string | number)[]>([]);
  
  // Loading states
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  
  // Form builder state
  const [formJson, setFormJson] = useState<FormSchema | null>(null);

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const userSysId = decodeToken()?.user_sys_id;

  // Build the payload for activity creation
  const buildJsonForActivity = () => {
    // Convert arrays to objects as required by API
    const activityType: Record<string, any> = {};
    selectedActivityTypes.forEach((typeId, index) => {
      activityType[index.toString()] = typeId;
    });
    
    const subject: Record<string, any> = {};
    selectedSubjects.forEach((subjectId, index) => {
      subject[index.toString()] = subjectId;
    });
    
    // สร้าง payload โดยแน่ใจว่าไม่มีค่า NULL ที่จะทำให้เกิด SQL error
    const payload = {
      title,
      description: description || '', // ให้เป็น empty string แทน null
      start_date: startDate,
      end_date: endDate,
      status,
      contact: contact || '', // ให้เป็น empty string แทน null
      user_count: userCount !== '' ? Number(userCount) : 0, // ให้เป็น 0 แทน null
      price: price !== '' ? Number(price) : 0, // ให้เป็น 0 แทน null
      user_property: userProperty || '', // ให้เป็น empty string แทน null
      remark: remark || '', // ให้เป็น empty string แทน null
      create_by: userSysId,
      // create_by: createBy,
      location_id: Number(locationId) || 0, // ให้เป็น 0 แทน null
    };

    // เพิ่มข้อมูลเฉพาะเมื่อมีค่า
    if (Object.keys(activityType).length > 0) {
      payload.activity_type = activityType;
    }
    
    if (Object.keys(subject).length > 0) {
      payload.subject = subject;
    }
    
    if (formJson) {
      payload.form_json = formJson;
    }
    
    return payload;
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch activity types
        const activityTypeResponse = await getActivityType({});
        if (activityTypeResponse?.success && activityTypeResponse.data) {
          setActivityTypes(activityTypeResponse.data);
        }

        // Fetch subjects
        setLoadingSubjects(true);
        const subjectsResponse = await getSubjects();
        setSubjects(subjectsResponse);
        setLoadingSubjects(false);

        // Fetch locations
        setLoadingLocations(true);
        const locationsResponse = await getLocations();
        setLocations(locationsResponse);
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
    // if (!createBy) newErrors.createBy = 'กรุณาระบุผู้สร้างกิจกรรม';
    if (!startDate) newErrors.startDate = 'กรุณาระบุวันที่เริ่มกิจกรรม';
    if (!endDate) newErrors.endDate = 'กรุณาระบุวันที่สิ้นสุดกิจกรรม';
    if (!status) newErrors.status = 'กรุณาระบุสถานะกิจกรรม';
    if (!locationId) newErrors.locationId = 'กรุณาระบุสถานที่';
    if (!userCount) newErrors.userCount = 'กรุณาระบุจำนวนผู้เข้าร่วม';
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'วันที่สิ้นสุดต้องมาหลังวันที่เริ่มกิจกรรม';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form after successful submission
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setStatus('active');
     // setCreateBy('');
    setContact('');
    setUserCount('');
    setPrice('');
    setUserProperty('');
    setRemark('');
    setLocationId('');
    setSelectedActivityTypes([]);
    setSelectedSubjects([]);
    setFormJson(null); 
  };

  // เมื่อ Testform มีการ submit
  const handleFormSubmit = (formData: FormSchema) => {
    setFormJson(formData);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission attempted');

    if (!userSysId) {
      setSubmitError('ไม่สามารถดึงข้อมูลผู้ใช้งานได้ กรุณาเข้าสู่ระบบใหม่');
      return;
    }

    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError('');
      console.log('Form validated, submitting...');

      try {
        // สร้าง payload โดยใช้ buildJsonForActivity
        const payload = buildJsonForActivity();
        console.log('Sending payload:', payload);
        
        const response = await createActivity(payload);
        console.log('API response:', response);

        if (response?.success) {
          setSubmitSuccess(true);
          resetForm();
          alert('สร้างกิจกรรมสำเร็จ');
        } else {
          setSubmitError('เกิดข้อผิดพลาดในการสร้างกิจกรรม: ' + (response?.message || 'ไม่ทราบสาเหตุ'));
          alert('เกิดข้อผิดพลาด: ' + (response?.message || 'ไม่ทราบสาเหตุ'));
        }
      } catch (error) {
        console.error('Error creating activity:', error);
        setSubmitError('เกิดข้อผิดพลาด: ' + (error instanceof Error ? error.message : 'ไม่ทราบสาเหตุ'));
        alert('เกิดข้อผิดพลาด: ' + (error instanceof Error ? error.message : 'ไม่ทราบสาเหตุ'));
      } finally {
        setIsSubmitting(false);
        console.log('Submission process completed');
      }
    } else {
      console.log('Form validation failed');
    }
  };

  // Handle activity type selection
  const handleActivityTypeChange = (typeId: number) => {
    setSelectedActivityTypes(prev => 
      prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId]
    );
  };

  // Handle subject selection
  const handleSubjectChange = (subjectId: string | number) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId]
    );
  };

  const handleFormJsonUpdate = (newFormJson: FormSchema) => {
    console.log('Updating form JSON:', newFormJson);
    setFormJson(newFormJson);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          สร้างกิจกรรมสำเร็จแล้ว!
        </div>
      )}
      
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}
      
      {/* ส่วนของฟอร์มหลัก */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <p>Create activity</p>
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

        {/* <div>
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
          </div>  */}

        
        
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
            onChange={(e) => setLocationId(Number(e.target.value) || '')}
            className={`w-full p-2 border rounded-md ${errors.locationId ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">เลือกสถานที่</option>
            {loadingLocations ? (
              <option value="" disabled>กำลังโหลดข้อมูลสถานที่...</option>
            ) : locations.length > 0 ? (
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
            onChange={(e) => setUserCount(Number(e.target.value) || '')}
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
            onChange={(e) => setPrice(Number(e.target.value) || '')}
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

        <CheckboxGroup
          items={activityTypes}
          selectedItems={selectedActivityTypes}
          onItemChange={handleActivityTypeChange}
          idKey="activity_type_id"
          nameKey="activity_type_name"
          label="ประเภทกิจกรรม"
        />

        <CheckboxGroup
          items={subjects}
          selectedItems={selectedSubjects}
          onItemChange={handleSubjectChange}
          idKey="subject_id"
          nameKey="subject_name"
          label="รายวิชาที่เกี่ยวข้อง"
          isLoading={loadingSubjects}
        />
      </div>

      {/* แบบฟอร์มกิจกรรม - แยกออกมาจากฟอร์มหลัก */}
      <div className="mt-6 mb-6">
        <h2 className="text-xl font-bold mb-2">แบบฟอร์มกิจกรรม</h2>
        <div id="dynamic-form-container">
          {/* นำ TestForm มาใช้โดยไม่ต้องอยู่ภายใน form */}
          <Testform formJson={formJson} setFormJson={setFormJson} />
{errors.formJson && <p className="text-red-500 text-xs mt-1">{errors.formJson}</p>}
        </div>
      </div>

      {/* ปุ่มสร้างกิจกรรม - แยกออกมาเป็นการใช้ div onClick แทน form */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-2 px-4 text-white rounded-md ${isSubmitting ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? 'กำลังสร้างกิจกรรม...' : 'สร้างกิจกรรม'}
        </button>
      </div>
    </div>
  );
};

export default CreateActivityPage;