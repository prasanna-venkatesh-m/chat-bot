import "./Chat.css";
import { useState, useRef } from "react";

function ChatScreen() {
  const [histroy, setHistroy] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(1);

  // Use a ref to keep track of histroy inside async functions to avoid stale closure
  const histroyRef = useRef(histroy);
  histroyRef.current = histroy;

  const handleSend = async () => {
    const messageCopy = message;
    var chat = {
      id: id,
      from: "user",
      message: message,
    };
    updateChatHistory(chat);
    await getBotResponse(messageCopy);
  };

  // Update chat history and return the new index of added chat (in current histroy)
  const updateChatHistory = (chat) => {
    setHistroy((prevHistory) => {
      const newHistory = [...prevHistory, chat];
      return newHistory;
    });
    setMessage("");
    setId((prevId) => prevId + 1);
  };

  const updateChatMessageById = (id, newMessage) => {
    setHistroy((prev) => {
      return prev.map((msg) =>
        msg.id === id ? { ...msg, message: newMessage } : msg
      );
    });
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

    // Generate unique id for bot message placeholder
    const botId = generateUniqueId();
    let botMessage = { id: botId, from: "bot", message: "" };

    // Add placeholder bot message to history
    setHistroy((prev) => [...prev, botMessage]);

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Assuming newline-delimited JSON chunks
      const lines = buffer.split("\n");
      buffer = lines.pop(); // leftover partial

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const parsed = JSON.parse(line);
          botMessage.message += parsed.message?.content || "";

          // Update bot message by id
          updateChatMessageById(botId, botMessage.message);
        } catch {
          // Ignore incomplete JSON chunk errors
        }
      }
    }

    setLoading(false);
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
              disabled={loading}
            ></textarea>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSend}
              disabled={loading || !message.trim()}
            >
              {loading ? "Please wait" : "Send"}
            </button>
          </div>
        </div>
        <div className="chats">
          {histroy
            .slice()
            .reverse()
            .map((item) => (
              <div
                key={item.id}
                className={
                  item.from === "bot" ? "messages-left" : "messages-right"
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
