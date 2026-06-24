import { useState } from "react";
import { setToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //  REAL-TIME VALIDATION
  const validateField = (name, value) => {
    let error = "";

    if (name === "username") {
      if (!value.trim()) error = "Username is required";
      else if (value.length < 3) error = "Minimum 3 characters";
    }

    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 3) error = "Minimum 3 characters";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });

    validateField(name, value);
  };

  //  LOGIN (UNCHANGED LOGIC)
  const login = async () => {
    if (
      errors.username ||
      errors.password ||
      !form.username ||
      !form.password
    ) {
      alert("Please fix errors first ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.access);
        alert("Login successful");
        navigate("/");
      } else {
        alert("Invalid credentials ❌");
      }
    } catch (err) {
      alert("Server error ❌");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to continue shopping</p>

        {/* USERNAME */}
        <label style={styles.label}>
          Username <span style={styles.star}>*</span>
        </label>
        <input
          name="username"
          placeholder="Enter username"
          value={form.username}
          onChange={handleChange}
          style={styles.input}
        />
        {touched.username && errors.username && (
          <p style={styles.error}>{errors.username}</p>
        )}

        {/* PASSWORD */}
        <label style={styles.label}>
          Password <span style={styles.star}>*</span>
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />
        {touched.password && errors.password && (
          <p style={styles.error}>{errors.password}</p>
        )}

        {/* LOGIN BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGNUP */}
        <p style={styles.link} onClick={() => navigate("/signup")}>
          Don't have an account?{" "}
          <span style={{ color: "#2563eb" }}>Signup</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #eef2ff, #f8fafc)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "350px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: "10px",
    color: "#555",
    fontSize: "14px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
  },
  star: {
    color: "red",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "-5px",
  },
  link: {
    marginTop: "10px",
    fontSize: "14px",
    textAlign: "center",
    cursor: "pointer",
  },
};

export default Login;
