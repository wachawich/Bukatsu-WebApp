'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormSchema, FormField } from '@/lib/types';
import { Button } from '@/comps/form/ui/button';
import { Form } from '@/comps/form/ui/form';
import { FieldRenderer } from './field-renderer';
import { joinActivity } from '@/utils/api/activity';

interface DynamicFormProps {
  form: FormSchema;
  onSubmit?: (data: Record<string, any>) => void;
  isSubmitting?: boolean;
  user_sys_id: string;
  activity_id: string;
}

export function DynamicForm({ form, onSubmit, isSubmitting = false, user_sys_id, activity_id }: DynamicFormProps) {
  const [submitted, setSubmitted] = useState(false);

  // Dynamically build Zod schema based on form fields
  const buildFormSchema = (fields: FormField[]) => {
    const schemaMap: Record<string, any> = {};
    
    fields.forEach((field) => {
      let fieldSchema: any = z.any();
      
      switch (field.type) {
        case 'text':
        case 'textarea':
          fieldSchema = z.string();
          if (field.validation?.minLength) {
            fieldSchema = fieldSchema.min(field.validation.minLength, {
              message: `Must be at least ${field.validation.minLength} characters`,
            });
          }
          if (field.validation?.maxLength) {
            fieldSchema = fieldSchema.max(field.validation.maxLength, {
              message: `Must be at most ${field.validation.maxLength} characters`,
            });
          }
          break;
        case 'email':
          fieldSchema = z.string().email('Invalid email address');
          break;
        case 'number':
          fieldSchema = z.coerce.number();
          if (field.validation?.min !== undefined) {
            fieldSchema = fieldSchema.min(field.validation.min, {
              message: `Must be at least ${field.validation.min}`,
            });
          }
          if (field.validation?.max !== undefined) {
            fieldSchema = fieldSchema.max(field.validation.max, {
              message: `Must be at most ${field.validation.max}`,
            });
          }
          break;
        case 'checkbox':
          fieldSchema = z.array(z.string()).optional();
          break;
        case 'radio':
        case 'select':
          fieldSchema = z.string();
          break;
        case 'date':
          fieldSchema = z.string();
          break;
        default:
          fieldSchema = z.string();
      }
      
      if (field.required) {
        if (field.type === 'checkbox') {
          fieldSchema = z.array(z.string()).min(1, 'Please select at least one option');
        } else {
          fieldSchema = fieldSchema.min(1, 'This field is required');
        }
      } else {
        if (field.type !== 'checkbox') {
          fieldSchema = fieldSchema.optional();
        }
      }
      
      schemaMap[field.id] = fieldSchema;
    });
    
    return z.object(schemaMap);
  };

  const formSchema = buildFormSchema(form.fields);
  
  // Set up react-hook-form with zod resolver
  const formMethods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: form.fields.reduce((acc, field) => {
      if (field.defaultValue !== undefined) {
        acc[field.id] = field.defaultValue;
      } else if (field.type === 'checkbox') {
        acc[field.id] = [];
      } else {
        acc[field.id] = '';
      }
      return acc;
    }, {} as Record<string, any>),
  });

  const handleSubmit = async (data: Record<string, any>) => {
    const enrichedData = form.fields.map((field) => ({
      id: field.id,
      label: field.label,
      type: field.type,
      value: data[field.id] ?? null,
    }));

    const payload = {
      user_sys_id,
      activity_id,
      approve: false,
      flag_valid: true,
      activity_json_form_user: JSON.stringify(enrichedData),
    };

    console.log("Sending to API:", payload);

    try {
      await joinActivity(payload);
      setSubmitted(true);
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to submit form. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="py-12 px-8 text-center bg-primary/5 rounded-lg border">
        <h3 className="text-2xl font-bold text-primary">Response Submitted</h3>
        <p className="mt-2 text-muted-foreground">Thank you for completing this form.</p>
        <Button 
          className="mt-6"
          onClick={() => {
            formMethods.reset();
            setSubmitted(false);
          }}
        >
          Submit Another Response
        </Button>
      </div>
    );
  }

  return (
    <Form {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(handleSubmit)} className="space-y-6">
        {form.fields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            form={formMethods}
          />
        ))}
        
        <Button 
          type="submit" 
          className="w-full md:w-auto bg-blue-500 text-[#ffffff]"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
