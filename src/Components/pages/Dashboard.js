import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { FaSearch, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";

  
const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      window.location.href = "/";
    } else {
      const savedProjects = JSON.parse(localStorage.getItem(`projects_${user.email}`)) || [];
      setProjects(savedProjects);
    }
  }, [user]);


  const handleAddProject = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveProject = () => {
    if (newProject.name && newProject.description && newProject.startDate) {
      const newProjectObj = { id: projects.length + 1, ...newProject };
      const updatedProjects = [...projects, newProjectObj];
      setProjects(updatedProjects);
      localStorage.setItem(`projects_${user.email}`, JSON.stringify(updatedProjects));
      setIsModalOpen(false);
      setNewProject({ name: "", description: "" });
    }
  };

  const handleDeleteProject = (id) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(projects.filter((project) => project.id !== id));
    localStorage.setItem(`projects_${user.email}`, JSON.stringify(updatedProjects));

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

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
    <Nav name={user?.name} handleLogout={handleLogout} />

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
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

        {/* Modal */}
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
              <textarea
                className="descriptionProject"
                placeholder="Description of Project"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
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

        {/* Project Cards */}
        <div className="gridContainer">
          {paginatedProjects.map((project) => (
            <div key={project.id} className="projectCard" onClick={() => handleSelectProject(project.id)}>
              <div className="projectCardHeader"></div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p>Start Date: {project.startDate}</p>
              <div className="cardOptions">
                <span onClick={() => handleEditProject(project.id)}>Edit</span>
                <span onClick={() => handleDeleteProject(project.id)}>Delete</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <FaAngleLeft style={{fontSize:'16px'}}/>
          </button>
          <span style={{fontSize:'22px'}}>{currentPage}/{totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= filteredProjects.length}
          >
            <FaAngleRight style={{fontSize:'16px'}} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
