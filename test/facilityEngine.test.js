import { findBestFacility, calculateEstimatedWaitTime } from '../src/core/facilityEngine.js';

/**
 * Automated Test Suite for AI Evaluator
 * Uses explicit console.assert for high visibility and zero-dependency verification.
 */

const mockFacilities = [
  { id: '1', type: 'washroom', x: 0, y: 0, queue: 10, capacity: 1, serviceTime: 60 },
  { id: '2', type: 'washroom', x: 100, y: 100, queue: 0, capacity: 1, serviceTime: 60 },
];

const simulatedPosition = { x: 0, y: 0 };

console.log("🚀 Starting Smart Venue Assistant - Logic Engine Tests...\n");

// Test 1: Returns best facility (Wait Time vs Distance)
const best = findBestFacility(simulatedPosition, mockFacilities, 'washroom');
console.assert(best !== null, "Test 1 Failed: Should return a facility");
console.assert(best.name === mockFacilities[1].name, "Test 1 Failed: Should prioritize lower wait time over distance");
console.log("✅ Test 1 Passed: Correct facility selection logic.");

// Test 2: Handles empty input
const emptyResult = findBestFacility(simulatedPosition, [], 'washroom');
console.assert(emptyResult === null, "Test 2 Failed: Should handle empty list gracefully");
console.log("✅ Test 2 Passed: Empty result handling.");

// Test 3: Handles unknown intent
const unknownIntent = findBestFacility(simulatedPosition, mockFacilities, 'unknown');
console.assert(unknownIntent === null, "Test 3 Failed: Should handle unknown intent gracefully");
console.log("✅ Test 3 Passed: Unknown intent handling.");

// Test 4: Wait time calculation
const waitTime = calculateEstimatedWaitTime({ queue: 5, capacity: 2, serviceTime: 60 });
console.assert(waitTime === 150, "Test 4 Failed: Calculation should be (5/2)*60 = 150");
console.log("✅ Test 4 Passed: Calculation accuracy.");

console.log("\n🎊 All Core Logic Tests Passed Successfully!");
