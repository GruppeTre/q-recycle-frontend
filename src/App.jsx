import {BrowserRouter, Navigate, Route, Routes} from "react-router";
import PartnerLoginPage from "./features/partner-login-page/PartnerLoginPage.jsx";
import UserLoginPage from "./features/user-login-page/UserLoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {role} from "./config/constants.js";
import {AuthProvider} from "./context/AuthContext.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import PartnerDashboardPage from "./features/partner-dashboard/PartnerDashboardPage.jsx";
import AdminDashboard from "./features/admin-dashboard/AdminDashboard.jsx";
import AdminDriversPage from "./features/admin-dashboard/pages/AdminDriversPage.jsx";
import AdminPartnersPage from "./features/admin-dashboard/pages/AdminPartnersPage.jsx";
import CreatePartnerPage from "./features/admin-dashboard/pages/CreatePartnerPage.jsx";
import RoutePlanner from "./features/driver-dashboard/routing-page/RoutePlanner.jsx";
import DriverRoutePage from "./features/driver-dashboard/DriverRoutePage.jsx";
import DriverDashboard from "./features/driver-dashboard/DriverDashboard.jsx";
import AdminStatisticsPage from "./features/admin-dashboard/pages/admin-statistics-page/AdminStatisticsPage.jsx";
import EditPartnerPage from "./features/admin-dashboard/pages/EditPartnerPage.jsx";

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
                              <PartnerDashboardPage />
                          </ProtectedRoute>
                      }/>

                  </Route>

                  <Route path="driver" element={<ProtectedRoute redirectPath="/" allowedRoles={[role.DRIVER, role.ADMIN]}> <DriverDashboard /> </ProtectedRoute>}>
                      <Route index element={<Navigate to="routes" replace={true} /> } />
                      <Route path="routes" element={<DriverRoutePage />} />

                  </Route>
                  <Route path="driver/routes/route-planner" element={
                      <ProtectedRoute redirectPath="/" allowedRoles={[role.DRIVER, role.ADMIN]} >
                          <RoutePlanner />
                      </ProtectedRoute> }
                  />

                  <Route path="admin" element={<ProtectedRoute redirectPath="/" allowedRoles={[role.ADMIN]}> <AdminDashboard /> </ProtectedRoute>}>
                      <Route index element={<Navigate to="drivers" replace={true}/>}/>
                      <Route path="drivers" element={<AdminDriversPage />} />

                      <Route path="partners">
                          <Route index element={<AdminPartnersPage />} />
                          <Route path="new" element={<CreatePartnerPage />} />
                          <Route path=":id/edit" element={<EditPartnerPage />} />
                      </Route>

                      <Route path="statistics" element={<AdminStatisticsPage />} />
                  </Route>

              </Routes>
          </BrowserRouter>
      </AuthProvider>
  );
}

export default App
