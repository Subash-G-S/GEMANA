import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import AuthLayout from "../components/AuthLayout";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
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

  toast.success("Account Created");

} catch (error) {

  toast.error(error.message);

}
  };

  return (
    <div>
      <AuthLayout
  title="Create Account"
  subtitle="Start building your freelancer reputation."
>

  <form
    onSubmit={handleSignup}
    className="space-y-5"
  >

    <input
      type="text"
      placeholder="Full Name"
      onChange={(e) =>
        setName(e.target.value)
      }
      className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:border-black"
    />

    <input
      type="text"
      placeholder="Username"
      onChange={(e) =>
        setUsername(e.target.value)
      }
      className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:border-black"
    />

    <input
      type="email"
      placeholder="Email"
      onChange={(e) =>
        setEmail(e.target.value)
      }
      className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:border-black"
    />

    <input
      type="password"
      placeholder="Password"
      onChange={(e) =>
        setPassword(e.target.value)
      }
      className="w-full border border-gray-300 rounded-2xl p-4 outline-none focus:border-black"
    />

    <button
      type="submit"
      className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:scale-[1.01] transition-all"
    >
      Create Account
    </button>
    <p className="text-center text-gray-500 pt-2" >
      Already have an account?

  <Link
    to="/"
    className="text-black font-semibold ml-2 hover:underline"
  >
    Login
  </Link>
    </p>
  </form>

</AuthLayout>
    </div>
  );
}

export default Signup;