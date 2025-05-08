// Simple in-memory database for the MVP
// In a production app, this would be replaced with a real database

import { FormSchema, FormResponse, FormAnalytics } from './types';

class InMemoryDB {
  private forms: Map<string, FormSchema> = new Map();
  private responses: Map<string, FormResponse[]> = new Map();

  // Form operations
  async getForms(): Promise<FormSchema[]> {
    return Array.from(this.forms.values());
  }

  async getForm(id: string): Promise<FormSchema | null> {
    return this.forms.get(id) || null;
  }

  async createForm(form: FormSchema): Promise<FormSchema> {
    this.forms.set(form.id, {
      ...form,
      analytics: {
        totalResponses: 0,
        fieldCompletion: {},
        responsesByDate: {},
        deviceStats: {
          desktop: 0,
          mobile: 0,
          tablet: 0,
        },
      },
    });
    return form;
  }

  async updateForm(id: string, form: FormSchema): Promise<FormSchema | null> {
    if (!this.forms.has(id)) return null;
    this.forms.set(id, { ...form, updatedAt: new Date().toISOString() });
    return this.forms.get(id) as FormSchema;
  }

  async deleteForm(id: string): Promise<boolean> {
    const deleted = this.forms.delete(id);
    if (deleted) {
      this.responses.delete(id);
    }
    return deleted;
  }

  // Response operations
  async getResponses(formId: string): Promise<FormResponse[]> {
    return this.responses.get(formId) || [];
  }

  async getResponse(formId: string, responseId: string): Promise<FormResponse | null> {
    const responses = this.responses.get(formId) || [];
    return responses.find(r => r.id === responseId) || null;
  }

  async createResponse(response: FormResponse): Promise<FormResponse> {
    const responses = this.responses.get(response.formId) || [];
    responses.push(response);
    this.responses.set(response.formId, responses);

    // Update analytics
    const form = this.forms.get(response.formId);
    if (form) {
      const analytics = form.analytics || {
        totalResponses: 0,
        fieldCompletion: {},
        responsesByDate: {},
        deviceStats: {
          desktop: 0,
          mobile: 0,
          tablet: 0,
        },
      };

      // Update total responses
      analytics.totalResponses++;
      analytics.lastResponseAt = response.submittedAt;

      // Update response by date
      const date = new Date(response.submittedAt).toISOString().split('T')[0];
      analytics.responsesByDate[date] = (analytics.responsesByDate[date] || 0) + 1;

      // Update field completion stats
      Object.entries(response.responses).forEach(([fieldId, value]) => {
        if (!analytics.fieldCompletion[fieldId]) {
          analytics.fieldCompletion[fieldId] = { completed: 0, skipped: 0 };
        }
        if (value !== undefined && value !== '') {
          analytics.fieldCompletion[fieldId].completed++;
        } else {
          analytics.fieldCompletion[fieldId].skipped++;
        }
      });

      // Update device stats based on user agent
      if (response.userAgent) {
        const userAgent = response.userAgent.toLowerCase();
        if (userAgent.includes('mobile')) {
          analytics.deviceStats.mobile++;
        } else if (userAgent.includes('tablet')) {
          analytics.deviceStats.tablet++;
        } else {
          analytics.deviceStats.desktop++;
        }
      }

      this.forms.set(response.formId, {
        ...form,
        analytics,
        updatedAt: new Date().toISOString(),
      });
    }

    return response;
  }

  // Analytics operations
  async getFormAnalytics(formId: string): Promise<FormAnalytics | null> {
    const form = await this.getForm(formId);
    return form?.analytics || null;
  }
}

// Singleton instance
export const db = new InMemoryDB();