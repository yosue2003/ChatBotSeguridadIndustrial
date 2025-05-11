import { useState } from 'react';
import { ChatProvider } from "../context/chatContext";
import SidebarChat from "../shared/components/sidebar/Sidebar";
import ChatHeader from '../shared/components/header/Header';
import ChatContainer from '../shared/components/container/ChatContainer';
import './chatPage.css';

const ChatPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <ChatProvider>
        <div className="container-chat-page">
            <ChatHeader toggleSidebar={toggleSidebar} />
            <div className="main-chat-page">
                <div className={`sidebar-chat-page ${sidebarOpen ? "active" : ""}`}>
                    <SidebarChat />
                </div>
                <ChatContainer />
            </div>
        </div>
        </ChatProvider>
    );
};

export default ChatPage;