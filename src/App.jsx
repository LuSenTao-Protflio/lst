import { BrowserRouter, Routes, Route } from "react-router-dom";
import Entry from "./pages/Entry";
import Home from "./pages/Home";
import ProjectDetail from "./components/ProjectDetail";
import Wechat from "./pages/Wechat";
import GlobalCursor from "./components/GlobalCursor";
import ClickRings from "./components/ClickRings";
import ScrollManager from "./components/ScrollManager";
import FloatingGlassNav from "./components/FloatingGlassNav";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <GlobalCursor />
      <ClickRings />
      <ScrollManager />
      <FloatingGlassNav />
      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/portfolio" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/wechat" element={<Wechat />} />
      </Routes>
    </BrowserRouter>
  );
}
