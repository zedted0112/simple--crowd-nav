/**
 * Decision Engine for the Smart Venue Assistant
 * Goal: Find the best facility based on distance and wait time.
 */

/**
 * Calculate the Euclidean distance between two points.
 * @param {Object} pos1 {x, y}
 * @param {Object} pos2 {x, y}
 * @returns {number}
 */
export const calculateEuclideanDistance = (pos1, pos2) => {
  const deltaX = pos2.x - pos1.x;
  const deltaY = pos2.y - pos1.y;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};

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
    distance: calculateEuclideanDistance(userPosition, f),
    waitTimeSeconds: calculateEstimatedWaitTime(f)
  }));

  // 3. Find max values for normalization (O(n))
  const maxDistance = Math.max(...facilitiesWithMetrics.map(f => f.distance)) || 1;
  const maxWaitTime = Math.max(...facilitiesWithMetrics.map(f => f.waitTimeSeconds)) || 1;

  // 4. Calculate weighted score (O(n))
  // Weighting: 40% Distance, 60% Wait Time (Lower is better)
  let bestFacility = null;
  let lowestScore = Infinity;

  facilitiesWithMetrics.forEach(f => {
    const normalizedDistance = f.distance / maxDistance;
    const normalizedWait = f.waitTimeSeconds / maxWaitTime;
    const totalScore = (normalizedDistance * 0.4) + (normalizedWait * 0.6);

    if (totalScore < lowestScore) {
      lowestScore = totalScore;
      bestFacility = { ...f, score: totalScore };
    }
  });

  // 5. Build explainable reasoning
  if (bestFacility) {
    const waitMins = Math.round(bestFacility.waitTimeSeconds / 60);
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
      distance: `${distMeters}m`,
      waitTime: `${waitMins} mins`,
      reasoning: reason,
      queue: bestFacility.queue,
      capacity: bestFacility.capacity
    };
  }

  return null;
};
