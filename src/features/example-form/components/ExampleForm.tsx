'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { exampleFormSchema, ExampleFormData } from '@/validations/example';

export function ExampleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExampleFormData>({
    resolver: zodResolver(exampleFormSchema),
    defaultValues: {
      subscribe: false,
    },
  });

  const onSubmit = (data: ExampleFormData) => {
    console.log('Form submitted:', data);
    // In a real app, you would send this to an API
    reset();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Example Form</CardTitle>
        <CardDescription>
          Demonstrates React Hook Form with Zod validation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" {...register('name')} />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[120px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter your message..."
              {...register('message')}
            />
            {errors.message && (
              <p className="text-destructive text-sm">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              {...register('category')}
            >
              <option value="">Select a category</option>
              <option value="feedback">Feedback</option>
              <option value="support">Support</option>
              <option value="sales">Sales</option>
            </select>
            {errors.category && (
              <p className="text-destructive text-sm">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="subscribe"
              className="border-input h-4 w-4 rounded"
              {...register('subscribe')}
            />
            <Label htmlFor="subscribe" className="font-normal">
              Subscribe to newsletter
            </Label>
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
