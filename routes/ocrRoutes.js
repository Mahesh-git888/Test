// const express = require('express');
// const OCRController = require('../controllers/ocrController');

// const router = express.Router();

// // Validation for minimum field count
// const validateHealthData = (req, res, next) => {
//   const fieldCount = Object.keys(req.body || {}).length;
  
//   if (fieldCount < 2) {
//     return res.status(400).json({ error: 'At least 2 fields required' });
//   }
  
//   next();
// };

// // Image upload endpoint
// router.post('/process-image', 
//   OCRController.uploadMiddleware, 
//   OCRController.processHealthForm
// );

// // HTTP body input endpoint  
// router.post('/process-text', 
//   validateHealthData, 
//   OCRController.processTextData
// );

// module.exports = router;

const express = require('express');
const OCRController = require('../controllers/ocrController');

const router = express.Router();

// Health data enums
const EXERCISE_LEVELS = ['rarely', 'none', 'light', 'moderate', 'intense'];
const DIET_TYPES = ['high sugar', 'low sugar', 'balanced', 'mixed'];
const AGE_LIMITS = { MIN: 0, MAX: 150 };

// Validation for fixed set of values
const validateHealthData = (req, res, next) => {
  const { age, smoker, exercise, dietType, diet } = req.body;
  
  const fieldCount = Object.keys(req.body || {}).length;
  if (fieldCount < 2) {
    return res.status(400).json({ error: 'At least 2 fields required' });
  }
  
  if (age !== undefined && (typeof age !== 'number' || age < AGE_LIMITS.MIN || age > AGE_LIMITS.MAX)) {
    return res.status(400).json(`{ error: Age must be a number between ${AGE_LIMITS.MIN}-${AGE_LIMITS.MAX} }`);
  }
  
  if (smoker !== undefined && typeof smoker !== 'boolean') {
    return res.status(400).json({ error: 'Smoker must be true or false' });
  }
  
  if (exercise !== undefined && !EXERCISE_LEVELS.includes(exercise)) {
    return res.status(400).json(`{ error: Exercise must be one of: ${EXERCISE_LEVELS.join(', ')} } `);
  }
  
  const dietValue = dietType || diet;
  if (dietValue !== undefined && !DIET_TYPES.includes(dietValue)) {
    return res.status(400).json(`{ error: Diet must be one of: ${DIET_TYPES.join(', ') } }`);
  }
  
  next();
};

// Image upload endpoint
router.post('/process-image', 
  OCRController.uploadMiddleware, 
  OCRController.processHealthForm
);

// HTTP body input endpoint  
router.post('/process-text', 
  validateHealthData, 
  OCRController.processTextData
);

module.exports = router;
