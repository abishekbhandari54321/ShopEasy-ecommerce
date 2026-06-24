import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
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

    if (name === "email") {
      if (!value) error = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(value)) error = "Enter valid email";
    }

    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 4) error = "Minimum 4 characters";
    }

    if (name === "password2") {
      if (!value) error = "Confirm your password";
      else if (value !== form.password) error = "Passwords do not match";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });
    setTouched({ ...touched, [name]: true });

    validateField(name, value);
  };

  //  SIGNUP (UNCHANGED LOGIC)
  const signup = async () => {
    if (
      errors.username ||
      errors.email ||
      errors.password ||
      errors.password2 ||
      !form.username ||
      !form.email ||
      !form.password ||
      !form.password2
    ) {
      alert("Fix errors first ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Signup successful ");
        navigate("/login");
      } else {
        alert("Error ❌");
      }
    } catch {
      alert("Server error ❌");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Signup to start shopping</p>

        {/* USERNAME */}
        <label style={styles.label}>
          Username <span style={styles.star}>*</span>
        </label>
        <input
          name="username"
          type="text"
          placeholder="Enter username"
          value={form.username}
          onChange={handleChange}
          style={styles.input}
        />
        {touched.username && errors.username && (
          <p style={styles.error}>{errors.username}</p>
        )}

        {/* EMAIL */}
        <label style={styles.label}>
          Email <span style={styles.star}>*</span>
        </label>
        <input
          name="email"
          type="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />
        {touched.email && errors.email && (
          <p style={styles.error}>{errors.email}</p>
        )}

        {/* PASSWORD */}
        <label style={styles.label}>
          Password <span style={styles.star}>*</span>
        </label>
        <input
          name="password"
          type="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />
        {touched.password && errors.password && (
          <p style={styles.error}>{errors.password}</p>
        )}

        {/* CONFIRM PASSWORD */}
        <label style={styles.label}>
          Confirm Password <span style={styles.star}>*</span>
        </label>
        <input
          name="password2"
          type="password"
          placeholder="Confirm password"
          value={form.password2}
          onChange={handleChange}
          style={styles.input}
        />
        {touched.password2 && errors.password2 && (
          <p style={styles.error}>{errors.password2}</p>
        )}

        {/* BUTTON */}
        <button
          onClick={signup}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating account..." : "Signup"}
        </button>

        {/* LOGIN LINK */}
        <p style={styles.link} onClick={() => navigate("/login")}>
          Already have an account?{" "}
          <span style={{ color: "#2563eb" }}>Login</span>
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
    width: "380px",
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

export default Signup;
