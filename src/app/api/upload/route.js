import { writeFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const agentId = formData.get('agentId');
    const docType = formData.get('docType');

    if (!file || !agentId || !docType) {
      return NextResponse.json(
        { error: 'File, agent ID, and document type are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create the directory path in public/uploads/[agentId]
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', agentId);
    
    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true });
    
    // Create the file path
    const filePath = path.join(uploadDir, file.name);
    
    // Write the file
    await writeFile(filePath, buffer);
    
    // Return the public URL path that can be used to access the file
    const publicPath = `/uploads/${agentId}/${file.name}`;
    
    return NextResponse.json({
      message: 'File uploaded successfully',
      path: publicPath
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
