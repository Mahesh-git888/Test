class FactorService {
  constructor() {
    this.requiredFields = ['age', 'smoker', 'exercise', 'diet'];
    this.confidenceMultiplier = 0.88;
  }

  extractFactors(answers) {
    if (!answers || typeof answers !== 'object') {
      throw new Error('Invalid answers object');
    }

    const factors = [];

    if (answers.smoker === true) {
      factors.push('smoking');
    }

    if (answers.dietType === 'high sugar' || answers.diet === 'high sugar') {
      factors.push('poor diet');
    }

    if (answers.exercise === 'rarely' || answers.exercise === 'none') {
      factors.push('low exercise');
    }

    if (answers.age && answers.age > 65) {
      factors.push('advanced age');
    }

    const providedFields = Object.keys(answers).length;
    const confidence = Math.round((providedFields / this.requiredFields.length) * this.confidenceMultiplier * 100) / 100;

    return { factors, confidence };
  }
}

module.exports = FactorService;