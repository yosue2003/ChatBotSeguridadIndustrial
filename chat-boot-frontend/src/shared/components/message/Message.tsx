import { FaUser } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import './Message.css';

interface Message {
    isAI: boolean;
    content: string;
    timestamp: string | number | Date;
}


const ChatMessage = ({ message }: { message: Message }) => {
    return (
        <div className={`message ${message.isAI ? 'ai-message' : 'user-message'}`}>
            <div className="message-avatar">
                {message.isAI ? <RiRobot2Fill /> : <FaUser />}
            </div>
            <div className="message-content">
                <p>{message.content}</p>
                <span className="message-time">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </div>
    );
};

export default ChatMessage;