import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/comps/form/ui/card";
import { Button } from "@/comps/form/ui/button";
import Link from "next/link";
// import { Plus, Pencil, Eye, Trash2, BarChart } from "lucide-react";
import { IconPlus, IconPencil, IconEye, IconTrash, IconChartBar
} from '@tabler/icons-react';


// async function getFormsData() {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/forms`, { cache: 'no-store' });
//     const data = await response.json();
//     return data.success ? data.data : [];
//   } catch (error) {
//     console.error("Failed to fetch forms:", error);
//     return [];
//   }
// }

export default async function FormsPage() {
  // const forms = await getFormsData();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Forms</h1>
        <Button asChild>
          <Link href="/forms/new" className="flex items-center gap-2">
            <IconPlus size={16} />
            Create Form
          </Link>
        </Button>
      </div>

      {forms.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-12 text-center">
          <h2 className="text-xl font-medium mb-2">No forms created yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first form to start collecting responses
          </p>
          <Button asChild>
            <Link href="/forms/new">Create Your First Form</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form: any) => (
            <Card key={form.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="truncate">{form.title}</CardTitle>
                <CardDescription className="truncate">
                  {form.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-muted-foreground">
                    {form.fields.length} {form.fields.length === 1 ? "field" : "fields"}
                  </div>
                  <div className="text-muted-foreground">
                    {form.analytics?.totalResponses || 0} responses
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/forms/${form.id}/edit`} className="flex items-center gap-1">
                      <IconPencil size={14} />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/forms/${form.id}/responses`} className="flex items-center gap-1">
                      <IconEye size={14} />
                      Responses
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/forms/${form.id}/analytics`} className="flex items-center gap-1">
                      <IconChartBar size={14} />
                      Analytics
                    </Link>
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <IconTrash size={14} className="mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}