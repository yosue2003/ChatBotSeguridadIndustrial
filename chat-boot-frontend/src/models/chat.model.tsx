export interface Message {
    id: number;
    conversationId: number;
    senderId: number;
    isAI: boolean;
    content: string;
    timestamp: string;
}

export interface Conversation {
    id: number;
    userId: number;
    title: string;
    createdAt: string;
    messages: Message[];
}

export interface Topic {
    id: number;
    name: string;
    description: string;
}

export interface ChatContextType {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    topics: Topic[];
    recommendedTopics: Topic[];
    messages: Message[];
    sendMessage: (content: string) => void;
    startNewConversation: (topicId?: number) => void;
    loadConversation: (conversationId: number) => void;
    loading: boolean;
}