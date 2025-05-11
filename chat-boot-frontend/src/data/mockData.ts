// Mock users

  // Mock safety topics
  export const mockTopics = [
    {
      id: 1,
      name: "Equipo de Protección Personal",
      description: "Información sobre EPP y su uso adecuado",
    },
    {
      id: 2,
      name: "Manejo de Sustancias Químicas",
      description: "Procedimientos seguros para el manejo de químicos",
    },
    {
      id: 3,
      name: "Prevención de Incendios",
      description: "Medidas para prevenir y responder a incendios",
    },
    {
      id: 4,
      name: "Primeros Auxilios",
      description: "Procedimientos básicos de primeros auxilios",
    },
    {
      id: 5,
      name: "Trabajo en Alturas",
      description: "Protocolos para trabajo seguro en alturas",
    },
    {
      id: 6,
      name: "Ergonomía",
      description: "Optimización de espacios de trabajo",
    },
  ];
  // Mock user interests
  export const mockUserInterests = [
    {
      userId: 1,
      topicId: 1,
    },
    {
      userId: 1,
      topicId: 3,
    },
    {
      userId: 2,
      topicId: 2,
    },
    {
      userId: 2,
      topicId: 5,
    },
  ];
  // Mock messages history with more detailed conversations
  export const mockMessages = [
    // Conversación 1: EPP
    {
      id: 1,
      conversationId: 1,
      senderId: 1,
      isAI: false,
      content: "¿Qué equipo de protección debo usar para trabajar con productos químicos?",
      timestamp: "2023-04-10T14:22:00Z",
    },
    {
      id: 2,
      conversationId: 1,
      senderId: 0,
      isAI: true,
      content: "Para trabajar con productos químicos, necesitas:\n\n1. Guantes resistentes a químicos\n2. Gafas de protección selladas\n3. Máscara respiratoria con filtros adecuados\n4. Bata o traje resistente a químicos\n5. Calzado de seguridad\n\nRecuerda siempre consultar la Hoja de Datos de Seguridad (SDS) del producto específico antes de manipularlo.",
      timestamp: "2023-04-10T14:22:30Z",
    },
    {
      id: 3,
      conversationId: 1,
      senderId: 1,
      isAI: false,
      content: "¿Cada cuánto debo reemplazar los guantes de protección química?",
      timestamp: "2023-04-10T14:23:00Z",
    },
    {
      id: 4,
      conversationId: 1,
      senderId: 0,
      isAI: true,
      content: "Los guantes de protección química deben reemplazarse:\n\n1. Según las recomendaciones del fabricante\n2. Si presentan signos de desgaste o daño\n3. Si han estado en contacto directo con químicos\n4. Al menos cada 6 meses en uso regular\n\nEs importante inspeccionar los guantes antes de cada uso buscando perforaciones o degradación del material.",
      timestamp: "2023-04-10T14:23:30Z",
    },
    // Conversación 2: Incendios
    {
      id: 5,
      conversationId: 2,
      senderId: 1,
      isAI: false,
      content: "¿Cuáles son los pasos básicos para responder a un incendio pequeño?",
      timestamp: "2023-04-15T09:45:00Z",
    },
    {
      id: 6,
      conversationId: 2,
      senderId: 0,
      isAI: true,
      content: "Para responder a un incendio pequeño, sigue el protocolo RACE:\n\nR - Rescatar a personas en peligro inmediato\nA - Activar la alarma y alertar a otros\nC - Confinar el fuego cerrando puertas y ventanas\nE - Extinguir el fuego (si es seguro) o Evacuar\n\nSi decides usar un extintor, recuerda el método PASS:\nP - Pull (Jalar el seguro)\nA - Aim (Apuntar a la base del fuego)\nS - Squeeze (Apretar el gatillo)\nS - Sweep (Barrer de lado a lado)",
      timestamp: "2023-04-15T09:45:30Z",
    },
    {
      id: 7,
      conversationId: 2,
      senderId: 1,
      isAI: false,
      content: "¿Qué tipo de extintor debo usar para diferentes tipos de fuego?",
      timestamp: "2023-04-15T09:46:00Z",
    },
    {
      id: 8,
      conversationId: 2,
      senderId: 0,
      isAI: true,
      content: "Los tipos de extintores según la clase de fuego son:\n\nClase A (Materiales sólidos): Agua, Espuma, Polvo ABC\nClase B (Líquidos y gases): Espuma, CO2, Polvo ABC\nClase C (Eléctricos): CO2, Polvo ABC\nClase D (Metales): Polvo especial\nClase K (Aceites de cocina): Químico húmedo\n\nEl extintor ABC es el más versátil y común en áreas de trabajo general.",
      timestamp: "2023-04-15T09:46:30Z",
    },
    // Conversación 3: Trabajo en Alturas
    {
      id: 9,
      conversationId: 3,
      senderId: 1,
      isAI: false,
      content: "¿Cuáles son los requisitos para trabajo en alturas?",
      timestamp: "2023-04-20T10:00:00Z",
    },
    {
      id: 10,
      conversationId: 3,
      senderId: 0,
      isAI: true,
      content: "Para trabajo en alturas (más de 1.8 metros) necesitas:\n\n1. Certificación vigente en trabajo en alturas\n2. Examen médico específico\n3. Equipo de protección:\n   - Arnés de cuerpo completo\n   - Línea de vida\n   - Conectores\n   - Punto de anclaje certificado\n4. Permiso de trabajo en alturas\n5. Plan de rescate\n\nTodo trabajo en altura requiere supervisión constante y sistema de protección contra caídas.",
      timestamp: "2023-04-20T10:00:30Z",
    },
    // Conversación 4: Ergonomía
    {
      id: 11,
      conversationId: 4,
      senderId: 1,
      isAI: false,
      content: "¿Cómo puedo configurar mi estación de trabajo para prevenir lesiones?",
      timestamp: "2023-04-25T11:15:00Z",
    },
    {
      id: 12,
      conversationId: 4,
      senderId: 0,
      isAI: true,
      content: "Para una estación de trabajo ergonómica:\n\n1. Altura de la silla:\n   - Pies planos en el suelo\n   - Rodillas a 90 grados\n\n2. Monitor:\n   - Al nivel de los ojos\n   - A un brazo de distancia\n   - Perpendicular a ventanas\n\n3. Teclado y ratón:\n   - Codos a 90 grados\n   - Muñecas rectas\n\n4. Pausas activas:\n   - 5 minutos cada hora\n   - Ejercicios de estiramiento\n\nRecuerda mantener una postura neutral y cambiar de posición frecuentemente.",
      timestamp: "2023-04-25T11:15:30Z",
    },
    // Conversación 5: Primeros Auxilios
    {
      id: 13,
      conversationId: 5,
      senderId: 1,
      isAI: false,
      content: "¿Qué debo hacer en caso de una quemadura química?",
      timestamp: "2023-04-30T15:20:00Z",
    },
    {
      id: 14,
      conversationId: 5,
      senderId: 0,
      isAI: true,
      content: "En caso de quemadura química, sigue estos pasos:\n\n1. Seguridad primero:\n   - Usa EPP apropiado\n   - Retira a la persona del área contaminada\n\n2. Tratamiento inmediato:\n   - Retira ropa contaminada\n   - Lava con agua abundante por 15-20 minutos\n   - No apliques neutralizadores\n\n3. Busca atención médica:\n   - Lleva la SDS del químico\n   - Documenta el incidente\n\nPREVENCIÓN: Siempre ten disponible una ducha y lavaojos de emergencia en áreas de trabajo con químicos.",
      timestamp: "2023-04-30T15:20:30Z",
    }
  ];