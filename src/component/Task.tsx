import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import TaskUpdate from "./TaskUpdate";
import { isValidUrl } from "../until";
import mql from '@microlink/mql'
import  { Link, useParams } from "react-router-dom";
import type { TaskType } from "../interface";
import { updateTask } from "../hook/databse";
import { useAppDispatch } from "../Redux/store";
import { updateTaskRedux } from "../Redux/managetdata";
export default function Task({ task ,color , idColum}:any) {
const { attributes, isDragging,listeners, setNodeRef, transform  } = useSortable ({
    id: task.id,
  });
const style = {
  transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  zIndex: isDragging ? 9999 : undefined,
  transition: isDragging ? "none" : "transform 300ms ease",
  opacity: isDragging ? 0.7 : 1, 
  color : isDragging ? color : '', 
};
const [dataurl ,setdataurl] = useState<any>('')
let [stateUp, setStateUp] = useState<boolean>(false)
let dispatch = useAppDispatch()
async function fetchIsUrl() {
  let check = isValidUrl(task.value)
  if(check){
    const result = await mql(task.value, { meta: true})
    if(result.data){
      setdataurl(result?.data)
    }
  }
}
useEffect(()=>{
  fetchIsUrl()
},[])
async function callDate(taskItem :TaskType) {
  console.log('task call up')
  dispatch(updateTaskRedux({idCol:idColum , idTask:task.id , data : taskItem}))
  setStateUp(false)
}
  return (
    <>
      {stateUp? <TaskUpdate callData={callDate} setStateUp={setStateUp}  task={task}/>:""}

      {isValidUrl(task?.value)?
        <a href={task?.value} target="_blank" rel="noopener noreferre">
          <div
          data-id={task.id}
          draggable
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          style={style}
          className="-z-10 group  items-center cursor-pointer overflow-hidden  rounded-lg w-full hover:outline-lime-100 my-2 bg-black/70 text-gray-400"
        >
          <div className="h-[150px] shrink-0">
            <img
              className="h-full w-full object-cover z-10 "
              src={dataurl?.image?.url  ||'https://kenh14cdn.com/203336854389633024/2021/12/16/photo-1-1639661774854697837985.jpg'}
              alt="Ảnh task"
            />
          </div>
          <div className="flex items-center">
<label className="relative px-1 flex items-center group cursor-pointer">
  <input
    type="checkbox"
    checked={task.state === true}
    onChange={(e)=>callDate({state : task.state == true ? false : true })}
    className={`
      peer 
      h-4 cursor-pointer appearance-none rounded-full bg-slate-100 border border-slate-300
      duration-500
      
      transition-all
      ${task.state== true ? "w-4 ":"w-0  -translate-x-14 group-hover:w-4  group-hover:translate-x-1"}
    `}
  />
  <span
    className={`
      absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
      pointer-events-none
      transition-opacity duration-200
      text-white bg-black rounded-full
      ${task.state === true ? 'opacity-100' : 'opacity-0'}
    `}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  </span>
</label>

          <div className=" flex items-center pl-1">
          <img className="w-[15px] h-[15px]" src={dataurl?.logo?.url}/>
          <h5
            onClick={() => setStateUp(task.state == true ? false :true)}
            className="text-[15px] pl-2 select-none w-full py-1 block truncate"
          >
          {dataurl?.title}
          </h5>
          </div>
          </div>
          <span className="pl-2 text-[12px] truncate block w-full">{dataurl.description}</span>

        </div>
        </a>

          :
      <div
      draggable
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`-z-10  group inline-flex items-center  cursor-pointer px-2} 
       rounded-lg  w-full hover:outline-lime-100 my-2 bg-black/70 text-gray-400`}
    >
<label className="relative px-1 flex items-center group cursor-pointer">
  <input
    type="checkbox"
    checked={task.state === true}
    onChange={(e)=>callDate({state : task.state == true ? false : true })}
    className={`
      peer 
      h-4 cursor-pointer appearance-none rounded-full bg-slate-100 border border-slate-300
      duration-400
      
      transition-all
      ${task.state== true ? "w-4 translate-x-[3px]":"w-0  -translate-x-14 group-hover:w-4  group-hover:translate-x-1"}
    `}
  />
  <span
    className={`
      absolute top-1/2 left-1/2 transform -translate-x-1 -translate-y-1/2
      pointer-events-none
      transition-opacity duration-200
      text-white bg-black rounded-full
      ${task.state === true ? 'opacity-100' : 'opacity-0'}
    `}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  </span>
</label>



          <h5
            onClick={(e) => setStateUp(true)}
            className="text-[15px] pl-2 select-none w-full py-2"
          >
            {task.value}
          </h5>
    </div>
          }

    </>
  );
}
