import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import {
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";
function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [username, setUsername] =
    useState("");
  const handleSignup = async (e) => {
    e.preventDefault();

    try {

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = userCredential.user;

  await setDoc(
    doc(db, "users", user.uid),
    {
      name,
      username,
      email,

      createdAt: new Date(),
    }
  );

  alert("Account Created");

} catch (error) {

  alert(error.message);

}
  };

  return (
    <div>
      <h1>Signup</h1>

      <form onSubmit={handleSignup}>
        <input
  type="text"
  placeholder="Full Name"
  onChange={(e) =>
    setName(e.target.value)
  }
/>

<input
  type="text"
  placeholder="Username"
  onChange={(e) =>
    setUsername(e.target.value)
  }
/>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Signup;