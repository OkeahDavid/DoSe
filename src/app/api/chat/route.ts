import { NextResponse } from 'next/server';
import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { DocumentProcessor } from '@/services/documentProcessor';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json();
    console.log('📥 Received request:', { message, context });

    console.log('🔑 OpenAI API Key present:', !!process.env.OPENAI_API_KEY);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ Embeddings initialized');

    const model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ ChatOpenAI model initialized');

    if (context && context.length > 0) {
      console.log('📂 Processing documents...', context);
      const documents = [];
      
      for (const fileName of context) {
        console.log(`🔄 Starting to process file: ${fileName}`);
        try {
          const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
          console.log(`📍 Full file path: ${filePath}`);
          
          try {
            await fs.access(filePath);
            console.log('✅ File exists at path');
          } catch (e) {
            console.error('❌ File not found at path:', e);
            throw new Error(`File not found: ${fileName}`);
          }

          const docs = await DocumentProcessor.processDocument(fileName);
          console.log(`📄 Document processed. Number of pages/sections:`, docs.length);
          console.log(`📝 First page content preview:`, docs[0]?.pageContent?.substring(0, 100));
          documents.push(...docs);
        } catch (error) {
          console.error(`❌ Error processing ${fileName}:`, error);
          throw error;
        }
      }

      console.log(`📚 Total documents processed: ${documents.length}`);
      
      console.log('🔄 Creating vector store...');
      const vectorStore = await MemoryVectorStore.fromDocuments(
        documents,
        embeddings
      );
      console.log('✅ Vector store created');

      console.log('⚡ Creating chain...');
      const chain = ConversationalRetrievalQAChain.fromLLM(
        model,
        vectorStore.asRetriever(),
        {
          returnSourceDocuments: true,
          questionGeneratorTemplate: `Given the following conversation and a follow-up question, rephrase the follow-up question to be a standalone question. Include all context needed to find relevant information from the documents.

Follow Up Question: {question}

Standalone question:`,
          qaTemplate: `You are a helpful assistant for understanding documents. Use the following pieces of context to provide a detailed answer to the question. If you cannot answer the question based on the context, say so.

Context: {context}

Question: {question}

Answer:`,
          verbose: true
        }
      );
      console.log('✅ Chain created');

      console.log('💬 Getting response from chain...');
      const chainResponse = await chain.call({
        question: message,
        chat_history: [],
      });
      console.log('🔍 Chain response text:', chainResponse.text);

      return NextResponse.json({ 
        response: chainResponse.text,
        sources: chainResponse.sourceDocuments 
      });
    } else {
      console.log('⚠️ No context provided, using regular chat');
      const response = await model.call([
        { 
          role: 'system', 
          content: 'You are DoSe, a helpful document search assistant. Currently, no documents have been uploaded.' 
        },
        { role: 'user', content: message }
      ]);

      return NextResponse.json({ response: response.content });
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error('Unknown error type:', error);
    }
    return NextResponse.json(
      { error: `Failed to process message: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}