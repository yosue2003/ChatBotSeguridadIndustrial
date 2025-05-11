import ChatMessages from '../message/ChatMessage';
import ChatInput from '../input/ChatInput';
import './ChatContainer.css';


const ChatContainer = () => {
    return (
        <div className="chat-container">
            <div className="chat-window">
                <ChatMessages />
            </div>
            <ChatInput />
        </div>
    );
};

export default ChatContainer;