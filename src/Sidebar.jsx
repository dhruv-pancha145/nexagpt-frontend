import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  // 1. Context से token और getallThreads को निकाला
  const { 
    allThreads, 
    setallThreads, 
    currThreadId, 
    setnewChat, 
    setPrompt, 
    setReply, 
    setcurrThreadId, 
    setMessages,
    token,
    getallThreads // App.jsx वाला ग्लोबल फंक्शन इस्तेमाल करेंगे
  } = useContext(MyContext);

  useEffect(() => {
    // 2. केवल तभी थ्रेड्स लोड करें जब यूज़र के पास टोकन (लॉगिन) हो
    if (token) {
      getallThreads();
    }
  }, [currThreadId, token]); // token बदलने पर भी री-रन होगा

  const createNewChat = () => {
    setnewChat(true);
    setPrompt("");
    setReply(null);
    setcurrThreadId(uuidv1());
    setMessages([]);
  };

  const changeThread = async (newThreadId) => {
    setcurrThreadId(newThreadId);
    try {
      // 3. यहाँ भी टोकन पास करना होगा ताकि ऑथराइजेशन एरर न आए
      const response = await fetch(`https://nexagpt-backend.onrender.com/api/thread/${newThreadId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const res = await response.json();
      if (response.ok) {
        setMessages(res);
        setnewChat(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      // 4. यहाँ भी टोकन पास करना होगा
      const response = await fetch(`https://nexagpt-backend.onrender.com/api/thread/${threadId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const res = await response.json();

      setallThreads(prev => prev.filter(thread => thread.threadId !== threadId));
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <section className="sidebar">
        {/* new chat button */}
        <button onClick={createNewChat}>
          <img src="src/assets/logo.svg" alt="gpt logo" className="logo" />
          <span><i className="fa-solid fa-pen-to-square" style={{ color: "rgb(255,255,255)" }}></i></span>
        </button>

        {/* history */}
        <ul className="history">
          {allThreads?.map((thread, idx) => (
            <li key={idx}
              onClick={(e) => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "hightlight" : ""}
            >
              {thread.title}
              <i className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation(); // इवेंट बबलिंग रोकें
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>

        {/* sign */}
        <div className="sign">
          <p>By ApnaCollege &hearts;</p>
        </div>
      </section>
    </>
  );
}

export default Sidebar;