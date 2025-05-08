'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormSchema, FormField } from '@/lib/types';
import { Button } from '@/comps/form/ui/button';
import { Input } from '@/comps/form/ui/input';
import { Textarea } from '@/comps/form/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/comps/form/ui/card';
// import { Plus, Save, Eye, Trash2 } from 'lucide-react';
import {
  IconPlus,
  IconDeviceFloppy as IconSave,
  IconEye,
  IconTrash,
} from '@tabler/icons-react';

import FieldTypesPanel from './field-types-panel';
import FieldEditor from './field-editor';
import FormPreview from './form-preview';

import { useMediaQuery } from "@/comps/public/useMediaQuery"

interface FormBuilderProps {
  initialForm?: FormSchema;
  onSave: (form: FormSchema) => void;
}

export default function FormBuilder({ initialForm, onSave }: FormBuilderProps) {
  const [showPreview, setShowPreview] = useState(false);
  const isLargerThanSm = useMediaQuery("(min-width: 768px)");
  const [form, setForm] = useState<FormSchema>(() => {
    if (initialForm) return initialForm;

    return {
      id: uuidv4(),
      title: 'Untitled Form',
      description: '',
      fields: [],
      theme: {
        primaryColor: '#8B5CF6',
        backgroundColor: '#FFFFFF',
        textColor: '#111827',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null);

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: `New ${type} field`,
      placeholder: `Enter ${type}...`,
      required: false,
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined,
    };

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));

    setSelectedFieldIndex(form.fields.length);
  };

  const updateField = (index: number, updatedField: FormField) => {
    const updatedFields = [...form.fields];
    updatedFields[index] = updatedField;

    setForm(prev => ({
      ...prev,
      fields: updatedFields,
    }));
  };

  const removeField = (index: number) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));

    if (selectedFieldIndex === index) {
      setSelectedFieldIndex(null);
    } else if (selectedFieldIndex !== null && selectedFieldIndex > index) {
      setSelectedFieldIndex(selectedFieldIndex - 1);
    }
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= form.fields.length) return;

    const updatedFields = [...form.fields];
    const [movedField] = updatedFields.splice(fromIndex, 1);
    updatedFields.splice(toIndex, 0, movedField);

    setForm(prev => ({
      ...prev,
      fields: updatedFields,
    }));

    if (selectedFieldIndex === fromIndex) {
      setSelectedFieldIndex(toIndex);
    }
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="container mx-auto py-6 bg-white text-black">
      {showPreview ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Form Preview</h1>
            <Button onClick={() => setShowPreview(false)} variant="outline">
              Back to Editor
            </Button>
          </div>
          <FormPreview form={form} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {isLargerThanSm ? (
                "Create Form"
              ) : (
                ""
              )}

            </h1>
            <div className="flex gap-2">
              <Button onClick={() => setShowPreview(true)} variant="outline" className="flex items-center gap-2">
                <IconEye size={16} />
                Preview
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <IconSave size={16} />
                Save Form
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8">
              <CardHeader>
                <CardTitle>Form Details</CardTitle>
                <CardDescription>Set your form title and description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Form Title</label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter form title"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Form Description</label>
                  <Textarea
                    id="description"
                    value={form.description || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter form description (optional)"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Add Fields</CardTitle>
                <CardDescription>Click to add new fields</CardDescription>
              </CardHeader>
              <CardContent>
                <FieldTypesPanel onAddField={addField} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-8">
              <CardHeader>
                <CardTitle>Form Fields</CardTitle>
                <CardDescription>Click to edit fields</CardDescription>
              </CardHeader>
              <CardContent>
                {form.fields.length === 0 ? (
                  <div className="border border-dashed rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">No fields added yet</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => addField('text')}
                    >
                      <IconPlus size={16} className="mr-2" />
                      Add your first field
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {form.fields.map((field, index) => (
                      <div
                        key={field.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedFieldIndex === index ? 'border-primary bg-primary/5' : 'hover:bg-secondary/50'
                          }`}
                        onClick={() => setSelectedFieldIndex(index)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{field.label}</p>
                            <p className="text-sm text-muted-foreground capitalize">{field.type}{field.required ? ' (Required)' : ''}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveField(index, index - 1);
                              }}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveField(index, index + 1);
                              }}
                              disabled={index === form.fields.length - 1}
                            >
                              ↓
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeField(index);
                              }}
                            >
                              <IconTrash size={16} className="text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedFieldIndex !== null && (
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Edit Field</CardTitle>
                  <CardDescription>Customize selected field</CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldEditor
                    field={form.fields[selectedFieldIndex]}
                    onChange={(updatedField) => updateField(selectedFieldIndex, updatedField)}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}