import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

function BrowseProjects() {

  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/projects"
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage("Failed to load projects.");
        return;
      }

      const openProjects = data.filter(
        (project) => project.status === "Open"
      );

      setProjects(openProjects);

    } catch (error) {

      setMessage("Unable to connect to the server.");

    }
  };


  // Search and filter
  const filteredProjects = projects.filter((project) => {

    const searchMatch =
      project.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      project.description
        .toLowerCase()
        .includes(search.toLowerCase());

    const skillMatch =
      skill === "" ||
      project.skills
        .toLowerCase()
        .includes(skill.toLowerCase());

    return searchMatch && skillMatch;
  });


  return (
    <div className="dashboard-page">

      <div className="dashboard-header">

        <div>
          <h1>Browse Projects</h1>

          <p>
            Find projects that match your skills.
          </p>
        </div>

      </div>


      {message && (
        <p className="auth-message">
          {message}
        </p>
      )}


      {/* Search and Filter */}

      <div className="project-details-box">

        <h2>Find Projects</h2>

        <div className="project-info">

          <div>

            <h3>Search</h3>

            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div>

            <h3>Skill</h3>

            <input
              type="text"
              placeholder="Example: React"
              value={skill}
              onChange={(e) =>
                setSkill(e.target.value)
              }
            />

          </div>

        </div>

      </div>


      {/* Project List */}

      <div className="project-list">

        {filteredProjects.length === 0 ? (

          <p>
            No matching projects found.
          </p>

        ) : (

          filteredProjects.map((project) => (

            <div
              className="project-card"
              key={project._id}
            >

              <div>

                <h3>
                  {project.title}
                </h3>

                <p>
                  {project.description}
                </p>

                <span>
                  Skills: {project.skills}
                </span>

                <br />

                <span>
                  Budget: ₹{project.budget}
                </span>

                <br />

                <span>
                  Deadline:{" "}
                  {new Date(
                    project.deadline
                  ).toLocaleDateString("en-GB")}
                </span>

              </div>


              <Link
                to={`/project-details/${project._id}`}
                className="primary-btn"
              >
                View Details
              </Link>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default BrowseProjects;