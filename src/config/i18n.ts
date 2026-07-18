export type SupportedLanguage = 'en' | 'es' | 'fr' | 'pt' | 'ar' | 'hi';

export interface TranslationBundle {
  nav: {
    fan: string;
    volunteer: string;
    operations: string;
    executive: string;
    diagnostics: string;
    skipLink: string;
  };
  common: {
    stadium: string;
    occupancy: string;
    capacity: string;
    health: string;
    weather: string;
    incidents: string;
    volunteers: string;
    submit: string;
    loading: string;
    disclaimer: string;
    fallback: string;
    confidence: string;
    reasoning: string;
    emergency: string;
    alert: string;
    status: string;
    location: string;
    actions: string;
  };
  fan: {
    conciergeTitle: string;
    conciergePlaceholder: string;
    navTitle: string;
    navFrom: string;
    navTo: string;
    navButton: string;
    navOptionFastest: string;
    navOptionLessCrowded: string;
    navOptionAccessible: string;
    merchTitle: string;
    queuePredTitle: string;
    lostFoundTitle: string;
    lostReportBtn: string;
    timelineTitle: string;
    accTitle: string;
    contrastBtn: string;
    fontSizeBtn: string;
  };
  volunteer: {
    shiftTitle: string;
    activeTasks: string;
    reportIncident: string;
    incType: string;
    incDesc: string;
    incLoc: string;
    incSeverity: string;
    translateTitle: string;
    translatePlaceholder: string;
    resourcesTitle: string;
    commTitle: string;
    protocols: string;
  };
  ops: {
    twinTitle: string;
    heatmapToggle: string;
    gateUtilization: string;
    medicalDispatch: string;
    securityCctv: string;
    copilotTitle: string;
    copilotPlaceholder: string;
    incidentFeed: string;
  };
  exec: {
    kpiTitle: string;
    comparisonTitle: string;
    healthTrend: string;
    genBriefBtn: string;
    briefTitle: string;
    reportTitle: string;
    reportDownloadBtn: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationBundle> = {
  en: {
    nav: {
      fan: "Fan Experience",
      volunteer: "Volunteer Console",
      operations: "Operations Command",
      executive: "Executive Control",
      diagnostics: "Diagnostics Panel",
      skipLink: "Skip to main content"
    },
    common: {
      stadium: "Stadium",
      occupancy: "Occupancy",
      capacity: "Capacity",
      health: "Operational Health",
      weather: "Weather Telemetry",
      incidents: "Incidents",
      volunteers: "Volunteers",
      submit: "Submit",
      loading: "Processing AI request...",
      disclaimer: "Simulated Data Indicator",
      fallback: "Rule-Based Offline Fallback Active",
      confidence: "AI Confidence",
      reasoning: "AI Reasoning Summary",
      emergency: "Trigger Stadium Emergency Evacuation",
      alert: "Critical Alert",
      status: "Status",
      location: "Location",
      actions: "Actions"
    },
    fan: {
      conciergeTitle: "FIFA Match Concierge Agent",
      conciergePlaceholder: "Ask about matches, food courts, restroom queues, or merchandise...",
      navTitle: "Smart Indoor Arena Navigation",
      navFrom: "Current Location",
      navTo: "Seat or Destination",
      navButton: "Calculate Navigation Route",
      navOptionFastest: "Shortest Path",
      navOptionLessCrowded: "Divert Congestions",
      navOptionAccessible: "Accessible (No Stairs)",
      merchTitle: "Food & Memorabilia Recommendations",
      queuePredTitle: "Real-Time Queue Wait Predictions",
      lostFoundTitle: "AI Lost & Found Assistant",
      lostReportBtn: "Log Lost Item",
      timelineTitle: "Personalized Match Timeline",
      accTitle: "Accessibility Assistant",
      contrastBtn: "Toggle High Contrast",
      fontSizeBtn: "Toggle Large Font Size"
    },
    volunteer: {
      shiftTitle: "AI Shift Schedule Assistant",
      activeTasks: "Assigned Task Dashboard",
      reportIncident: "Report Security or Medical Incident",
      incType: "Incident Category",
      incDesc: "What is happening?",
      incLoc: "Where is it happening?",
      incSeverity: "Assessed Severity",
      translateTitle: "Instant Translation Assistant",
      translatePlaceholder: "Paste fan question here for instant translation...",
      resourcesTitle: "Request Operations Resources",
      commTitle: "Emergency Team Dispatch Radio",
      protocols: "Emergency Response Protocols"
    },
    ops: {
      twinTitle: "Stadium Digital Twin",
      heatmapToggle: "Overlay Density Heatmap",
      gateUtilization: "Checkpoint Gate Utilizations",
      medicalDispatch: "Medical Dispatch Dashboard",
      securityCctv: "Simulated Security Feed Console",
      copilotTitle: "Operations AI Copilot",
      copilotPlaceholder: "Issue operational directive (e.g. 'Redirect flow to Gate 2', 'Dispatch doctor to Sector C')...",
      incidentFeed: "Active Log Incident Feed"
    },
    exec: {
      kpiTitle: "Executive Key Performance Indicators",
      comparisonTitle: "Multi-Stadium Performance Matrix",
      healthTrend: "Tournament Operational Health Score Trend",
      genBriefBtn: "Compile Executive AI Brief",
      briefTitle: "Generated Executive briefing",
      reportTitle: "Tournament Operations Intelligence Report",
      reportDownloadBtn: "Export Operational Brief PDF"
    }
  },
  es: {
    nav: {
      fan: "Experiencia del Fan",
      volunteer: "Consola de Voluntarios",
      operations: "Mando de Operaciones",
      executive: "Control Ejecutivo",
      diagnostics: "Panel de Diagnóstico",
      skipLink: "Saltar al contenido principal"
    },
    common: {
      stadium: "Estadio",
      occupancy: "Ocupación",
      capacity: "Capacidad",
      health: "Salud Operativa",
      weather: "Telemetría del Clima",
      incidents: "Incidentes",
      volunteers: "Voluntarios",
      submit: "Enviar",
      loading: "Procesando solicitud de IA...",
      disclaimer: "Indicador de Datos Simulados",
      fallback: "Reserva Determinista Fuera de Línea Activa",
      confidence: "Confianza de IA",
      reasoning: "Resumen de Razonamiento de IA",
      emergency: "Iniciar Evacuación de Emergencia del Estadio",
      alert: "Alerta Crítica",
      status: "Estado",
      location: "Ubicación",
      actions: "Acciones"
    },
    fan: {
      conciergeTitle: "Agente Conserje de Partidos de la FIFA",
      conciergePlaceholder: "Pregunte sobre partidos, comida, baños o mercancía...",
      navTitle: "Navegación Inteligente en el Estadio",
      navFrom: "Ubicación Actual",
      navTo: "Asiento o Destino",
      navButton: "Calcular Ruta de Navegación",
      navOptionFastest: "Ruta Corta",
      navOptionLessCrowded: "Evitar Congestiones",
      navOptionAccessible: "Accesible (Sin Escaleras)",
      merchTitle: "Recomendaciones de Alimentos y Souvenirs",
      queuePredTitle: "Predicciones de Espera en Cola en Tiempo Real",
      lostFoundTitle: "Asistente de Objetos Perdidos con IA",
      lostReportBtn: "Registrar Objeto Perdido",
      timelineTitle: "Cronología del Partido Personalizada",
      accTitle: "Asistente de Accesibilidad",
      contrastBtn: "Alternar Alto Contraste",
      fontSizeBtn: "Alternar Letra Grande"
    },
    volunteer: {
      shiftTitle: "Asistente de Turno por IA",
      activeTasks: "Panel de Tareas Asignadas",
      reportIncident: "Reportar Incidente Médico o de Seguridad",
      incType: "Categoría de Incidente",
      incDesc: "¿Qué está pasando?",
      incLoc: "¿Dónde está sucediendo?",
      incSeverity: "Severidad Evaluada",
      translateTitle: "Asistente de Traducción Instantánea",
      translatePlaceholder: "Pegue la pregunta del fan aquí para traducir...",
      resourcesTitle: "Solicitar Recursos de Operación",
      commTitle: "Radio de Despacho de Emergencia",
      protocols: "Protocolos de Respuesta de Emergencia"
    },
    ops: {
      twinTitle: "Gemelo Digital del Estadio",
      heatmapToggle: "Superponer Mapa de Calor",
      gateUtilization: "Utilización de Puertas de Control",
      medicalDispatch: "Panel de Despacho Médico",
      securityCctv: "Consola de CCTV Simulada",
      copilotTitle: "Copiloto de Operaciones por IA",
      copilotPlaceholder: "Emitir directiva operativa (ej. 'Redirigir flujo a Puerta 2', 'Enviar médico a Sector C')...",
      incidentFeed: "Flujo de Registro de Incidentes Activos"
    },
    exec: {
      kpiTitle: "Indicadores Clave de Rendimiento Ejecutivo",
      comparisonTitle: "Matriz de Rendimiento Multi-Estadio",
      healthTrend: "Tendencia de Salud Operativa del Torneo",
      genBriefBtn: "Generar Resumen de IA Ejecutivo",
      briefTitle: "Breve Informe Ejecutivo Generado",
      reportTitle: "Informe de Inteligencia de Operaciones del Torneo",
      reportDownloadBtn: "Exportar PDF del Informe Operativo"
    }
  },
  fr: {
    nav: {
      fan: "Expérience Supporter",
      volunteer: "Console Bénévole",
      operations: "Commandement des Opérations",
      executive: "Contrôle Exécutif",
      diagnostics: "Panneau de Diagnostic",
      skipLink: "Passer au contenu principal"
    },
    common: {
      stadium: "Stade",
      occupancy: "Taux d'occupation",
      capacity: "Capacité",
      health: "Santé Opérationnelle",
      weather: "Télémesure Météo",
      incidents: "Incidents",
      volunteers: "Bénévoles",
      submit: "Soumettre",
      loading: "Traitement de la demande IA...",
      disclaimer: "Indicateur de Données Simulées",
      fallback: "Mode Hors-ligne Dégradé Règle Active",
      confidence: "Confiance de l'IA",
      reasoning: "Résumé du Raisonnement IA",
      emergency: "Déclencher l'Évacuation d'Urgence du Stade",
      alert: "Alerte Critique",
      status: "Statut",
      location: "Emplacement",
      actions: "Actions"
    },
    fan: {
      conciergeTitle: "Agent Concierge de Match FIFA",
      conciergePlaceholder: "Posez vos questions sur les matchs, restaurants, files d'attente...",
      navTitle: "Navigation Intelligente dans l'Arène",
      navFrom: "Position Actuelle",
      navTo: "Siège ou Destination",
      navButton: "Calculer l'Itinéraire",
      navOptionFastest: "Plus Court Chemin",
      navOptionLessCrowded: "Éviter les Foules",
      navOptionAccessible: "Accessible (Sans Escaliers)",
      merchTitle: "Recommandations Restauration & Souvenirs",
      queuePredTitle: "Prévisions d'Attente aux Files en Temps Réel",
      lostFoundTitle: "Assistant Objets Trouvés IA",
      lostReportBtn: "Signaler un Objet Perdu",
      timelineTitle: "Chronologie du Match Personnalisée",
      accTitle: "Assistant Accessibilité",
      contrastBtn: "Activer le Contraste Élevé",
      fontSizeBtn: "Activer la Grande Taille de Police"
    },
    volunteer: {
      shiftTitle: "Assistant IA Planning des Gardes",
      activeTasks: "Tableau des Tâches Assignées",
      reportIncident: "Signaler un Incident de Sécurité ou Médical",
      incType: "Catégorie d'Incident",
      incDesc: "Que se passe-t-il ?",
      incLoc: "Où cela se passe-t-il ?",
      incSeverity: "Gravité Évaluée",
      translateTitle: "Assistant de Traduction Instantanée",
      translatePlaceholder: "Collez la question du supporter ici pour la traduire...",
      resourcesTitle: "Demande de Ressources Opérationnelles",
      commTitle: "Radio de Dispatch d'Urgence",
      protocols: "Protocoles d'Intervention d'Urgence"
    },
    ops: {
      twinTitle: "Double Numérique du Stade",
      heatmapToggle: "Superposer la Carte Thermique",
      gateUtilization: "Utilisation des Portes de Contrôle",
      medicalDispatch: "Console de Dispatch Médical",
      securityCctv: "Console de Flux CCTV Simulée",
      copilotTitle: "Copilote IA d'Opérations",
      copilotPlaceholder: "Émettre une directive opérationnelle (ex. 'Rediriger le flux vers la Porte 2')...",
      incidentFeed: "Flux des Incident Enregistrés"
    },
    exec: {
      kpiTitle: "Indicateurs de Performance Exécutifs",
      comparisonTitle: "Matrice de Performance Multi-Stades",
      healthTrend: "Tendance de l'Indice de Santé Opérationnelle",
      genBriefBtn: "Générer le Rapport IA Exécutif",
      briefTitle: "Rapport Exécutif Généré",
      reportTitle: "Rapport d'Intelligence Opérationnelle du Tournoi",
      reportDownloadBtn: "Exporter le Briefing PDF"
    }
  },
  pt: {
    nav: {
      fan: "Experiência do Torcedor",
      volunteer: "Console do Voluntário",
      operations: "Comando de Operações",
      executive: "Controle Executivo",
      diagnostics: "Painel de Diagnóstico",
      skipLink: "Pular para o conteúdo principal"
    },
    common: {
      stadium: "Estádio",
      occupancy: "Ocupação",
      capacity: "Capacidade",
      health: "Saúde Operacional",
      weather: "Telemetria do Clima",
      incidents: "Incidentes",
      volunteers: "Voluntários",
      submit: "Enviar",
      loading: "Processando solicitação de IA...",
      disclaimer: "Indicador de Dados Simulados",
      fallback: "Fallback Regra Offline Ativo",
      confidence: "Confiança IA",
      reasoning: "Resumo do Raciocínio IA",
      emergency: "Disparar Evacuação de Emergência do Estádio",
      alert: "Alerta Crítico",
      status: "Status",
      location: "Localização",
      actions: "Ações"
    },
    fan: {
      conciergeTitle: "Agente Concierge de Partida da FIFA",
      conciergePlaceholder: "Pergunte sobre partidas, alimentação, filas ou lembranças...",
      navTitle: "Navegação Inteligente na Arena",
      navFrom: "Localização Atual",
      navTo: "Assento ou Destino",
      navButton: "Calcular Rota de Navegação",
      navOptionFastest: "Caminho Mais Curto",
      navOptionLessCrowded: "Desviar de Congestionamento",
      navOptionAccessible: "Acessível (Sem Escadas)",
      merchTitle: "Recomendações de Alimentação e Lojas",
      queuePredTitle: "Previsões de Fila em Tempo Real",
      lostFoundTitle: "Assistente de Achados e Perdidos IA",
      lostReportBtn: "Registrar Objeto Perdido",
      timelineTitle: "Linha do Tempo Personalizada",
      accTitle: "Assistente de Acessibilidade",
      contrastBtn: "Alternar Alto Contraste",
      fontSizeBtn: "Alternar Fonte Grande"
    },
    volunteer: {
      shiftTitle: "Assistente de Escala por IA",
      activeTasks: "Painel de Tarefas Designadas",
      reportIncident: "Relatar Incidente de Segurança ou Médico",
      incType: "Categoria do Incidente",
      incDesc: "O que está acontecendo?",
      incLoc: "Onde está acontecendo?",
      incSeverity: "Gravidade Avaliada",
      translateTitle: "Tradutor de Conversa Instantâneo",
      translatePlaceholder: "Cole a pergunta do torcedor aqui para tradução...",
      resourcesTitle: "Solicitar Recursos de Operação",
      commTitle: "Rádio de Transmissão de Emergência",
      protocols: "Protocolos de Resposta a Emergências"
    },
    ops: {
      twinTitle: "Gêmeo Digital do Estádio",
      heatmapToggle: "Sobrepor Mapa de Calor",
      gateUtilization: "Utilização das Portas de Entrada",
      medicalDispatch: "Painel de Controle Médico",
      securityCctv: "Console de CCTV Simulado",
      copilotTitle: "Copiloto Operacional IA",
      copilotPlaceholder: "Diretiva operacional (ex. 'Redirecionar fluxo para Portão 2', 'Enviar médico')...",
      incidentFeed: "Registro de Incidentes Ativos"
    },
    exec: {
      kpiTitle: "Indicadores-Chave de Desempenho",
      comparisonTitle: "Matriz de Comparação Multi-Estádios",
      healthTrend: "Tendência do Índice de Saúde Operacional",
      genBriefBtn: "Gerar Resumo Executivo por IA",
      briefTitle: "Relação Executiva Gerada por IA",
      reportTitle: "Relatório de Inteligência de Operações da Copa",
      reportDownloadBtn: "Exportar Briefing Operacional em PDF"
    }
  },
  ar: {
    nav: {
      fan: "تجربة الجماهير",
      volunteer: "لوحة المتطوعين",
      operations: "قيادة العمليات",
      executive: "التحكم التنفيذي",
      diagnostics: "لوحة التشخيص",
      skipLink: "تخطي للوصول للمحتوى"
    },
    common: {
      stadium: "الملعب",
      occupancy: "نسبة الحضور",
      capacity: "السعة الاستيعابية",
      health: "الصحة التشغيلية",
      weather: "قياسات الطقس",
      incidents: "الحوادث",
      volunteers: "المتطوعون",
      submit: "إرسال",
      loading: "جاري معالجة طلب الذكاء الاصطناعي...",
      disclaimer: "مؤشر بيانات محاكاة",
      fallback: "نمط التشغيل الاحتياطي غير المتصل نشط حالياً",
      confidence: "نسبة ثقة الذكاء الاصطناعي",
      reasoning: "ملخص تفكير الذكاء الاصطناعي",
      emergency: "إطلاق أمر الإخلاء الطارئ للملعب",
      alert: "إنذار حرج",
      status: "الحالة",
      location: "الموقع",
      actions: "الإجراءات"
    },
    fan: {
      conciergeTitle: "وكيل فيفا لإرشاد الجماهير بالذكاء الاصطناعي",
      conciergePlaceholder: "اسأل عن المباريات، المطاعم، طوابير دورات المياه، أو المتجر...",
      navTitle: "نظام الملاحة الذكي داخل الملعب",
      navFrom: "الموقع الحالي",
      navTo: "المقعد أو الوجهة",
      navButton: "حساب مسار الملاحة",
      navOptionFastest: "المسار الأقصر",
      navOptionLessCrowded: "تجنب الازدحام",
      navOptionAccessible: "متاح لذوي الهمم (بدون درج)",
      merchTitle: "توصيات الأطعمة والمنتجات التذكارية",
      queuePredTitle: "توقعات أوقات الانتظار في الطوابير",
      lostFoundTitle: "مساعد المفقودات بالذكاء الاصطناعي",
      lostReportBtn: "تسجيل بلاغ مفقودات",
      timelineTitle: "جدول زمني مخصص للمباراة",
      accTitle: "مساعد إمكانية الوصول",
      contrastBtn: "تبديل وضع التباين العالي",
      fontSizeBtn: "تبديل حجم الخط الكبير"
    },
    volunteer: {
      shiftTitle: "مساعد مهام الوردية بالذكاء الاصطناعي",
      activeTasks: "لوحة المهام النشطة",
      reportIncident: "بلاغ عن حادث أمني أو طبي",
      incType: "فئة الحادث",
      incDesc: "ما الذي يحدث؟",
      incLoc: "أين يحدث ذلك؟",
      incSeverity: "درجة الخطورة المقدرة",
      translateTitle: "مساعد الترجمة الفورية للجماهير",
      translatePlaceholder: "انسخ سؤال المشجع هنا لترجمته فوراً...",
      resourcesTitle: "طلب مستلزمات تشغيلية",
      commTitle: "راديو توجيه فرق الطوارئ",
      protocols: "بروتوكولات الاستجابة للطوارئ"
    },
    ops: {
      twinTitle: "التوأم الرقمي للملعب",
      heatmapToggle: "تفعيل الخريطة الحرارية لجميع الزوايا",
      gateUtilization: "معدل استهلاك البوابات ونقاط التفتيش",
      medicalDispatch: "لوحة التحكم الطبي وتوجيه الإسعاف",
      securityCctv: "لوحة التحكم الافتراضية بكاميرات المراقبة",
      copilotTitle: "مساعد العمليات الذكي (كوبيلوت)",
      copilotPlaceholder: "اكتب توجيهاً تشغيلياً (مثل: 'أعد توجيه التدفق للبوابة 2'، 'أرسل فريق طبي')...",
      incidentFeed: "سجل بلاغات الحوادث النشطة"
    },
    exec: {
      kpiTitle: "مؤشرات الأداء الرئيسية التنفيذية",
      comparisonTitle: "جدول المقارنة بين الملاعب",
      healthTrend: "اتجاه مؤشر الصحة التشغيلية العام للبطولة",
      genBriefBtn: "توليد ملخص تنفيذي بالذكاء الاصطناعي",
      briefTitle: "التقرير التنفيذي المولد بواسطة الذكاء الاصطناعي",
      reportTitle: "تقرير استخبارات عمليات البطولة الرسمي",
      reportDownloadBtn: "تصدير الملخص التشغيلي كـ PDF"
    }
  },
  hi: {
    nav: {
      fan: "प्रशंसक अनुभव",
      volunteer: "स्वयंसेवक कंसोल",
      operations: "संचालन कमान",
      executive: "कार्यकारी नियंत्रण",
      diagnostics: "डायग्नोस्टिक्स पैनल",
      skipLink: "मुख्य सामग्री पर जाएं"
    },
    common: {
      stadium: "स्टेडियम",
      occupancy: "उपस्थिति",
      capacity: "क्षमता",
      health: "परिचालन स्वास्थ्य स्कोर",
      weather: "मौसम टेलीमेट्री",
      incidents: "घटनाएँ",
      volunteers: "स्वयंसेवक",
      submit: "जमा करें",
      loading: "एआई अनुरोध संसाधित किया जा रहा है...",
      disclaimer: "सिम्युलेटेड डेटा संकेतक",
      fallback: "नियम-आधारित ऑफ़लाइन फ़ॉलबैक सक्रिय",
      confidence: "एआई आत्मविश्वास",
      reasoning: "एआई तर्क सारांश",
      emergency: "स्टेडियम आपातकालीन निकासी शुरू करें",
      alert: "महत्वपूर्ण चेतावनी",
      status: "स्थिति",
      location: "स्थान",
      actions: "कार्रवाई"
    },
    fan: {
      conciergeTitle: "फीफा मैच कंसीयज एजेंट",
      conciergePlaceholder: "मैच, फूड कोर्ट, वॉशरूम कतारों या मर्चेंडाइज के बारे में पूछें...",
      navTitle: "स्मार्ट इंडोर एरिना नेविगेशन",
      navFrom: "वर्तमान स्थान",
      navTo: "सीट या गंतव्य",
      navButton: "मार्ग की गणना करें",
      navOptionFastest: "सबसे छोटा मार्ग",
      navOptionLessCrowded: "भीड़ से बचें",
      navOptionAccessible: "सुलभ (सीढ़ियाँ नहीं)",
      merchTitle: "भोजन और मर्चेंडाइज सिफारिशें",
      queuePredTitle: "वास्तविक समय कतार प्रतीक्षा पूर्वानुमान",
      lostFoundTitle: "एआई खोया-पाया सहायक",
      lostReportBtn: "खोई हुई वस्तु रिपोर्ट करें",
      timelineTitle: "व्यक्तिगत मैच समयरेखा",
      accTitle: "अभिगम्यता सहायक",
      contrastBtn: "हाई कंट्रास्ट टॉगल करें",
      fontSizeBtn: "बड़े फ़ॉन्ट आकार टॉगल करें"
    },
    volunteer: {
      shiftTitle: "एआई शिफ्ट कार्यक्रम सहायक",
      activeTasks: "असाइन किया गया कार्य डैशबोर्ड",
      reportIncident: "सुरक्षा या चिकित्सा घटना की रिपोर्ट करें",
      incType: "घटना श्रेणी",
      incDesc: "क्या हो रहा है?",
      incLoc: "घटना कहाँ हो रही है?",
      incSeverity: "मूल्यांकन की गई गंभीरता",
      translateTitle: "त्वरित अनुवाद सहायक",
      translatePlaceholder: "तुरंत अनुवाद के लिए प्रशंसक का प्रश्न यहाँ पेस्ट करें...",
      resourcesTitle: "परिचालन संसाधनों का अनुरोध करें",
      commTitle: "आपातकालीन टीम प्रेषण रेडियो",
      protocols: "आपातकालीन प्रतिक्रिया प्रोटोकॉल"
    },
    ops: {
      twinTitle: "स्टेडियम डिजिटल ट्विन",
      heatmapToggle: "घनत्व हीटमैप ओवरले करें",
      gateUtilization: "चेकपॉइंट गेट उपयोग",
      medicalDispatch: "चिकित्सा प्रेषण डैशबोर्ड",
      securityCctv: "सिम्युलेटेड सुरक्षा फ़ीड कंसोल",
      copilotTitle: "ऑपरेशंस एआई कोपायलट",
      copilotPlaceholder: "परिचालन निर्देश जारी करें (जैसे: 'प्रवाह को गेट 2 पर पुनर्निर्देशित करें')...",
      incidentFeed: "सक्रिय घटना लॉग फ़ीड"
    },
    exec: {
      kpiTitle: "कार्यकारी मुख्य प्रदर्शन संकेतक",
      comparisonTitle: "बहु-स्टेडियम प्रदर्शन मैट्रिक्स",
      healthTrend: "टूर्नामेंट परिचालन स्वास्थ्य स्कोर रुझान",
      genBriefBtn: "कार्यकारी एआई संक्षिप्त संकलित करें",
      briefTitle: "उत्पन्न कार्यकारी संक्षिप्त विवरण",
      reportTitle: "टूर्नामेंट संचालन खुफिया रिपोर्ट",
      reportDownloadBtn: "परिचालन संक्षिप्त पीडीएफ निर्यात करें"
    }
  }
};
