import type { Message, Conversation } from '../../models/chat.model';

export const generateAIResponse = (): string => {
    const safetyResponses = [
        'Es importante siempre usar equipo de protección personal en áreas de producción.',
        'Los procedimientos de evacuación deben ser revisados regularmente.',
        'Recuerde reportar cualquier condición insegura que observe.',
        'La seguridad industrial es responsabilidad de todos en la organización.',
        'Antes de operar maquinaria, asegúrese de tener la capacitación adecuada.',
        'Los extintores deben ser inspeccionados mensualmente.',
        'En caso de derrame químico, siga los protocolos establecidos.',
        'Las señales de seguridad son esenciales para prevenir accidentes.',
        'Mantenga las salidas de emergencia despejadas en todo momento.',
        'La comunicación efectiva es clave para mantener un ambiente de trabajo seguro.',
    ];
    return safetyResponses[Math.floor(Math.random() * safetyResponses.length)];
};

export const getNextMessageId = (messages: Message[], conversations: Conversation[]): number => {
    return Math.max(0, 
        ...messages.map((m) => m.id), 
        ...conversations.flatMap(c => c.messages.map(m => m.id))
    ) + 1;
};

export const getNextConversationId = (conversations: Conversation[]): number => {
    return Math.max(0, ...conversations.map((c) => c.id)) + 1;
};

export const createUserMessage = (
    content: string, 
    conversationId: number, 
    nextId: number
): Message => {
    return {
        id: nextId,
        conversationId,
        senderId: 1,
        isAI: false,
        content,
        timestamp: new Date().toISOString(),
    };
};

export const createAIMessage = (
    content: string, 
    conversationId: number, 
    nextId: number
): Message => {
    return {
        id: nextId,
        conversationId,
        senderId: 0,
        isAI: true,
        content,
        timestamp: new Date().toISOString(),
    };
};

export const createNewConversation = (
    id: number,
    title: string,
    messages: Message[] = []
): Conversation => {
    return {
        id,
        userId: 1,
        title,
        createdAt: new Date().toISOString(),
        messages,
    };
};