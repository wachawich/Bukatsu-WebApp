import { FormSchema, FormResponse } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Eye, FileDown } from 'lucide-react';

async function getFormData(id: string): Promise<FormSchema | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/forms/${id}`, { cache: 'no-store' });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Failed to fetch form:", error);
    return null;
  }
}

async function getResponsesData(formId: string): Promise<FormResponse[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/responses/${formId}`, { cache: 'no-store' });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Failed to fetch responses:", error);
    return [];
  }
}

export default async function FormResponsesPage({ params }: { params: { id: string } }) {
  const [form, responses] = await Promise.all([
    getFormData(params.id),
    getResponsesData(params.id)
  ]);

  if (!form) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Form Not Found</h1>
        <p className="mb-8">The form you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/forms">Back to Forms</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/forms">
              <ArrowLeft size={16} />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{form.title} - Responses</h1>
            <p className="text-muted-foreground">{responses.length} {responses.length === 1 ? 'response' : 'responses'} collected</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/forms/${params.id}`} className="flex items-center gap-2">
              <Eye size={16} />
              View Form
            </Link>
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown size={16} />
            Export CSV
          </Button>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-12 text-center">
          <h2 className="text-xl font-medium mb-2">No responses yet</h2>
          <p className="text-muted-foreground mb-6">
            Share your form to start collecting responses
          </p>
          <Button asChild>
            <Link href={`/forms/${params.id}`}>View Form</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {responses.map((response) => (
            <Card key={response.id}>
              <CardHeader>
                <CardTitle className="text-lg">Response {response.id.slice(0, 8)}</CardTitle>
                <CardDescription>
                  Submitted on {new Date(response.submittedAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {form.fields.map((field) => (
                    <div key={field.id} className="border-b pb-3">
                      <p className="font-medium">{field.label}</p>
                      <p className="mt-1">
                        {response.responses[field.id] !== undefined
                          ? Array.isArray(response.responses[field.id])
                            ? (response.responses[field.id] as string[]).join(', ')
                            : String(response.responses[field.id])
                          : 'No response'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}