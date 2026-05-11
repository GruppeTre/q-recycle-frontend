import {BrowserRouter, Route, Routes} from "react-router";
import FrontPage from "./features/front-page";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route index element={<FrontPage />}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App
