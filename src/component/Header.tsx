import { faMattressPillow, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Setting from "./Setting";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Profile } from "../interface";

export default function Header() {
  const [storedProfile, setStoredProfile] = useState<Profile | null>(null);

  const [stateOpen, setStateOpen] = useState<boolean>(false);
  const refAccount = useRef<HTMLElement | null>(null);

  const toggleMenu = () => setStateOpen(prev => !prev);
  const closeMenu = () => setStateOpen(false);

  function handCallRef(el: HTMLElement | null) {
    refAccount.current = el;
  }

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (refAccount.current && !refAccount.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);
  useEffect(()=>{
  let storedProfile = localStorage.getItem("userProfile");
  if(storedProfile){
    setStoredProfile(JSON.parse(storedProfile))
  }
  },[])
  return (
    <>
      <Setting handCallRef={handCallRef} stateOpen={stateOpen} />
      <div className="dark:bg-bg-dark header flex justify-between h-[50px] w-full bg-white px-2 shadow-lg">
        <Link to={'/'} className="logo flex items-center w-2/12">
          <FontAwesomeIcon className="text-[28px] text-black" icon={faMattressPillow} />
          <p className="text-black select-none font-medium ml-2">Trello</p>
        </Link>
        <div className="search hidden md:flex w-9/12 mx-20 items-center justify-end cursor-pointer">
          <div className="flex items-center w-full h-[32px] bg-black/30 backdrop-blur-sm hover:bg-black/40 my-2 rounded-md transition-colors duration-200">
            <FontAwesomeIcon className="p-3 text-gray-500" icon={faSearch} />
            <input
              type="text"
              className="h-[25px]  outline-none bg-transparent w-full text-sm placeholder-gray-200 placeholder-black-500"
              placeholder="Search"
            />
          </div>
          <button className="w-[75px] rounded-sm text-[13px] h-[32px] text-black font-medium bg-black/30 mx-3 hover:bg-black/50 my-2">
            Create
          </button>
        </div>
        <div onClick={toggleMenu} className="action flex items-center w-3/12 justify-end relative">
          <div className="w-8 h-8 hover:bg-gray-200 dark:hover:bg-gray-400 flex items-center justify-center rounded-lg">
            <img
              loading="lazy" 
              className="w-[25px] h-[25px] object-cover rounded-full cursor-pointer"
              src={storedProfile?.img}
              alt="User avatar"
            />
          </div>
        </div>
      </div>
    </>
  );
}
