import { Outlet } from 'react-router-dom'

export default function layout1() {
  return (
    <div className='dark:bg-bg-dark '>
      <Outlet/>
    </div>
  )
}
