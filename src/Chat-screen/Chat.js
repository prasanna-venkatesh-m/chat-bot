import "./Chat.css";
import { useState } from "react";
import axios from "axios";

function ChatScreen() {
  const [histroy, setHistroy] = useState([]);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    var chat = {
      from: "user",
      message: message,
    };
    updateChatHistory(chat);
    await getBotResponse(message);
    setMessage("");
  };

  const updateChatHistory = (chat) => {
    setHistroy((prevHistory) => [...prevHistory, chat]);
  };

  const getBotResponse = async (message) => {
    var response = await axios.post("http://localhost:11434/api/chat", {
      model: "gemma3:1b",
      stream: false,
      messages: [{ role: "user", content: message }],
    });
    var chat = {
      from: "bot",
      message: response.data.message.content,
    };
    console.log(histroy);
    updateChatHistory(chat);
    console.log(histroy);
  };

  return (
 <div className="chat-screen">
      <div className="chat-area">
        <div className="fixed-input">
          <div className="input-group">
            <textarea
              className="form-control custom-textarea"
              aria-label="With textarea"
              placeholder="Ask anything"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
        <div className="chats">
          {histroy.map((item, index) => (
            <div
              key={index + item.message}
              className={
                item.from == "bot" ? "messages-left" : "messages-right"
              }
            >
              <div className="message-row">
                {item.from === "bot" && <div className="circle">B</div>}
                <div className="message-text">{item.message}</div>
                {item.from === "user" && <div className="circle">U</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
