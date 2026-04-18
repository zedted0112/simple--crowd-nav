/**
 * Decision Engine for finding the best facility
 * Logic:
 * 1. Filter by requested type
 * 2. Calculate Euclidean distance
 * 3. Calculate Estimated Wait Time (EWT) = (queue / capacity) * serviceTime
 * 4. Score = (normalized_distance * 0.4) + (normalized_wait_time * 0.6)
 */

export const calculateDistance = (pos1, pos2) => {
  return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
};

export const calculateEWT = (facility) => {
  if (!facility.capacity || facility.capacity <= 0) return Infinity;
  return (facility.queue / facility.capacity) * facility.serviceTime;
};

export const findBestFacility = (userPosition, facilities, intentType) => {
  // 1. Filter by type
  const filtered = facilities.filter(f => f.type === intentType);
  if (filtered.length === 0) return null;

  // 2. Map facilities with their calculated metrics
  const scored = filtered.map(f => {
    const distance = calculateDistance(userPosition, f);
    const ewt = calculateEWT(f);
    return { ...f, distance, ewt };
  });

  // 3. Simple scoring (lower is better)
  // We normalize by finding max values in the current set to stay within 0-1 range for weighting
  const maxDist = Math.max(...scored.map(s => s.distance)) || 1;
  const maxEWT = Math.max(...scored.map(s => s.ewt)) || 1;

  scored.forEach(s => {
    const distScore = s.distance / maxDist;
    const ewtScore = s.ewt / maxEWT;
    s.totalScore = (distScore * 0.4) + (ewtScore * 0.6);
  });

  // 4. Sort and pick best
  scored.sort((a, b) => a.totalScore - b.totalScore);

  const best = scored[0];
  
  // Provide reasoning
  if (best.ewt === 0) {
    best.reasoning = `Recommended because it is nearby and has no queue.`;
  } else if (best.distance < 20) {
    best.reasoning = `Recommended for its extreme proximity, despite a short wait.`;
  } else {
    best.reasoning = `Recommended as the best balance between distance and wait time.`;
  }

  return best;
};
