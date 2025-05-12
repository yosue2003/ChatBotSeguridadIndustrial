import { useEffect, useRef } from 'react';
import { useChat } from "../../../context/chatContext";
import ChatMessage from './Message';
import TypingIndicator from './Identificator';
import WelcomeScreen from './Welcome';


const ChatMessages = () => {
    const { messages = [], currentConversation, loading } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Si no hay conversación activa, mostrar la pantalla de bienvenida
    if (!currentConversation && messages.length === 0) {
        return <WelcomeScreen />;
    }

    return (
        <div className="chat-messages">
            {messages && messages.map((message) => (
                <ChatMessage
                    key={message.id}
                    message={{
                        isAI: message.isAI,
                        content: message.content,
                        timestamp: message.timestamp
                    }}
                />
            ))}
            
            {loading && <TypingIndicator />}
            
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;