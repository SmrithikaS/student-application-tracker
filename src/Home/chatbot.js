import React, { useState } from "react";
import axios from "axios";
import './chatbot.css'
import chatbot from'../images/chat-bot.webp' 

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: "user", text: message };
    setChat([...chat, userMessage]);
    setError(null); 

    try {
      const response = await axios.post("http://18.211.153.46:8080/api/chat", {
        message: message,
      });

      const botReply = { sender: "bot", text: response.data.reply };
      setChat((prevChat) => [...prevChat, botReply]);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to connect to the chatbot. Please try again.");
    }

    setMessage("");
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(true)}>
    {!isOpen && 
      <img className="chatbot" src={chatbot}></img>}
    {isOpen && (
        <div className="chatbox">
          <h2>Chatbot</h2>
          <button className="close-btn" onClick={(e) => { 
    e.stopPropagation(); 
    setIsOpen(false); 
}}>✖</button>

          <div>
            {chat.map((msg, index) => (
              <p key={index}>{msg.text}</p>
            ))}
          </div>
          {error && <p>{error}</p>}
          <input
            type="text"
            className="chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask your question..."
          />
          <button className="send-button" onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
