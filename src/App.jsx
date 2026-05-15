import {BrowserRouter, Route, Routes} from "react-router";
import PartnerLoginPage from "./features/partner-login-page/PartnerLoginPage.jsx";
import UserLoginPage from "./features/user-login-page/UserLoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {role} from "./config/constants.js";
import {AuthProvider} from "./context/AuthContext.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import AdminDashboard from "./features/admin-dashboard/AdminDashboard.jsx";

function App() {

  return (
      <AuthProvider>
          <BrowserRouter>
              <Routes>

                  <Route index element={
                      <GuestRoute>
                          <UserLoginPage />
                      </GuestRoute>
                  }/>

                  <Route path="test" element={<AdminDashboard />}/>

                  <Route path="partner" >

                      <Route index element={
                          <GuestRoute allowedRoles={[role.ADMIN, role.DRIVER]}>
                              <PartnerLoginPage />
                          </GuestRoute>
                      }/>

                      <Route path="dashboard" element={
                          <ProtectedRoute redirectPath="/partner" allowedRoles={[role.PARTNER]}>
                              <h1>DASHBOARD</h1>
                          </ProtectedRoute>
                      } />
                  </Route>

                  <Route path="driver" element={<ProtectedRoute redirectPath="/" allowedRoles={[role.DRIVER, role.ADMIN]}/>}>
                      <Route index element={<h1>DRIVER DASHBOARD</h1>} />
                  </Route>

                  <Route path="admin" element={<ProtectedRoute redirectPath="/" allowedRoles={[role.ADMIN]}/>}>
                      <Route index element={<h1>ADMIN DASHBOARD </h1>} />
                  </Route>
              </Routes>
          </BrowserRouter>
      </AuthProvider>
  );
}

export default App
