import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import TaskUpdate from "./TaskUpdate";
import { isValidUrl } from "../until";
import mql from "@microlink/mql";
import type { TaskType } from "../interface";
import { useAppDispatch } from "../Redux/store";
import { removeTaskRedux, updateTaskRedux } from "../Redux/managetdata";

export default function Task({ task, color, idColum }: any) {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({ id: task.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: isDragging ? 9999 : undefined,
    transition: isDragging ? "none" : "transform 300ms ease",
    opacity: isDragging ? 0.7 : 1,
    color: isDragging ? color : "",
  };

  const [dataurl, setDataUrl] = useState<any>(null);
  const [stateUp, setStateUp] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchIsUrl() {
      if (isValidUrl(task.value)) {
        const result = await mql(task.value, { meta: true });
        if (result.data) {
          setDataUrl(result.data);
        }
      }
    }
    fetchIsUrl();
  }, [task.value]);

  const callUpdate = (taskItem: TaskType) => {
    dispatch(updateTaskRedux({ idCol: idColum, idTask: task.id, data: taskItem }));
    setStateUp(false);
  };

  const callRemove = () => {
    dispatch(removeTaskRedux({ idCol: idColum, idTask: task.id }));
    setStateUp(false);
  };

  const renderCheckbox = () => (
    <label className="relative px-1 flex items-center group cursor-pointer">
      <input
        type="checkbox"
        checked={task.state === true}
        onChange={() => callUpdate({ state: !task.state })}
        className={`
          peer h-4 cursor-pointer appearance-none rounded-full bg-slate-100 border border-slate-300
          duration-500 transition-all
          ${task.state ? "w-4" : "w-0 -translate-x-14 group-hover:w-4 group-hover:translate-x-1"}
        `}
      />
      <span
        className={`
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          pointer-events-none transition-opacity duration-200 text-white bg-black rounded-full
          ${task.state ? "opacity-100" : "opacity-0"}
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </label>
  );

  if (stateUp) {
    return <TaskUpdate callRemove={callRemove} callUpdate={callUpdate} setStateUp={setStateUp} task={task} />;
  }

  return isValidUrl(task?.value) ? (
<div
  data-id={task.id}
  draggable
  ref={setNodeRef}
  {...listeners}
  {...attributes}
  style={style}
  className="group items-center cursor-pointer overflow-hidden rounded-lg w-full hover:outline-lime-100 my-2 bg-black/70 text-gray-400 hover:outline hover:outline-2 hover:outline-offset-1 hover:outline-white"
>
  {/* Phần ảnh có thể click để mở link */}
  <a href={task.value} target="_blank" rel="noopener noreferrer">
    <div className="h-[150px]">
      <img
        className="h-full w-full object-cover"
        src={dataurl?.image?.url || "https://kenh14cdn.com/203336854389633024/2021/12/16/photo-1-1639661774854697837985.jpg"}
        alt="Ảnh task"
      />
    </div>
  </a>

  {/* Phần dưới: click để cập nhật */}
  <div
    className="flex flex-col p-2"
    onClick={() => setStateUp(true)}
  >
    <div className="flex items-center mb-1">
      {renderCheckbox()}
      <img className="w-[15px] h-[15px] ml-2" src={dataurl?.logo?.url} alt="Logo" />
      <h5 className="text-[15px] pl-2 select-none truncate">
        {dataurl?.title}
      </h5>
    </div>
    <span className="text-[12px] truncate block w-full">
      {dataurl?.description}
    </span>
  </div>
</div>

  ) : (
    <div
      draggable
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    className="flex items-center cursor-pointer rounded-lg w-full px-2 my-2 bg-black/70 text-gray-400 hover:outline hover:outline-2 hover:outline-offset-1 hover:outline-white"
    >
      {renderCheckbox()}
      <h5 onClick={() => setStateUp(true)} className="text-[15px] pl-2 select-none w-full py-2">
        {task.value}
      </h5>
    </div>
  );
}
