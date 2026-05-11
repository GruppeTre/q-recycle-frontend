import {BrowserRouter, Route, Routes} from "react-router";
import FrontPage from "./features/front-page";
import PartnerLoginPage from "./features/partner-login/PartnerLoginPage.jsx";
import DriverAdminLoginPage from "./features/driver-admin-login/DriverAdminLoginPage.jsx";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route index element={<FrontPage />}/>
              <Route path="driverlogin" element={<DriverAdminLoginPage />}/>
              <Route path={'partner'} element={<PartnerLoginPage/>}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App
