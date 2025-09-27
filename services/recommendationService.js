class RecommendationService {
  constructor() {
    this.riskThresholds = { high: 70, medium: 40 };
    this.factorRules = {
      smoking: {
        recommendations: ['Quit smoking immediately', 'Consider nicotine replacement therapy', 'Join smoking cessation program'],
        priority: 1
      },
      'poor diet': {
        recommendations: ['Reduce sugar intake', 'Increase fiber consumption', 'Limit processed foods', 'Eat more vegetables'],
        priority: 2
      },
      'low exercise': {
        recommendations: ['Walk 30 mins daily', 'Start with light cardio', 'Take stairs instead of elevator', 'Join fitness classes'],
        priority: 3
      },
      'advanced age': {
        recommendations: ['Regular health checkups', 'Monitor blood pressure', 'Maintain social connections', 'Consider preventive screenings'],
        priority: 4
      }
    };
  }

  generateRecommendations(riskResult, factors, answers = {}) {
    const recommendations = [];
    const prioritizedFactors = this.prioritizeFactors(factors);
    
    prioritizedFactors.forEach(factor => {
      const rule = this.factorRules[factor];
      if (rule) {
        const contextualRecs = this.getContextualRecommendations(factor, answers, rule.recommendations);
        recommendations.push(...contextualRecs);
      }
    });

    // Add risk-specific recommendations
    if (riskResult.risk_level === 'high') {
      recommendations.unshift('Consult healthcare provider soon');
    }

    // Limit to top 5 recommendations
    const finalRecommendations = recommendations.slice(0, 5);

    return {
      risk_level: riskResult.risk_level,
      factors,
      recommendations: finalRecommendations,
      status: this.getStatus(riskResult.risk_level, factors.length)
    };
  }

  prioritizeFactors(factors) {
    return factors.sort((a, b) => {
      const priorityA = this.factorRules[a]?.priority || 999;
      const priorityB = this.factorRules[b]?.priority || 999;
      return priorityA - priorityB;
    });
  }

  getContextualRecommendations(factor, answers, baseRecommendations) {
    switch (factor) {
      case 'smoking':
        return answers.age > 50 ? 
          ['Quit smoking urgently - higher risk at your age', ...baseRecommendations.slice(1)] :
          baseRecommendations.slice(0, 2);
      
      case 'poor diet':
        return answers.exercise === 'rarely' ?
          ['Reduce sugar and increase activity', ...baseRecommendations.slice(1, 3)] :
          baseRecommendations.slice(0, 2);
      
      case 'low exercise':
        return answers.age > 60 ?
          ['Start with gentle walking', 'Consider water aerobics'] :
          baseRecommendations.slice(0, 2);
      
      default:
        return baseRecommendations.slice(0, 2);
    }
  }

  getStatus(riskLevel, factorCount) {
    if (riskLevel === 'high' && factorCount >= 3) return 'urgent';
    if (riskLevel === 'high') return 'attention_needed';
    if (riskLevel === 'medium') return 'monitor';
    return 'ok';
  }
}

module.exports = RecommendationService;