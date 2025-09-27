# OCR Health Survey Backend

Node.js MVC backend with Gemini integration for processing health survey forms.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set your Gemini API key in `.env`:
```
GEMINI_API_KEY=your_actual_api_key
```

3. Start server:
```bash
npm run dev
```

## API Endpoints

### POST /api/ocr/process-image
Upload health survey form image for OCR processing and recommendations.

**Request:** Multipart form with `image` field

### POST /api/ocr/process-text  
Process health data directly as JSON and get recommendations.

**Request Body:**
```json
{
  "age": 42,
  "gender": "male",
  "height": 175,
  "weight": 80,
  "smoker": false,
  "exercise": "moderate",
  "dietType": "mixed"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "healthProfile": { ... },
    "recommendations": { ... }
  }
}
```