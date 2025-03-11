import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ProjectsDetails.css";
import Nav from "../Nav/Nav";
import { FaPen, FaTrash, FaFolder, FaFile, FaChevronDown, FaChevronRight} from "react-icons/fa";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';

// Função para formatar a data
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [projectMaterials, setProjectMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ name: "", value: 0 });
  const [allUsers, setAllUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  const [folderOpenStates, setFolderOpenStates] = useState({});

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

    axios.get(`http://localhost:5000/api/projects/${projectId}`, { withCredentials: true })
    .then(response => {
      console.log('Project data:',response.data);
      setProject(response.data);
    })
    .catch(error => {
      console.error('Error fetching project:', error);
    });

    axios.get(`http://localhost:5000/api/members/${projectId}`, { withCredentials: true })
    .then(response => {
      setMembers(response.data);
    })
    .catch(error => {
      console.error('Error fetching members:', error);
    });

    axios.get(`http://localhost:5000/api/files/folders/${projectId}`)
    .then(response => {
      console.log('API response for folders:', response.data);
      const foldersWithFiles = response.data.map(folder => ({
        ...folder,
        files: [] // Inicializa a propriedade files como um array vazio se estiver undefined
      }));
      setFolders(foldersWithFiles);
      setFolderOpenStates(foldersWithFiles.reduce((acc, folder, index) => {
        acc[index] = false;
        return acc;
      }, {}));
      // Carregar arquivos para cada pasta
      foldersWithFiles.forEach((folder, index) => {
        axios.get(`http://localhost:5000/api/files/${projectId}/${folder.id}`)
          .then(fileResponse => {
            setFolders(prevFolders => {
              const updatedFolders = [...prevFolders];
              updatedFolders[index].files = fileResponse.data;
              return updatedFolders;
            });
          })
          .catch(error => {
            console.error('Error fetching files for folder:', folder.id, error);
          });
      });
    })
    .catch(error => {
      console.error('Error fetching folders:', error);
      setFolders([]);
    });


    axios.get(`http://localhost:5000/api/projectMaterials/${projectId}`, { withCredentials: true })
      .then(response => {
        setProjectMaterials(response.data);
      })
      .catch(error => {
        console.error('Error fetching budget items:', error);
      });

    axios.get('http://localhost:5000/api/users', { withCredentials: true })
      .then(response => {
        setAllUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, [projectId, user, navigate]);



  const handleAddMember = (memberEmail) => {
    if (user?.role !== "Product Manager") {
      alert("Only Product Managers can add members.");
      return;
    }
    const selectedUser = allUsers.find(user => user.email === memberEmail);
    if (selectedUser) {
       // Verificar se o membro já foi adicionado
       const isMemberAlreadyAdded = members.some(member => member.email === selectedUser.email);
       if (isMemberAlreadyAdded) {
         alert("Este membro já foi adicionado ao projeto.");
         return;
       }
      console.log("Selected User:", selectedUser);
      console.log("Request Body", { member: selectedUser.id });
      axios.post(`http://localhost:5000/api/members/${projectId}`, { member: selectedUser.id })
        .then(response => {
          setMembers([...members, response.data]);
          addNotification(`Member ${selectedUser.name} added to the project.`);
        })
        .catch(error => {
          console.error('Error adding member:', error);
        });
    }
  };

  const handleRemoveMember = (index) => {
    if (user?.role !== "Product Manager") {
      alert("Only Product Managers can remove members.");
      return;
    }
    const memberToRemove = members[index];
    axios.delete(`http://localhost:5000/api/members/${projectId}/${memberToRemove.id}`)
      .then(() => {
        setMembers(members.filter((_, i) => i !== index));
        addNotification(`Member ${memberToRemove.name} removed from the project.`);
      })
      .catch(error => {
        console.error('Error removing member:', error);
      });
  };

  /*const handleAddFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post(`http://localhost:5000/api/files/${projectId}`, formData)
      .then(response => {
        setFiles([...files, response.data]);
        addNotification(`File ${file.name} added to the project.`);
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
        addNotification(`File ${fileToRemove.name} removed from the project.`);
      })
      .catch(error => {
        console.error('Error removing file:', error);
      });
  };*/

  const handleAddBudgetItem = () => {
    if (editIndex >= 0) {
      const updatedItem = { ...newMaterial, projectId };
      axios.put(`http://localhost:5000/api/projectMaterials/${projectMaterials[editIndex].id}`, updatedItem)
        .then(response => {
          const updatedItems = projectMaterials.map((item, index) =>
            index === editIndex ? response.data : item
          );
          setProjectMaterials(updatedItems);
          setEditIndex(-1);
          addNotification(`Budget item ${newMaterial.name} updated.`);
        })
        .catch(error => {
          console.error('Error updating budget item:', error);
        });
    } else {
      const newItem = { ...newMaterial, projectId };
      axios.post(`http://localhost:5000/api/projectMaterials`, newItem)
        .then(response => {
          setProjectMaterials([...projectMaterials, response.data]);
          addNotification(`Budget item ${newMaterial.name} added.`);
        })
        .catch(error => {
          console.error('Error adding budget item:', error);
        });
    }
    setNewMaterial({ name: "", value: 0 });
  };

  const handleEditBudgetItem = (index) => {
    setNewMaterial(projectMaterials[index]);
    setEditIndex(index);
  };

  const handleRemoveBudgetItem = (index) => {
    const itemToRemove = projectMaterials[index];
    axios.delete(`http://localhost:5000/api/projectMaterials/${itemToRemove.id}`)
      .then(() => {
        setProjectMaterials(projectMaterials.filter((_, i) => i !== index));
        addNotification(`Budget item ${itemToRemove.name} removed.`);
      })
      .catch(error => {
        console.error('Error removing budget item:', error);
      });
  };

  const addNotification = (message) => {
    const newNotification = {
      message,
      user: user.name,
      timestamp: new Date().toLocaleString()
    };
    setNotifications([...notifications, newNotification]);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const handleAddFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      axios.post(`http://localhost:5000/api/files/folders/${projectId}`, { name: folderName })
        .then(response => {
          setFolders(prevFolders => [...prevFolders,{ ...response.data, files: [] }]);
          addNotification(`Folder ${folderName} added to the project.`);
          console.log("Folders:", folders);
        })
        .catch(error => {
          console.error('Error adding folder:', error);
        });
    }
  };

  const handleRemoveFolder = (folderIndex) => {
    const folderToRemove = folders[folderIndex];
    axios.delete(`http://localhost:5000/api/files/folders/${projectId}/${folderToRemove.id}`)
      .then(() => {
        setFolders(folders.filter((_, i) => i !== folderIndex));
        addNotification(`Folder ${folderToRemove.name} removed from the project.`);
      })
      .catch(error => {
        console.error('Error removing folder:', error);
      });
  };
  
  const handleAddFileToFolder = (folderIndex, file) => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    console.log("Folder Index:", folderIndex);
    console.log("File:", file);
    const formData = new FormData();
    formData.append('file', file);

    axios.post(`http://localhost:5000/api/files/${projectId}/${folders[folderIndex].id}`, formData)
      .then(response => {
        console.log("Response:", response.data);
        setFolders(prevFolders => {
          const updatedFolders = [...prevFolders];
          if (updatedFolders[folderIndex]) {
            if (!Array.isArray(updatedFolders[folderIndex].files)) {
              updatedFolders[folderIndex].files = []; // Inicializa a propriedade files como um array vazio se estiver undefined
            }
            // Verificação para garantir que o arquivo não está sendo adicionado mais de uma vez
            if (!updatedFolders[folderIndex].files.some(f => f.id === response.data.id)) {
              updatedFolders[folderIndex].files.push(response.data);
            }
          } else {
            console.error('Folder is undefined');
          }
          console.log("Updated Folders:", updatedFolders);
          return updatedFolders;
        });
        addNotification(`File ${file.name} added to folder ${folders[folderIndex].name}.`);
      })
      .catch(error => {
        console.error('Error adding file:', error);
      });
  };


  const handleDragStart = (e, folderIndex, fileIndex) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ folderIndex, fileIndex }));
  };
  
  const handleDrop = (e, targetFolderIndex) => {
    e.preventDefault();
    const { folderIndex, fileIndex } = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (folderIndex !== targetFolderIndex) {
      const fileToMove = folders[folderIndex].files[fileIndex];
      const updatedFolders = [...folders];
      updatedFolders[folderIndex].files.splice(fileIndex, 1);
      updatedFolders[targetFolderIndex].files.push(fileToMove);
      setFolders(updatedFolders);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveFile = (folderIndex, fileIndex) => {
    const fileToRemove = folders[folderIndex].files[fileIndex];
    axios.delete(`http://localhost:5000/api/files/${projectId}/${folders[folderIndex].id}/${fileToRemove.id}`)
      .then(() => {
        const updatedFolders = [...folders];
        updatedFolders[folderIndex].files.splice(fileIndex, 1);
        setFolders(updatedFolders);
        addNotification(`File ${fileToRemove.name} removed from folder ${folders[folderIndex].name}.`);
      })
      .catch(error => {
        console.error('Error removing file:', error);
      });
  };

  const toggleFolderOpenState = (index) => {
    setFolderOpenStates(prevStates => ({
      ...prevStates,
      [index]: !prevStates[index]
    }));
  };

  
  const totalBudget = projectMaterials.reduce((total, item) => total + parseFloat(item.value), 0);

  if (!project) {
    return <div>Loading...</div>;
  }


  return (
    <div className="flex h-screen bg-gray-100">
      <Nav name={user?.name} notifications={notifications} openModal={openModal} />
      <main className="mainContent">
        <div className="project-details">
        <h2>{project ? project.name : "Project Name Not Available"}</h2>
        <p>Start Date: {project ? formatDate(project.startDate) : "Start Date Not Available"}</p>
          <div>
            <h3>Add Members</h3>
            {user?.role === "Product Manager" && (
              <select style={{ padding: '0.5rem' }} onChange={(e) => handleAddMember(e.target.value)}>
              <option value="">Select Member</option>
              {allUsers.map((user, index) => (
                <option key={index} value={user.email}>{user.name} ({user.email})</option>
              ))}
            </select>
            )}
            <ul>
              {members.map((member, index) => (
                <li key={index}>
                  {member.name}
                  <FaTrash className="trash" onClick={() => handleRemoveMember(index)} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Add Folder</h3>
            <button className= 'addFolder' onClick={handleAddFolder}>Add Folder +</button>
            {Array.isArray(folders) && folders.map((folder, folderIndex) => (
            <div key={folderIndex} className="folder" onDrop={(e) => handleDrop(e, folderIndex)} onDragOver={handleDragOver}>
              <h4 className="folder-header">
                <span onClick={() => toggleFolderOpenState(folderIndex)} className="folder-toggle">
                    {folderOpenStates[folderIndex] ? <FaChevronDown /> : <FaChevronRight />}
                </span>
                <FaFolder  
                className="folder-icon" 
                /> {folder.name}
                <FaTrash className="trash" onClick={() => handleRemoveFolder(folderIndex)} />
              </h4>
              {folderOpenStates[folderIndex] && (
                <>
                <input
                  type="file"
                  onChange={(e) => handleAddFileToFolder(folderIndex, e.target.files[0])}
                  className="file-input"
                />
                <ul className="files-list">
                  {Array.isArray(folder.files) && folder.files.map((file, fileIndex) => (
                    <li key={fileIndex} draggable onDragStart={(e) => handleDragStart(e, folderIndex, fileIndex)} className="file-item">
                      <FaFile className="file-icon"/><a className="filesPastas" href={`http://localhost:5000/api/files/download/${file.id}`} download={file.name} >
                        {file.name}
                      </a>
                      <FaTrash className="trash" onClick={() => handleRemoveFile(folderIndex, fileIndex)} />
                    </li>
                  ))}
                </ul>
                </>
              )}
            </div>
          ))}
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
                {projectMaterials.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.value}</td>
                    <td>
                      <button className="editBudget" onClick={() => handleEditBudgetItem(index)}><FaPen/></button>
                      <button className="removeBudget" onClick={() => handleRemoveBudgetItem(index)}><FaTrash/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Total Budget: {totalBudget}</p>
          </div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Notifications"
            className="modal_notifications"
          >
            <h2 className="text_n">Notifications</h2>
            <ul className="notifications">
              {notifications.map((notification, index) => (
                <li key={index}>
                  <p>{notification.message}</p>
                  <p><strong>User:</strong> {notification.user}</p>
                  <p><strong>Time:</strong> {notification.timestamp}</p>
                </li>
              ))}
            </ul>
            <button className="close_n" onClick={closeModal}>Close</button>
          </Modal>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;