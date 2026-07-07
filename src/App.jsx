import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectDetail from "./components/ProjectDetail";
import Wechat from "./pages/Wechat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/wechat" element={<Wechat />} />
      </Routes>
    </BrowserRouter>
  );
}
