import { useEffect, useState } from 'react'
import SettingBoard from './SettingBoard'
import { fetchDataBoard } from '../Redux/managetdata'
import { useAppDispatch, type RootState } from '../Redux/store'
import { useSelector } from 'react-redux'
import hexToRGBA from '../until'
import { Link } from 'react-router-dom'

export default function ManagerBoard() {
  type dataType = {id:string,name:string , background:string ,userId:string}
  const [stateSetting, setStateSetting] = useState<boolean>(false)
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [listBoard ,setListBoard] = useState<dataType[]|null>(null)
  const dispatch = useAppDispatch()
  const data = useSelector((state: RootState) => state)
  
  function handlerCreateBoard() {
    setStateSetting(true)
  }

  function refSettingBoard(ref: HTMLElement) {
    setRef(ref)
  }

  function handlerClose(e: MouseEvent) {
    if (ref && !ref.contains(e.target as Node)) {
      setStateSetting(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handlerClose)
    return () => {
      document.removeEventListener('mousedown', handlerClose)
    }
  }, [ref])

  useEffect(() => {
    dispatch(fetchDataBoard())
  }, [dispatch])
  useEffect(() => {
    let id = localStorage.getItem('isLogin')
    let newBoard = data.manager.Boards.filter((item)=>item.userId==id)
    setListBoard(newBoard)
  }, [data.manager.Boards])
  console.log(listBoard)
  return (
    <>
      <SettingBoard
        setStateSetting={setStateSetting}
        stateSetting={stateSetting}
        refSettingBoard={refSettingBoard}
      />

      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <nav className="w-full md:w-64 bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 sticky top-6 h-fit">
          <a
            href="#"
            className="flex items-center gap-3 bg-blue-100 text-blue-900 rounded-xl py-3 px-5 shadow hover:bg-blue-200 transition"
          >
            <i className="fas fa-home text-lg"></i>
            <span className="font-semibold text-base">Home</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-gray-700 rounded-xl py-3 px-5 hover:bg-gray-100 transition cursor-pointer"
          >
            <i className="fas fa-credit-card text-lg"></i>
            <span className="font-semibold text-base">Boards</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-gray-700 rounded-xl py-3 px-5 hover:bg-gray-100 transition cursor-pointer"
          >
            <i className="fas fa-th-large text-lg"></i>
            <span className="font-semibold text-base">Templates</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-gray-700 rounded-xl py-3 px-5 hover:bg-gray-100 transition cursor-pointer"
          >
            <i className="fas fa-cog text-lg"></i>
            <span className="font-semibold text-base">Settings</span>
          </a>
        </nav>

        {/* Main content */}
        <main className="flex-1 bg-white rounded-xl border border-gray-200 p-8 shadow-md">
          <button
            onClick={handlerCreateBoard}
            type="button"
            className="mb-8 inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-semibold text-base rounded-md py-3 px-6 transition"
          >
            <i className="fas fa-plus"></i>
            Create a board
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Ví dụ 1 board */}
          {listBoard?.map((item)=>(
            <Link
              to={`/${item.id}`}
              className="block w-full rounded-xl shadow-lg overflow-hidden relative group hover:shadow-xl transition-shadow"
            >
              {item?.background?.length>10 ?              
              <img
                alt="Mountain landscape with blue sky and distant hills"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                src={item?.background}
              />:
              <div style={{backgroundColor:hexToRGBA(item?.background)}} className="w-full h-40 object-cover group-hover:scale-105 transition-transform"></div>
              }
              <span className="absolute left-4 bottom-4 text-white font-bold text-lg drop-shadow-lg select-none">
                {item?.name}
              </span>
            </Link>
          ))}

            {/* Bạn có thể lặp thêm nhiều board ở đây */}
          </div>
        </main>
      </div>
    </>
  )
}
