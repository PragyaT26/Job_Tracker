import { useState } from "react";
import { api } from "./api";

export default function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const path = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const data = await api(path, "POST", { email, password });
      localStorage.setItem("token", data.token); // remember the login
      localStorage.setItem("email", data.email);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-box">
      <h1>Job Tracker</h1>
      <p className="muted">{isSignup ? "Create your account" : "Login to your account"}</p>

      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{isSignup ? "Sign up" : "Login"}</button>
      </form>

      <p className="muted">
        {isSignup ? "Already have an account? " : "New here? "}
        <a href="#" onClick={(e) => { e.preventDefault(); setIsSignup(!isSignup); setError(""); }}>
          {isSignup ? "Login" : "Sign up"}
        </a>
      </p>
    </div>
  );
}
