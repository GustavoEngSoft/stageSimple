import React, { useState, useEffect } from "react";
import "./ProjectsSimple.css";
import { FaSearch, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import axios from "../../axiosConfig";


const ProjectsSimple = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", startDate: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching user information...");
    axios.get('http://localhost:5000/api/users/me', {withCredentials: true})
      .then(response => {
        console.log("User information fetched successfully:", response.data);
        setUser(response.data);
        return axios.get(`http://localhost:5000/api/projects?email=${response.data.email}`, {withCredentials: true});
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
    if (user?.role !== "Product Manager") {
      alert("Only Product Managers can create projects.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveProject = () => {
    if (newProject.name && newProject.startDate) {
      const newProjectObj = { ...newProject, userEmail: user.email };
      console.log("Saving project:", newProjectObj);
      axios.post('http://localhost:5000/api/projects', newProjectObj, {withCredentials: true})
        .then(response => {
          console.log("Project saved successfully:", response.data);
          // Verificar se o projeto já está na lista antes de adicioná-lo
          const isProjectAlreadyAdded = projects.some(project => project.id === response.data.id);
          if (!isProjectAlreadyAdded) {
            setProjects([...projects, response.data]);
          }
          setIsModalOpen(false);
          setNewProject({ name: "", startDate: "" });
          console.log("Projects:", projects);
        })
        .catch(error => console.error('Error saving project:', error));
    }
  };

  const handleDeleteProject = (id) => {
    axios.delete(`http://localhost:5000/api/projects/${id}`, {withCredentials: true})
      .then(() => {
        setProjects(projects.filter((project) => project.id !== id));
      })
      .catch(error => console.error('Error deleting project:', error));
  };

  const handleEditProject = (id) => {
    const projectToEdit = projects.find((project) => project.id === id);
    setNewProject({ name: projectToEdit.name, startDate: projectToEdit.startDate });
    setIsModalOpen(true);
    handleDeleteProject(id);
  };

  const handleSelectProject = (id) => {
    console.log("Selected project:", id);
    navigate(`/project/${id}`);
  };

  const handleStatusProject = (id) => {
    navigate(`/projectStatus/${id}`);
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

  const isProductManager = user?.role === "Product Manager";


  return (
    <div className="flex h-screen bg-gray-100">
      <Nav name={user?.name}/>

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
          {isProductManager && (
            <button
              onClick={handleAddProject}
              className="new-project-btn"
            >
              <span className="text-lg mr-2">+</span> New Project
            </button>
          )}
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
                {isProductManager &&(
                <>
                <span onClick={() => handleEditProject(project.id)}>Edit</span>
                <span onClick={() => handleDeleteProject(project.id)}>Delete</span>
                </>
                )}
                <span onClick={() => handleStatusProject(project.id)}>Status</span>
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

export default ProjectsSimple;