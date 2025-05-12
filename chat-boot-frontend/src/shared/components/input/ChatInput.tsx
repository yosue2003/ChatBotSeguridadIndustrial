import { useState } from 'react';
import type { FormEvent } from 'react';
import { useChat } from "../../../context/chatContext";
import './ChatInput.css';

const ChatInput = () => {
    const [inputMessage, setInputMessage] = useState('');
    const { 
        sendMessage, 
        //currentConversation, 
        loading } = useChat();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const message = inputMessage.trim();
        if (!message) return;
        
        setInputMessage('');
        sendMessage(message);
    };

    return (
        <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                //disabled={!currentConversation || loading}
            />
            <button 
                type="submit" 
                disabled={!inputMessage.trim() || loading}
            >
                Enviar
            </button>
        </form>
    );
};

export default ChatInput;