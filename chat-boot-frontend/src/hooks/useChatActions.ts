import { useState, useEffect } from 'react';
import { Message, Conversation, Topic } from '../models/chat.model';
import { mockMessages, mockTopics } from '../data/mockData';
import {
    generateAIResponse,
    getNextMessageId,
    getNextConversationId,
    createUserMessage,
    createAIMessage,
    createNewConversation
} from '../shared/utils/chatUtils';

export const useChatActions = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [topics, setTopics] = useState<Topic[]>(mockTopics);
    const [recommendedTopics, setRecommendedTopics] = useState<Topic[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    // Cargar conversaciones desde datos mock
    useEffect(() => {
        const userConversations = mockMessages.reduce((convs: Conversation[], msg) => {
            const existingConv = convs.find((c) => c.id === msg.conversationId);
            if (existingConv) {
                existingConv.messages.push(msg);
                return convs;
            }
            const newConv: Conversation = {
                id: msg.conversationId,
                userId: msg.senderId,
                title: `Conversation ${msg.conversationId}`,
                createdAt: msg.timestamp,
                messages: [msg],
            };
            return [...convs, newConv];
        }, []);
        setConversations(userConversations);
    }, []);

    // Actualizar mensajes cuando cambia la conversación
    useEffect(() => {
        if (currentConversation) {
            setMessages(currentConversation.messages);
        } else {
            setMessages([]);
        }
    }, [currentConversation]);

    const sendMessage = async (content: string) => {
        if (!currentConversation) {
            const newId = getNextConversationId(conversations);
            const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
            
            const userMessage = createUserMessage(content, newId, 1);
            const aiMessage = createAIMessage(
                "¡Hola! Soy SafetyBot, tu asistente en temas de seguridad industrial. ¿En qué puedo ayudarte hoy?",
                newId,
                2
            );

            const updatedMessages = [userMessage, aiMessage];
            const finalConversation = createNewConversation(newId, title, updatedMessages);

            setMessages(updatedMessages);
            setCurrentConversation(finalConversation);
            setConversations(prev => [...prev, finalConversation]);
            return;
        }

        setLoading(true);
        const newUserMessage = createUserMessage(
            content,
            currentConversation.id,
            getNextMessageId(messages, conversations)
        );

        const updatedMessages = [...messages, newUserMessage];
        const isFirstUserMessage = messages.every(m => m.isAI);
        const shouldUpdateTitle = isFirstUserMessage && !currentConversation.title.startsWith('Sobre:');

        const updatedCurrentConversation = {
            ...currentConversation,
            messages: updatedMessages,
            title: shouldUpdateTitle 
                ? (content.length > 30 ? content.substring(0, 30) + '...' : content)
                : currentConversation.title
        };

        const updatedConversations = conversations.map((conv) =>
            conv.id === currentConversation.id ? updatedCurrentConversation : conv
        );

        setMessages(updatedMessages);
        setCurrentConversation(updatedCurrentConversation);
        setConversations(updatedConversations);

        // Simular respuesta del bot
        setTimeout(() => {
            const aiResponse = createAIMessage(
                generateAIResponse(content),
                currentConversation.id,
                getNextMessageId(updatedMessages, conversations)
            );

            const finalMessages = [...updatedMessages, aiResponse];
            const finalConversation = {
                ...updatedCurrentConversation,
                messages: finalMessages,
            };

            const finalConversations = updatedConversations.map((conv) =>
                conv.id === currentConversation.id ? finalConversation : conv
            );

            setMessages(finalMessages);
            setCurrentConversation(finalConversation);
            setConversations(finalConversations);
            setLoading(false);
        }, 1000);
    };

    const startNewConversation = (topicId?: number) => {
        const newId = getNextConversationId(conversations);
        const title = topicId 
            ? `Sobre: ${topics.find((t) => t.id === topicId)?.name ?? 'Tema nuevo'}` 
            : 'Nueva conversación';

        let initialMessages: Message[] = [];
        if (topicId) {
            const topic = topics.find((t) => t.id === topicId);
            if (topic) {
                initialMessages = [createAIMessage(
                    `Bienvenido a la conversación sobre ${topic.name}. ¿En qué puedo ayudarte respecto a este tema?`,
                    newId,
                    1
                )];
            }
        } else {
            initialMessages = [createAIMessage(
                "¡Hola! Soy SafetyBot, tu asistente en temas de seguridad industrial. ¿En qué puedo ayudarte hoy?",
                newId,
                1
            )];
        }

        const newConversation = createNewConversation(newId, title, initialMessages);
        const updatedConversations = [...conversations, newConversation];
        
        setConversations(updatedConversations);
        setCurrentConversation(newConversation);
        setMessages(newConversation.messages);
    };

    const loadConversation = (conversationId: number) => {
        const conversation = conversations.find((c) => c.id === conversationId);
        if (conversation) {
            setCurrentConversation(conversation);
            setMessages(conversation.messages);
        }
    };

    return {
        conversations,
        currentConversation,
        topics,
        recommendedTopics,
        messages,
        loading,
        sendMessage,
        startNewConversation,
        loadConversation
    };
};