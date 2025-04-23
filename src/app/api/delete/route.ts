import { NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const fileName = url.searchParams.get('file');

    if (!fileName) {
      return NextResponse.json(
        { error: 'No file specified.' },
        { status: 400 }
      );
    }

    // Prevent path traversal attacks by sanitizing the filename
    const sanitizedFileName = path.basename(fileName);
    const filePath = path.join(process.cwd(), 'public', 'uploads', sanitizedFileName);

    await unlink(filePath);

    return NextResponse.json({
      message: 'File deleted successfully',
      fileName: sanitizedFileName
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file.' },
      { status: 500 }
    );
  }
}