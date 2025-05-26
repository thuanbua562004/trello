import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import SettingBoard from "./SettingBoard";
import { fetchDataBoard } from "../Redux/managetdata";
import { useAppDispatch, type RootState } from "../Redux/store";
import { useSelector } from "react-redux";
import hexToRGBA from "../until";
import { Link } from "react-router-dom";

export default function ManagerBoard() {
  type dataType = {
    id: string;
    name: string;
    background: string;
    userId: string;
  };

  const [stateSetting, setStateSetting] = useState<boolean>(false);
  const ref = useRef<HTMLElement | null>(null);
  const dispatch = useAppDispatch();
  const data = useSelector((state: RootState) => state.manager.Boards);

  const handlerCreateBoard = useCallback(() => {
    setStateSetting(true);
  }, []);

  const refSettingBoard = useCallback((el: HTMLDivElement | null) => {
    ref.current = el;
  }, []);

  useEffect(() => {
    const handlerClose = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setStateSetting(false);
      }
    };

    document.addEventListener("mousedown", handlerClose);
    return () => {
      document.removeEventListener("mousedown", handlerClose);
    };
  }, []);

  useEffect(() => {
    dispatch(fetchDataBoard());
  }, [dispatch]);

  const id = localStorage.getItem("isLogin");
  const listBoard = useMemo(() => {
    return data.filter((item) => item.userId === id);
  }, [data, id]);

  return (
    <>
      <SettingBoard
        setStateSetting={setStateSetting}
        stateSetting={stateSetting}
        refSettingBoard={refSettingBoard}
      />

      <div className="dark:bg-bg-dark h-full">
        <div className="dark:bg-bg-dark max-w-7xl mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="dark:bg-bg-dark w-full md:w-64 bg-white rounded-2xl shadow-xl p-5 sticky top-6">
            <nav className="flex flex-col gap-3">
              <a
                href="#"
                className="dark:hover:bg-gray-500 flex items-center gap-3 text-gray-700 hover:text-blue-600 rounded-xl px-4 py-3 hover:bg-gray-50 transition"
              >
                <i className="fas fa-th-large text-lg"></i>
                <span className="text-base font-medium">Boards</span>
              </a>
              <a
                href="#"
                className="dark:hover:bg-gray-500 flex items-center gap-3 text-gray-700 hover:text-blue-600 rounded-xl px-4 py-3 hover:bg-gray-50 transition"
              >
                <i className="fas fa-cogs text-lg"></i>
                <span className="text-base font-medium">Settings</span>
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="dark:bg-bg-dark flex-1 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <h1 className="text-xl font-semibold text-gray-800">Your Boards</h1>
              <button
                onClick={handlerCreateBoard}
                type="button"
                className="dark:bg-gray-400 shadow-2xl inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-2 rounded-md transition"
              >
                <i className="fas fa-plus"></i>
                New Board
              </button>
            </div>

            {/* Boards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listBoard.map((item) => (
                <Link
                  to={`/${item.id}`}
                  key={item.id}
                  className="group rounded-xl shadow-md hover:shadow-lg transition overflow-hidden relative"
                >
                  {item.background.length > 10 ? (
                    <img
                      src={item.background}
                      alt={item.name}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      style={{ backgroundColor: hexToRGBA(item.background) }}
                      className="w-full h-44 group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <span className="absolute bottom-3 left-4 text-white font-bold text-lg drop-shadow-lg">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
