import "./Chat.css";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useTheme } from "../ThemeToggle/ThemContext.js";
import { FaRobot, FaUser } from "react-icons/fa"; // Font Awesome Robot

function ChatScreen() {
  const [histroy, setHistroy] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(1);
  const bottomRef = useRef(null);

  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [histroy]);

  const histroyRef = useRef(histroy);
  histroyRef.current = histroy;

  const handleSend = async () => {
    const messageCopy = message;
    const chat = {
      id: id,
      from: "user",
      message: message,
    };
    updateChatHistory(chat);
    await getBotResponse(messageCopy);
  };

  const updateChatHistory = (chat) => {
    setHistroy((prevHistory) => [...prevHistory, chat]);
    setMessage("");
    setId((prevId) => prevId + 1);
  };

  const updateChatMessageById = (id, newMessage) => {
    setHistroy((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, message: newMessage } : msg))
    );
  };

  const generateUniqueId = () =>
    Date.now().toString() + Math.random().toString(36).slice(2);

  const getBotResponse = async (message) => {
    setLoading(true);

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemma3:1b",
        stream: true,
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.body) {
      console.error("No response body stream available.");
      setLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const botId = generateUniqueId();
    let botMessage = { id: botId, from: "bot", message: "" };

    setHistroy((prev) => [...prev, botMessage]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const parsed = JSON.parse(line);
          botMessage.message += parsed.message?.content || "";
          updateChatMessageById(botId, botMessage.message);
        } catch {
          // Ignore incomplete JSON chunk errors
        }
      }
    }

    setLoading(false);
  };

  return (
    <div className={`chat-screen${isDark ? " dark-mode" : ""}`}>
      <div className="chat-area">
        {/* Dark mode toggle */}
        <div
          className="form-check form-switch"
          style={{ position: "fixed", top: 10, right: 20, zIndex: 200 }}
        >
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="darkModeSwitch"
            checked={isDark}
            onChange={toggleTheme}
          />
          <label className="form-check-label" htmlFor="darkModeSwitch">
            {isDark ? "Dark" : "Light"}
          </label>
        </div>

        {/* Chat input area */}
        <div className="fixed-input">
          <div className="input-group">
            <textarea
              className="form-control custom-textarea"
              aria-label="With textarea"
              placeholder="Ask anything"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            ></textarea>
            <button
              type="button"
              className="btn btn-secondary full-height-button"
              onClick={handleSend}
              disabled={loading || !message.trim()}
            >
              {loading ? "Please wait" : "Send"}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chats">
          {histroy.map((item) => (
            <div
              key={item.id}
              className={
                item.from === "bot" ? "messages-left" : "messages-right"
              }
            >
              <div className="message-row">
                {item.from === "bot" && (
                  <div className="circle">
                    {" "}
                    <FaRobot size={20} />
                  </div>
                )}
                <div className="message-text">
                  <ReactMarkdown>{item.message}</ReactMarkdown>
                </div>
                {item.from === "user" && <div className="circle"><FaUser size={20} /></div>}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
