import { describe, it, expect } from 'vitest';
import { findBestFacility, calculateDistance, calculateEWT } from './facilityEngine';

describe('Facility Engine', () => {
  const mockFacilities = [
    { id: '1', type: 'washroom', x: 0, y: 0, queue: 10, capacity: 1, serviceTime: 60 }, // EWT = 600
    { id: '2', type: 'washroom', x: 100, y: 100, queue: 0, capacity: 1, serviceTime: 60 }, // EWT = 0
  ];

  it('calculates distance correctly', () => {
    const dist = calculateDistance({ x: 0, y: 0 }, { x: 3, y: 4 });
    expect(dist).toBe(5);
  });

  it('calculates EWT correctly', () => {
    const ewt = calculateEWT({ queue: 10, capacity: 2, serviceTime: 30 });
    expect(ewt).toBe(150);
  });

  it('filters by type correctly', () => {
    const result = findBestFacility({ x: 0, y: 0 }, mockFacilities, 'food');
    expect(result).toBeNull();
  });

  it('picks the best facility (Low wait time vs Distance)', () => {
    // Both are washrooms. #1 is at (0,0) (where user is) but has long wait.
    // #2 is far away but has no wait.
    // Given 60% weight to wait time, #2 should win.
    const result = findBestFacility({ x: 0, y: 0 }, mockFacilities, 'washroom');
    expect(result.id).toBe('2');
  });

  it('handles empty results gracefully', () => {
    const result = findBestFacility({ x: 0, y: 0 }, [], 'washroom');
    expect(result).toBeNull();
  });
});
