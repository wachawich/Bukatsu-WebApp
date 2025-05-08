'use client';

import { useState } from 'react';
import { FormField } from '@/lib/types';
import { Input } from '@/comps/form/ui/input';
import { Checkbox } from '@/comps/form/ui/checkbox';
import { Button } from '@/comps/form/ui/button';
import { Label } from '@/comps/form/ui/label';
// import { Plus, X } from 'lucide-react';

import {
  IconPlus,
  IconDeviceFloppy as IconSave,
  IconEye,
  IconTrash,
  IconX,
} from '@tabler/icons-react';

interface FieldEditorProps {
  field: FormField;
  onChange: (field: FormField) => void;
}

const FieldEditor = ({ field, onChange }: FieldEditorProps) => {
  const [newOption, setNewOption] = useState('');
  
  const hasOptions = field.type === 'select' || field.type === 'radio' || field.type === 'checkbox';
  
  const handleAddOption = () => {
    if (!newOption.trim()) return;
    
    const updatedOptions = [...(field.options || []), newOption.trim()];
    onChange({ ...field, options: updatedOptions });
    setNewOption('');
  };
  
  const handleRemoveOption = (index: number) => {
    const updatedOptions = field.options?.filter((_, i) => i !== index);
    onChange({ ...field, options: updatedOptions });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="field-label">Field Label</Label>
        <Input
          id="field-label"
          value={field.label}
          onChange={(e) => onChange({ ...field, label: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="field-placeholder">Placeholder</Label>
        <Input
          id="field-placeholder"
          value={field.placeholder || ''}
          onChange={(e) => onChange({ ...field, placeholder: e.target.value })}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="field-required"
          checked={field.required}
          onCheckedChange={(checked) => onChange({ ...field, required: checked === true })}
        />
        <Label htmlFor="field-required">Required field</Label>
      </div>
      
      {field.type === 'number' && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="field-min">Min Value</Label>
            <Input
              id="field-min"
              type="number"
              value={field.validation?.min ?? ''}
              onChange={(e) => onChange({ 
                ...field, 
                validation: { 
                  ...field.validation, 
                  min: e.target.value ? Number(e.target.value) : undefined
                }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="field-max">Max Value</Label>
            <Input
              id="field-max"
              type="number"
              value={field.validation?.max ?? ''}
              onChange={(e) => onChange({ 
                ...field, 
                validation: { 
                  ...field.validation, 
                  max: e.target.value ? Number(e.target.value) : undefined
                }
              })}
            />
          </div>
        </div>
      )}
      
      {(field.type === 'text' || field.type === 'textarea' || field.type === 'email') && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="field-minlength">Min Length</Label>
            <Input
              id="field-minlength"
              type="number"
              value={field.validation?.minLength ?? ''}
              onChange={(e) => onChange({ 
                ...field, 
                validation: { 
                  ...field.validation, 
                  minLength: e.target.value ? Number(e.target.value) : undefined
                }
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="field-maxlength">Max Length</Label>
            <Input
              id="field-maxlength"
              type="number"
              value={field.validation?.maxLength ?? ''}
              onChange={(e) => onChange({ 
                ...field, 
                validation: { 
                  ...field.validation, 
                  maxLength: e.target.value ? Number(e.target.value) : undefined
                }
              })}
            />
          </div>
        </div>
      )}
      
      {hasOptions && (
        <div className="space-y-3">
          <Label>Options</Label>
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...(field.options || [])];
                    updatedOptions[index] = e.target.value;
                    onChange({ ...field, options: updatedOptions });
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOption(index)}
                >
                  <IconX size={16} className="text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add new option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddOption();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAddOption}
            >
              <IconPlus size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldEditor;