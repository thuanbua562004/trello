import { useNavigate } from "react-router-dom";
import logo from "../assets/index";
import { handlerLoginGG } from "../hook/handlerGG";
import { useEffect } from "react";
export default function Login() {
  let navigate = useNavigate();
  async function login() {
    try {
      await handlerLoginGG(); 
      navigate("/"); 
    } catch (err) {
      console.error("Login failed:", err);
    }
  }
  let isLogin = localStorage.getItem('isLogin')
  useEffect(()=>{
    if(isLogin){
      navigate('/')
    }
  },[])

  return (
    <>
      <div className="modal-login h-screen  flex items-center justify-center">
        <div className="max-w-md p-7 mx-2 sm:mx-auto bg-gray-200 bord items-center rounded-md shadow-sm ">
          <div className="div ">
            <h3 className=" mx-auto text-[30px] py-5 font-medium text-center">
              Welcome Trello App
            </h3>
          </div>
          <div
            onClick={login}
            className="action flex bg-blue-300 justify-around rounded-md shadow-sm h-[50px] my-3 max-w-sm
           items-center cursor-pointer hover:bg-blue-50 transform ease-linear duration-200"
          >
            {logo.iconGoogle}
            <button className="font-light">Login width Google</button>
          </div>
          <div
            className="action flex bg-blue-300 justify-around rounded-md shadow-sm h-[50px] my-3 max-w-sm
           items-center cursor-pointer hover:bg-blue-50 transform ease-linear duration-200"
          >
            {logo.iconFaceBook}
            <button className="font-light">Login width Facebook</button>
          </div>
        </div>
      </div>
    </>
  );
}
