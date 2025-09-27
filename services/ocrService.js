const Tesseract = require('tesseract.js');
const { distance } = require('fastest-levenshtein');

class OCRService {
  constructor() {
    this.validKeys = ['age', 'smoker', 'exercise', 'diet'];
    this.requiredFields = ['age', 'smoker', 'exercise', 'diet'];
    this.confidenceMultiplier = 0.92;
    this.incompleteThreshold = 0.5;
  }

  async extractHealthData(imageBuffer) {
    try {
      const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
      return this.parseHealthText(text);
    } catch (error) {
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  parseHealthText(text) {
    const pairs = this.extractKeyValuePairs(text);
    const answers = {};

    Object.entries(pairs).forEach(([key, value]) => {
      if (key === 'age') answers.age = this.extractNumber(value);
      if (key === 'smoker') answers.smoker = this.extractBoolean(value);
      if (key === 'exercise') answers.exercise = this.extractExercise(value);
      if (key === 'diet') answers.diet = this.extractDiet(value);
    });

    const missing_fields = this.requiredFields.filter(field => answers[field] === undefined || answers[field] === null);
    const confidence = this.calculateConfidence(answers, missing_fields);

    if (missing_fields.length > this.requiredFields.length * this.incompleteThreshold) {
      return { status: "incomplete_profile", reason: ">50% fields missing" };
    }

    return { answers, missing_fields, confidence };
  }

  calculateConfidence(answers, missing_fields) {
    if (this.requiredFields.length === 0) return 1.0;
    const completeness = (this.requiredFields.length - missing_fields.length) / this.requiredFields.length;
    return Math.round(completeness * this.confidenceMultiplier * 100) / 100;
  }

  matchKey(rawKey) {
    let bestMatch = null;
    let bestScore = Infinity;

    for (const validKey of this.validKeys) {
      const score = distance(rawKey.toLowerCase(), validKey);
      if (score < bestScore && score <= 2) {
        bestScore = score;
        bestMatch = validKey;
      }
    }

    return bestMatch;
  }

  extractKeyValuePairs(text) {
    const pairs = {};
    const lines = text.split(/\r?\n/);

    for (const line of lines) {
      const match = line.split(/[:=>\-|]+/);
      if (match.length >= 2) {
        const rawKey = match[0].trim();
        const value = match.slice(1).join(' ').trim();
        const key = this.matchKey(rawKey);
        
        if (key && value) {
          pairs[key] = pairs[key] ? `${pairs[key]} ${value}` : value;
        }
      }
    }

    return pairs;
  }

  extractNumber(text) {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  }

  extractBoolean(text) {
    return /\b(yes|true|1)\b/i.test(text);
  }

  extractExercise(text) {
    if (/rarely|never|none/i.test(text)) return 'rarely';
    if (/light/i.test(text)) return 'light';
    if (/moderate/i.test(text)) return 'moderate';
    if (/intense|daily/i.test(text)) return 'intense';
    return 'rarely';
  }

  extractDiet(text) {
    if (/high sugar|sugar|sweet/i.test(text)) return 'high sugar';
    if (/low sugar|healthy/i.test(text)) return 'low sugar';
    if (/balanced/i.test(text)) return 'balanced';
    return 'mixed';
  }
}

module.exports = OCRService;