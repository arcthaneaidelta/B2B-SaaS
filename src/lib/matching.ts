import { Candidate, EmployerRequirement, MatchBreakdown } from '../types';

/**
 * Deterministic Explainable Matching Engine for VERITY
 * 
 * Rules:
 * 1. Mandatory filters are strictly evaluated first.
 *    Any candidate failing a mandatory requirement is marked ineligible, with explicit reasons shown.
 * 2. Eligible candidates are scored using explicit weighted criteria:
 *    - Experience (0-100 normalized)
 *    - Qualifications & Document verification status (0-100 normalized)
 *    - Availability readiness (0-100 normalized)
 *    - Location & travel flexibility (0-100 normalized)
 * 3. Final score = sum of weighted scores, bounded 0-100.
 * 4. Fulfilled criteria, missing evidence, and expiration warnings are compiled for explainability.
 */

export function calculateMatch(candidate: Candidate, requirement: EmployerRequirement): MatchBreakdown {
  const ineligibilityReasons: string[] = [];
  const fulfilledCriteria: string[] = [];
  const missingEvidence: string[] = [];
  const warnings: string[] = [];

  // 1. Mandatory Eligibility Checks
  let mandatoryPassed = true;

  for (const criterion of requirement.mandatoryCriteria) {
    if (criterion.type === 'min_experience') {
      const minYears = Number(criterion.targetValue) || 0;
      if (candidate.experienceYears >= minYears) {
        fulfilledCriteria.push(`Met minimum experience requirement (${candidate.experienceYears} yrs vs ${minYears} yrs required)`);
      } else {
        mandatoryPassed = false;
        ineligibilityReasons.push(`Insufficient experience: candidate has ${candidate.experienceYears} yrs, required ${minYears} yrs`);
      }
    } else if (criterion.type === 'required_doc') {
      const requiredCategory = String(criterion.targetValue);
      const matchingDocs = candidate.documents.filter(d => d.category === requiredCategory);
      const validDoc = matchingDocs.find(d => d.status === 'Independently confirmed' || d.status === 'Document checked');

      if (validDoc) {
        fulfilledCriteria.push(`Confirmed qualification: ${validDoc.title} (${validDoc.status})`);
      } else {
        const unconfirmedDoc = matchingDocs.find(d => d.status === 'Submitted for review' || d.status === 'Self-reported');
        if (unconfirmedDoc) {
          missingEvidence.push(`${unconfirmedDoc.title} is currently ${unconfirmedDoc.status.toLowerCase()} (unverified)`);
        } else {
          missingEvidence.push(`Missing mandatory qualification in category: ${requiredCategory}`);
        }
        mandatoryPassed = false;
        ineligibilityReasons.push(`Lacks verified credential in category "${requiredCategory}"`);
      }
    } else if (criterion.type === 'availability') {
      if (criterion.targetValue === 'Immediate' && candidate.availability !== 'Immediate') {
        mandatoryPassed = false;
        ineligibilityReasons.push(`Availability mismatch: candidate notice period is "${candidate.availability}", required Immediate`);
      } else {
        fulfilledCriteria.push(`Availability matches: ${candidate.availability}`);
      }
    }
  }

  // Check for expiring documents
  candidate.documents.forEach(doc => {
    if (doc.expiryDate) {
      const expiry = new Date(doc.expiryDate);
      const now = new Date('2026-10-20');
      const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        warnings.push(`Document "${doc.title}" expired on ${doc.expiryDate}`);
      } else if (diffDays <= 45) {
        warnings.push(`Document "${doc.title}" expires in ${diffDays} days (${doc.expiryDate})`);
      }
    }
  });

  // 2. Weighted Scoring (Weights sum to 100)
  const weights = requirement.preferenceWeights || { experience: 35, qualifications: 35, availability: 15, location: 15 };

  // Experience Sub-Score (0-100)
  let expScore = 70;
  if (candidate.experienceYears >= 8) expScore = 100;
  else if (candidate.experienceYears >= 5) expScore = 90;
  else if (candidate.experienceYears >= 3) expScore = 80;
  else expScore = 60;

  // Qualifications Sub-Score (0-100) based on verified ratio & verification level
  let qualScore = 60;
  const verifiedDocsCount = candidate.documents.filter(d => d.status === 'Independently confirmed' || d.status === 'Document checked').length;
  if (candidate.verificationLevel === 'Independently confirmed') qualScore = 100;
  else if (candidate.verificationLevel === 'Document checked') qualScore = 88;
  else qualScore = 55;
  if (verifiedDocsCount >= 3) qualScore = Math.min(100, qualScore + 10);

  // Availability Sub-Score (0-100)
  let availScore = 70;
  if (candidate.availability === 'Immediate') availScore = 100;
  else if (candidate.availability === '2 weeks notice') availScore = 85;
  else if (candidate.availability === '1 month notice') availScore = 70;
  else availScore = 50;

  // Location Sub-Score (0-100)
  let locScore = 60;
  const reqCity = requirement.location.split(',')[0].trim().toLowerCase();
  const candCity = candidate.location.split(',')[0].trim().toLowerCase();
  if (candCity === reqCity) {
    locScore = 100;
    fulfilledCriteria.push(`Direct local match in ${candCity.toUpperCase()}`);
  } else if (candidate.travelFlexibility === 'Sweden wide' || candidate.travelFlexibility === 'Nordic travel accepted') {
    locScore = 90;
    fulfilledCriteria.push(`Location flexibility: candidate accepts ${candidate.travelFlexibility}`);
  } else if (candidate.travelFlexibility === 'Regional (up to 50km)') {
    locScore = 75;
  } else {
    locScore = 45;
    warnings.push(`Candidate is in ${candidate.location} with local-only radius`);
  }

  // Final deterministic composite score
  const totalWeight = (weights.experience + weights.qualifications + weights.availability + weights.location) || 100;
  const rawScore = (
    (expScore * weights.experience) +
    (qualScore * weights.qualifications) +
    (availScore * weights.availability) +
    (locScore * weights.location)
  ) / totalWeight;

  // If mandatory checks fail, clamp score or show ineligibility
  const finalScore = mandatoryPassed ? Math.round(rawScore) : Math.min(48, Math.round(rawScore * 0.5));

  return {
    candidateId: candidate.id,
    score: finalScore,
    isEligible: mandatoryPassed,
    mandatoryPassed,
    ineligibilityReasons,
    weightsBreakdown: {
      experienceScore: expScore,
      qualificationsScore: qualScore,
      availabilityScore: availScore,
      locationScore: locScore
    },
    fulfilledCriteria,
    missingEvidence,
    warnings
  };
}

/**
 * Rank candidates for a given requirement.
 * Separates eligible candidates from excluded candidates.
 */
export function rankCandidatesForRequirement(candidates: Candidate[], requirement: EmployerRequirement) {
  const evaluated = candidates.map(candidate => ({
    candidate,
    match: calculateMatch(candidate, requirement)
  }));

  const eligible = evaluated
    .filter(item => item.match.isEligible)
    .sort((a, b) => b.match.score - a.match.score);

  const excluded = evaluated
    .filter(item => !item.match.isEligible)
    .sort((a, b) => b.match.score - a.match.score);

  return { eligible, excluded };
}
