'use client';

import { FormField as DynamicFormField, FormSchema } from '@/lib/types';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/comps/form/ui/form';
import { Input } from '@/comps/form/ui/input';
import { Textarea } from '@/comps/form/ui/textarea';
import { Checkbox } from '@/comps/form/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/comps/form/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/comps/form/ui/select';
import { Label } from '@/comps/form/ui/label';

interface FieldRendererProps {
  field: DynamicFormField;
  form: UseFormReturn<any>;
}

export function FieldRenderer({ field, form }: FieldRendererProps) {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={field.placeholder}
                    {...formField}
                    type={field.type}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case 'number':
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={field.placeholder}
                    type="number"
                    {...formField}
                    onChange={(e) => formField.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case 'textarea':
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder}
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case 'checkbox':
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                </div>
                {field.options?.map((option) => (
                  <FormField
                    key={option}
                    control={form.control}
                    name={field.id}
                    render={({ field: formField }) => {
                      return (
                        <FormItem
                          key={option}
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={formField.value?.includes(option)}
                              onCheckedChange={(checked : any) => {
                                const currentValue = formField.value || [];
                                return checked
                                  ? formField.onChange([...currentValue, option])
                                  : formField.onChange(
                                      currentValue.filter((value: string) => value !== option)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{option}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case 'radio':
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    defaultValue={formField.value}
                    className="flex flex-col space-y-1"
                  >
                    {field.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                        <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case 'select':
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || 'Select an option'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      case 'date':
        return (
          <FormField
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...formField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      
      default:
        return null;
    }
  };

  return renderField();
}