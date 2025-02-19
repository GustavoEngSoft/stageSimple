import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { FaSearch, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import axios from "../../axiosConfig";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "", startDate: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching user information...");
    axios.get('http://localhost:5000/api/users/me', { withCredentials: true })
      .then(response => {
        console.log("User information fetched successfully:", response.data);
        setUser(response.data);
        return axios.get(`http://localhost:5000/api/projects?email=${response.data.email}`, { withCredentials: true });
      })
      .then(response => {
        console.log("Projects fetched successfully:", response.data);
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching user or projects:', error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("Request data:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      });
  }, []);

  const handleAddProject = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveProject = () => {
    if (newProject.name && newProject.startDate) {
      const newProjectObj = { ...newProject, userEmail: user.email };
      axios.post('http://localhost:5000/api/projects', newProjectObj, { withCredentials: true })
        .then(response => {
          console.log("Project saved successfully:", response.data);
          setProjects([...projects, response.data]);
          setIsModalOpen(false);
          setNewProject({ name: "", description: "", startDate: "" });
        })
        .catch(error => console.error('Error saving project:', error));
    }
  };

  const handleDeleteProject = (id) => {
    axios.delete(`http://localhost:5000/api/projects/${id}`, { withCredentials: true })
      .then(() => {
        setProjects(projects.filter((project) => project.id !== id));
      })
      .catch(error => console.error('Error deleting project:', error));
  };

  const handleEditProject = (id) => {
    const projectToEdit = projects.find((project) => project.id === id);
    setNewProject({ name: projectToEdit.name, description: projectToEdit.description, startDate: projectToEdit.startDate });
    setIsModalOpen(true);
    handleDeleteProject(id);
  };

  const handleSelectProject = (id) => {
    navigate(`/project/${id}`);
  };

  const filteredProjects = Array.isArray(projects) ? projects.filter((project) =>
    project.name && project.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handleLogout = () => {
    // Limpar o cookie da sessão
    document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav name={user?.name} handleLogout={handleLogout} />

      <main className="main-content">
        <div className="header">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button>
              <FaSearch />
            </button>
          </div>
          <button
            onClick={handleAddProject}
            className="new-project-btn"
          >
            <span className="text-lg mr-2">+</span> New Project
          </button>
        </div>

        {isModalOpen && (
          <div className="modalOverlay">
            <div className="modalProject">
              <h2 className="text-xl font-bold mb-4">New Project</h2>
              <input
                className="nameProejct"
                type="text"
                placeholder="Name of Project"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
              <input
                className="date_in"
                type="date"
                placeholder="Date of Start"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
              />
              <button className='save_button' onClick={handleSaveProject}>Save</button>
              <button className='cancel_button' onClick={handleModalClose}>Cancel</button>
            </div>
          </div>
        )}

        <div className="gridContainer">
          {paginatedProjects.map((project) => (
            <div key={project.id} className="projectCard">
              <div className="projectCardHeader"></div>
              <h3>{project.name}</h3>
              <p>Start Date: {project.startDate}</p>
              <div className="cardOptions">
                <input
                  className="selectProject"
                  type="radio"
                  name="selectedProject"
                  onChange={() => handleSelectProject(project.id)}
                />
                <span onClick={() => handleEditProject(project.id)}>Edit</span>
                <span onClick={() => handleDeleteProject(project.id)}>Delete</span>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <FaAngleLeft style={{ fontSize: '16px' }} />
          </button>
          <span style={{ fontSize: '22px' }}>{currentPage}/{totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= filteredProjects.length}
          >
            <FaAngleRight style={{ fontSize: '16px' }} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;