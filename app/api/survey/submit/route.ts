import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const surveyData = await request.json();
    
    // Add timestamp and ID
    const submission = {
      ...surveyData,
      submittedAt: new Date(),
      id: new Date().getTime().toString(),
    };

    const db = await getDatabase();
    const collection = db.collection('surveys');
    
    const result = await collection.insertOne(submission);
    
    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting survey:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit survey' },
      { status: 500 }
    );
  }
} 