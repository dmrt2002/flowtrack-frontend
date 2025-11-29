import { useState, useEffect } from 'react';
import {
  getPublicForm,
  trackFormView,
  getOrCreateUTK,
} from '../services/formApi';
import type { PublicFormSchema } from '../types/public-form';

export function usePublicForm(workspaceSlug: string) {
  const [formSchema, setFormSchema] = useState<PublicFormSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchForm() {
      try {
        setIsLoading(true);
        setError(null);

        const schema = await getPublicForm(workspaceSlug);

        if (isMounted) {
          setFormSchema(schema);

          // Track form view for analytics
          const utk = getOrCreateUTK();
          trackFormView(workspaceSlug, utk);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load form');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchForm();

    return () => {
      isMounted = false;
    };
  }, [workspaceSlug]);

  return {
    formSchema,
    isLoading,
    error,
  };
}
