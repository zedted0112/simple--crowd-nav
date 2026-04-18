import { getDistance, normalize, formatMinutes } from '../utils/mathUtils.js';

/**
 * Decision Engine for the Smart Venue Assistant

/**
 * Calculate the Estimated Wait Time (EWT) for a facility.
 * Formula: EWT = (Queue Length / Capacity) * Average Service Time per person
 * @param {Object} facility 
 * @returns {number} Wait time in seconds
 */
export const calculateEstimatedWaitTime = (facility) => {
  const { queue, capacity, serviceTime } = facility;
  if (!capacity || capacity <= 0) return Infinity;
  return (queue / capacity) * serviceTime;
};

/**
 * Score a facility based on normalized distance and wait time.
 * Logic uses O(n) complexity.
 * @param {Object} userPosition 
 * @param {Array} facilities 
 * @param {string} intentType 
 * @returns {Object|null} Best facility with metrics and reasoning
 */
export const findBestFacility = (userPosition, facilities, intentType) => {
  // 1. Filter facilities by the detected intent (O(n))
  const relevantFacilities = facilities.filter(f => f.type === intentType);
  if (relevantFacilities.length === 0) return null;

  // 2. Compute metrics for each facility (O(n))
  const facilitiesWithMetrics = relevantFacilities.map(f => ({
    ...f,
    distance: getDistance(userPosition, f),
    waitTimeSeconds: calculateEstimatedWaitTime(f)
  }));

  // 3. Find max values for normalization (O(n))
  const maxDistance = Math.max(...facilitiesWithMetrics.map(f => f.distance)) || 1;
  const maxWaitTime = Math.max(...facilitiesWithMetrics.map(f => f.waitTimeSeconds)) || 1;

  // 4. Calculate weighted score (O(n))
  let bestFacility = null;
  let lowestScore = Infinity;

  facilitiesWithMetrics.forEach(f => {
    const normalizedDistance = normalize(f.distance, maxDistance);
    const normalizedWait = normalize(f.waitTimeSeconds, maxWaitTime);
    const totalScore = (normalizedDistance * 0.4) + (normalizedWait * 0.6);

    if (totalScore < lowestScore) {
      lowestScore = totalScore;
      bestFacility = { ...f, score: totalScore };
    }
  });

  // 5. Build explainable reasoning
  if (bestFacility) {
    const waitMinsLabel = formatMinutes(bestFacility.waitTimeSeconds);
    const distMeters = Math.round(bestFacility.distance);
    
    let reason = "Selected as the optimal balance between distance and wait time.";
    if (bestFacility.waitTimeSeconds === 0) {
      reason = "Chosen because it has the lowest possible wait time and is reasonably close.";
    } else if (distMeters < 15) {
      reason = "Selected due to extreme proximity, even with a short queue.";
    }

    return {
      name: bestFacility.name,
      type: bestFacility.type,
      x: bestFacility.x,
      y: bestFacility.y,
      distance: `${distMeters}m`,
      waitTime: waitMinsLabel,
      reasoning: reason,
      queue: bestFacility.queue,
      capacity: bestFacility.capacity
    };
  }

  return null;
};
