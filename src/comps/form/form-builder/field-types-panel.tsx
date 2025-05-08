'use client';

import { Button } from '@/comps/form/ui/button';
import { FormField } from '@/lib/types';
import {
  IconTypography,
  IconHash,
  IconMail,
  IconAlignLeft,
  IconCheckbox,
  IconCircleCheck,
  IconListCheck,
  IconCalendarEvent,
} from '@tabler/icons-react';

interface FieldTypesPanelProps {
  onAddField: (type: FormField['type']) => void;
}

const fieldTypes: { type: FormField['type']; icon: React.ReactNode; label: string }[] = [
  { type: 'text', icon: <IconTypography size={16} />, label: 'Text' },
  { type: 'number', icon: <IconHash size={16} />, label: 'Number' },
  // { type: 'email', icon: <IconMail size={16} />, label: 'Email' },
  { type: 'textarea', icon: <IconAlignLeft size={16} />, label: 'Paragraph' },
  { type: 'checkbox', icon: <IconCheckbox size={16} />, label: 'Checkbox' },
  { type: 'radio', icon: <IconCircleCheck size={16} />, label: 'Radio' },
  { type: 'select', icon: <IconListCheck size={16} />, label: 'Dropdown' },
  // { type: 'date', icon: <IconCalendarEvent size={16} />, label: 'Date' },
];



const FieldTypesPanel = ({ onAddField }: FieldTypesPanelProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {fieldTypes.map((field) => (
        <Button
          key={field.type}
          variant="outline"
          className="h-auto py-4 justify-start flex-col items-center space-y-2 hover:bg-primary/5 hover:border-primary transition-colors"
          onClick={() => onAddField(field.type)}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {field.icon}
          </div>
          <span className="text-sm">{field.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default FieldTypesPanel;