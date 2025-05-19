'use client';

import { FormSchema } from '@/lib/types';
import { DynamicForm } from '@/comps/form/form-display/dynamic-form';

interface FormPreviewProps {
  form: FormSchema;
  user_sys_id: number;     
  activity_id: number;  
   onSubmitSuccess?: () => void;
}

const FormPreview = ({ form, user_sys_id, activity_id, onSubmitSuccess }: FormPreviewProps) => {
  console.log('FormPreview received form:', form); 
  const handleSubmit = (data: any) => {
    console.log('Preview form data:', data);
    if (onSubmitSuccess) {
      onSubmitSuccess();
    }
  };
  
  return (
    <div className="border rounded-lg p-6 bg-card text-black">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{form.title || 'Untitled Form'}</h2>
        {form.description && (
          <p className="text-muted-foreground mt-2">{form.description}</p>
        )}
      </div>
      
      <DynamicForm 
        form={form} 
        user_sys_id={user_sys_id} 
        activity_id={activity_id} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
};

export default FormPreview;