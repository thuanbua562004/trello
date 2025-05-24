import { useState } from "react";
import hexToRGBA from "../until";
import { useAppDispatch } from "../Redux/store";
import { addBoardRedux } from "../Redux/managetdata";

export default function SettingBoard({refSettingBoard , stateSetting ,setStateSetting} :any) {
  type formCreate ={
    name :string ,
    background:string
  }
  let dispatch = useAppDispatch()
  const [formCreate ,setFormCreate] = useState<formCreate>({
    name:"",
    background:"https://storage.googleapis.com/a1aa/image/a21b7d01-b6e0-4167-78b4-18491e87942c.jpg",
  })
  const colorsHex = [
  '#bfdbfe',  
  '#3b82f6',      
  '#1e40af',     
  '#7c3aed',      
  '#f472b6',          
];
const imageIds = [
  'https://storage.googleapis.com/a1aa/image/5c1f8616-5d6a-4e5d-532f-0b29a380adae.jpg',
  'https://storage.googleapis.com/a1aa/image/4d8cf869-6dd1-4b48-208c-ca7ae0081294.jpg',
  'https://storage.googleapis.com/a1aa/image/7806c1ac-5e14-479b-b1d1-e4c3e201e124.jpg',
];

  function setForm(item:string ,type?:string) {
    if(type=='name'){
     setFormCreate((pre) => ({ ...pre, name: item }));
    }else{
     setFormCreate((pre) => ({ ...pre, background: item }));

    }
  }
  async function submitCreate(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    let id = localStorage.getItem('isLogin')
    let userID = String(localStorage.getItem('isLogin'))
    const boardId = `${id}_${Math.floor(Math.random()*100000)}`;

    dispatch(addBoardRedux({ id :boardId, userId:userID,name:formCreate.name, background :formCreate.background }))
    setStateSetting(false)
  }
  return (
    <>
<div ref={refSettingBoard} className={`dark:bg-bg-dark shadow-xl z-30 max-w-xs w-full mx-auto p-3 fixed top-1/2 left-1/2 transform -translate-x-1/2
  ease-out duration-200    ${stateSetting ? "-translate-y-1/2 opacity-100" : "translate-y-[500px] opacity-0 pointer-events-none"} shadow-lg rounded-lg bg-white`}>
  {/* Header */}
  <div className="flex items-center justify-between mb-2">
    <button aria-label="Back" className="text-gray-400 hover:text-gray-600">
      <i className="fas fa-chevron-left text-base"></i>
    </button>
    <h1 className=" text-center flex-grow text-gray-700 font-semibold text-base">
      Tạo bảng
    </h1>
    <button aria-label="Close" className="text-gray-400 hover:text-gray-600">
      <i className="fas fa-times text-base"></i>
    </button>
  </div>

  {/* Illustration */}
  <div className="bg-blue-100 rounded-lg p-2 mb-3 flex justify-center">
    {formCreate?.background.length>10 ?    
    <img
      alt="Board illustration"
      className="w-full h-[50px] object-cover select-none"
      draggable="false"
      src={formCreate?.background}
    /> :
    <div style={{backgroundColor:hexToRGBA(formCreate.background)}} className="w-full h-[50px] object-cover select-none"></div>}

  </div>

  {/* Background image row */}
  <div className="flex space-x-1 mb-2 justify-center">
    {imageIds.map((item,index)=>(
        <img key={index} onClick={()=>setForm(item)} className="w-10 h-10 rounded-md object-cover cursor-pointer"
        src={`${item}`}
        />
    ))}

  </div>

  {/* Color swatches */}
  <div className="flex space-x-1 mb-4 justify-center">
    {colorsHex.map((item,index)=>(
      <button key={index} onClick={()=>setForm(item)} style={{backgroundColor:hexToRGBA(item)}} className="w-10 h-10 rounded-md "></button>
    ))}
  </div>

  {/* Form */}
  <form className="space-y-2">
    <div>
      <label
        htmlFor="title"
        className="block dark:bg-bg-dark text-gray-800 font-medium mb-1 text-sm"
      >
        Tiêu đề bảng <span className="text-red-600">*</span>
      </label>
      <input
        onChange={(e)=>setForm(e.target.value ,'name')}
        id="title"
        placeholder="Tiêu đề bảng"
        required
        className="dark:bg-bg-dark w-full border border-red-600 rounded-md px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
        type="text"
      />
    </div>
    <p className="text-gray-700 text-xs flex items-center gap-1">
      <span className="dark:bg-bg-dark text-xl select-none">👋</span> Tiêu đề bảng là bắt buộc
    </p>
    <div>
      <label
        htmlFor="view-permission"
        className="block text-gray-800 font-medium mb-1 text-sm"
      >
        Quyền xem
      </label>
      <select
        id="view-permission"
        className="w-full border dark:bg-bg-dark hover:bg-gray-400 border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option>Không gian làm việc</option>
      </select>
    </div>
    <button
      disabled={formCreate.name==""? true : false}
      onClick={submitCreate}
      className="w-full cursor-pointer hover:bg-gray-400 bg-gray-300 text-back font-medium py-1.5 rounded-md text-sm "
    >
      Tạo mới
    </button>
  </form>
</div>

    </>
  );
}
