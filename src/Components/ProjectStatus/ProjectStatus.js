import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProjectStatus.css";
import axios from "../../axiosConfig";
import Nav from "../Nav/Nav";
import './ProjectStatus.css';

const ProjectStatus = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState({
    initialDocuments: false,
    constructionPlan: false,
    constructionStart: false,
    finalReview: false,
  });
  const [progress, setProgress] = useState(0);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/projects/${projectId}`)
      .then(response => {
        setProject(response.data);
        setStatus(response.data.status || {
          initialDocuments: false,
          constructionPlan: false,
          constructionStart: false,
          finalReview: false,
        });
        setProgress(response.data.progress || 0);
        console.log('Project status fetched successfully:', response.data.progress);
      })
      .catch(error => {
        console.error('Error fetching project status:', error);
      });

      axios.get('http://localhost:5000/api/users/me', { withCredentials: true })
      .then(response => {
        setUserRole(response.data.role);
      })
      .catch(error => {
        console.error('Error fetching user role:', error);
      });
      
  }, [projectId]);

  const handleStatusChange = (key) => {
    if (userRole !== 'Product Manager') {
      alert('Only Product Managers can update the project status.');
      return;
    }
    const updatedStatus = { ...status, [key]: !status[key] };
    setStatus(updatedStatus);
    const updatedProgress = (Object.values(updatedStatus).filter(value => value).length / 4) * 100;
    setProgress(updatedProgress);
    console.log('Updated status:', updatedStatus);
    console.log('Updated progress:', updatedProgress);
    axios.put(`http://localhost:5000/api/projects/${projectId}/status`, {status: updatedStatus})
      .then(response => {
        console.log('Status updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <Nav />
        <main className="project-status-container">       
        <h1 className="text_PS">Project Status: {project.name}</h1>
        <div className="status-cards">
            <div className="status-card">
            <h2 className="text_PS">Initial Documents</h2>
            <label className="switch_1">
                <input 
                type="checkbox" 
                checked={status.initialDocuments} 
                onChange={() => handleStatusChange('initialDocuments')} />
                <span className="slider round"></span>
            </label>
            </div>
            <div className="status-card">
            <h2 className='text_PS'>Construction Plan</h2>
            <label className="switch_2">
                <input 
                type="checkbox" 
                checked={status.constructionPlan} 
                onChange={() => handleStatusChange('constructionPlan')} 
                disabled={!status.initialDocuments}
                />
                <span className="slider round"></span>
            </label>
            </div>
            <div className="status-card">
            <h2 className="text_PS">Construction Start</h2>
            <label className="switch_3">
                <input 
                type="checkbox" 
                checked={status.constructionStart} 
                onChange={() => handleStatusChange('constructionStart')} 
                disabled={!status.constructionPlan}
                />
                <span className="slider round"></span>
            </label>
            </div>
            <div className="status-card">
            <h2 className="text_PS">Final Review</h2>
            <label className="switch_4">
                <input 
                type="checkbox" 
                checked={status.finalReview} 
                onChange={() => handleStatusChange('finalReview')} 
                disabled={!status.constructionStart}
                />
                <span className="slider round"></span>
            </label>
            </div>
        </div>
        <div className="progress">
            <h2 className="text_PS">Project Progress: {progress}%</h2>
        </div>
        </main>
    </div>
  );
};

export default ProjectStatus;