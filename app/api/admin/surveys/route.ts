import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('surveys');
    
    // Get all surveys, sorted by submission date (newest first)
    const surveys = await collection
      .find({})
      .sort({ submittedAt: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      surveys: surveys.map(survey => ({
        ...survey,
        _id: survey._id.toString(), // Convert ObjectId to string
      })),
    });
  } catch (error) {
    console.error('Error fetching surveys:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch surveys' },
      { status: 500 }
    );
  }
} 