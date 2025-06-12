import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    login(username.trim());
    navigate("/"); // Redirect to main page
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          autoFocus
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 320,
    margin: "100px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 6,
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    marginTop: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    fontSize: 16,
    borderRadius: 4,
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
  },
};
