import {useEffect, useState } from "react";
import type { Profile, SettingItem } from "../interface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faArrowLeft, faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { handerLogout } from "../hook/handlerGG";
import { useNavigate } from "react-router-dom";
import { addClassDarkMode } from "../until";
interface SettingProps {
  handCallRef: React.RefCallback<HTMLDivElement> | React.RefObject<HTMLDivElement> | null;
  stateOpen: boolean;
}

function Setting({handCallRef ,stateOpen}: SettingProps) {
const [storedProfile, setStoredProfile] = useState<Profile | null>(null);

const [setting ,setSetting] = useState<SettingItem[][]>([[
  {id :"1",to:"" ,name:"Acount"},
  {id :"2",to:"" ,name:"Opration"},
  {id :"3",to:"" ,name:"Board"},
  {id :"4",to:"" ,name:"Setting"},
  {id :"5",to:"" ,name:"Theme" , children :[{id:"8",to:"",name:"Light" },{id:"9",to:"",name:"Dark"}]},
  {id :"6",to:"" ,name:"Help"},
  {id :"7",to:"" ,name:"Logout"},
]])

const [stateTheme , setStateTheme ] = useState<{theme:string}>({theme:'light'})
let navigete =useNavigate()
function handerSetting(item:SettingItem) {
  if(item.children){
    setSetting([...setting ,item.children])
  }else{
    if(item.name=="Light" || item.name=="Dark"){
      localStorage.setItem('isMode' , item.name =='Dark' ? 'dark' : 'light')
      setStateTheme({theme:item.name})
    }
    if(item.name=='Logout'){
      handerLogout()
      navigete('/login')
    }
    return
  }
}
function handBack() {
  if(setting.length==0) return
    setSetting(prev => prev.slice(0, -1));
}

useEffect(()=>{
  addClassDarkMode()
},[stateTheme])
  useEffect(()=>{
const stored = localStorage.getItem("userProfile");

if (stored) {
  const storedProfile = JSON.parse(stored);
  setStoredProfile(storedProfile)
}
  },[])

let renderSetting = setting[setting.length-1]?.map((item)=>(
        <li key={item.id} onClick={()=>handerSetting(item)} className="px-2 dark:text-gray-200  flex items-center w-full py-1 rounded-md transform duration-200 hover:opacity-70 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500">
            <button
              type="button"
              className="w-full text-left hover:text-gray-900 focus:outline-none "
            >
              {item?.name}
            </button>
              {item?.children? <FontAwesomeIcon className="font-light" icon={faArrowRight}></FontAwesomeIcon> :""}
              {stateTheme.theme == item.name ? <FontAwesomeIcon className="font-light" icon={faCheck}></FontAwesomeIcon> :""}

          </li>
))
  return (
    <>
      {stateOpen ?       <div
        ref={handCallRef}
        className="dark:bg-bg-dark z-10 bg-white rounded-xl w-full max-w-xs p-6 text-gray-700 text-base leading-relaxed absolute top-12 right-6 shadow-xl"
        style={{ fontFeatureSettings: '"liga" 0' }}
      >
        <div className="mb-4">
          <h3 className="text-xs font-semibold dark:text-gray-200 text-gray-600 uppercase select-none">
            TÀI KHOẢN
          </h3>
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <img
            className="flex items-center justify-center rounded-full bg-[#1B2B44] dark:text-gray-200 text-white font-semibold w-10 h-10 text-sm select-none"
            src={storedProfile?.img}
         >
          </img>
          <div className="flex flex-col">
            <span className="font-medium dark:text-gray-200 text-gray-900 leading-tight">
              {storedProfile?.name}
            </span>
            <span className="text-xs dark:text-gray-200 text-gray-600 leading-tight select-text">
              {storedProfile?.email}
            </span>
          </div>
        </div>

        <hr className="border-gray-300 mb-4" />

        <div className="mb-4">
          <h3 className="text-xs dark:text-gray-200 font-semibold text-gray-600 uppercase select-none mb-2">
            TRELLO
          </h3>
          {setting.length>1 ?
          <h3 onClick={handBack} className="text-xs cursor-pointer  font-semibold text-gray-600 uppercase select-none mb-2  bg-slate-300 px-2 rounded-md">
           <FontAwesomeIcon className="py-2  text-start" icon={faArrowLeft}></FontAwesomeIcon> 
          </h3>: ""}

          <ul className="space-y-2 text-gray-700">
            {renderSetting}
          </ul>
        </div>

      </div> :""}
    </>
  );
}

export default Setting;
