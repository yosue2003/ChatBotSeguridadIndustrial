import { RiRobot2Fill } from "react-icons/ri";
import './Message.css';

/**
 * Componente que muestra un indicador de escritura
 * para indicar que el bot está procesando una respuesta
 */
const TypingIndicator = () => {
    return (
        <div className="message ai-message">
            <div className="message-avatar">
                <RiRobot2Fill />
            </div>
            <div className="message-content typing">
                <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;