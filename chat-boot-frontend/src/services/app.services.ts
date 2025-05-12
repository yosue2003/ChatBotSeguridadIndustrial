import { API_BASE_URL } from './config/config';
import type { Topic, Message, Conversation } from '../models/chat.model';
import axios from 'axios';

export const ChatService = {
    async getTopics(): Promise<Topic[]> {
        const response = await fetch(`${API_BASE_URL}/chat/topics`);
        if (!response.ok) {
            throw new Error('Error al obtener los temas');
        }
        return response.json();
    },

    async getUserConversations(userId: number): Promise<Conversation[]> {
        const response = await fetch(`${API_BASE_URL}/chat/conversations/${userId}`);
        if (!response.ok) {
            throw new Error('Error al obtener las conversaciones');
        }
        return response.json();
    },

    async getConversation(conversationId: number): Promise<Conversation> {
        const response = await fetch(`${API_BASE_URL}/chat/conversation/${conversationId}`);
        if (!response.ok) {
            throw new Error('Error al obtener la conversación');
        }
        return response.json();
    },

    async sendMessage(content: string, conversationId?: number, topicId?: number): Promise<{
        message: Message;
        conversation: Conversation;
    }> {
        try {
            const response = await axios.post<{ message: Message; conversation: Conversation; }>(`${API_BASE_URL}/chat/message`, {
                content,
                conversationId,
                topicId
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    async deleteConversation(conversationId: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/chat/conversation/${conversationId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error al eliminar la conversación');
        }
    },

    async deleteAllUserConversations(userId: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/chat/conversations/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error al eliminar las conversaciones');
        }
    },
};