import './Message.css';

const WelcomeScreen = () => {
    return (
        <div className="chat-welcome">
            <h2>Bienvenido a SafetyBot</h2>
            <p>
                Selecciona un tema de seguridad o inicia una nueva conversación
                para comenzar a chatear.
            </p>
        </div>
    );
};

export default WelcomeScreen;