class RiskService {
  constructor() {
    this.riskScores = {
      smoking: 30,
      'poor diet': 25,
      'low exercise': 20,
      'advanced age': 15
    };
    this.riskThresholds = { high: 70, medium: 40 };
  }

  classifyRisk(factors) {
    if (!Array.isArray(factors)) {
      throw new Error('Factors must be an array');
    }

    let score = 0;
    const rationale = [];

    factors.forEach(factor => {
      if (this.riskScores[factor]) {
        score += this.riskScores[factor];
        rationale.push(factor === 'poor diet' ? 'high sugar diet' : 
                      factor === 'low exercise' ? 'low activity' : factor);
      }
    });

    let risk_level = 'low';
    if (score >= this.riskThresholds.high) risk_level = 'high';
    else if (score >= this.riskThresholds.medium) risk_level = 'medium';

    return { risk_level, score, rationale };
  }
}

module.exports = RiskService;