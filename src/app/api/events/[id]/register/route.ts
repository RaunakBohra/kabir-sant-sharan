import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database-service';

export const runtime = 'nodejs';

interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  dietaryRestrictions?: string;
  specialRequests?: string;
  agreeToTerms: boolean;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as RegistrationData;

    // Validate required fields
    const { fullName, email, phone, emergencyContact, emergencyPhone, agreeToTerms } = body;
    if (!fullName || !email || !phone || !emergencyContact || !emergencyPhone || !agreeToTerms) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if event exists
    const eventsResult = await databaseService.getEvents();
    const event = eventsResult.events.find((e) => e.id === params.id);

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event is published and registration is required
    if (!event.published || !event.registrationRequired) {
      return NextResponse.json(
        { error: 'Registration not available for this event' },
        { status: 400 }
      );
    }

    // Check registration deadline
    if (event.registrationDeadline) {
      const deadline = new Date(event.registrationDeadline);
      const now = new Date();
      if (now > deadline) {
        return NextResponse.json(
          { error: 'Registration deadline has passed' },
          { status: 400 }
        );
      }
    }

    // Check if event has already passed
    const eventDate = new Date(event.startDate);
    const now = new Date();
    if (eventDate < now) {
      return NextResponse.json(
        { error: 'Cannot register for past events' },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const existingRegistrations = await getEventRegistrations(params.id);
    const existingRegistration = existingRegistrations.find(
      reg => reg.email.toLowerCase() === email.toLowerCase()
    );

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      );
    }

    // Check capacity
    const isWaitlist = event.maxAttendees && existingRegistrations.length >= event.maxAttendees;

    // Create registration
    const registration = {
      id: Date.now().toString(),
      eventId: params.id,
      fullName,
      email: email.toLowerCase(),
      phone,
      emergencyContact,
      emergencyPhone,
      dietaryRestrictions: body.dietaryRestrictions || null,
      specialRequests: body.specialRequests || null,
      registrationDate: new Date().toISOString(),
      status: isWaitlist ? 'waitlist' : 'confirmed',
      confirmationCode: generateConfirmationCode()
    };

    // In a real implementation, this would save to database
    // For now, we'll return a success response
    console.log('Registration created:', registration);

    // Update event attendee count (mock)
    if (!isWaitlist) {
      // In real implementation: update event.currentAttendees++
    }

    const response = {
      message: isWaitlist
        ? 'You have been added to the waiting list for this event'
        : 'Registration successful! You will receive a confirmation email shortly.',
      registration: {
        id: registration.id,
        confirmationCode: registration.confirmationCode,
        status: registration.status,
        eventTitle: event.title,
        eventDate: event.startDate,
        eventTime: event.startTime
      },
      isWaitlist
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Error processing registration:', error);
    return NextResponse.json(
      { error: 'Failed to process registration' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const registrations = await getEventRegistrations(params.id);

    // Return summary information without personal details
    const summary = {
      totalRegistrations: registrations.length,
      confirmedRegistrations: registrations.filter(r => r.status === 'confirmed').length,
      waitlistRegistrations: registrations.filter(r => r.status === 'waitlist').length,
      registrations: registrations.map(reg => ({
        id: reg.id,
        fullName: reg.fullName,
        registrationDate: reg.registrationDate,
        status: reg.status
      }))
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const confirmationCode = searchParams.get('confirmationCode');

    if (!email && !confirmationCode) {
      return NextResponse.json(
        { error: 'Email or confirmation code required' },
        { status: 400 }
      );
    }

    const registrations = await getEventRegistrations(params.id);
    const registration = registrations.find(
      reg => (email && reg.email.toLowerCase() === email.toLowerCase()) ||
             (confirmationCode && reg.confirmationCode === confirmationCode)
    );

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // In a real implementation, this would delete from database
    console.log('Registration cancelled:', registration.id);

    return NextResponse.json({
      message: 'Registration cancelled successfully',
      refundInfo: 'If applicable, refunds will be processed within 5-7 business days'
    });
  } catch (error) {
    console.error('Error cancelling registration:', error);
    return NextResponse.json(
      { error: 'Failed to cancel registration' },
      { status: 500 }
    );
  }
}

// Helper function to get event registrations
async function getEventRegistrations(eventId: string) {
  // In a real implementation, this would query the database
  // For now, return mock data
  return [
    {
      id: '1',
      eventId,
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      emergencyContact: 'Jane Doe',
      emergencyPhone: '+1234567891',
      dietaryRestrictions: null,
      specialRequests: null,
      registrationDate: '2024-09-20T10:00:00Z',
      status: 'confirmed',
      confirmationCode: 'KS2024001'
    }
  ];
}

// Helper function to generate confirmation code
function generateConfirmationCode(): string {
  const prefix = 'KS';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${year}${random}`;
}