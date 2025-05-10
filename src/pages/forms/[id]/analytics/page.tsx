'use client';

import { FormSchema, FormAnalytics } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Users, Clock, Monitor, Smartphone, Tablet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

async function getFormData(id: string): Promise<{ form: FormSchema | null; analytics: FormAnalytics | null }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/forms/${id}`, { cache: 'no-store' });
    const data = await response.json();
    return {
      form: data.success ? data.data : null,
      analytics: data.success ? data.data.analytics : null,
    };
  } catch (error) {
    console.error("Failed to fetch form:", error);
    return { form: null, analytics: null };
  }
}

export default async function FormAnalyticsPage({ params }: { params: { id: string } }) {
  const { form, analytics } = await getFormData(params.id);

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

  const responseData = analytics?.responsesByDate
    ? Object.entries(analytics.responsesByDate).map(([date, count]) => ({
        date,
        responses: count,
      }))
    : [];

  const fieldCompletionData = form.fields.map((field) => ({
    name: field.label,
    completed: analytics?.fieldCompletion[field.id]?.completed || 0,
    skipped: analytics?.fieldCompletion[field.id]?.skipped || 0,
  }));

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
            <h1 className="text-2xl font-bold">{form.title} - Analytics</h1>
            <p className="text-muted-foreground">
              {analytics?.totalResponses || 0} total responses
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalResponses || 0}</div>
            <p className="text-xs text-muted-foreground">
              Last response: {analytics?.lastResponseAt
                ? new Date(analytics.lastResponseAt).toLocaleDateString()
                : 'No responses yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desktop Users</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.deviceStats.desktop || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Users</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.deviceStats.mobile || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tablet Users</CardTitle>
            <Tablet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.deviceStats.tablet || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Responses Over Time</CardTitle>
            <CardDescription>Daily response count</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="responses" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Field Completion Rates</CardTitle>
            <CardDescription>Completed vs skipped fields</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fieldCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="hsl(var(--chart-2))" stackId="a" name="Completed" />
                <Bar dataKey="skipped" fill="hsl(var(--chart-3))" stackId="a" name="Skipped" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );