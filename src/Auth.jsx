import { useState, useContext } from "react";
import { MyContext } from "./MyContext";
import "./Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { loginUser } = useContext(MyContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const bodyData = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`https://nexagpt-backend.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.error || "Something went wrong");
      }

      if (isLogin) {
        // अगर लॉगिन सफल रहा, तो कॉन्टेक्स्ट का फंक्शन कॉल करें
        loginUser(res.token, res.user);
      } else {
        // अगर साइनअप सफल रहा
        setMessage(res.success);
        setIsLogin(true); // यूजर को लॉगिन स्क्रीन पर भेजें
        setName("");
        setPassword("");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h2>{isLogin ? "Welcome back to NexaGPT" : "Create your account"}</h2>
        
        {error && <p className="authError">{error}</p>}
        {message && <p className="authSuccess">{message}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="inputGroup">
              <label>Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Dhruv Panchal" 
                required 
              />
            </div>
          )}

          <div className="inputGroup">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@example.com" 
              required 
            />
          </div>

          <div className="inputGroup">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className="authBtn">
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="authToggleText">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }}>
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;