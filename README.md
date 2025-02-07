# DoSe

## Overview
This is a **Document Search Bot** built with **Next.js (TypeScript)**. It allows users to upload documents, extract text, and perform search queries on the content.

## Features
- 📂 **Upload Documents** (PDF, DOCX, TXT)
- 🔍 **Extract and Search Text** from uploaded files
- 🚀 **API Routes** for backend processing
- 🌐 **Deployed on Vercel** for seamless usage

## Technologies Used
- **Frontend & Backend**: Next.js (TypeScript)
- **File Handling**: Multer
- **Text Extraction**: pdf-parse, mammoth
- **API Requests**: Axios

## Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/OkeahDavid/dose.git
cd document-search-bot
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Run the Development Server
```bash
npm run dev
```
> The app will be available at `http://localhost:3000`

## API Routes

### 🔹 `POST /api/upload`
Handles document uploads and stores them for processing.

#### **Request Body:**
- `file`: The document file to upload (PDF, DOCX, TXT)

#### **Response:**
```json
{
  "message": "File uploaded successfully",
  "filePath": "/uploads/sample.pdf"
}
```

## Deployment
### 🚀 Deploying to Vercel
1. Push your code to **GitHub**
2. Connect the repository to **Vercel**
3. Set environment variables (if needed)
4. Deploy with one click! 🎉

## Future Enhancements
- ✨ Implement full-text search with AI
- 🔎 Add summarization & keyword extraction

---
**Made with ❤️ using Next.js & TypeScript**

