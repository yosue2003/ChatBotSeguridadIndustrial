import React, { createContext, useContext } from 'react';
import type { ChatContextType } from '../models/chat.model';
import { useChatActions } from '../hooks/useChatActions';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const chatActions = useChatActions();

    return (
        <ChatContext.Provider value={chatActions}>
            {children}
        </ChatContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
