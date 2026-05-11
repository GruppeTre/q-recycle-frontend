import {BrowserRouter, Route, Routes} from "react-router";
import FrontPage from "./features/front-page";
import DriverAdminLoginPage from "./features/driver-admin-login/DriverAdminLoginPage.jsx";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route index element={<FrontPage />}/>
              <Route path="driverlogin" element={<DriverAdminLoginPage />}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App
