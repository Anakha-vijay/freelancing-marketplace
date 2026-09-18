import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import BrowseProjects from "./pages/BrowseProjects";
import ProjectDetails from "./pages/ProjectDetails";
import SubmitProposal from "./pages/SubmitProposal";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/client-dashboard"
          element={<ClientDashboard />}
        />

        <Route
          path="/freelancer-dashboard"
          element={<FreelancerDashboard />}
        />
        <Route
          path="/browse-projects"
          element={<BrowseProjects />}
        />
        <Route
          path="/project-details"
          element={<ProjectDetails />}
        />
        <Route
          path="/submit-proposal"
          element={<SubmitProposal />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;