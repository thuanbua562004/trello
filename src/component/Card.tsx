import { faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import  { useState } from "react";
import SettingCart from "./SettingCard";

function Card() {
  type Task = {
    id: number;
    value: string;
  };

  type Column = {
    id: string;
    name: string;
    listTask: Task[];
  };

  const [columns, setColumns] = useState<Column[]>([
    {
      id: "today",
      name: "Today",
      listTask: [
        { id: 0, value: "Learn ReactJS" },
        { id: 1, value: "Learn SQL" },
        { id: 2, value: "Learn JavaScript" },
        { id: 3, value: "Learn NodeJS" },
      ],
    },
  ]);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Bắt đầu kéo
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };



  // Khi thả task vào vị trí khác
  const handleDrop = (hoverIndex: number, columnId: string) => {
    if (dragIndex === null) return;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === columnId) {
          const newTasks = [...col.listTask];
          const temp = newTasks[dragIndex];
          newTasks[dragIndex] = newTasks[hoverIndex];
          newTasks[hoverIndex] = temp;

          return { ...col, listTask: newTasks };
        }
        return col;
      })
    );

    setDragIndex(null);
  };

  return (
    <>
    <div className="flex gap-4 p-4">
      {columns.map((column) => (
        <>
          <SettingCart/>
          <div className="relative ">
            <div key={column.id}
              className="w-[272px] max-h-[500px] rounded-lg p-4 shadow-lg bg-gray-300 "
            >
              <div className="flex items-center justify-between mb-2">
                <input
                  className="text-[15px] text-white outline-blue-400 bg-gray-300 px-2"
                  value={column.name}
                  readOnly
                />
                <FontAwesomeIcon
                  icon={faEllipsis}
                  className="cursor-pointer p-1 hover:bg-gray-50 hover:rounded-md"
                />
              </div>

              <div className="box-todo overflow-y-scroll min-h-[400px] scroll-container">
                {column.listTask.map((task, index) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverIndex(index);
                    }}                
                    onDrop={() => handleDrop(index, column.id)}
                    className=" group inline-flex items-center h-[32px] cursor-pointer pb-1 pt-2 mt-2 bg-gray-200 rounded-lg px-3 w-full hover:outline outline-neutral-50">
                    <label className="group-hover:flex hidden items-center relative px-1">
                      <input
                        type="checkbox"
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded-full bg-slate-100 border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                      />
                      <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
                    <h5 className="text-[15px]">{task.value}</h5>
                  </div>
                ))}
              </div>

              <div className="box-add w-full flex items-center px-2 h-[32px] cursor-pointer pb-1 pt-2 my-2 hover:bg-white hover:rounded-lg">
                <FontAwesomeIcon icon={faPlus} />
                <h5 className="pl-2">Add Card</h5>
              </div>
            </div>
          </div>
        </>
      ))}
    </div>
    </>
  );
}

export default Card;
