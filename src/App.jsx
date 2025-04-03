import { useState } from "react";
import styles from "./App.module.css";
import { Chat } from "./components/Chat/Chat";
import { Controls } from "./components/Chat/Controls/Controls";
import { Assistant } from "./assistants/openai";
import { Loader } from "./components/Loader/Loader";

// import { Assistant } from "./assistants/googleai";

// function App() {
//   const [messages, setMessages] = useState([]);
//   function addMessage(message) {
//     setMessages((prevMessages) => [...prevMessages, message]);
//   }
//   async function handleContentSend(content) {
//     addMessage({ content, role: "user" });
//     try {
//       const result = await chat.sendMessage(content);
//       addMessage({ content: result.response.text(), role: "assistant" });
//     } catch {
//       addMessage({
//         content: "Sorry, I couldn't process your request. Please try again!",
//         role: "system",
//       });
//     }
//   }
//   return (
//     <div className={styles.App}>
//       <header className={styles.Header}>
//         <img className={styles.Logo} src="/chat-bot.png" />
//         <h2 className={styles.Title}>AI Chatbot</h2>
//       </header>
//       <div className={styles.ChatContainer}>
//         <Chat messages={messages} />
//       </div>
//       <Controls onSend={handleContentSend} />
//     </div>
//   );
// }
// export default App;

function App() {
  const assistant = new Assistant();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function handleContentSend(content) {
    setLoading(true);
    addMessage({ content, role: "user" });
    try {
      const result = await assistant.chat(content, messages);
      addMessage({ content: result, role: "assistant" });
    } catch {
      addMessage({
        content: "Sorry, I couldn't process your request. Please try again!",
        role: "system",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.App}>
      {loading && <Loader />}
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" />
        <h2 className={styles.Title}>AI Chatbot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Controls isDisabled={loading} onSend={handleContentSend} />
    </div>
  );
}

export default App;
