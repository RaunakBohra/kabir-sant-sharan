'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/toast';

const EVENT_TYPES = [
  { value: 'satsang', label: 'Satsang' },
  { value: 'meditation', label: 'Meditation Session' },
  { value: 'festival', label: 'Festival' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'discourse', label: 'Spiritual Discourse' },
  { value: 'retreat', label: 'Retreat' }
];

interface EventFormProps {
  event?: any;
  isEdit?: boolean;
}

export function EventForm({ event, isEdit = false }: EventFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    type: event?.event_type || 'satsang',
    location: event?.location || '',
    virtualLink: event?.virtual_link || '',
    startDate: event?.event_date?.split('T')[0] || '',
    startTime: event?.event_time || '',
    endDate: event?.end_date?.split('T')[0] || event?.event_date?.split('T')[0] || '',
    endTime: event?.end_time || '',
    timezone: event?.timezone || 'Asia/Kathmandu',
    maxAttendees: event?.max_attendees || '',
    registrationRequired: event?.registration_required ?? true,
    registrationDeadline: event?.registration_deadline?.split('T')[0] || '',
    organizer: event?.organizer || 'Kabir Sant Sharan',
    language: event?.language || 'en',
    published: event?.published ?? false,
    featured: event?.is_featured ?? false,
    tags: event?.tags || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(isEdit ? `/api/events/${event.id}` : '/api/events', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          event_type: formData.type,
          event_date: formData.startDate,
          event_time: formData.startTime,
          end_date: formData.endDate,
          end_time: formData.endTime,
          location: formData.location,
          virtual_link: formData.virtualLink,
          timezone: formData.timezone,
          max_attendees: formData.maxAttendees ? parseInt(formData.maxAttendees.toString()) : null,
          registration_required: formData.registrationRequired,
          registration_deadline: formData.registrationDeadline,
          organizer: formData.organizer,
          language: formData.language,
          published: saveAsDraft ? false : formData.published,
          is_featured: formData.featured,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean).join(','),
          slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          current_attendees: event?.current_attendees || 0
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${isEdit ? 'update' : 'create'} event`);
      }

      toast.success(saveAsDraft ? 'Event saved as draft' : `Event ${isEdit ? 'updated' : 'created'} successfully!`);
      router.push('/admin/events');
    } catch (error) {
      console.error('Failed to submit event:', error);
      toast.error(error instanceof Error ? error.message : `Failed to ${isEdit ? 'update' : 'create'} event`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6 bg-cream-50 p-8 rounded-lg shadow-lg border border-cream-200">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-dark-900 mb-2">
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g., Daily Satsang - Morning Meditation"
          className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-dark-900 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Describe the event, its purpose, and what attendees can expect..."
          className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Type and Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-dark-900 mb-2">
            Event Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {EVENT_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-dark-900 mb-2">
            Language *
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ne">Nepali</option>
          </select>
        </div>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-dark-900 mb-2">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-dark-900 mb-2">
            Start Time *
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-dark-900 mb-2">
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-dark-900 mb-2">
            End Time *
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-dark-900 mb-2">
            Physical Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Kabir Sant Sharan, Kathmandu"
            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="virtualLink" className="block text-sm font-medium text-dark-900 mb-2">
            Virtual Link (Optional)
          </label>
          <input
            type="url"
            id="virtualLink"
            name="virtualLink"
            value={formData.virtualLink}
            onChange={handleChange}
            placeholder="https://zoom.us/j/..."
            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Registration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="maxAttendees" className="block text-sm font-medium text-dark-900 mb-2">
            Max Attendees (Optional)
          </label>
          <input
            type="number"
            id="maxAttendees"
            name="maxAttendees"
            value={formData.maxAttendees}
            onChange={handleChange}
            min="1"
            placeholder="Leave empty for unlimited"
            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="registrationDeadline" className="block text-sm font-medium text-dark-900 mb-2">
            Registration Deadline
          </label>
          <input
            type="date"
            id="registrationDeadline"
            name="registrationDeadline"
            value={formData.registrationDeadline}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-dark-900 mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="meditation, kabir, satsang"
          className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="registrationRequired"
            name="registrationRequired"
            checked={formData.registrationRequired}
            onChange={handleChange}
            className="w-4 h-4 text-teal-600 border-cream-300 rounded focus:ring-teal-500"
          />
          <label htmlFor="registrationRequired" className="ml-2 text-sm text-dark-700">
            Registration Required
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 text-teal-600 border-cream-300 rounded focus:ring-teal-500"
          />
          <label htmlFor="featured" className="ml-2 text-sm text-dark-700">
            Featured Event
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-4 h-4 text-teal-600 border-cream-300 rounded focus:ring-teal-500"
          />
          <label htmlFor="published" className="ml-2 text-sm text-dark-700">
            Publish Event
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-cream-200">
        <button
          type="button"
          onClick={() => router.push('/admin/events')}
          disabled={isSubmitting}
          className="px-6 py-2 border border-cream-300 text-dark-700 rounded-lg hover:bg-cream-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isSubmitting}
          className="px-6 py-2 border border-amber-300 bg-amber-50 text-amber-800 rounded-lg hover:bg-amber-100 transition-colors"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isEdit ? 'Update Event' : 'Create Event'}</span>
        </button>
      </div>
    </form>
  );
}