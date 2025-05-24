import { useNavigate } from "react-router-dom";
import logo from "../assets/index";
import { handlerLoginGG } from "../hook/handlerGG";
import { useEffect, useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isLogin = localStorage.getItem("isLogin") === "true"; 

  useEffect(() => {
    if (isLogin) {
      navigate("/", { replace: true }); 
    }
  }, [isLogin, navigate]);

  async function login() {
    try {
      setLoading(true);
      await handlerLoginGG();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-login h-screen flex items-center justify-center">
      <div className="max-w-md p-7 mx-2 sm:mx-auto bg-gray-200 rounded-md shadow-sm">
        <h3 className="text-[30px] py-5 font-medium text-center">Welcome Trello App</h3>

        <div
          onClick={login}
          className="action flex bg-blue-300 justify-around rounded-md shadow-sm h-[50px] my-3 max-w-sm items-center cursor-pointer hover:bg-blue-50 transform ease-linear duration-200"
        >
          {logo.iconGoogle}
          <button className="font-light" disabled={loading}>
            {loading ? "Loading..." : "Login with Google"}
          </button>
        </div>

        <div className="action flex bg-blue-300 justify-around rounded-md shadow-sm h-[50px] my-3 max-w-sm items-center cursor-pointer hover:bg-blue-50 transform ease-linear duration-200">
          {logo.iconFaceBook}
          <button className="font-light">Login with Facebook</button>
        </div>
      </div>
    </div>
  );
}
