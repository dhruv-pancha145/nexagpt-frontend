import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v1 as uuidv1 } from "uuid";
import logoSvg from "./assets/logo.svg"; 

function Sidebar() {
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
    getallThreads 
  } = useContext(MyContext);

  useEffect(() => {
    if (token) {
      getallThreads();
    }
  }, [currThreadId, token]); 

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
        <button onClick={createNewChat}>
          <img src={logoSvg} alt="gpt logo" className="logo" />
          <span><i className="fa-solid fa-pen-to-square" style={{ color: "rgb(255,255,255)" }}></i></span>
        </button>

        <ul className="history">
          {allThreads?.map((thread, idx) => (
            <li key={idx}
              onClick={(e) => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "hightlight" : ""}
            >
              {thread.title}
              <i className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation(); 
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>

        <div className="sign">
          <p>By ApnaCollege &hearts;</p>
        </div>
      </section>
    </>
  );
}

export default Sidebar;