import { TiThMenuOutline } from "react-icons/ti";
import { BsSun, BsMoonFill } from "react-icons/bs";
import { useTheme } from '../../../context/themeContext';
import './Header.css';

const ChatHeader = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className="header-chat-page">
            <button className="hamburger-menu" onClick={toggleSidebar}>
                <TiThMenuOutline size={18}/>
            </button>
            <h1>SafetyBot</h1>
            <button onClick={toggleTheme} className="theme-toggle">
                {isDarkMode ? <BsSun size={18} /> : <BsMoonFill size={18} />}
            </button>
        </div>
    );
};

export default ChatHeader;