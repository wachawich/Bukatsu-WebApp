import { FormSchema } from '@/lib/types';
import { DynamicForm } from '@/components/form-display/dynamic-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';

async function getFormData(id: string): Promise<FormSchema | null> {
  try {
    // In a real implementation, this would fetch from your API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/forms/${id}`, { cache: 'no-store' });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error("Failed to fetch form:", error);
    return null;
  }
}

export default async function FormPage({ params }: { params: { id: string } }) {
  const form = await getFormData(params.id);

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
          <h1 className="text-2xl font-bold">{form.title}</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/forms/${params.id}/edit`} className="flex items-center gap-2">
            <Pencil size={16} />
            Edit Form
          </Link>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto bg-card border rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">{form.title}</h2>
          {form.description && <p className="mt-2 text-muted-foreground">{form.description}</p>}
        </div>
        <div className="p-6">
          <DynamicForm
            form={form}
            onSubmit={async (data) => {
              // In client component, we'd submit to API
              console.log('Form submitted:', data);
              
              await fetch('/api/responses', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  formId: form.id,
                  responses: data,
                }),
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}