import { NextResponse } from 'next/server';

// Temporary in-memory storage for notes
let notes = [
  {
    id: '1',
    title: 'Grocery List',
    content: 'Milk, Bread, Eggs, Apples',
    category: 'shopping',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Doctor Appointment Notes',
    content: 'Ask about blood pressure medication side effects',
    category: 'health',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    const newNote = {
      id: Date.now().toString(),
      title: data.title,
      content: data.content,
      category: data.category || 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    notes.push(newNote);
    
    return NextResponse.json({
      success: true,
      note: newNote
    });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}