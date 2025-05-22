import { faClose, faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Task from "./Task";
import { useSortable } from "@dnd-kit/sortable";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import SettingCard from "./SettingCard";
import hexToRGBA from "../until";
import { useAppDispatch } from "../Redux/store";
import { addTaskRedux, updateColumRedux } from "../Redux/managetdata";
import type { Column, TaskType } from "../interface";
import { useParams } from "react-router-dom";
import { DndContext } from "@dnd-kit/core";

export default function Column({ column  ,addValue   }: any) {
  const [input ,setInput]= useState('')
  const [stateAdd ,setSateAdd]= useState(false)
  const [stateOpenSetting ,setStateOpenSetting]= useState(false)
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [color,setColor] = useState<string>('')
  let dispatch = useAppDispatch()
  let param = useParams()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, 
    backgroundcolor: isDragging ? color : "#E2DBDB"

  };

function handlerAddValue() {
  if(input && addValue){
    addValue({idCol : column.id , value : input })
    dispatch(addTaskRedux({id:column.id ,value:input}))
    setInput('')
  }
  setInput('')
  setSateAdd(false)
}
function handSettingColum (){
  setStateOpenSetting(!stateOpenSetting)
}
function CallRef(node: HTMLElement | null) {
  setRef(node);
}
useEffect(()=>{
 function handleMouseDown(e: MouseEvent) {
      let target =e.target as Node
      if (ref && !ref.contains(target)) {
        setStateOpenSetting(false)
      }

    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
})
function setColorBackground(color:string) {
setColor(color)
  if(!column.id) return
  dispatch(updateColumRedux({id:column.id, color:color}))
}
useEffect(()=>{
  setColor(column.color)
},[column.color])
  return (
    <>
    <div className="relative  ">
      <SettingCard CallRef={CallRef}  setColorBackground={setColorBackground} setSateAdd={setSateAdd} stateOpenSetting={stateOpenSetting}/>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="items-start flex gap-4 p-4">
      <div 
      style={{ backgroundColor: hexToRGBA(color || '#E2DBDB',0.95) }}
      data-no-drop
      className= {`select-none  w-[272px] max-h-[500px] rounded-lg p-4 shadow-lg `}>
        <div className="no-drop select-none flex rounded-lg items-center justify-between mb-2">
          <input
            style={{backgroundColor:color? color  :'#E2DBDB'}}
            className={`no-drop text-[15px] rounded-lg text-white outline-blue-400  px-2`}
            value={column.name}
            readOnly
          />
        <div onClick={handSettingColum}>
          <FontAwesomeIcon
            icon={faEllipsis}
            className="cursor-pointer p-1 hover:bg-gray-50 hover:rounded-md"
          />
        </div>
        </div>
        <SortableContext
            items={column?.listTask?.map((t: any) => t.id)}
            strategy={verticalListSortingStrategy}
            
          >
            <div id="drop-zone" className="drop-zone box-todo overflow-y-scroll max-h-[330px] scroll-container">
            {column?.listTask?.map((item: TaskType) => (
              <Task  color={color} idColum={column.id} key={item.id} task={item} />
            ))}

        </div>
        </SortableContext>
            
          {!stateAdd? <div data-no-drop onClick={()=>setSateAdd(true)} className="box-add w-full flex items-center px-2 h-[32px] cursor-pointer my-2 hover:bg-white hover:rounded-lg">
          <FontAwesomeIcon icon={faPlus} />
          <h5 className="select-none pl-2 text-[15px]">Add Task</h5>
          </div>:""}



          {stateAdd ?<div data-no-drop className="input-add pt-3">
              <input className="h-[45px] w-full rounded-lg text-[15px] px-3 outline-blue-400" onChange={(e)=>setInput(e.target.value)} type="text" value={input} placeholder="Typing title or link" />
              <div className="action flex items-center py-3">
                <button onClick={handlerAddValue} className="btn hover:opacity-80 font-light   text-[15px] text-white bg-blue-500 h-[40px] w-[90px] text-center rounded-md">Add</button>
                <p onClick={()=>setSateAdd(false)}><FontAwesomeIcon  className="p-3" onClick={handlerAddValue} icon={faClose}></FontAwesomeIcon></p>
              </div>
            </div> :""}
      </div>
    </div>
    </div>

    </>
  );
}
