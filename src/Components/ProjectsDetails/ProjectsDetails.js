import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./ProjectsDetails.css";
import Nav from "../Nav/Nav";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [project] = useState(() => {
    const projects = JSON.parse(localStorage.getItem(`projects_${user.email}`)) || [];
    return projects.find((p) => p.id === parseInt(projectId));
  });
  const [members, setMembers] = useState([]);
  const [files, setFiles] = useState([]);
  const [budgetItems, setBudgetItems] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ name: "", value: 0 });

  const handleAddMember = (member) => {
    setMembers([...members, member]);
  };

  const handleAddFile = (file) => {
    setFiles([...files, file]);
  };

  const handleAddBudgetItem = () => {
    setBudgetItems([...budgetItems, newMaterial]);
    setNewMaterial({ name: "", value: 0 });
  };

  const totalBudget = budgetItems.reduce((total, item) => total + parseFloat(item.value), 0);

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav name={user?.name} handleLogout={() => { localStorage.removeItem("user"); window.location.href = "/"; }} />
      <main className="mainContent">
        <div className="project-details">
            <h2>{project.name}</h2>
            <p>Start Date: {project.startDate}</p>

            <div>
                <h3>Add Members</h3>
                <input type="text" placeholder="Member Name" onKeyDown={(e) => e.key === 'Enter' && handleAddMember(e.target.value)} />
                <ul>
                {members.map((member, index) => (
                    <li key={index}>{member}</li>
                ))}
                </ul>
            </div>

            <div>
                <h3>Attach Files</h3>
                <input type="file" onChange={(e) => handleAddFile(e.target.files[0])} />
                <ul>
                {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                ))}
                </ul>
            </div>

            <div>
                <h3>Budget</h3>
                <input
                type="text"
                placeholder="Material Name"
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                />
                <input
                type="number"
                placeholder="Material Value"
                value={newMaterial.value}
                onChange={(e) => setNewMaterial({ ...newMaterial, value: e.target.value })}
                />
                <button onClick={handleAddBudgetItem}>Add Material</button>
                <table>
                <thead>
                    <tr>
                    <th>Material</th>
                    <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {budgetItems.map((item, index) => (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.value}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
                <p>Total Budget: {totalBudget}</p>
            </div>
            </div>
        </main>
    </div>

  );
};

export default ProjectDetails;