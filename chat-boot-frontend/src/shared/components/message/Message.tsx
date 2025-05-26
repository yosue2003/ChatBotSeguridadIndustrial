import { FaUser } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import Markdown from "markdown-to-jsx";
import './Message.css';

interface Message {
    isAI: boolean;
    content: string;
    timestamp: string | number | Date;
}

const ChatMessage = ({ message }: { message: Message }) => {    const renderAIContent = (content: string) => {
        // Detectar si una línea es un título
        const isTitle = (line: string): boolean => {
            const headingKeywords = [
                'Ejemplo', 'Conclusión', 'Prácticas Recomendadas', 'Introducción',
                'Recomendaciones', 'Resumen', 'Objetivos', 'Importante'
            ];
            
            // Si ya es un encabezado o comienza con una palabra clave
            return line.startsWith('#') || 
                   headingKeywords.some(keyword => 
                       line.trim().toLowerCase().startsWith(keyword.toLowerCase())
                   );
        };

        // Procesar el contenido
        const processedContent = content.split('\n').map(line => {
            line = line.trim();
            if (line.startsWith('```') || line.endsWith('```')) {
                // Ignorar las líneas que son solo marcadores de código
                return '';
            }
            
            // Si es un título pero no tiene #, agregarlo
            if (isTitle(line) && !line.startsWith('#')) {
                return `### ${line}`;
            }
            
            return line;
        }).join('\n');

        return (
            <article className="ai-article">
                <Markdown options={{
                    overrides: {
                        h1: {
                            props: {
                                className: 'ai-title-h1'
                            }
                        },
                        h2: {
                            props: {
                                className: 'ai-title-h2'
                            }
                        },
                        h3: {
                            props: {
                                className: 'ai-title-h3'
                            }
                        },
                        p: {
                            props: {
                                className: 'ai-paragraph'
                            }
                        },
                        ul: {
                            props: {
                                className: 'ai-list'
                            }
                        },
                        li: {
                            props: {
                                className: 'ai-list-item'
                            }
                        },
                        pre: {
                            props: {
                                className: 'ai-pre'
                            }
                        },
                        code: {
                            props: {
                                className: 'ai-code'
                            }
                        }
                    }
                }}>
                    {processedContent}
                </Markdown>
            </article>
        );
    };

    return (
        <div className={`message ${message.isAI ? "ai-message" : "user-message"}`}>
            <div className="message-avatar">
                {message.isAI ? <RiRobot2Fill /> : <FaUser />}
            </div>
            <div className="message-content">
                {message.isAI ? renderAIContent(message.content) : <p>{message.content}</p>}
                <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
            </div>
        </div>
    );
};

export default ChatMessage;