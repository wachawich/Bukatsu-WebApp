'use client';

import { FormSchema } from '@/lib/types';
import FormBuilder from '@/components/form-builder/form-builder';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditFormPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<FormSchema | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`/api/forms/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setForm(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch form:", error);
      }
    };

    fetchForm();
  }, [params.id]);

  const handleSave = async (updatedForm: FormSchema) => {
    try {
      const response = await fetch(`/api/forms/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedForm),
      });
      
      const result = await response.json();
      
      if (result.success) {
        router.push(`/forms/${result.data.id}`);
      }
    } catch (error) {
      console.error('Failed to update form:', error);
    }
  };

  if (!form) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  return <FormBuilder initialForm={form} onSave={handleSave} />;
}