import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Column from "./Column";
import Task from "./Task";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import type { ListTasks, TaskType } from "../interface/index";
import {
  useState,
  useMemo,
  type FormEvent,
  useEffect,
  useRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, type RootState } from "../Redux/store";
import { useParams } from "react-router-dom";
import {
  addColumRedux,
  fetchColumRedux,
  fetchDataBoard,
  updateColumRedux,
} from "../Redux/managetdata";
import { useSelector } from "react-redux";
import hexToRGBA, { configPath, findColumnIdByTaskId } from "../until";

export default function Board() {
  const [pointerPos, setPointerPos] = useState<{x: number, y: number} | null>(null);
  const [background, setBackground] = useState<string>("");
  const dataCollum = useSelector((state: RootState) => state.manager);
  let dispatch = useAppDispatch();
  let param = useParams<{ id: string }>();
  const [stateAddColum, setstateAddColum] = useState<boolean>(false);
  ////// HANDLER
  const [columns, setColumns] = useState<ListTasks[] | []>([]);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeColumn = useMemo(() => {
    if (!activeId) return null;
    return columns.find((col) => col.id === activeId) || null;
  }, [activeId, columns]);

  // Tìm task đang kéo để render DragOverlay
  const activeTask = useMemo(() => {
    if (!activeId) return null;
    for (const col of columns) {
      const task = col?.listTask.find((t) => t.id === activeId);
      if (task) return task;
    }
    return null;
  }, [activeId, columns]);
  let isDagDnD = useRef(false);
  function handleDragStart(event: any) {
    setActiveId(event.active.id);
    isDagDnD.current = true;
      setPointerPos({
    x: event.activatorEvent.clientX,
    y: event.activatorEvent.clientY,
  });
  }
  function handleDragEnd(event: any) {
    setActiveId(null);
    // Nếu kéo là cột
    if (columns.some((col) => col.id === event.active.id)) {
      handleDragEndColumn(event);
    } else {
      // Ngược lại là kéo task
      handleDragEndTask(event);
    }
    isDagDnD.current = false;
  }
  function getTaskValue(id: string) {
    for (let column of columns) {
      const index = column.listTask.findIndex((item) => item.id === id);
      if (index !== -1) {
        return {
          index,
          value: column.listTask[index],
          idcl: column.id,
        };
      }
    }
    return null;
  }

  function handleDragEndTask(event: any) {
    const { active, over } = event;
    setActiveId(null);
    setShouldUpdate(true);
    
    if (!over || active.id === over.id) return;
    // if(over.id.length>15 )return
    console.log("check Over" ,over.id)
    let finCol = findColumnIdByTaskId(active.id , columns)
    if(finCol ==over.id) return

    let idTask1 = active.id;
    let idTask2 = over.id;
    let taskvalue1 = getTaskValue(idTask1);
    let taskvalue2 = getTaskValue(idTask2);
    if (!taskvalue1) return;
    setColumns((pre) =>
      pre.map((item) => {
        // Nếu cùng cột thì swap vị trí 2 task
        if (taskvalue1.idcl === taskvalue2?.idcl) {
          if (item.id === taskvalue1.idcl) {
            const newList = [...item.listTask];
            const temp = newList[taskvalue1.index];
            newList[taskvalue1.index] = newList[taskvalue2.index];
            newList[taskvalue2.index] = temp;
            return { ...item, listTask: newList };
          }
        }
        if (taskvalue1.idcl !== taskvalue2?.idcl) {
          if (item.id == taskvalue1?.idcl) {
            let newList = item.listTask.filter(
              (item, index) => index !== taskvalue1.index
            );
            return { ...item, listTask: newList };
          }
          if (item.id == taskvalue2?.idcl) {
            let newList = [...item.listTask];
            newList.push(taskvalue1.value);
            return { ...item, listTask: newList };
          }
        }

        // Nếu kéo task sang cột khác (taskvalue2 == null)
        if (taskvalue2 === null) {
          if (taskvalue1.idcl === over.id) {
            return item;
          }
          if (item.id === over.id) {
            // idMove phải lấy đúng
            let temp = taskvalue1.value;
            let newListMove = [...item.listTask, temp];
            return { ...item, listTask: newListMove };
          }

          if (item.id === taskvalue1.idcl) {
            let newListCurrent = item.listTask.filter(
              (task, index) => index !== taskvalue1.index
            );
            return { ...item, listTask: newListCurrent };
          }

          return item; // Trường hợp khác giữ nguyên
        }

        return item; // Trường hợp không thay đổi
      })
    );
  }
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
    const mouseSensor = useSensor(MouseSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const sensors = useSensors(
    mouseSensor,
   touchSensor,
  );
  function handleDragEndColumn(event: any) {
    let { active, over } = event;
    const oldIndex = columns.findIndex((col) => col.id === active.id);
    const newIndex = columns.findIndex((col) => col.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newColumns = [...columns];
    const [moved] = newColumns.splice(oldIndex, 1);
    newColumns.splice(newIndex, 0, moved);

    setColumns(newColumns);
  }
  type Value = {
    idCol: string;
    value: string;
  };

  function addValue(value: Value) {
    if (!value.value.trim()) return;
    const newTask: TaskType = {
      id: Date.now().toString(), // Hoặc dùng uuid()
      value: value.value,
    };
    setColumns((pre) =>
      pre.map((item) =>
        item.id === value.idCol
          ? { ...item, listTask: [...item.listTask, newTask] }
          : item
      )
    );
  }
  function hanlerAddColum(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("nameColum") as string;
    if (!param.id) {
      return;
    }
    dispatch(addColumRedux({ id: param.id, name: name }));
    setstateAddColum(false);
  }
  useEffect(() => {
    dispatch(fetchColumRedux());
  }, []);
  useEffect(() => {
    if (dataCollum.Colum) {
      const rawId = param.id || "";
      let idBoard = configPath(rawId);
      const result = dataCollum.Colum.filter((item) => {
      let idCloum = configPath(item.id);
        return idBoard == idCloum;
      });
      const converted = result.map((item) => ({
        id: item.id,
        name: item?.name ?? "",
        listTask: item.listTask ?? [],
        color:item.color??""
      }));
      setColumns(converted);
    }
  }, [dataCollum.Colum]);
  useEffect(() => {
    if (shouldUpdate) {
      dispatch(updateColumRedux(columns));
      setShouldUpdate(false); 
    }
  }, [columns, shouldUpdate]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const onMouseDown = (e: MouseEvent) => {
      if (isDagDnD.current) return;

      isDragging.current = true;
      startX.current = e.pageX - container.offsetLeft;
      scrollLeft.current = container.scrollLeft;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDagDnD.current) return;

      if (!isDragging.current) return;
      const x = e.pageX - container.offsetLeft;
      const walk = x - startX.current;
      container.scrollLeft = scrollLeft.current - walk;
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mouseleave", onMouseUp);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mouseleave", onMouseUp);
    };
  }, []);
  useEffect(() => {
    dispatch(fetchDataBoard());
  }, []);
  useEffect(() => {
    let idBoard = param.id;
    if (idBoard) {
      dataCollum.Boards.forEach((item) => {
        if (item.id == idBoard) {
          setBackground(item.background);
        }
      });
    }
  }, [dataCollum.Boards]);
  return (
    <>
      <div className=" h-full">
      <div
        style={{
          backgroundImage:
          background.length > 10 ? `url(${background})` : "none",
          backgroundColor:
          background.length <= 10 ? hexToRGBA(background) : undefined,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100vw",
        }}
        ref={scrollRef}
        className="flex overflow-x-scroll object-fill h-full w-full scroll-container"
      >
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >

            {columns.map((col) => (
              <Column addValue={addValue} key={col.id} column={col} />
            ))}

          <DragOverlay>
            {activeColumn ? (
              <Column column={activeColumn} isDragOverlay={true} />
            ) : activeTask ? (
              <Task task={activeTask} />
            ) : null}
          </DragOverlay>
        </DndContext>

          <div className="dark:bg-bg-dark w-[272px] h-fit rounded-md mt-4  p-2 mr-20">
            {stateAddColum ? (
              <div className="w-[272px] ">
                <form className="outline-none" onSubmit={hanlerAddColum}>
                  <input
                    name="nameColum"
                    className="dark:bg-bg-dark w-fit border outline-none focus:border-red-500 rounded-lg p-2"
                    type="text"
                    placeholder="Name colum"
                  />
                  <div className="flex items-center">
                    <button
                      type="submit"
                      className="dark:hover:bg-gray-500 dark:bg-gray-400 text-[12px] shadow-lg bg-blue-500 hover:bg-blue-400 p-2 my-4 rounded-lg text-black font-medium"
                    >
                      Add Colum
                    </button>
                    <FontAwesomeIcon
                      onClick={() => setstateAddColum(false)}
                      className="cursor-pointer p-2 hover:bg-gray-300 mx-3 rounded-lg"
                      icon={faClose}
                    ></FontAwesomeIcon>
                  </div>
                </form>
              </div>
            ) : (
              <div
                onClick={() => setstateAddColum(true)}
                className="w-[252px] mt-4 mr-20  p-2 flex items-center dark:hover:bg-gray-500 dark:bg-gray-400  justify-start bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-lg  h-[44px] "
              >
                <FontAwesomeIcon
                  className="px-3"
                  icon={faPlus}
                ></FontAwesomeIcon>{" "}
                <h3  className="text-[15px] shadow-sm  " >Add Colum</h3>
              </div>
            )}
          </div>
      </div>
      </div>
    </>
  );
}
