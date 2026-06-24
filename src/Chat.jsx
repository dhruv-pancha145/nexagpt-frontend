import "./Chat.css";
import { useContext, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import Loader from "./Loader.jsx";  
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

function Chat() {
  const { newChat, messages, isLoading, displayedReply, isTyping } = useContext(MyContext);
  const bottomRef = useRef(null);  

  useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: "auto" });


  }, [messages, isLoading, displayedReply]);

  return (
    <>
      {newChat && <h1 className="newChatMsg">Start a New Chat!</h1>}
      <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", minHeight: 0 }}>
        <div className="chats">

          {messages?.map((chat, idx) => {
            const isLastAssistant = chat.role === "assistant" && idx === messages.length - 1;
            const contentToShow = (isLastAssistant && isTyping) ? displayedReply : chat.content;

            return (
              <div className={chat.role === "user" ? "userdiv" : "gptdiv"} key={idx}>
                {chat.role === "user" ? (
                  <p className="userMessage">{chat.content}</p>
                ) : (
                  <div className="gptMessage">
                    <ReactMarkdown components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div"
                            customStyle={{ width: "100%", overflowX: "auto", margin: 0 }}>
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code style={{ background: "#323232", padding: "2px 6px", borderRadius: "4px" }} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}>
                      {contentToShow}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            );
          })} 

          {isLoading && (
            <div className="loaderWrapper">
              <Loader />
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>
      </div>
    </>
  );
}

export default Chat;