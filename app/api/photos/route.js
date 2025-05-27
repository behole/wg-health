import { NextResponse } from 'next/server';

// Sample photo data
const photos = [
  {
    id: '1',
    url: '/images/placeholder1.jpg',
    title: 'Family Dinner',
    description: 'Lovely dinner with the family',
    uploadedAt: new Date().toISOString(),
    tags: ['family', 'dinner']
  },
  {
    id: '2',
    url: '/images/placeholder2.jpg',
    title: 'Garden Walk',
    description: 'Beautiful flowers in the garden',
    uploadedAt: new Date().toISOString(),
    tags: ['garden', 'nature']
  }
];

export async function GET() {
  try {
    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.url || !data.title) {
      return NextResponse.json(
        { error: 'URL and title are required' },
        { status: 400 }
      );
    }
    
    const newPhoto = {
      id: Date.now().toString(),
      url: data.url,
      title: data.title,
      description: data.description || '',
      uploadedAt: new Date().toISOString(),
      tags: data.tags || []
    };
    
    photos.push(newPhoto);
    
    return NextResponse.json({
      success: true,
      photo: newPhoto
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}