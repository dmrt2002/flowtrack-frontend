import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import request from '@/lib/request';
import { toast } from 'sonner';

// Example types
type ExampleItem = {
  id: string;
  name: string;
  description: string;
};

// Example query hook
export function useExampleQuery() {
  return useQuery({
    queryKey: ['exampleData'],
    queryFn: async () => {
      const response = await request.get<ExampleItem[]>('/api/v1/example');
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

// Example mutation hook
export function useCreateExampleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<ExampleItem, 'id'>) => {
      const response = await request.post<ExampleItem>('/api/v1/example', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exampleData'] });
      toast.success('Item created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create item');
    },
  });
}

// Example delete mutation
export function useDeleteExampleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await request.delete(`/api/v1/example/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exampleData'] });
      toast.success('Item deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete item');
    },
  });
}
