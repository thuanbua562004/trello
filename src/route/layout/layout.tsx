import { Outlet } from "react-router-dom";
import Headers from "../../component/Header";
const Layout = () => {
  return (
    <>
<div className="dark:bg-bg-dark h-screen flex flex-col overflow-hidden">
  {/* Header cố định chiều cao 50px */}
  <div className="h-[50px] shrink-0">
    <Headers />
  </div>

  {/* Nội dung chiếm phần còn lại, scroll được nếu quá dài */}
  <div className="dark:bg-bg-dark flex-1 overflow-auto h-full">
    <Outlet />
  </div>
</div>

    </>
  );
};

export default Layout;
