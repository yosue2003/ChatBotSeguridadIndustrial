import { useState} from 'react'

import { FiBookOpen } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { FaChevronRight, FaChevronDown, FaHistory, FaTrash } from "react-icons/fa";
import { useChat } from '../../../context/chatContext';
import './sidebar.css'


const SidebarChat = () => {
    const {
        topics,
        recommendedTopics,
        conversations,
        startNewConversation,
        loadConversation,
        currentConversation,
        deleteConversation,
        deleteAllConversations,
    } = useChat() 
    const [isTopicsOpen, setIsTopicsOpen] = useState(true)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)

    const toggleSection = (section: "topics" | "history") => {
        if (section === "topics") {
            setIsTopicsOpen(!isTopicsOpen);
            if (!isTopicsOpen && isHistoryOpen) {
                setIsHistoryOpen(false);
            }
        } else if (section === "history") {
            setIsHistoryOpen(!isHistoryOpen);
            if (!isHistoryOpen && isTopicsOpen) {
                setIsTopicsOpen(false);
            }
        }
    };
    
    return (
        <div className="sidebar">

            <div className="sidebar-button-container">
                <button
                onClick={() => startNewConversation()} 
                className="new-chat-button"
                >
                <FaPlus size={18} />
                <span>Nueva Conversación</span>
                </button>
            </div>
        

            <div className="flex-grow">
                <div className="section-divider">
                    <button
                    onClick={() => toggleSection("topics")}
                    className="section-header"
                    >
                    <div className="section-title">
                        <FiBookOpen  size={18}/>
                        <span>Temas de Seguridad</span>
                    </div>
                    {isTopicsOpen ? (
                        <FaChevronDown size={18} />
                    ) : (
                        <FaChevronRight size={18} />
                    )}
                    </button>
                    {isTopicsOpen && (
                    <div className="section-content">
                        {recommendedTopics.length > 0 && (
                        <div className="topic-group">
                            <h4 className="topic-group-title">
                            Temas Recomendados
                            </h4>
                            <ul className="topic-list">
                            {recommendedTopics.map((topic) => (
                                <li key={`recommended-${topic.id}`}>
                                <button
                                    onClick={() => startNewConversation(topic.id)}
                                    className="topic-item"
                                >
                                    {topic.name}
                                </button>
                                </li>
                            ))}
                            </ul>
                        </div>
                        )}
                        <h4 className="topic-group-title">
                        Todos los Temas
                        </h4>
                        <ul className="topic-list">
                        {topics.map((topic) => (
                            <li key={topic.id}>
                            <button
                                onClick={() => startNewConversation(topic.id)}
                                className="topic-item"
                                title={topic.description}
                            >
                                {topic.name}
                            </button>
                            </li>
                        ))}
                        </ul>
                    </div>
                    )}
                </div>
            
                <div className="section-divider">
                    <button
                    onClick={() => toggleSection("history")}
                    className="section-header"
                    >
                    <div className="section-title">
                        <FaHistory size={18} />
                        <span>Historial de Conversaciones</span>
                    </div>
                    {isHistoryOpen ? (
                        <FaChevronDown size={18} />
                    ) : (
                        <FaChevronRight size={18} />
                    )}
                    </button>
                    {isHistoryOpen && (
                    <div className="section-content">
                        {conversations.length === 0 ? (
                        <p className="empty-history">
                            No hay conversaciones previas
                        </p>
                        ) : (
                        <>
                            <div className="sidebar-button-container">
                                <button
                                onClick={() => deleteAllConversations()}
                                className="new-chat-button"
                                >
                                <FaTrash size={18} />
                                <span>Eliminar todo</span>
                                </button>
                            </div>
                            <ul className="conversation-list">
                                {conversations.map((conversation) => (                                <li key={conversation.id}>
                                    <div
                                        onClick={() => loadConversation(conversation.id)}
                                        className={`conversation-item ${currentConversation?.id === conversation.id ? 'active-conversation' : ''}`}
                                    >
                                        <span>{conversation.title}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteConversation(conversation.id);
                                            }}
                                            className="delete-button"
                                            title="Eliminar conversación"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </li>
                                ))}
                            </ul>
                        </>
                        )}
                    </div>
                    )}
                </div>
            </div>
        
            <div className="safety-container">
                <div className="safety-box">
                <h4 className="safety-title">
                    Consejo de Seguridad
                </h4>
                <p className="safety-text">
                    Recuerde siempre reportar condiciones inseguras y seguir los
                    protocolos establecidos.
                </p>
                </div>
            </div>
        </div>
    )
}

export default SidebarChat;