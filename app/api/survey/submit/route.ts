import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const surveyData = await request.json();
    
    if (!surveyData || Object.keys(surveyData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid survey data' },
        { status: 400 }
      );
    }
    
    // Add timestamp and ID
    const submission = {
      ...surveyData,
      submittedAt: new Date(),
      id: new Date().getTime().toString(),
    };

    console.log('Attempting to connect to database...');
    const db = await getDatabase();
    console.log('Database connected successfully');
    
    const collection = db.collection('surveys');
    console.log('Inserting survey data...');
    
    const result = await collection.insertOne(submission);
    console.log('Survey inserted successfully:', result.insertedId);
    
    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Detailed error submitting survey:', error);
    
    // More specific error messages
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed',
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Unknown server error' },
      { status: 500 }
    );
  }
} 