import {BrowserRouter, Route, Routes} from "react-router";
import FrontPage from "./features/front-page";
import PartnerLoginPage from "./features/partner-login-page/PartnerLoginPage.jsx";
import UserLoginPage from "./features/user-login-page/UserLoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {role} from "./config/constants.js";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route index element={<FrontPage />}/>
              <Route path="driverlogin" element={<UserLoginPage />}/>
              <Route path="partner" >
                  <Route index="/login" element={<PartnerLoginPage />} />
                  <Route path="dashboard" element={
                      <ProtectedRoute redirectPath="/" allowedRoles={[role.PARTNER]}><h1>DASHBOARD</h1></ProtectedRoute>
                  } />
              </Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App
