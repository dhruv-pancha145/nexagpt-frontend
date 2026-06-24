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

  // ऐप लोड होने पर लोकलस्टोरेज से पुराना यूजर डेटा निकालें (यदि हो)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

const getallThreads = async () => {
    if (!token) return; // अगर टोकन नहीं है तो कॉल ही मत करो
    try {
      const response = await fetch("https://nexagpt-backend.onrender.com/api/thread", {
        headers: {
          // टोकन पास किया ताकि 401 Unauthorized एरर न आए
          "Authorization": `Bearer ${token}` 
        }
      });
      const res = await response.json();
      
      // यह सुरक्षा जांच एरर रोकेगी: अगर बैकएंड ऐरे भेजता है तभी मैप करें
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

  // लॉगिन करने का फंक्शन (Auth.jsx कॉल करेगा)
  const loginUser = (userToken, userData) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // लॉगआउट करने का फंक्शन (ChatWindow dropdown कॉल करेगा)
  const logoutUser = () => {
    setToken(null);
    setUser(null);
    localStorage.clear(); // सब साफ़
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
    user, token, loginUser, logoutUser // इन नई वैल्यूज को प्रोवाइडर में पास किया
  };

  return (
    <>
      <div className="app">
        <MyContext.Provider value={providerValues}> {/* 'value' को सही तरीके से Context.Provider के साथ इस्तेमाल किया */}
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