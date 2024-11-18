import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./page/HomePage";
import NavBar from "./component/NavBar";
import DifficultyPage from "./page/DifficultyPage";
import SinglePlayer from "./page/SinglePlayer";

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/difficulty" element={<DifficultyPage />} />
        <Route path="/single" element={<SinglePlayer />} />
      </Routes>
    </>
  );
}

export default App;
