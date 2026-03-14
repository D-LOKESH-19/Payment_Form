import React, { useState } from "react";
import { WEB3FORMS_KEY } from "./config";


const FireChecker = () => {

  const maxSlots = 5;
  const deadline = new Date("2026-03-20");

  const [count, setCount] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  const today = new Date();

  const isDeadlineOver = today > deadline;
  const isFull = count >= maxSlots;
  const registrationClosed = isFull || isDeadlineOver;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (registrationClosed) return;

    const payload = {
      access_key: WEB3FORMS_KEY,
      name: formData.name,
      email: formData.email,
      subject: "FireChecker Test Registration",
      from_name: formData.name
    };

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      alert("Registration Successful");

      setCount(prev => prev + 1);

      setFormData({
        name: "",
        email: ""
      });
    }
  };

  return (
    <div style={{ padding: "40px" }}>

      <h2>🔥 FireChecker Event Registration</h2>

      <p>Slots: {count} / {maxSlots}</p>

      {registrationClosed && (
        <p style={{ color: "red" }}>
          Registration Closed
        </p>
      )}

      {isDeadlineOver && (
        <p style={{ color: "orange" }}>
          Deadline Over
        </p>
      )}

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <br/><br/>

        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <br/><br/>

        <button disabled={registrationClosed}>
          Register
        </button>

      </form>

    </div>
  );
};

export default FireChecker;