import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await api.post("/auth/register", form);
    alert("Registration successful. Please login.");
    navigate("/login");
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Register</h2>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      {/* 🔥 ROLE SELECTION */}
      <div>
        <label>
          <input
            type="radio"
            name="role"
            value="user"
            checked={form.role === "user"}
            onChange={handleChange}
          />
          Customer
        </label>

        <label>
          <input
            type="radio"
            name="role"
            value="seller"
            checked={form.role === "seller"}
            onChange={handleChange}
          />
          Seller
        </label>
      </div>

      <button type="submit">Register</button>
    </form>
  );
}
