import { describe, it, expect } from 'vitest';
import { LCG } from './lcg';
import { initializeSimulation, stepSimulation } from './engine';
import { FanConciergeSchema } from '../ai/schemas';

describe('FIFA Nexus AI Core Systems', () => {
  
  describe('LCG Determinism', () => {
    it('should generate identical results for seed FIFA2026', () => {
      const lcg1 = new LCG('FIFA2026');
      const lcg2 = new LCG('FIFA2026');

      for (let i = 0; i < 50; i++) {
        expect(lcg1.next()).toBe(lcg2.next());
      }
    });

    it('should generate different outputs for different seeds', () => {
      const lcg1 = new LCG('FIFA2026');
      const lcg2 = new LCG('FIFA2026_DIFFERENT');

      expect(lcg1.next()).not.toBe(lcg2.next());
    });
  });

  describe('Simulation Engine', () => {
    it('should initialize with tickCount 0 and list primary stadiums', () => {
      const initialState = initializeSimulation('FIFA2026');
      
      expect(initialState.tickCount).toBe(0);
      expect(initialState.stadiums.length).toBe(3);
      expect(initialState.stadiums[0].name).toBe('MetLife Stadium');
      expect(initialState.volunteers.length).toBeGreaterThan(0);
      expect(initialState.weather.temperature).toBeDefined();
    });

    it('should advance state deterministically on tick steps', () => {
      const state0 = initializeSimulation('FIFA2026');
      const state1_a = stepSimulation(state0, 'FIFA2026');
      const state1_b = stepSimulation(state0, 'FIFA2026');

      expect(state1_a.tickCount).toBe(1);
      expect(state1_b.tickCount).toBe(1);
      
      // Verify determinism across duplicate transitions
      expect(state1_a.stadiums[0].occupancy).toBe(state1_b.stadiums[0].occupancy);
      expect(state1_a.weather.temperature).toBe(state1_b.weather.temperature);
    });
  });

  describe('AI Schema Validation', () => {
    it('should validate conforming Fan Concierge responses', () => {
      const validData = {
        reasoningSummary: "Located shortest concession queue.",
        confidenceScore: 0.92,
        isFallback: false,
        timestamp: new Date().toISOString(),
        response: "Pampa Grill has the lowest wait time of 5 minutes.",
        recommendations: [
          { name: "Pampa Grill", location: "Section 104", priceEst: "$$", waitTimeMinutes: 5 }
        ]
      };

      const result = FanConciergeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject non-conforming responses', () => {
      const invalidData = {
        response: 12345, // invalid type, should be string
        confidenceScore: "very high" // invalid type, should be number
      };

      const result = FanConciergeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
