'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { FileUpload } from '@/components/ui/file-upload';
import { ComponentErrorBoundary } from '@/components/ui/error-boundary';
import { toast } from '@/components/ui/toast';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['meditation', 'discourse', 'festival', 'music', 'workshop', 'retreat']),
  location: z.string().optional(),
  virtualLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  timezone: z.string(),
  maxAttendees: z.number().min(1).optional(),
  registrationRequired: z.boolean(),
  registrationDeadline: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.string(),
  organizer: z.string().min(1, 'Organizer is required'),
  language: z.enum(['en', 'hi', 'ne']),
  published: z.boolean(),
  featured: z.boolean(),
  coverImage: z.string().optional()
}).refine((data) => {
  const start = new Date(data.startDate + 'T' + data.startTime);
  const end = new Date(data.endDate + 'T' + data.endTime);
  return end > start;
}, {
  message: 'End date/time must be after start date/time',
  path: ['endDate']
});

type EventFormData = z.infer<typeof eventSchema>;

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EVENT_TYPES = [
  { value: 'meditation', label: 'Meditation Session' },
  { value: 'discourse', label: 'Spiritual Discourse' },
  { value: 'festival', label: 'Festival' },
  { value: 'music', label: 'Bhajan/Music' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'retreat', label: 'Retreat' }
];

const CATEGORIES = [
  { value: 'satsang', label: 'Satsang' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'celebration', label: 'Celebration' },
  { value: 'learning', label: 'Learning' },
  { value: 'community', label: 'Community' }
];

export function CreateEventDialog({ open, onOpenChange, onSuccess }: CreateEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [autoSaveKey, setAutoSaveKey] = useState('event-draft');

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'meditation',
      location: '',
      virtualLink: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      timezone: 'Asia/Kathmandu',
      maxAttendees: undefined,
      registrationRequired: false,
      registrationDeadline: '',
      category: '',
      tags: '',
      organizer: 'Kabir Sant Sharan',
      language: 'en',
      published: false,
      featured: false,
      coverImage: ''
    }
  });

  // Create a stable auto-save function
  const autoSave = useCallback(() => {
    const values = form.getValues();
    if (values.title || values.description) {
      localStorage.setItem(autoSaveKey, JSON.stringify(values));
      console.log('Auto-saved draft');
    }
  }, [form, autoSaveKey]);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    if (!open) return;

    const interval = setInterval(autoSave, 30000);

    return () => clearInterval(interval);
  }, [open, autoSave]);

  // Create a stable load draft function
  const loadDraft = useCallback(() => {
    const saved = localStorage.getItem(autoSaveKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset(parsed);
        toast.info('Loaded saved draft');
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [form, autoSaveKey]);

  // Load draft on mount
  useEffect(() => {
    if (open) {
      loadDraft();
    }
  }, [open, loadDraft]);

  const onSubmit = async (data: EventFormData, saveAsDraft = false) => {
    setIsSubmitting(true);

    try {
      // Upload image if provided
      let imageUrl = data.coverImage;
      if (uploadedImage) {
        const formData = new FormData();
        formData.append('file', uploadedImage);
        formData.append('type', 'image');

        const uploadResponse = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      // Create event
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          coverImage: imageUrl,
          published: saveAsDraft ? false : data.published,
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          currentAttendees: 0
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create event');
      }

      // Clear auto-save draft
      localStorage.removeItem(autoSaveKey);

      toast.success(saveAsDraft ? 'Event saved as draft' : 'Event created successfully!');
      form.reset();
      setUploadedImage(null);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    const values = form.getValues();
    onSubmit(values, true);
  };

  const handleClose = () => {
    const values = form.getValues();
    if (values.title || values.description) {
      if (confirm('You have unsaved changes. Do you want to save a draft?')) {
        localStorage.setItem(autoSaveKey, JSON.stringify(values));
        toast.info('Draft saved locally');
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Schedule satsangs, meditation sessions, and community gatherings
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g., Daily Satsang - Morning Meditation"
                      className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <ComponentErrorBoundary isolate>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                        placeholder="Describe the event, its purpose, and what attendees can expect..."
                        minHeight={250}
                        maxHeight={500}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </ComponentErrorBoundary>

            {/* Event Type and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      >
                        {EVENT_TYPES.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location and Virtual Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Physical Location</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="e.g., Community Hall, Kabir Ashram"
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      />
                    </FormControl>
                    <FormDescription>Leave empty for online-only events</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="virtualLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Virtual Meeting Link</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="url"
                        placeholder="https://zoom.us/..."
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      />
                    </FormControl>
                    <FormDescription>For online or hybrid events</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="date"
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="time"
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="date"
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="time"
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Registration Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="maxAttendees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Attendees (Optional)</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="number"
                        min="1"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="Leave empty for unlimited"
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Deadline (Optional)</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="datetime-local"
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Organizer, Tags, Language */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="organizer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organizer</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <input
                        {...field}
                        type="text"
                        placeholder="meditation, satsang, music"
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      />
                    </FormControl>
                    <FormDescription>Comma-separated</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-400 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ne">Nepali</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <FormLabel>Event Cover Image</FormLabel>
              <FileUpload
                onFilesAccepted={(files) => setUploadedImage(files[0])}
                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                maxFiles={1}
                multiple={false}
                maxSize={5 * 1024 * 1024}
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center space-x-6">
              <FormField
                control={form.control}
                name="registrationRequired"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 text-dark-900 border-cream-300 rounded focus:ring-dark-400"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0 cursor-pointer">Registration required</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 text-dark-900 border-cream-300 rounded focus:ring-dark-400"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0 cursor-pointer">Publish immediately</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="w-4 h-4 text-dark-900 border-cream-300 rounded focus:ring-dark-400"
                      />
                    </FormControl>
                    <FormLabel className="!mt-0 cursor-pointer">Mark as featured</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="px-4 py-2 text-dark-600 border border-cream-300 rounded-lg hover:bg-cream-50 transition-colors disabled:opacity-50"
              >
                Save as Draft
              </button>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-dark-600 border border-cream-300 rounded-lg hover:bg-cream-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-dark-900 text-white rounded-lg hover:bg-dark-800 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Event</span>
                  )}
                </button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}