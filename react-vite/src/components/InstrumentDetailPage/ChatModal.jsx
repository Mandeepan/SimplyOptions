import { IoExit } from "react-icons/io5";
import { CiCircleQuestion } from "react-icons/ci";
import { FaArrowCircleUp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { ThreeDots } from "react-loader-spinner";
import ReactMarkdown from "react-markdown";
import  { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addUserMessage, fetchChatResponse } from "../../redux/chats"
import { getAnInstrumentThunk } from "../../redux/instrument";
import "./ChatModal.css"

export default function ChatModal({closeModalFromPage}){
    const dispatch = useDispatch();
    const [inputMessage, setInputMessage] = useState('');
    const { instrumentId } = useParams();
    const instrument = useSelector((state) => state.instruments.currentInstrument); 
    const { messages, loading } = useSelector((state) => state.chats);

    useEffect(() => {
        if (instrumentId) {
            dispatch(getAnInstrumentThunk(instrumentId)); 
        }
    }, [dispatch, instrumentId]);

    const handleInputChange =(e)=>{
        setInputMessage(e.target.value)
    }
    
    const ChatMessage = ({ content, role }) => {
        return (
            <div className={`chat-message ${role === "user" ? "user" : "bot"}`}>
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        );
    };

    const handleSend = async ()=>{
        if (!inputMessage) return; // save the fetch if input message is empty
        await dispatch(addUserMessage(inputMessage));
        try {
            const company_name = instrument && instrument.company? instrument.company.company_name: "a company"
            const company_short_intro=instrument && instrument.company?instrument.company.short_description :""
            const requestData={
                message:inputMessage,
                company_name: company_name ,
                company_short_intro: company_short_intro
            }

            await dispatch(fetchChatResponse(requestData));
        } catch (error) {
            console.error('Error fetching chat response:', error);
        }
        setInputMessage('');
    }

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('backdrop')) {
            closeModalFromPage();
        }
    };

    return (
        <AnimatePresence>
                {(
                    <motion.div 
                    className="backdrop"
                    onClick={handleBackdropClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className="side-modal"
                            initial={{ x: "100%" }}
                            animate={{ x: 0}}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                            style={{ pointerEvents: "auto" }}
                        >
                            <div className="side-modal-content">
                                <button className="close-modal-button" onClick={closeModalFromPage}><IoExit /></button>
                                <p className="typing-content">Hi, I am SimpleBuddy, here&apos;s what I think about {instrument.company?.company_name}:</p>
                                <p className="typing-content">{instrument.company?.ai_prompt} Let me know if you have any questions.</p>
                            </div>
                            <div className="chat-history">
                                {messages && messages.map((msg, index) => (
                                    <ChatMessage key={index} content={msg.content} role={msg.role} />
                                ))}
                            </div>
                            <div className="loading-indicator">{loading&&(
                                                <ThreeDots
                                                visible={true}
                                                height="2rem"
                                                width="2rem"
                                                color="#efddf2e2"
                                                radius="9"
                                                ariaLabel="three-dots-loading"
                                                wrapperStyle={{}}
                                                wrapperClass=""
                                            />
                            )}</div>
                            <div className="chat-input-container">
                                <input className="buddy_input" 
                                        type="text"
                                        name="inputMessage"
                                        value={loading ? '' : inputMessage}
                                        onChange={handleInputChange}
                                        placeholder="Enter your question here..."
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleSend(); // Trigger the send action if a user hit the ENTER key
                                            }
                                        }}
                                        />
                                <button className="ai-send-button" onClick={handleSend} disabled={loading}><FaArrowCircleUp />
                                </button>
                            </div>
                            <div className="openAI-logo-container">
                                <div className="tooltip-wrapper">
                                    <div className="ai-tooltip">AI answer may be inaccurate. Use it cautiously.</div>
                                    <CiCircleQuestion />
                                </div>
                                <p>Powered by</p>
                                <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/OpenAI_Logo.svg.png" alt="Powered by OpenAI"></img>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
    )
}