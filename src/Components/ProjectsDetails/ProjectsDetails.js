import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProjectsDetails.css";
import Nav from "../Nav/Nav";
import { FaTrash } from "react-icons/fa";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [files, setFiles] = useState([]);
  const [budgetItems, setBudgetItems] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ name: "", value: 0 });
  const [allUsers, setAllUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/me', { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        navigate("/");
      });
    }, [navigate]);

    useEffect(() => {
      if (!user) {
        return;
    }
    console.log("Project ID:", projectId);

    axios.get(`http://localhost:5000/api/projects/${projectId}`)
    .then(response => {
      console.log('Project data:',response.data);
      setProject(response.data);
    })
    .catch(error => {
      console.error('Error fetching project:', error);
    });

    axios.get(`http://localhost:5000/api/members/${projectId}`)
    .then(response => {
      setMembers(response.data);
    })
    .catch(error => {
      console.error('Error fetching members:', error);
    });

    axios.get(`http://localhost:5000/api/files/${projectId}`)
    .then(response => {
      setFiles(response.data);
    })
    .catch(error => {
      console.error('Error fetching files:', error);
    });


    axios.get(`http://localhost:5000/api/budgetItems/${projectId}`)
      .then(response => {
        setBudgetItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching budget items:', error);
      });

    axios.get('http://localhost:5000/api/users')
      .then(response => {
        setAllUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [projectId, user, navigate]);

  useEffect(() => {
    if (projectId) {
      localStorage.setItem(`members_${projectId}`, JSON.stringify(members));
    }
  }, [members, projectId]);


  const handleAddMember = (member) => {
    axios.post(`http://localhost:5000/api/members/${projectId}`, { member })
      .then(response => {
        setMembers([...members, response.data]);
      })
      .catch(error => {
        console.error('Error adding member:', error);
      });
  };

  const handleRemoveMember = (index) => {
    const memberToRemove = members[index];
    axios.delete(`http://localhost:5000/api/members/${projectId}/${memberToRemove.id}`)
      .then(() => {
        setMembers(members.filter((_, i) => i !== index));
      })
      .catch(error => {
        console.error('Error removing member:', error);
      });
  };

  const handleAddFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post(`http://localhost:5000/api/files/${projectId}`, formData)
      .then(response => {
        setFiles([...files, response.data]);
      })
      .catch(error => {
        console.error('Error adding file:', error);
      });
  };

  const handleRemoveFile = (index) => {
    const fileToRemove = files[index];
    axios.delete(`http://localhost:5000/api/files/${projectId}/${fileToRemove.id}`)
      .then(() => {
        setFiles(files.filter((_, i) => i !== index));
      })
      .catch(error => {
        console.error('Error removing file:', error);
      });
  };

  const handleAddBudgetItem = () => {
    if (editIndex >= 0) {
      const updatedItem = { ...newMaterial, projectId };
      axios.put(`http://localhost:5000/api/budgetItems/${budgetItems[editIndex].id}`, updatedItem)
        .then(response => {
          const updatedItems = budgetItems.map((item, index) =>
            index === editIndex ? response.data : item
          );
          setBudgetItems(updatedItems);
          setEditIndex(-1);
        })
        .catch(error => {
          console.error('Error updating budget item:', error);
        });
    } else {
      const newItem = { ...newMaterial, projectId };
      axios.post(`http://localhost:5000/api/budgetItems`, newItem)
        .then(response => {
          setBudgetItems([...budgetItems, response.data]);
        })
        .catch(error => {
          console.error('Error adding budget item:', error);
        });
    }
    setNewMaterial({ name: "", value: 0 });
  };

  const handleEditBudgetItem = (index) => {
    setNewMaterial(budgetItems[index]);
    setEditIndex(index);
  };

  const handleRemoveBudgetItem = (index) => {
    const itemToRemove = budgetItems[index];
    axios.delete(`http://localhost:5000/api/budgetItems/${itemToRemove.id}`)
      .then(() => {
        setBudgetItems(budgetItems.filter((_, i) => i !== index));
      })
      .catch(error => {
        console.error('Error removing budget item:', error);
      });
  };

  /*const addNotification = (member) => {
    const notifications = JSON.parse(localStorage.getItem(`notifications_${member}`)) || [];
    notifications.push(`You have been added to the project: ${project.name}`);
    localStorage.setItem(`notifications_${member}`, JSON.stringify(notifications));
  };

  const linkProjectToUser = (member) => {
    const userProjects = JSON.parse(localStorage.getItem(`projects_${member}`)) || [];
    userProjects.push(project);
    localStorage.setItem(`projects_${member}`, JSON.stringify(userProjects));
  };*/

  const totalBudget = budgetItems.reduce((total, item) => total + parseFloat(item.value), 0);

  if (!project) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    // Limpar o cookie da sessão
    document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Nav name={user?.name} handleLogout={handleLogout} />
      <main className="mainContent">
        <div className="project-details">
        <h2>{project ? project.name : "Project Name Not Available"}</h2>
        <p>Start Date: {project ? project.startDate : "Start Date Not Available"}</p>

          <div>
            <h3>Add Members</h3>
            <select style={{ padding: '0.5rem' }} onChange={(e) => handleAddMember(e.target.value)}>
              <option value="">Select Member</option>
              {allUsers.map((user, index) => (
                <option key={index} value={user.email}>{user.name} ({user.email})</option>
              ))}
            </select>
            <ul>
              {members.map((member, index) => (
                <li key={index}>
                  {member}
                  <FaTrash className="trash" onClick={() => handleRemoveMember(index)} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Attach Files</h3>
            <input type="file" onChange={(e) => handleAddFile(e.target.files[0])} />
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  <a href={URL.createObjectURL(file)} download={file.name}>{file.name}</a>
                  <FaTrash className="trash" onClick={() => handleRemoveFile(index)} />
                </li>
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
            <button className='addMatrial' onClick={handleAddBudgetItem}>Add Material +</button>
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
                    <td>
                      <button className="editBudget" onClick={() => handleEditBudgetItem(index)}>Edit</button>
                      <button className="removeBudget" onClick={() => handleRemoveBudgetItem(index)}>Remove</button>
                    </td>
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