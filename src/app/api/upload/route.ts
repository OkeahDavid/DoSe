import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file received.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, file.name);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      message: 'File uploaded successfully',
      fileName: file.name
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to upload file.' },
      { status: 500 }
    );
  }
}