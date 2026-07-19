import { z } from 'zod';
import { useSimulationStore } from '../simulation/store';
import * as schemas from './schemas';
import {
  sanitizeInput,
  sanitizeObject,
  validatePrompt,
  rateLimiter,
  validateEnvironment,
  secureLogger
} from '../shared/utils/security';

/**
 * Generates local rule-based deterministic responses based on simulation telemetry.
 */
export function generateDeterministicMockResponse(
  agentName: string,
  userInput: string,
  lang: string = 'en'
): any {
  const storeState = useSimulationStore.getState().state;
  const activeStadium = storeState.stadiums.find(s => s.id === storeState.activeStadiumId) || storeState.stadiums[0];
  const timestamp = new Date().toISOString();
  
  // Multilingual translations helper for common strings
  const defaultTr = {
    en: {
      concierge: "Welcome to FIFA World Cup 2026. How can I assist you with your match day experience?",
      nav: "Optimized route computed.",
      triage: "Incident report analyzed.",
      copilot: "Command console processed.",
      exec: "Executive intelligence brief compiled.",
      vol: "Shift assignment checklist updated.",
      em: "EMERGENCY SAFETY ADVISORY ACTIVE.",
      pred: "Crowd congestion prediction model run."
    },
    es: {
      concierge: "Bienvenido a la Copa Mundial de la FIFA 2026. ¿Cómo puedo ayudarle con su experiencia el día del partido?",
      nav: "Ruta optimizada calculada.",
      triage: "Reporte de incidente analizado.",
      copilot: "Consola de comando procesada.",
      exec: "Resumen de inteligencia ejecutiva compilado.",
      vol: "Lista de verificación de turno actualizada.",
      em: "AVISO DE SEGURIDAD DE EMERGENCIA ACTIVO.",
      pred: "Modelo de predicción de congestión de multitudes ejecutado."
    },
    fr: {
      concierge: "Bienvenue à la Coupe du Monde de la FIFA 2026. Comment puis-je vous aider pour votre match?",
      nav: "Itinéraire optimisé calculé.",
      triage: "Rapport d'incident analysé.",
      copilot: "Console de commande traitée.",
      exec: "Briefing d'intelligence exécutive compilé.",
      vol: "Liste de contrôle de quart mise à jour.",
      em: "AVIS DE SÉCURITÉ D'URGENCE ACTIF.",
      pred: "Modèle de prédiction de la foule exécuté."
    },
    pt: {
      concierge: "Bem-vindo à Copa do Mundo FIFA 2026. Como posso ajudar em sua experiência no dia do jogo?",
      nav: "Rota otimizada calculada.",
      triage: "Relatório de incidentes analisado.",
      copilot: "Console de comando processado.",
      exec: "Resumo de inteligência executiva compilado.",
      vol: "Lista de verificação de turno atualizada.",
      em: "AVISO DE SEGURANÇA DE EMERGÊNCIA ATIVO.",
      pred: "Modelo de previsão de congestionamento executado."
    },
    ar: {
      concierge: "مرحباً بكم في كأس العالم فيفا 2026. كيف يمكنني مساعدتكم اليوم؟",
      nav: "تم احتساب المسار الأمثل.",
      triage: "تم تحليل تقرير الحادث.",
      copilot: "تم معالجة وحدة التحكم التشغيلية.",
      exec: "تم إعداد ملخص الاستخبارات التنفيذي.",
      vol: "تم تحديث قائمة مهام الوردية.",
      em: "تحذير السلامة الطارئة نشط حالياً.",
      pred: "تم تشغيل نموذج التنبؤ بازدحام الجماهير."
    },
    hi: {
      concierge: "फीफा विश्व कप 2026 में आपका स्वागत है। मैं आपके मैच के दिन के अनुभव में क्या सहायता कर सकता हूँ?",
      nav: "अनुकूलित मार्ग की गणना की गई।",
      triage: "घटना रिपोर्ट का विश्लेषण किया गया।",
      copilot: "कमांड कंसोल संसाधित।",
      exec: "कार्यकारी खुफिया विवरण तैयार।",
      vol: "शिफ्ट असाइनमेंट चेकलिस्ट अपडेट की गई।",
      em: "आपातकालीन सुरक्षा सलाह सक्रिय है।",
      pred: "भीड़ भीड़ भविष्यवाणी मॉडल चलाया गया।"
    }
  };
  const tr = defaultTr[lang as 'en' | 'es' | 'fr' | 'pt' | 'ar' | 'hi'] || defaultTr.en;

  switch (agentName) {
    case 'Fan Concierge': {
      const leastCongestedRestroom = activeStadium.facilities
        .filter(f => f.type === 'restroom')
        .sort((a, b) => a.congestion - b.congestion)[0];
      const leastCongestedFood = activeStadium.facilities
        .filter(f => f.type === 'food')
        .sort((a, b) => a.congestion - b.congestion)[0];

      return {
        reasoningSummary: "Analyzed active stadium facility congestion rates to recommend the shortest queues.",
        confidenceScore: 0.95,
        isFallback: true,
        timestamp,
        response: `${tr.concierge} In ${activeStadium.name}, ${leastCongestedRestroom?.name} currently has a low wait time of ${leastCongestedRestroom?.waitTime} minutes. For food, we recommend ${leastCongestedFood?.name} which has a wait time of only ${leastCongestedFood?.waitTime} minutes.`,
        recommendations: [
          {
            name: leastCongestedFood?.name || 'Pampa Grill',
            location: 'Section 104',
            priceEst: '$$',
            waitTimeMinutes: leastCongestedFood?.waitTime || 5
          },
          {
            name: 'Official FIFA Merchandise Stand',
            location: 'Main Gate Concierge',
            priceEst: '$$$',
            waitTimeMinutes: 10
          }
        ]
      };
    }

    case 'Navigation Assistant': {
      const gate1 = activeStadium.gates[0];
      const routeText = userInput.toLowerCase().includes('gate')
        ? `Proceed along the Outer Ring Pathway towards ${gate1.name}. The gate has a current wait time of ${gate1.waitTime} minutes.`
        : `Head towards the nearest concourse. Elevators are accessible behind Block 102.`;

      return {
        reasoningSummary: "Dijkstra-based pathing model mapped onto stadium zones using real-time gate wait times.",
        confidenceScore: 0.98,
        isFallback: true,
        timestamp,
        routeDescription: `${tr.nav} ${routeText}`,
        routeSteps: [
          "Locate seat section signage on the main level.",
          "Walk 50m north to the main concession boulevard.",
          "Follow the green accessible tags to the destination elevator."
        ],
        estimatedWaitMinutes: gate1.waitTime,
        accessibilityNotes: "Route fully accommodates wheelchairs, avoids steps, and utilizes ramps.",
        alternateRouteSuggested: false
      };
    }

    case 'Incident Triage Agent': {
      let severity: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low';
      let role: any = 'Crowd Marshall';
      let action = 'Dispatch staff to verify condition.';

      if (userInput.toLowerCase().includes('fight') || userInput.toLowerCase().includes('weapon') || userInput.toLowerCase().includes('security')) {
        severity = 'High';
        role = 'Security Support';
        action = 'Notify stadium security response unit and deploy backup staff.';
      } else if (userInput.toLowerCase().includes('heart') || userInput.toLowerCase().includes('unconscious') || userInput.toLowerCase().includes('blood') || userInput.toLowerCase().includes('medical')) {
        severity = 'Critical';
        role = 'Medical Responder';
        action = 'Dispatch emergency trauma responders with paramedic bag and defibrillator.';
      } else if (userInput.toLowerCase().includes('queue') || userInput.toLowerCase().includes('crowd')) {
        severity = 'Medium';
        role = 'Crowd Marshall';
        action = 'Redirect incoming streams of fans to secondary turnstiles.';
      }

      return {
        reasoningSummary: "Keywords analysis matching incident dictionary to volunteer skills database.",
        confidenceScore: 0.90,
        isFallback: true,
        timestamp,
        severity,
        suggestedAction: `${tr.triage} Action plan: ${action}`,
        dispatchedRole: role,
        isEmergencyAlert: severity === 'Critical'
      };
    }

    case 'Operations Copilot': {
      const congestedGates = activeStadium.gates.filter(g => g.waitTime > 20);
      const suggestions = congestedGates.map(g => `Open additional scanners at ${g.name} or divert traffic to Lot B gates.`);
      if (suggestions.length === 0) {
        suggestions.push("All operations within parameters. Monitor gate flows as kickoff approaches.");
      }

      return {
        reasoningSummary: "Evaluating gate and queue capacity levels against baseline limits.",
        confidenceScore: 0.92,
        isFallback: true,
        timestamp,
        actionableSuggestions: suggestions,
        criticalAlerts: congestedGates.map(g => `${g.name} wait time is currently ${g.waitTime} min!`),
        recommendedResourceShifts: [
          {
            fromLocation: 'Gate 4 (Idle)',
            toLocation: congestedGates[0]?.name || 'Gate 2',
            volunteerCount: 3,
            reason: 'Relieve high throughput pressure.'
          }
        ]
      };
    }

    case 'Executive Brief Generator': {
      const avgWait = Math.round(activeStadium.gates.reduce((acc, g) => acc + g.waitTime, 0) / activeStadium.gates.length);
      const criticalCount = storeState.incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved').length;

      return {
        reasoningSummary: "Aggregated global telemetry index and calculated the tournament average health score.",
        confidenceScore: 0.96,
        isFallback: true,
        timestamp,
        executiveSummary: `${tr.exec} Stadium operational status is nominal. Overall health index is ${activeStadium.operationalHealth}%. Average wait time is ${avgWait} minutes across primary checkpoints.`,
        operationalHealthScore: activeStadium.operationalHealth,
        criticalIncidentsCount: criticalCount,
        keyRecommendations: [
          "Deploy auxiliary shuttle buses to MetLife Stadium Lot C to ease exit bottlenecks.",
          "Keep restrooms near food courts under frequent sanitation rotation."
        ],
        resourceForecastAdvice: "Weather forecast suggests mild heat; prepare extra water kiosks in Zone D."
      };
    }

    case 'Volunteer Assistant': {
      return {
        reasoningSummary: "Interpreting current volunteer workload status and active assignment list.",
        confidenceScore: 0.94,
        isFallback: true,
        timestamp,
        instructions: `${tr.vol} Please report to your assigned location in ${activeStadium.name}. Ensure you have your radio channel set to 4B. Check in fans manually using the offline check sheets if scanners fail.`,
        priority: 'Medium',
        estimatedDurationMinutes: 45,
        equipmentNeeded: ['Radio Transceiver', 'Laminated Map', 'Auxiliary Flashlight']
      };
    }

    case 'Emergency Response Advisor': {
      return {
        reasoningSummary: "Triggering standard safety procedure manuals according to emergency codes.",
        confidenceScore: 0.99,
        isFallback: true,
        timestamp,
        alertHeadline: `${tr.em} CLEAR AND SECURE ALL STADIUM EGRESS GATES.`,
        evacuationDirections: [
          "Proceed calmly to the nearest marked fire exit.",
          "Do not use elevators. Assist wheelchair bound spectators at ramps.",
          "Assemble at designated Parking Lot coordinates."
        ],
        safetyProtocols: [
          "Activate alarm sirens on all levels.",
          "Unlock automated turnstiles to enable full egress.",
          "Radio command centers for police support."
        ],
        coordinationChannels: ['Emergency UHF Channel 1', 'Operations Audio Bridge']
      };
    }

    case 'Crowd Prediction Assistant': {
      const bottlenecks = activeStadium.gates
        .filter(g => g.waitTime > 15)
        .map(g => ({
          location: g.name,
          probability: 0.85,
          etaMinutes: 10
        }));

      if (bottlenecks.length === 0) {
        bottlenecks.push({ location: 'Food Court Main Entry', probability: 0.6, etaMinutes: 20 });
      }

      return {
        reasoningSummary: "Statistical model forecasting gate and concession lines based on simulated crowd density.",
        confidenceScore: 0.88,
        isFallback: true,
        timestamp,
        predictedBottlenecks: bottlenecks,
        mitigationStrategy: `${tr.pred} Divert incoming spectators to auxiliary gates and push alert updates to fan handsets.`,
        concurrencyRiskScore: 68
      };
    }

    default:
      throw new Error(`Unknown agent: ${agentName}`);
  }
}

/**
 * Invokes the specialized AI Agent. If the API key is set, it queries the Gemini API.
 * Otherwise, it falls back to the deterministic local mock engine.
 */
export async function invokeAIAgent(
  agentName: string,
  userInput: string = '',
  lang: string = 'en'
): Promise<any> {
  const store = useSimulationStore.getState();

  // 1. Validate Environment Variables
  try {
    validateEnvironment();
  } catch (envErr: any) {
    store.addLog('security', 'error', `[Configuration Block] ${envErr.message}`);
    return {
      reasoningSummary: "Environment validation failed.",
      confidenceScore: 0.0,
      isFallback: true,
      timestamp: new Date().toISOString(),
      response: "Configuration Error: The system is misconfigured.",
      instructions: "Please report this issue to stadium operations.",
      alertHeadline: "CONFIGURATION ERROR",
      evacuationDirections: [],
      safetyProtocols: [],
      routeDescription: "N/A",
      routeSteps: []
    };
  }

  // 2. Enforce Rate Limiting
  if (!rateLimiter('global-client')) {
    secureLogger.security(`Rate limit exceeded for client query.`);
    return {
      reasoningSummary: "Rate limiter blocked request to prevent resource flooding.",
      confidenceScore: 0.0,
      isFallback: true,
      timestamp: new Date().toISOString(),
      response: "Too many requests. Please wait a moment before trying again.",
      instructions: "Rate limit restriction is active.",
      alertHeadline: "RATE LIMIT ACTIVE",
      evacuationDirections: [],
      safetyProtocols: [],
      routeDescription: "N/A",
      routeSteps: []
    };
  }

  // 3. Audit log the input receipt
  store.addLog('ai', 'audit', `[AI Request] Invoking ${agentName} (Lang: ${lang}) | Input: "${userInput.slice(0, 50)}..."`);

  // 4. Validate input for Prompt Injection
  const promptCheck = validatePrompt(userInput);
  if (!promptCheck.valid) {
    secureLogger.security(`Prompt Injection attempt detected in query: "${userInput}". Reason: ${promptCheck.reason}`);
    return {
      reasoningSummary: "Jailbreak Filter flagged input as dangerous. Blocked execution.",
      confidenceScore: 0.0,
      isFallback: true,
      timestamp: new Date().toISOString(),
      response: "Access Denied: The system detected unsafe instructions in your input.",
      instructions: "Request blocked due to security policies.",
      alertHeadline: "SECURITY EXCEPTION",
      evacuationDirections: [],
      safetyProtocols: [],
      routeDescription: "N/A",
      routeSteps: []
    };
  }

  const cleanInput = sanitizeInput(userInput);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  // Return schema based on agent name
  let schema: z.ZodSchema = schemas.FanConciergeSchema;
  if (agentName === 'Navigation Assistant') schema = schemas.NavigationAssistantSchema;
  else if (agentName === 'Incident Triage Agent') schema = schemas.IncidentTriageSchema;
  else if (agentName === 'Operations Copilot') schema = schemas.OperationsCopilotSchema;
  else if (agentName === 'Executive Brief Generator') schema = schemas.ExecutiveBriefSchema;
  else if (agentName === 'Volunteer Assistant') schema = schemas.VolunteerAssistantSchema;
  else if (agentName === 'Emergency Response Advisor') schema = schemas.EmergencyAdvisorSchema;
  else if (agentName === 'Crowd Prediction Assistant') schema = schemas.CrowdPredictionSchema;

  // 5. Fallback logic: If no API key, execute deterministic mock response directly
  if (!apiKey) {
    const mockRes = generateDeterministicMockResponse(agentName, cleanInput, lang);
    store.addLog('ai', 'info', `[AI Fallback] ${agentName} returned deterministic mock response.`);
    return sanitizeObject(schema.parse(mockRes));
  }

  // 6. Gemini API Call
  try {
    const systemPrompt = `You are the ${agentName} agent for the FIFA World Cup 2026 Tournament Operations.
    Your output MUST be a valid JSON object matching this schema specification.
    Do not return any extra markdown formatting outside of JSON.
    All text fields in your response MUST be written in the language specified: "${lang}".
    Provide a confidenceScore (number between 0 and 1) representing your certainty.
    Provide a reasoningSummary explaining your recommendation.
    Ensure isFallback is set to false.
    The current active stadium context has these properties: ${JSON.stringify(store.state.stadiums.find(s => s.id === store.state.activeStadiumId))}.
    The user message is: "${cleanInput}"`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemPrompt }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse the JSON
    const jsonRes = JSON.parse(rawText.trim());
    
    // Validate schema
    const parsedData = schema.parse({
      ...jsonRes,
      isFallback: false,
      timestamp: new Date().toISOString()
    });

    store.addLog('ai', 'info', `[AI Success] ${agentName} answered successfully using Gemini Live.`);
    return sanitizeObject(parsedData);

  } catch (err: any) {
    // If anything fails (network error, invalid json, schema mismatch), degrade to mock response
    store.addLog(
      'ai',
      'warning',
      `[AI Degradation] Gemini request failed or invalid JSON returned. Error: ${err.message}. Degrading to rule-based fallback.`
    );
    const fallbackRes = generateDeterministicMockResponse(agentName, cleanInput, lang);
    return sanitizeObject(schema.parse(fallbackRes));
  }
}
