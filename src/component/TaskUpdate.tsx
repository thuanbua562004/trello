import React, { useEffect, useState } from "react";
import { faClose, faUserPlus, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import type { TaskType } from "../interface";

type Props = {
  setStateUp: Function;
  task: TaskType;
  callUpdate: Function;
  callRemove: Function;
};

function formatDateInput(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
}

export default function TaskUpdate({ setStateUp, task, callUpdate, callRemove }: Props) {
  const [stateDes, setStateDes] = useState(false);
  const [deadlineDay, setDeadlineDay] = useState<string>("");

  const [value, setValue] = useState<TaskType>({
    date: formatDateInput(task.date),
    img: "",
    value: task.value || "",
    state: task.state || false,
    description: task.description || ""
  });

  const handData = (val: string | boolean, field: string) => {
    setValue((prev) => ({ ...prev, [field]: val }));
  };



  useEffect(() => {
    if (value.date) {
      const deadlineDate = new Date(value.date);
      const now = new Date();
      const diffInMs = deadlineDate.getTime() - now.getTime();

      if (diffInMs > 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const days = Math.floor(diffInMinutes / (60 * 24));
        const hours = Math.floor((diffInMinutes % (60 * 24)) / 60);
        const minutes = diffInMinutes % 60;
        const timeLeftString = `${days}d ${hours}h ${minutes}m`;
        setDeadlineDay(timeLeftString);
      } else {
        setDeadlineDay("Đã hết hạn");
      }
    } else {
      setDeadlineDay("None");
    }
  }, [value.date]);

  return (
    <div
      className="fixed select-none inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-4 max-w-xl w-full mx-5">
        {/* Header */}
        <div className="flex justify-between">
          <button
            className="bg-green-200 text-green-900 text-sm font-semibold rounded-md px-3 py-1 flex items-center gap-1"
            type="button"
          >
            <span>This Week</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={() => setStateUp(false)}
            type="button"
            className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center hover:bg-red-400 text-white"
            aria-label="Đóng"
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>

        {/* Input Title */}
        <div className="mt-4">
          <input
            onChange={(e) => handData(e.target.value, "value")}
            value={value.value}
            placeholder="Nhập tiêu đề công việc..."
            className="w-full text-xl font-semibold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-400 placeholder-gray-400"
          />
        </div>

        {/* Checkbox + Deadline */}
        <div className="inline-flex items-center justify-between my-3 bg-blue-100 p-2 rounded-lg w-full">
          <div className="flex">
            <label className="flex items-center cursor-pointer relative">
              <input
                onChange={(e) => handData(e.target.checked, "state")}
                checked={value.state}
                type="checkbox"
                className="peer h-5 w-5 cursor-pointer appearance-none rounded shadow border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
              />
              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </label>
            <label className="cursor-pointer ml-2 text-slate-600 text-sm">Complete</label>
          </div>
          <span className="text-[12px] text-red-500">Deadline: {deadlineDay}</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 mb-6">
          <div className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-1 text-gray-700 text-sm font-medium">
            <FontAwesomeIcon icon={faClock} />
            <input
              onChange={(e) => handData(e.target.value, "date")}
              type="date"
              className="bg-transparent outline-none text-sm text-gray-700"
              value={value.date}
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-1 text-gray-700 text-sm font-medium hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faUserPlus} /> Member
          </button>
        </div>

        {/* Description */}
        <div className="my-5 ml-2 mb-1 text-gray-700 font-semibold text-sm min-w-min">
          <div className="flex my-5 items-center justify-start">
            <span>Description</span>
            <h5
              onClick={() => setStateDes(!stateDes)}
              className="w-[70px] h-[25px] bg-slate-300 rounded-lg mx-3 flex items-center justify-center cursor-pointer"
            >
              {stateDes ? "Cancel" : "Edit"}
            </h5>
          </div>
          {stateDes ? (
            <ReactQuill value={value.description || ""} onChange={(content) => handData(content, "description")} />
          ) : (
            <h5 className="text-gray-500 whitespace-pre-wrap">{value.description || "Chưa có mô tả"}</h5>
          )}
        </div>

        {/* Submit */}
        <div className="mt-4 flex justify-end">
          <span
            onClick={() => callRemove()}
            className="px-4 mr-3 py-1 bg-red-600 text-white font-light rounded text-[13px] shadow-sm hover:bg-red-700"
          >
            Remove task
          </span>
          <button
            onClick={()=>{callUpdate(value)}}
            className="px-4 py-1 bg-blue-600 text-white font-light rounded shadow-sm text-[13px] hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
