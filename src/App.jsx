import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Auth from "./Auth.jsx";
import { MyContext } from './MyContext.jsx';
import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setcurrThreadId] = useState(uuidv1());
  const [messages, setMessages] = useState([]);  
  const [newChat, setnewChat] = useState(true);
  const [isLoading, setIsLoading] = useState(false); 
  const [allThreads, setallThreads] = useState([]);
  const [displayedReply, setDisplayedReply] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Authentication States
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

const getallThreads = async () => {
    if (!token) return; 
    try {
      const response = await fetch("https://nexagpt-backend.onrender.com/api/thread", {
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      });
      const res = await response.json();
      
      if (Array.isArray(res)) {
        const filterData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
        setallThreads(filterData);
      } else {
        console.log("Backend response is not an array:", res);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const loginUser = (userToken, userData) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.clear(); 
    setMessages([]);
    setallThreads([]);
    setcurrThreadId(uuidv1());
    setnewChat(true);
  };

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setcurrThreadId,
    newChat, setnewChat,
    messages, setMessages,      
    isLoading, setIsLoading, 
    allThreads, setallThreads,
    getallThreads,  
    displayedReply, setDisplayedReply,
    isTyping, setIsTyping,
    user, token, loginUser, logoutUser 
  };

  return (
    <>
      <div className="app">
        <MyContext.Provider value={providerValues}> 
          {token ? (
            <>
              <Sidebar />
              <ChatWindow />
            </>
          ) : (
            <Auth />
          )}
        </MyContext.Provider>
      </div>
    </>
  )
}

export default App;