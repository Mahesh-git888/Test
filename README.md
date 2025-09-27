# OCR Health Survey Backend

Node.js MVC backend with Gemini AI integration for processing health survey forms through OCR and providing personalized health recommendations.

## Features

- *OCR Processing*: Extract health data from uploaded survey form images using Tesseract.js
- *AI Recommendations*: Generate personalized health recommendations using Google's Gemini AI
- *Risk Assessment*: Classify health risks based on extracted factors
- *RESTful API*: Clean API endpoints for image and text processing
- *Rate Limiting*: Built-in protection against API abuse

## Architecture


project/
├── controllers/          # Request handlers
│   └── ocrController.js
├── models/              # Data models
│   └── HealthSurvey.js
├── routes/              # API route definitions
│   └── ocrRoutes.js
├── services/            # Business logic
│   ├── factorService.js      # Extract health factors
│   ├── geminiService.js      # Gemini AI integration
│   ├── ocrService.js         # OCR processing
│   ├── recommendationService.js  # Generate recommendations
│   └── riskService.js        # Risk classification
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
└── server.js           # Application entry point


## Prerequisites

- Node.js >= 16.0.0
- npm or yarn
- Google Gemini API key

## Setup

1. *Clone and install dependencies:*
bash
git clone <repository-url>
cd project
npm install


2. *Environment configuration:*
bash
cp .env.example .env


Edit .env with your configuration:
env
# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Security Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001


3. *Start the server:*
bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start


The server will start on http://localhost:3000

## API Documentation

### Base URL

http://localhost:3000/api/ocr


### Endpoints

#### 1. Process Health Survey Image

*POST* /process-image

Upload a health survey form image for OCR processing and AI-powered recommendations.

*Request:*
- Content-Type: multipart/form-data
- Body: Form data with image field containing the image file

*Example using curl:*
bash
curl -X POST \
  http://localhost:3000/api/ocr/process-image \
  -F "image=@health_survey.jpg"


*Example using JavaScript:*
javascript
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('/api/ocr/process-image', {
  method: 'POST',
  body: formData
});

const result = await response.json();


#### 2. Process Health Data Directly

*POST* /process-text

Process health data directly as JSON and receive personalized recommendations.

*Request Body:*
json
{
  "age": 42,
  "gender": "male",       //must give atleast 2 of these
  "smoker": false,
  "exercise": "moderate",
  "diet": "mixed",
}


*Example using curl:*
bash
curl -X POST \
  http://localhost:3000/api/ocr/process-text \
  -H "Content-Type: application/json" \
  -d '{
    "age": 42,
    "gender": "male",
    "smoker": false,
    "exercise": "moderate",
    "diet": "mixed"
  }'


*Example using JavaScript:*
javascript
const healthData = {
  age: 42,
  gender: "male",
  smoker: false,
  exercise: "moderate",
  diet: "mixed"
};

const response = await fetch('/api/ocr/process-text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(healthData)
});

const result = await response.json();


### Response Format

*Success Response:*
json
{
  "success": true,
  "data": {
    "healthProfile": {
      "personalInfo": {
        "age": 42,
        "gender": "male",
        "height": 175,
        "weight": 80,
        "bmi": 26.1
      },
      "lifestyle": {
        "smoker": false,
        "exercise": "moderate",
        "dietType": "mixed"
      },
      "riskFactors": {
        "cardiovascular": "moderate",
        "diabetes": "low",
        "overall": "moderate"
      },
      "riskLevel": "moderate"
    },
    "recommendations": {
      "dietary": [
        "Increase fiber intake with whole grains and vegetables",
        "Limit processed foods and added sugars"
      ],
      "exercise": [
        "Aim for 150 minutes of moderate aerobic activity per week",
        "Include strength training exercises twice per week"
      ],
      "lifestyle": [
        "Maintain regular sleep schedule (7-9 hours)",
        "Practice stress management techniques"
      ],
      "gemini_recommendations": [
        "Consider consulting with a nutritionist for personalized meal planning",
        "Regular health check-ups are recommended given your risk profile"
      ]
    }
  }
}


*Error Response:*
json
{
  "success": false,
  "error": "Error message describing what went wrong"
}


*Incomplete OCR Response:*
json
{
  "success": false,
  "status": "incomplete_profile",
  "message": "Could not extract complete health profile from image",
  "extractedData": {
    "age": 42,
    "gender": "male"
  },
  "missingFields": ["height", "weight", "exercise"]
}


## Health Data Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| age | number | Yes | Age in years |
| gender | string | Yes | "male", "female", or "other" |
| height | number | Yes | Height in centimeters |
| weight | number | Yes | Weight in kilograms |
| smoker | boolean | No | Smoking status |
| exercise | string | No | "sedentary", "light", "moderate", "vigorous" |
| dietType | string | No | "vegetarian", "vegan", "mixed", "keto", etc. |
| medicalHistory | array | No | Array of medical conditions |
| allergies | array | No | Array of known allergies |

## Development

*Available Scripts:*
bash
npm run dev      # Start development server with auto-reload
npm start        # Start production server
npm test         # Run tests
npm run lint     # Run ESLint


*Testing:*
bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch


## Error Handling

The API uses standard HTTP status codes:

- 200 - Success
- 400 - Bad Request (missing or invalid data)
- 500 - Internal Server Error

All error responses include a descriptive error message in the error field.

## Rate Limiting

API endpoints are rate-limited to prevent abuse. Default limits:
- 100 requests per 15 minutes per IP address

## Security

- CORS enabled for specified origins
- Request size limits enforced
- Input validation on all endpoints
- Environment variables for sensitive configuration

## License

UNLICENSED - Internal Amazon project
