import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import path from 'path';
import fs from 'fs/promises';

export class DocumentProcessor {
  static async processDocument(fileName: string) {
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    console.log('📄 Processing document:', { fileName, filePath });

    try {
      const stats = await fs.stat(filePath);
      console.log(`📊 File size: ${stats.size} bytes`);
    } catch (error) {
      console.error('❌ File access error:', error);
      if (error instanceof Error) {
        throw new Error(`Cannot access file ${fileName}: ${error.message}`);
      } else {
        throw new Error(`Cannot access file ${fileName}: ${String(error)}`);
      }
    }

    const fileExtension = path.extname(fileName).toLowerCase();
    console.log('📎 File extension:', fileExtension);

    try {
      let loader;
      switch (fileExtension) {
        case '.pdf':
          loader = new PDFLoader(filePath);
          break;
        case '.docx':
          loader = new DocxLoader(filePath);
          break;
        case '.txt':
          loader = new TextLoader(filePath);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`);
      }

      console.log('🔄 Loading document content...');
      const docs = await loader.load();
      console.log(`✅ Document loaded successfully. Got ${docs.length} pages/sections`);
      return docs;
    } catch (error) {
      console.error('❌ Document processing error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to process ${fileName}: ${error.message}`);
      } else {
        throw new Error(`Failed to process ${fileName}: ${String(error)}`);
      }
    }
  }
}