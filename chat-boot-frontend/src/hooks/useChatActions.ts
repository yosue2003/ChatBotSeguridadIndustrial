import { useState, useEffect } from 'react';
import type { Message, Conversation, Topic } from '../models/chat.model';
import { ChatService } from '../services/app.services';

export const useChatActions = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [recommendedTopics, setRecommendedTopics] = useState<Topic[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const userId = 1;

    // Cargar temas al inicio
    useEffect(() => {
        const loadTopics = async () => {
            try {
                const fetchedTopics = await ChatService.getTopics();
                setTopics(fetchedTopics);
                setRecommendedTopics(fetchedTopics.slice(0, 3));
            } catch (error) {
                console.error('Error al cargar temas:', error);
            }
        };
        loadTopics();
    }, []);

    // Cargar conversaciones del usuario al inicio
    useEffect(() => {
        const loadConversations = async () => {
            try {
                const fetchedConversations = await ChatService.getUserConversations(userId);
                setConversations(fetchedConversations);
            } catch (error) {
                console.error('Error al cargar conversaciones:', error);
            }
        };
        loadConversations();
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
        try {
            setLoading(true);
            
            // Creamos un mensaje temporal del usuario
            const userMessage: Message = {
                id: Date.now(), // ID temporal
                conversationId: currentConversation?.id || 0,
                senderId: userId,
                isAI: false,
                content: content,
                timestamp: new Date().toISOString()
            };
            
            // Añadimos inmediatamente el mensaje del usuario a la UI
            setMessages(prev => [...prev, userMessage]);

            const response = await ChatService.sendMessage(
                content,
                currentConversation?.id,
                undefined 
            );

            if (!currentConversation) {
                // Si es una nueva conversación, usar el primer mensaje como título
                const newConversation = {
                    ...response.conversation,
                    title: content.length > 30 ? content.substring(0, 30) + '...' : content
                };
                setCurrentConversation(newConversation);
                setConversations(prev => [...prev, newConversation]);
            } else {
                const updatedConversation = {
                    ...currentConversation,
                    messages: [...currentConversation.messages, userMessage, response.message]
                };
                setCurrentConversation(updatedConversation);
                setConversations(prev =>
                    prev.map(conv =>
                        conv.id === currentConversation.id ? updatedConversation : conv
                    )
                );
            }
            
            // Actualizamos los mensajes con la respuesta del bot
            setMessages(prev => [...prev, response.message]);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        } finally {
            setLoading(false);
        }
    };

    const startNewConversation = async (topicId?: number) => {
        try {
            setLoading(true);
            setMessages([]); // Clear current messages
            
            // Default welcome message or topic-specific message
            let welcomeMessage = {
                id: Date.now(),
                conversationId: 0,
                senderId: 0, // System/AI sender
                isAI: true,
                content: "¡Hola! Soy SAFEMIND 1.0. ¿En qué tema de seguridad industrial puedo ayudarte hoy?",
                timestamp: new Date().toISOString()
            };
    
            // If topic selected, customize welcome message
            if (topicId) {
                const topic = topics.find(t => t.id === topicId);
                if (topic) {
                    welcomeMessage.content = `¡Hola! Soy SAFEMIND 1.0. Me gustaría proporcionarte información sobre ${topic.name}. ¿Qué te gustaría saber específicamente?`;
                }
            }
            
            // Show welcome message immediately to avoid UI delay
            setMessages([welcomeMessage]);
    
            try {
                // Send the welcome message to backend
                const initialResponse = await ChatService.sendMessage(
                    welcomeMessage.content, 
                    undefined, 
                    topicId
                );
                
                // Update with server response
                if (initialResponse && initialResponse.conversation) {
                    // Get server-generated message/conversation IDs
                    welcomeMessage = initialResponse.message || welcomeMessage;
                    
                    // Update conversation state with server response
                    setCurrentConversation(initialResponse.conversation);
                    setConversations(prev => [...prev, initialResponse.conversation]);
                    
                    // Ensure messages are updated with server response
                    setMessages([welcomeMessage]);
                } else {
                    // Handle case where server doesn't return expected data
                    console.error('Respuesta del servidor incompleta');
                }
            } catch (apiError) {
                console.error('Error en la comunicación con el servidor:', apiError);
                // Keep the local welcome message if server request fails
                // This ensures user sees something even if API fails
            }
        } catch (error) {
            console.error('Error al iniciar nueva conversación:', error);
            // Show error message to user
            setMessages([{
                id: Date.now(),
                conversationId: 0,
                senderId: 0,
                isAI: true,
                content: "Lo siento, el servicio está tardando demasiado en responder. Por favor, intenta nuevamente.",
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const loadConversation = async (conversationId: number) => {
        try {
            const conversation = await ChatService.getConversation(conversationId);
            setCurrentConversation(conversation);
            setMessages(conversation.messages);
        } catch (error) {
            console.error('Error al cargar conversación:', error);
        }
    };

    const deleteConversation = async (conversationId: number) => {
        try {
            await ChatService.deleteConversation(conversationId);
            
            if (currentConversation?.id === conversationId) {
                setCurrentConversation(null);
                setMessages([]);
            }

            setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        } catch (error) {
            console.error('Error al eliminar la conversación:', error);
        }
    };

    const deleteAllConversations = async () => {
        try {
            await ChatService.deleteAllUserConversations(userId);
            
            setCurrentConversation(null);
            setMessages([]);
            setConversations([]);
        } catch (error) {
            console.error('Error al eliminar todas las conversaciones:', error);
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
        loadConversation,
        deleteConversation,
        deleteAllConversations
    };
};