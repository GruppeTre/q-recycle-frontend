import {BrowserRouter, Route, Routes} from "react-router";
import FrontPage from "./features/front-page";
import CounterPage from "./features/counter";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route index element={<FrontPage />}/>
              <Route path="counter" element={<CounterPage />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App
