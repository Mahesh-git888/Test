// const { GoogleGenerativeAI } = require('@google/generative-ai');

// class GeminiService {
//   constructor() {
//     if (!process.env.GEMINI_API_KEY) {
//       throw new Error('GEMINI_API_KEY environment variable is required');
//     }
//     this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//   }

//  async generateHealthRecommendations(healthProfile) {
//     const prompt = `Based on this health profile, provide 3-5 specific, actionable health recommendations (non-diagnostic):
    
// Health Profile: ${JSON.stringify(healthProfile)}

// Format as JSON: {"recommendations": ["rec1", "rec2", "rec3"]}`;

//     try {
//       const result = await this.model.generateContent(prompt);
//       const response = await result.response;
//       console.log('Gemini raw response:', response);
//       if (!response.ok) {
//         throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
//       }
//       const text = response.text();
      
//       try {
//         return JSON.parse(text);
//       } catch (parseError) {
//         throw new Error(`Failed to parse Gemini response: ${parseError.message}`);
//       }
//     } catch (error) {
//       throw new Error(`Gemini API error: ${error.message}`);
//     }
//   }
// }

// module.exports = GeminiService;


const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateHealthRecommendations(healthProfile) {
    const prompt = `Based on this health profile, provide 3-5 specific, actionable health recommendations (non-diagnostic). Return ONLY valid JSON without markdown formatting:

Health Profile: ${JSON.stringify(healthProfile)}

Return format: {"recommendations": ["rec1", "rec2", "rec3"]}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response =  result.response;
      let text = response.text().trim();
      
      // Clean markdown formatting
      text = text.replace(/json\n?/g, '').replace(/\n?/g, '').trim();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return { recommendations: ["Maintain regular exercise", "Eat balanced diet", "Get adequate sleep"] };
      }
    } catch (error) {
      return { recommendations: ["Maintain regular exercise", "Eat balanced diet", "Get adequate sleep"] };
    }
  }
}

module.exports = GeminiService;