// Temporary in-memory storage for appointments
// In a production app, you'd use a database instead
let appointments = [
  {
    id: '1',
    title: 'Doctor Appointment',
    date: new Date().toISOString().split('T')[0], // Today
    time: '10:00',
    location: 'Dr. Smith\'s Office',
    withPerson: 'Sarah',
    notes: 'Bring medication list'
  },
  {
    id: '2',
    title: 'Lunch with Family',
    date: new Date().toISOString().split('T')[0], // Today
    time: '12:30',
    location: 'Home',
    withPerson: 'Josh, Emma',
    notes: 'Italian food day!'
  }
];

export async function GET() {
  return Response.json({ appointments });
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.date || !data.time) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Add ID and create new appointment
    const newAppointment = {
      id: Date.now().toString(),
      title: data.title,
      date: data.date,
      time: data.time,
      location: data.location || '',
      withPerson: data.withPerson || '',
      notes: data.notes || '',
      status: 'pending' // New appointments are pending until approved by family
    };
    
    // Add to our temporary store
    appointments.push(newAppointment);
    
    // In a real app, you'd also:
    // 1. Send a notification to family members
    // 2. Store in a database
    
    return Response.json({ 
      success: true, 
      appointment: newAppointment 
    });
  } catch (error) {
    console.error('Error adding appointment:', error);
    return Response.json(
      { error: 'Failed to add appointment' },
      { status: 500 }
    );
  }
}

// Update appointment (for admin approval, etc.)
export async function PUT(request) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return Response.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    // Find and update the appointment
    const index = appointments.findIndex(apt => apt.id === data.id);
    
    if (index === -1) {
      return Response.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    appointments[index] = {
      ...appointments[index],
      ...data,
    };
    
    return Response.json({
      success: true,
      appointment: appointments[index]
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return Response.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// Delete appointment
export async function DELETE(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return Response.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }
    
    // Find and remove the appointment
    const initialLength = appointments.length;
    appointments = appointments.filter(apt => apt.id !== id);
    
    if (appointments.length === initialLength) {
      return Response.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return Response.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}
