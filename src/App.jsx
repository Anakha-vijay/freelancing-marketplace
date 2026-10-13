import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import BrowseProjects from "./pages/BrowseProjects";
import ProjectDetails from "./pages/ProjectDetails";
import SubmitProposal from "./pages/SubmitProposal";
import PostProject from "./pages/PostProject";
import MyProjects from "./pages/MyProjects";
import ViewProposals from "./pages/ViewProposals";
import ProjectManagement from "./pages/ProjectManagement";
import Messages from "./pages/Messages";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";

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
          path="/project-details/:id"
          element={<ProjectDetails />}
        />
        <Route
          path="/submit-proposal/:id"
          element={<SubmitProposal />}
        />
        <Route
          path="/post-project"
          element={<PostProject />}
        />
        <Route
          path="/my-projects"
          element={<MyProjects />}
        />
        <Route
          path="/view-proposals"
          element={<ViewProposals />}
        />
        <Route
          path="/project-management/:id"
          element={<ProjectManagement />}
        />
        <Route
          path="/messages"
          element={<Messages />}
        />

        <Route
          path="/messages/:id"
          element={<Messages />}
        />
        <Route
          path="/my-applications"
          element={<MyApplications />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reviews/:id" element={<Reviews />} />
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;