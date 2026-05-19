import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import toast from "react-hot-toast";
function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
    toast.success("Welcome back !");
  };

  return (
    <div>
      

      <AuthLayout
  title="Welcome Back"
  subtitle="Login to access your dashboard."
>

  <form
    onSubmit={handleLogin}
    className="space-y-5"
  >

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
      Login
    </button>
    <p className="text-center text-gray-500 pt-2" >
      Dont have an account?

  <Link
    to="/signup"
    className="text-black font-semibold ml-2 hover:underline"
  >
    Signup
  </Link>
    </p>
  </form>

</AuthLayout>

      
    </div>
  );
}

export default Login;