// import React, { useState, useEffect } from "react";
// import { db } from "./firebase";
// import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

// const FireChecker = () => {
//   const [count, setCount] = useState(0);
//   const [eventData, setEventData] = useState(null); // start as null
//   const [formData, setFormData] = useState({ name: "", email: "" });

//   const eventDocRef = doc(db, "events", "event1");

//   // Fetch event data on mount
//   useEffect(() => {
//   const fetchEvent = async () => {
//     try {
//       const docSnap = await getDoc(doc(db, "events", "event1"));
//       if (docSnap.exists()) {
//         console.log("Event data fetched:", docSnap.data());
//         setEventData(docSnap.data());
//         setCount(docSnap.data().registered ?? 0);
//       } else {
//         console.log("Document event1 does NOT exist!");
//       }
//     } catch (err) {
//       console.error("Firestore fetch error:", err);
//     }
//   };
//   fetchEvent();
// }, []);

//   // Wait until eventData is loaded
//   if (!eventData) {
//     return <p>Loading event details...</p>;
//   }

//   const isDeadlineOver = new Date() > new Date(eventData.deadline);
//   const isFull = count >= (eventData.capacity ?? 0);
//   const registrationClosed = isFull || isDeadlineOver;

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (registrationClosed) return;

//     // 1️⃣ Send to Web3Forms
//     const payload = {
//       access_key: import.meta.env.VITE_WEB3FORMS_KEY,
//       name: formData.name,
//       email: formData.email,
//       subject: "FireChecker Event Registration",
//       from_name: formData.name
//     };

//     try {
//       const res = await fetch("https://api.web3forms.com/submit", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//       const data = await res.json();
//       if (!data.success) throw new Error("Web3Forms submission failed");
//     } catch (err) {
//       console.error("Web3Forms error:", err);
//       alert("Registration failed via Web3Forms. Try again.");
//       return;
//     }

//     // 2️⃣ Increment 'registered' in Firestore
//     try {
//       await updateDoc(eventDocRef, {
//         registered: increment(1)
//       });
//       setCount(prev => prev + 1);
//       setFormData({ name: "", email: "" });
//       alert("Registration Successful!");
//     } catch (err) {
//       console.error("Firebase error:", err);
//       alert("Failed to update registration in Firebase.");
//     }
//   };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>🔥 {eventData.name || "Event"} Registration</h2>
//       <p>Slots: {count} / {eventData.capacity}</p>

//       {registrationClosed && <p style={{ color: "red" }}>Registration Closed</p>}
//       {isDeadlineOver && <p style={{ color: "orange" }}>Deadline Over</p>}

//       <form onSubmit={handleSubmit}>
//         <input
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />
//         <input
//           name="email"
//           placeholder="Email"
//           type="email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />
//         <button disabled={registrationClosed}>Register</button>
//       </form>
//     </div>
//   );
// };

// export default FireChecker;














// import React, { useState, useEffect } from "react";
// import { db } from "./firebase";
// import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// const FireChecker = () => {
//   const [count, setCount] = useState(0);
//   const [eventData, setEventData] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     teamName: "" // <-- new field added
//   });

//   const eventDocRef = doc(db, "events", "event1");

//   // Fetch event data
//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const docSnap = await getDoc(eventDocRef);
//         if (docSnap.exists()) {
//           console.log("Event data fetched:", docSnap.data());
//           setEventData(docSnap.data());
//           setCount(docSnap.data().registered ?? 0);
//         } else {
//           console.log("Document event1 does NOT exist!");
//         }
//       } catch (err) {
//         console.error("Firestore fetch error:", err);
//       }
//     };
//     fetchEvent();
//   }, []);

//   if (!eventData) return <p>Loading event details...</p>;

//   const isDeadlineOver = new Date() > new Date(eventData.deadline);
//   const isFull = count >= (eventData.capacity ?? 0);
//   const registrationClosed = isFull || isDeadlineOver;

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (registrationClosed) return;

//     // 1️⃣ Send to Web3Forms
//     const payload = {
//       access_key: import.meta.env.VITE_WEB3FORMS_KEY,
//       name: formData.name,
//       email: formData.email,
//       subject: `${eventData.name} Registration`,
//       from_name: formData.name,
//       // include extra fields in Web3Forms submission
//       teamName: formData.teamName
//     };

//     try {
//       const res = await fetch("https://api.web3forms.com/submit", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//       const data = await res.json();
//       if (!data.success) throw new Error("Web3Forms submission failed");
//     } catch (err) {
//       console.error("Web3Forms error:", err);
//       alert("Registration failed via Web3Forms. Try again.");
//       return;
//     }

//     // 2️⃣ Update Firestore
//     try {
//       // Store registration as an array of objects
//       await updateDoc(eventDocRef, {
//         registered: count + 1,
//         registrations: arrayUnion({
//           name: formData.name,
//           email: formData.email,
//           teamName: formData.teamName,
//           timestamp: new Date()
//         })
//       });
//       setCount(prev => prev + 1);
//       setFormData({ name: "", email: "", teamName: "" });
//       alert("Registration Successful!");
//     } catch (err) {
//       console.error("Firebase error:", err);
//       alert("Failed to update registration in Firebase.");
//     }
//   };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>🔥 {eventData.name || "Event"} Registration</h2>

//       {/* Display all event fields dynamically */}
//       <div style={{ marginBottom: "20px" }}>
//         {Object.entries(eventData).map(([key, value]) => {
//           if (key === "registered" || key === "registrations") return null;
//           return (
//             <p key={key}>
//               <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
//             </p>
//           );
//         })}
//       </div>

//       <p>Slots: {count} / {eventData.capacity}</p>
//       {registrationClosed && <p style={{ color: "red" }}>Registration Closed</p>}
//       {isDeadlineOver && <p style={{ color: "orange" }}>Deadline Over</p>}

//       <form onSubmit={handleSubmit}>
//         <input
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />
//         <input
//           name="email"
//           placeholder="Email"
//           type="email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />
//         <input
//           name="teamName"
//           placeholder="Team Name"
//           value={formData.teamName}
//           onChange={handleChange}
//           required
//         />
//         <br /><br />
//         <button disabled={registrationClosed}>Register</button>
//       </form>
//     </div>
//   );
// };

// export default FireChecker;
















import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

const FireChecker = () => {
  const [count, setCount] = useState(0);
  const [eventData, setEventData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    teamName: "" // extra field
  });

  const eventDocRef = doc(db, "events", "event1");

  // Fetch event data on mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docSnap = await getDoc(eventDocRef);
        if (docSnap.exists()) {
          console.log("Event data fetched:", docSnap.data());
          setEventData(docSnap.data());
          setCount(docSnap.data().registered ?? 0);
        } else {
          console.log("Document event1 does NOT exist!");
        }
      } catch (err) {
        console.error("Firestore fetch error:", err);
      }
    };
    fetchEvent();
  }, []);

  if (!eventData) return <p>Loading event details...</p>;

  // Parse deadline including time
  const deadlineDate = new Date(eventData.deadline);
  const now = new Date();
  const isDeadlineOver = now > deadlineDate;
  const isFull = count >= (eventData.capacity ?? 0);
  const registrationClosed = isFull || isDeadlineOver;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (registrationClosed) return;

    // 1️⃣ Send to Web3Forms
    const payload = {
      access_key: import.meta.env.VITE_WEB3FORMS_KEY,
      name: formData.name,
      email: formData.email,
      subject: `${eventData.name} Registration`,
      from_name: formData.name,
      teamName: formData.teamName
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) throw new Error("Web3Forms submission failed");
    } catch (err) {
      console.error("Web3Forms error:", err);
      alert("Registration failed via Web3Forms. Try again.");
      return;
    }

    // 2️⃣ Update Firestore
    try {
      await updateDoc(eventDocRef, {
        registered: count + 1,
        registrations: arrayUnion({
          name: formData.name,
          email: formData.email,
          teamName: formData.teamName,
          timestamp: new Date()
        })
      });
      setCount(prev => prev + 1);
      setFormData({ name: "", email: "", teamName: "" });
      alert("Registration Successful!");
    } catch (err) {
      console.error("Firebase error:", err);
      alert("Failed to update registration in Firebase.");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>🔥 {eventData.name || "Event"} Registration</h2>

      {/* Display all event fields dynamically */}
      <div style={{ marginBottom: "20px" }}>
        {Object.entries(eventData).map(([key, value]) => {
          if (key === "registered" || key === "registrations") return null;
          return (
            <p key={key}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
            </p>
          );
        })}
      </div>

      {/* Show formatted deadline */}
      <p>
        Registration closes on:{" "}
        {deadlineDate.toLocaleString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <p>Slots: {count} / {eventData.capacity}</p>
      {registrationClosed && <p style={{ color: "red" }}>Registration Closed</p>}
      {isDeadlineOver && !isFull && <p style={{ color: "orange" }}>Deadline Over</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br /><br />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br /><br />
        <input
          name="teamName"
          placeholder="Team Name"
          value={formData.teamName}
          onChange={handleChange}
          required
        />
        <br /><br />
        <button disabled={registrationClosed}>Register</button>
      </form>
    </div>
  );
};

export default FireChecker;