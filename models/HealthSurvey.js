class HealthSurvey {
  constructor(answers) {
    this.answers = answers;
    this.missing_fields = [];
    this.confidence = 0;
    this.factors = [];
    this.risk_level = null;
    this.score = 0;
    this.rationale = [];
  }

  static fromOCR(ocrResult) {
    if (!ocrResult || !ocrResult.answers) {
      throw new Error('Invalid OCR result');
    }
    const survey = new HealthSurvey(ocrResult.answers);
    survey.missing_fields = ocrResult.missing_fields || [];
    survey.confidence = ocrResult.confidence || 0;
    return survey;
  }

  addFactors(factorResult) {
    if (!factorResult || !factorResult.factors) {
      throw new Error('Invalid factor result');
    }
    this.factors = factorResult.factors;
    this.confidence = factorResult.confidence;
  }

  addRisk(riskResult) {
    if (!riskResult) {
      throw new Error('Invalid risk result');
    }
    this.risk_level = riskResult.risk_level;
    this.score = riskResult.score;
    this.rationale = riskResult.rationale || [];
  }

  toJSON() {
    return {
      answers: this.answers,
      missing_fields: this.missing_fields,
      confidence: this.confidence,
      factors: this.factors,
      risk_level: this.risk_level,
      score: this.score,
      rationale: this.rationale
    };
  }
}

module.exports = HealthSurvey;