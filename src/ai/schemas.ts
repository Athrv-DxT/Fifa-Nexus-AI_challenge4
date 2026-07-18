import { z } from 'zod';

export const BaseAgentResponseSchema = z.object({
  reasoningSummary: z.string(),
  confidenceScore: z.number().min(0).max(1),
  isFallback: z.boolean().default(false),
  timestamp: z.string()
});

export const FanConciergeSchema = BaseAgentResponseSchema.extend({
  response: z.string(),
  recommendations: z.array(z.object({
    name: z.string(),
    location: z.string(),
    priceEst: z.string(),
    waitTimeMinutes: z.number()
  })).optional()
});

export const NavigationAssistantSchema = BaseAgentResponseSchema.extend({
  routeDescription: z.string(),
  routeSteps: z.array(z.string()),
  estimatedWaitMinutes: z.number(),
  accessibilityNotes: z.string(),
  alternateRouteSuggested: z.boolean()
});

export const IncidentTriageSchema = BaseAgentResponseSchema.extend({
  severity: z.enum(['Critical', 'High', 'Medium', 'Low']),
  suggestedAction: z.string(),
  dispatchedRole: z.enum(['Crowd Marshall', 'Medical Responder', 'Info Desk', 'Security Support']),
  isEmergencyAlert: z.boolean()
});

export const OperationsCopilotSchema = BaseAgentResponseSchema.extend({
  actionableSuggestions: z.array(z.string()),
  criticalAlerts: z.array(z.string()),
  recommendedResourceShifts: z.array(z.object({
    fromLocation: z.string(),
    toLocation: z.string(),
    volunteerCount: z.number(),
    reason: z.string()
  }))
});

export const ExecutiveBriefSchema = BaseAgentResponseSchema.extend({
  executiveSummary: z.string(),
  operationalHealthScore: z.number(),
  criticalIncidentsCount: z.number(),
  keyRecommendations: z.array(z.string()),
  resourceForecastAdvice: z.string()
});

export const VolunteerAssistantSchema = BaseAgentResponseSchema.extend({
  instructions: z.string(),
  priority: z.enum(['High', 'Medium', 'Low']),
  estimatedDurationMinutes: z.number(),
  equipmentNeeded: z.array(z.string())
});

export const EmergencyAdvisorSchema = BaseAgentResponseSchema.extend({
  alertHeadline: z.string(),
  evacuationDirections: z.array(z.string()),
  safetyProtocols: z.array(z.string()),
  coordinationChannels: z.array(z.string())
});

export const CrowdPredictionSchema = BaseAgentResponseSchema.extend({
  predictedBottlenecks: z.array(z.object({
    location: z.string(),
    probability: z.number(), // 0 to 1
    etaMinutes: z.number()
  })),
  mitigationStrategy: z.string(),
  concurrencyRiskScore: z.number().min(0).max(100)
});

export type FanConciergeResponse = z.infer<typeof FanConciergeSchema>;
export type NavigationAssistantResponse = z.infer<typeof NavigationAssistantSchema>;
export type IncidentTriageResponse = z.infer<typeof IncidentTriageSchema>;
export type OperationsCopilotResponse = z.infer<typeof OperationsCopilotSchema>;
export type ExecutiveBriefResponse = z.infer<typeof ExecutiveBriefSchema>;
export type VolunteerAssistantResponse = z.infer<typeof VolunteerAssistantSchema>;
export type EmergencyAdvisorResponse = z.infer<typeof EmergencyAdvisorSchema>;
export type CrowdPredictionResponse = z.infer<typeof CrowdPredictionSchema>;
export type AnyAgentResponse =
  | FanConciergeResponse
  | NavigationAssistantResponse
  | IncidentTriageResponse
  | OperationsCopilotResponse
  | ExecutiveBriefResponse
  | VolunteerAssistantResponse
  | EmergencyAdvisorResponse
  | CrowdPredictionResponse;
