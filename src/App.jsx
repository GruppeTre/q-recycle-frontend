import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import PartnerLoginPage from "./features/partner-login-page/PartnerLoginPage.jsx";
import UserLoginPage from "./features/user-login-page/UserLoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {role} from "./config/constants.js";
import {AuthProvider} from "./context/AuthContext.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import AdminDashboard from "./features/admin-dashboard/AdminDashboard.jsx";
import AdminDriversPage from "./features/admin-dashboard/pages/AdminDriversPage.jsx";
import AdminPartnersPage from "./features/admin-dashboard/pages/AdminPartnersPage.jsx";
import AdminStatisticsPage from "./features/admin-dashboard/pages/AdminStatisticsPage.jsx";

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

                  <Route path="admin" element={<ProtectedRoute redirectPath="/" allowedRoles={[role.ADMIN]}> <AdminDashboard /> </ProtectedRoute>}>
                      <Route index element={<Navigate to="drivers" replace={true}/>}/>
                      <Route path="drivers" element={<AdminDriversPage />} />
                      <Route path="partners" element={<AdminPartnersPage />} />
                      <Route path="statistics" element={<AdminStatisticsPage />} />
                  </Route>

              </Routes>
          </BrowserRouter>
      </AuthProvider>
  );
}

export default App
