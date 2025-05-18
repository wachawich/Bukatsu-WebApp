// Form Schema Types
export interface FormField {
  id: string;
  type: 'text' | 'number' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  defaultValue?: string | string[] | number | boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  createdAt: string;
  updatedAt: string;
  analytics?: FormAnalytics;
}

export interface FormResponse {
  id: string;
  formId: string;
  responses: {
    [fieldId: string]: string | string[] | number | boolean;
  };
  submittedAt: string;
  userAgent?: string;
  ipAddress?: string;
  location?: string;
}

export interface FormAnalytics {
  totalResponses: number;
  lastResponseAt?: string;
  averageCompletionTime?: number;
  fieldCompletion: {
    [fieldId: string]: {
      completed: number;
      skipped: number;
    };
  };
  responsesByDate: {
    [date: string]: number;
  };
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}