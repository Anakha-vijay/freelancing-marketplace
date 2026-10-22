import API_BASE_URL from "../api";


import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardNavbar from "../components/DashboardNavbar";
import "../App.css";

function Messages() {
  const { id } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // Load accepted projects for clients and freelancers
  const fetchConversations = async () => {
    try {
      if (!(user?.id || user?._id) || !token) {
        setProjects([]);
        return;
      }

      const userId = user.id || user._id;

      const endpoint =
        user.role === "client"
          ? `${API_BASE_URL}/api/proposals/client/${userId}/accepted`
          : `${API_BASE_URL}/api/proposals/freelancer/${userId}`;

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        const acceptedProjects = data
          .filter(
            (proposal) =>
              proposal.status === "Accepted" &&
              proposal.project
          )
          .map((proposal) => proposal.project);

        const uniqueProjects = acceptedProjects.filter(
          (project, index, array) =>
            array.findIndex(
              (item) => item._id === project._id
            ) === index
        );

        setProjects(uniqueProjects);
      } else {
        console.log(
          "Failed to load conversations:",
          data.message
        );
        setProjects([]);
      }
    } catch (error) {
      console.log("Error loading conversations:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Find the selected project and the other participant
  const fetchProject = async () => {
    try {
      const response = await fetch(
        "${API_BASE_URL}/api/projects"
      );

      const data = await response.json();

      if (!response.ok || !Array.isArray(data)) {
        console.log("Failed to load projects");
        return;
      }

      const project = data.find(
        (item) => item._id === id
      );

      if (!project) {
        console.log("Project not found:", id);
        return;
      }

      setProjectTitle(project.title || "Project Chat");

      const currentUserId = user?.id || user?._id;
      const clientId =
        project.client?._id || project.client;
      const freelancerId =
        project.selectedFreelancer?._id ||
        project.selectedFreelancer;

      if (String(currentUserId) === String(clientId)) {
        setReceiverId(freelancerId || null);
      } else if (
        String(currentUserId) === String(freelancerId)
      ) {
        setReceiverId(clientId || null);
      } else {
        setReceiverId(null);
      }
    } catch (error) {
      console.log("Error fetching project:", error);
    }
  };

  // Load messages for the selected project
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/messages/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessages(Array.isArray(data) ? data : []);
      } else {
        console.log("Message error:", data.message);
      }
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);

      Promise.all([fetchProject(), fetchMessages()])
        .finally(() => setLoading(false));
    } else {
      setMessages([]);
      setReceiverId(null);
      setLoading(true);
      fetchConversations();
    }
  }, [id]);

  // Send a message in the selected project's chat
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    if (!(user?.id || user?._id) || !token) {
      alert("Please log in again to send messages.");
      return;
    }

    if (!receiverId) {
      alert(
        "No conversation partner was found for this project."
      );
      return;
    }

    try {
      const response = await fetch(
        "${API_BASE_URL}/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            receiver: receiverId,
            project: id,
            message: newMessage.trim()
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNewMessage("");
        await fetchMessages();
      } else {
        alert(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.log("Error sending message:", error);
      alert("Unable to send the message. Please try again.");
    }
  };

  return (
    <div>
      <DashboardNavbar role={user?.role || "freelancer"} />

      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1>Messages</h1>
            <p>
              Communicate with your clients and freelancers.
            </p>
          </div>

          {id && (
            <Link to="/messages" className="secondary-btn">
              ← All Messages
            </Link>
          )}
        </div>

        {!id ? (
          <div className="projects-section">
            <div className="section-heading">
              <h2>Your Conversations</h2>
            </div>

            {loading ? (
              <p>Loading your conversations...</p>
            ) : projects.length === 0 ? (
              <p>
                No accepted projects yet. Once a proposal is
                accepted, the project will appear here.
              </p>
            ) : (
              <div className="project-list">
                {projects.map((project) => (
                  <div className="project-card" key={project._id}>
                    <div>
                      <h3>{project.title}</h3>
                      <p>
                        {project.status || "Project conversation"}
                      </p>
                    </div>

                    <Link
                      to={`/messages/${project._id}`}
                      className="primary-btn"
                    >
                      Open Chat
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="chat-box">
            <div className="chat-header">
              <h2>{projectTitle || "Project Chat"}</h2>
              <p>Project communication</p>
            </div>

            <div className="chat-messages">
              {loading ? (
                <p>Loading messages...</p>
              ) : messages.length === 0 ? (
                <p>No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    className={
                      String(msg.sender?._id || msg.sender) ===
                      String(user?.id || user?._id)
                        ? "message sent"
                        : "message received"
                    }
                    key={msg._id}
                  >
                    <p>{msg.message}</p>

                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit"
                        }
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>

            <form
              className="message-form"
              onSubmit={sendMessage}
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                required
              />

              <button type="submit" className="primary-btn">
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
