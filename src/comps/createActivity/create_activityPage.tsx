import React, { useState, useEffect } from 'react';
import { createActivity, getActivityType, ActivityTypeField } from '@/utils/api/activity';
import CheckboxGroup from './checkbox';
import { decodeToken } from '@/utils/auth/jwt';
import { getSubject } from "@/utils/api/subject";
import { getLocation } from "@/utils/api/location";
import Testform from "@/comps/testForm/testForm";
import { FormSchema } from "@/lib/types";
import ImageUpload from "@/comps/Imageupload/uploadimage";
import { useRouter } from 'next/router';

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
  

  const [activityTypes, setActivityTypes] = useState<ActivityTypeField[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<number[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<(string | number)[]>([]);
  const router = useRouter();

  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  
  const [formJson, setFormJson] = useState<FormSchema | null>(null);
  const [imageJson, setImageJson] = useState<{ url: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const userSysId = decodeToken()?.user_sys_id;

  const buildJsonForActivity = () => {
    const activityType: Record<string, any> = {};
    selectedActivityTypes.forEach((typeId, index) => {
      activityType[index.toString()] = typeId;
    });
    
    const subject: Record<string, any> = {};
    selectedSubjects.forEach((subjectId, index) => {
      subject[index.toString()] = subjectId;
    });
  
    const payload = {
      title,
      description: description || '', 
      start_date: startDate,
      end_date: endDate,
      status,
      contact: contact || '', 
      user_count: userCount !== '' ? Number(userCount) : 0, 
      price: price !== '' ? Number(price) : 0, 
      user_property: userProperty || '', 
      remark: remark || '', 
      create_by: userSysId,
      activity_json_form: formJson,
      image_link: imageJson || { square: '', banner: '' }, 
      location_id: Number(locationId) || 0, 
    };
    console.log('Payload:', payload);
    
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

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const activityTypeResponse = await getActivityType({});
        if (activityTypeResponse?.success && activityTypeResponse.data) {
          setActivityTypes(activityTypeResponse.data);
        }

        setLoadingSubjects(true);
        const subjectsResponse = await getSubjects();
        setSubjects(subjectsResponse);
        setLoadingSubjects(false);

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


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title) newErrors.title = 'Please enter the activity name';
    if (!startDate) newErrors.startDate = 'Please enter the start date';
    if (!endDate) newErrors.endDate = 'Please enter the end date';
    if (!locationId) newErrors.locationId = 'Please select a location';
    if (!userCount) newErrors.userCount = 'Please enter the number of participants';

    if (!imageJson || (!imageJson.square && !imageJson.banner)) {
        newErrors.image = 'Please upload an image';
    }
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date must be after the start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setContact('');
    setUserCount('');
    setPrice('');
    setUserProperty('');
    setRemark('');
    setLocationId('');
    setSelectedActivityTypes([]);
    setSelectedSubjects([]);
    setFormJson(null); 
    setImageJson(null);
  };


  const handleFormSubmit = (formData: FormSchema) => {
    setFormJson(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission attempted');

    if (!userSysId) {
      setSubmitError('Unable to retrieve user information. Please log in again.');
      return;
    }

    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError('');
      console.log('Form validated, submitting...');

      try {
        const payload = buildJsonForActivity();
        console.log('Sending payload:', payload);
        
        const response = await createActivity(payload);
        console.log('API response:', response);

        if (response?.success) {
          setSubmitSuccess(true);

          const storedActivities = JSON.parse(localStorage.getItem("activities") || "[]");
          storedActivities.push(payload);
          localStorage.setItem("activities", JSON.stringify(storedActivities));

          resetForm();
          alert('Activity created successfully');

          router.push("/myac");
        } else {
          setSubmitError('Error creating activity: ' + (response?.message || 'Unknown error'));
          alert('Error occurred: ' + (response?.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error creating activity:', error);
        setSubmitError('Error occurred: ' + (error instanceof Error ? error.message : 'Unknown error'));
        alert('Error occurred: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setIsSubmitting(false);
        console.log('Submission process completed');
      }
    } else {
      console.log('Form validation failed');
    }
};

  const handleActivityTypeChange = (typeId: number) => {
    setSelectedActivityTypes(prev => 
      prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId]
    );
  };


  const handleSubjectChange = (subjectId: string | number) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId]
    );
  };

  const handleImageUploaded = (imageData: { square: string; banner: string }) => {
    setImageJson(imageData);
};



  const handleFormJsonUpdate = (newFormJson: FormSchema) => {
    console.log('Updating form JSON:', newFormJson);
    setFormJson(newFormJson);
  };


  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md ">
      <div className="text-3xl font-bold text-center bg-orange-500 text-white shadow-lg w-full px-10 py-8 rounded-tr-lg rounded-tl-lg">
        <p className="mt-2">Create activity</p>
      </div>
      <div className='p-6'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 max-w-4xl mx-auto px-4 py-6">
          
          <div>
            <ImageUpload onImageUploaded={handleImageUploaded} />     
          </div>

          <div className='w-full'>
            <label className="block text-sm font-medium text-gray-700 mb-1 ">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2 border  rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Activity name"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          
            <div className='mt-8'>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={9}
                placeholder="Enter activity details"
              />
            </div>
          </div>
      

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full p-2 border rounded-md ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
          </div>
    
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full p-2 border rounded-md ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Information
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(Number(e.target.value) || '')}
              className={`w-full p-2 border rounded-md ${errors.locationId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Location</option>
              {loadingLocations ? (
                <option value="" disabled>Loading location data...</option>
              ) : locations.length > 0 ? (
                locations.map((location) => (
                  <option key={location.location_id} value={location.location_id}>
                    {location.location_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No location data found</option>
              )}
            </select>
            {errors.locationId && <p className="text-red-500 text-xs mt-1">{errors.locationId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Participants <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={userCount}
              onChange={(e) => setUserCount(Number(e.target.value) || '')}
              className={`w-full p-2 border rounded-md ${errors.userCount ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.userCount && <p className="text-red-500 text-xs mt-1">{errors.userCount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (Baht)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value) || '')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Participant Requirements
            </label>
            <input
              type="text"
              value={userProperty}
              onChange={(e) => setUserProperty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remark
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={1}
            />
          </div>

          <CheckboxGroup
            items={activityTypes}
            selectedItems={selectedActivityTypes}
            onItemChange={handleActivityTypeChange}
            idKey="activity_type_id"
            nameKey="activity_type_name"
            label="Activity Type"
          />

          <CheckboxGroup
            items={subjects}
            selectedItems={selectedSubjects}
            onItemChange={handleSubjectChange}
            idKey="subject_id"
            nameKey="subject_name"
            label="Subject"
            isLoading={loadingSubjects}
          />
        </div>

      
        <div className="mt-6 mb-6">
          <h2 className="text-xl font-bold mb-2">Activity Form</h2>
          <div id="dynamic-form-container">
            <Testform formJson={formJson} setFormJson={setFormJson} />
            {errors.formJson && <p className="text-red-500 text-xs mt-1">{errors.formJson}</p>}
          </div>
        </div>

      
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-2 px-4 text-white rounded-md ${isSubmitting ? 'bg-gray-500' : 'bg-orange-500 hover:bg-orange-700'}`}
          >
            {isSubmitting ? 'Creating Activity...' : 'Create Activity'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateActivityPage;

