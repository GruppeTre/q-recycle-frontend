import {BrowserRouter, Route, Routes} from "react-router";
import FrontPage from "./features/front-page";
import PartnerLoginPage from "./features/partner-login/PartnerLoginPage.jsx";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route index element={<FrontPage />}/>
              <Route path={'partner'} element={<PartnerLoginPage/>}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App
