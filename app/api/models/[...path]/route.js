import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { path: filePath } = await params;
    const filePathArray = Array.isArray(filePath) ? filePath : [filePath];
    const relativePath = filePathArray.join('/');
    
    // Security: Only allow files from models directory
    if (!relativePath.startsWith('models/')) {
      return new NextResponse('Not Found', { status: 404 });
    }
    
    // Remove 'models/' prefix and construct full path
    const fileRelativePath = relativePath.replace(/^models\//, '');
    const fileSystemPath = path.join(process.cwd(), 'public', 'models', fileRelativePath);
    
    // Check if file exists
    if (!fs.existsSync(fileSystemPath)) {
      return new NextResponse('File Not Found', { status: 404 });
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(fileSystemPath);
    const fileExtension = path.extname(fileSystemPath).toLowerCase();
    
    // Set appropriate Content-Type based on file extension
    let contentType = 'application/octet-stream';
    if (fileExtension === '.usdz') {
      contentType = 'model/vnd.usdz+zip';
    } else if (fileExtension === '.glb') {
      contentType = 'model/gltf-binary';
    }
    
    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${path.basename(fileSystemPath)}"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error serving model file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

