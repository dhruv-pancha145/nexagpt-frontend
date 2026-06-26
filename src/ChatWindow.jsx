import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import "./Loader.css";  

function ChatWindow() {
  const {
    prompt, 
    setPrompt, 
    reply, 
    setReply, 
    currThreadId, 
    messages, 
    setMessages, 
    setnewChat, 
    isLoading, 
    setIsLoading,
    getallThreads,
    isTyping,         
    setIsTyping,      
    displayedReply,   
    setDisplayedReply,
    user,
    token,
    logoutUser
  } = useContext(MyContext);

  const [showDropdown, setShowDropdown] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;

    setnewChat(false); 
    setIsLoading(true);  
 
    const options = {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: prompt, threadId: currThreadId })
    };
    try {
      const response = await fetch("https://nexagpt-backend.onrender.com/api/chat", options);
      const res = await response.json();
      
      if (!response.ok) throw new Error(res.error || "Failed to fetch response");

      setReply(res.reply); 
      await getallThreads();   
      const fullReply = res.reply;
      setReply(fullReply);

      const words = fullReply.split(" ");
      let i = 0;
      setIsTyping(true);      
      setDisplayedReply("");   

      const interval = setInterval(() => {
        if (i < words.length) {
          setDisplayedReply(prev => prev + (i === 0 ? "" : " ") + words[i]);
          i++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 15); 
    } catch(err) {
       console.log(err);
    } finally {
         setIsLoading(false); 
    }
  }

  useEffect(() => {
    if(prompt && reply) {
       setMessages(messages => (
         [...messages, { role: "user", content: prompt }, { role: "assistant", content: reply }]
       ))
    }
    setPrompt("");
  }, [reply]);

  return (
    <>
      <div className="chatWindow">
        <div className="navbar" style={{ position: "relative" }}>
          <span>NexaGPT <i className="fa-solid fa-chevron-down" style={{ color: "rgb(255, 255, 255)" }}></i> </span>
          
          <div className="userIconDiv" onClick={() => setShowDropdown(!showDropdown)}>
            <span className="userIcon">
              <i className="fa-solid fa-user" style={{ color: "rgb(255, 255, 255)" }}></i>
            </span>
          </div>

          {showDropdown && (
            <div className="dropDown">
              <div className="dropDownItem userProfileHeader" style={{ borderBottom: "1px solid #2f2f2f", paddingBottom: "8px" }}>
                <div style={{ fontWeight: "bold", textTransform: "uppercase" }}>{user?.name || "User"}</div>
                <div style={{ fontSize: "0.75rem", color: "#b4b4b4" }}>Free Plan</div>
              </div>
              <div className="dropDownItem"><i className="fa-solid fa-star"></i> Upgrade plan</div>
              <div className="dropDownItem"><i className="fa-solid fa-wand-magic-sparkles"></i> Personalization</div>
              <div className="dropDownItem"><i className="fa-solid fa-circle-user"></i> Profile</div>
              <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
              <div className="dropDownItem" style={{ borderTop: "1px solid #2f2f2f", marginTop: "5px", paddingTop: "8px" }}><i className="fa-solid fa-circle-question"></i> Help</div>
              
              <div className="dropDownItem" onClick={logoutUser} style={{ color: "#f87171" }}>
                <i className="fa-solid fa-right-from-bracket" style={{ color: "#f87171" }}></i> Log out
              </div>
            </div>
          )}
        </div>

        <Chat />

        <div className="chatInput"> 
          <div className="inputBox">
            <input 
              placeholder="Ask anything"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
            />
            <div id="submit" onClick={getReply}>
              <i className="fa-solid fa-paper-plane" style={{ color: "rgb(255, 255, 255)" }}></i>
            </div>
          </div>
          <p className="info">
            NexaGPT can make mistakes. Check important info. See Cookie Preferences
          </p>
        </div>
      </div>
    </>
  );
}

export default ChatWindow;