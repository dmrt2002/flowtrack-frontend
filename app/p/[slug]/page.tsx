'use client';

import { useParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { PublicForm } from '@/features/forms/components/PublicForm';
import { usePublicForm } from '@/features/forms/hooks/usePublicForm';

export default function PublicFormPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { formSchema, isLoading, error } = usePublicForm(slug);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-6">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-indigo-600" />
          <p className="text-[16px] text-neutral-600">Loading form...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !formSchema) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-6">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mb-2 text-[24px] font-bold text-neutral-900">
            Form Not Found
          </h1>
          <p className="mb-6 text-[16px] text-neutral-600">
            {error ||
              'The form you are looking for does not exist or is no longer available.'}
          </p>
          <p className="text-[14px] text-neutral-500">
            Please check the URL and try again.
          </p>
        </div>
      </div>
    );
  }

  // Render form
  return <PublicForm formSchema={formSchema} />;
}
