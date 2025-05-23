import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./component/Login";
import Layout1 from "./route/layout/layout1";
import Board from "./component/Board";
import ManagerBoard from "./component/ManagerBoard";
import PageError from "./component/PageError";
import ProtectedRoute from "./route/Protected";
import { store } from './Redux/store'
import { Provider } from 'react-redux'
import Layout from "./route/layout/layout";
function App() {

return (
    <>
<Provider store={store}>
  <BrowserRouter>
    <Routes>
      <Route element={<Layout1 />}>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageError />} />
      </Route>

        <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<ManagerBoard />} />
          <Route path="/:id" element={<Board />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
</Provider>


    </>
  );
}

export default App;
