// const multer = require('multer');
// const HealthSurvey = require('../models/HealthSurvey');
// const OCRService = require('../services/ocrService');
// const FactorService = require('../services/factorService');
// const RiskService = require('../services/riskService');
// const RecommendationService = require('../services/recommendationService');
// const GeminiService = require('../services/geminiService');

// const upload = multer({ storage: multer.memoryStorage() });
// const ocrService = new OCRService();
// const factorService = new FactorService();
// const riskService = new RiskService();
// const recommendationService = new RecommendationService();
// const geminiService = new GeminiService();

// class OCRController {
//   static uploadMiddleware = upload.single('image');

//   static async processHealthForm(req, res) {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: 'No image file provided' });
//       }

//       const ocrResult = await ocrService.extractHealthData(req.file.buffer);
      
//       if (ocrResult.status === 'incomplete_profile') {
//         return res.json({ success: false, ...ocrResult });
//       }

//       const healthSurvey = HealthSurvey.fromOCR(ocrResult);
//       const factorResult = factorService.extractFactors(ocrResult.answers);
//       healthSurvey.addFactors(factorResult);
      
//       const riskResult = riskService.classifyRisk(factorResult.factors);
//       healthSurvey.addRisk(riskResult);
      
//       const ruleBasedRecommendations = recommendationService.generateRecommendations(riskResult, factorResult.factors, ocrResult.answers);
//       const geminiRecommendations = await geminiService.generateHealthRecommendations(healthSurvey.toJSON());

//       res.json({
//         success: true,
//         data: {
//           healthProfile: healthSurvey.toJSON(),
//           ruleBasedRecommendations,
//           geminiRecommendations
//         }
//       });

//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   }

//   static async processTextData(req, res) {
//     try {
//       if (!req.body || typeof req.body !== 'object') {
//         return res.status(400).json({ error: 'Invalid request body' });
//       }

//       const healthSurvey = new HealthSurvey(req.body);
//       const factorResult = factorService.extractFactors(req.body);
//       healthSurvey.addFactors(factorResult);
      
//       const riskResult = riskService.classifyRisk(factorResult.factors);
//       healthSurvey.addRisk(riskResult);
      
//       const ruleBasedRecommendations = recommendationService.generateRecommendations(riskResult, factorResult.factors, req.body);
//       const geminiRecommendations = await geminiService.generateHealthRecommendations(healthSurvey.toJSON());

//       res.json({
//         success: true,
//         data: {
//           healthProfile: healthSurvey.toJSON(),
//           ruleBasedRecommendations,
//           geminiRecommendations
//         }
//       });

//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         error: error.message
//       });
//     }
//   }
// }

// module.exports = OCRController;


const multer = require('multer');
const HealthSurvey = require('../models/HealthSurvey');
const OCRService = require('../services/ocrService');
const FactorService = require('../services/factorService');
const RiskService = require('../services/riskService');
const RecommendationService = require('../services/recommendationService');
const GeminiService = require('../services/geminiService');

const upload = multer({ storage: multer.memoryStorage() });
const ocrService = new OCRService();
const factorService = new FactorService();
const riskService = new RiskService();
const recommendationService = new RecommendationService();
const geminiService = new GeminiService();

class OCRController {
  static uploadMiddleware = upload.single('image');

  static async processHealthForm(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const ocrResult = await ocrService.extractHealthData(req.file.buffer);
      
      if (ocrResult.status === 'incomplete_profile') {
        return res.json({ success: false, ...ocrResult });
      }

      const healthSurvey = HealthSurvey.fromOCR(ocrResult);
      const factorResult = factorService.extractFactors(ocrResult.answers);
      healthSurvey.addFactors(factorResult);
      
      const riskResult = riskService.classifyRisk(factorResult.factors);
      healthSurvey.addRisk(riskResult);
      
      const recommendations = recommendationService.generateRecommendations(riskResult, factorResult.factors, ocrResult.answers);
      const geminiRecommendations = await geminiService.generateHealthRecommendations(healthSurvey.toJSON());

      res.json({
        success: true,
        data: {
          healthProfile: healthSurvey.toJSON(),
          recommendations: {
            ...recommendations,
            gemini_recommendations: geminiRecommendations.recommendations
          }
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async processTextData(req, res) {
    try {
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ error: 'Invalid request body' });
      }

      const healthSurvey = new HealthSurvey(req.body);
      const factorResult = factorService.extractFactors(req.body);
      healthSurvey.addFactors(factorResult);
      
      const riskResult = riskService.classifyRisk(factorResult.factors);
      healthSurvey.addRisk(riskResult);
      
      const recommendations = recommendationService.generateRecommendations(riskResult, factorResult.factors, req.body);
      const geminiRecommendations = await geminiService.generateHealthRecommendations(healthSurvey.toJSON());

      res.json({
        success: true,
        data: {
          healthProfile: healthSurvey.toJSON(),
          recommendations: {
            ...recommendations,
            gemini_recommendations: geminiRecommendations.recommendations
          }
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = OCRController;