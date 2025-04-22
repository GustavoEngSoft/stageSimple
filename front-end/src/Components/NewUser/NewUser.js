import { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import './NewUser.css';
import { FaSearch, FaEye, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import axios from "../../axiosConfig";


const NewUser = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [ssn, setSsn] = useState("");
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    name: "",
    email: "",
    role: "",
    dateOfBirth: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        console.log("Fetched users:",response.data);
        setUsers(response.data.rows);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      }
    };

    fetchUsers();
  }, []);


  const handleAddUser = async () => {
    const formData = {
      name,
      email,
      password,
      role,
      birthdate: dateOfBirth,
      ssn,
      isActive: true
    };
    try {
      const response = await axios.post('http://localhost:5000/api/register', formData);
      if (response.status === 201) {
        console.log("User registered successfully:", response.data);
      } else {
        alert(response.data.error);
      }
    } catch (err) {
      console.error("Erro ao registrar usuário:", err);
      alert("Erro ao registrar usuário. Tente novamente.");
    }
  };

  const validateSsn = (ssn) => {
    const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
    return ssnPattern.test(ssn);
  };

  const handleToggleActive = async (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].isActive = !updatedUsers[index].isActive;
    setUsers(updatedUsers);

    try {
      await axios.put(`http://localhost:5000/api/users/${updatedUsers[index].id}`, { isActive: updatedUsers[index].isActive });
      console.log("User status updated successfully");
    } catch (err) {
      console.error("Erro ao atualizar status do usuário:", err);
      alert("Erro ao atualizar status do usuário. Tente novamente.");
    }
  };

  const handleViewUser = (index) => {
    const user = users[index];
    setSelectedUser({
      ...user,
      dateOfBirth: user.birthdate
  });
    setIsViewModalOpen(true);
  };

  const handleSaveUser = async () => {
    console.log("Selected User ID:", selectedUser.id); // Log the selected user ID
    if (!selectedUser.id) {
      alert("User ID is missing. Cannot update user.");
      return;
    }
    console.log("Selected User:", selectedUser);
    const updatedUsers = users.map(user =>
      user.email === selectedUser.email ? selectedUser : user
    );
    setUsers(updatedUsers);
    setIsViewModalOpen(false);

    try {
      const response = await axios.put(`http://localhost:5000/api/user/${selectedUser.id}`, selectedUser);
      if (response.status === 200) {
        console.log("User updated successfully:", response.data);
      } else {
        console.error("Erro ao atualizar usuário:", response.data.error);
        alert(response.data.error);
      }
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      alert("Erro ao atualizar usuário. Tente novamente.");
    }
  };
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }; 
  
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div>
      <Nav/>
      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <div className="header">
            <div className="search-bar">
              <input
              type="text"
              placeholder="Search for user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button>
                <FaSearch />
              </button>
            </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="new-project-btn"
              >
              <span className="text-lg mr-2">+</span> New User
              </button>
        </div>

         {/* Modal */}
         {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h1 className="text_newUser">New User</h1>
              <input
                style={{ width: "98%", borderRadius: "10px", border: "1px solid #ccc", marginBottom: "1rem", padding: "0.6rem" }}
                className="UserInfo"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
               style={{ width: "98%", borderRadius: "10px", border: "1px solid #ccc", marginBottom: "1rem", padding: "0.6rem" }}
                className="UserInfo"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                style={{ width: "98%", borderRadius: "10px", border: "1px solid #ccc", marginBottom: "1rem", padding: "0.6rem" }}
                className="UserInfo"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                style={{ width: "24%", height: "7%", borderRadius: "10px", border: "1px solid #ccc" }}
                className="UserInfo"
                type="date"
                placeholder="Date of birth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                onFocus={(e) => e.target.placeholder = ""}
                onBlur={(e) => e.target.placeholder = "Date of birth"}
              />
              <input
                style={{ width: "24%" , marginLeft: "6rem", height: "7%", borderRadius: "10px", border: "1px solid #ccc" }}
                className="UserInfo"
                type="text"
                placeholder="SSN"
                value={ssn}
                onChange={(e) => setSsn(e.target.value)}
                onBlur={() => {
                  if (!validateSsn(ssn)) {
                    alert("SSN must be in the format 123-45-6789");
                  } else {
                    return;
                  }
                }}
              />
              <select
                style={{ width: "24%", marginLeft: "5.4rem", height: "10%", borderRadius: "10px", border: "1px solid #ccc" }}
                className="UserInfo"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="" disabled>Select Role</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Architect">Architect</option>
                <option value="Engineer">Engineer</option>
              </select>
              <button className="saveButton" onClick={handleAddUser}>Salvar</button>
              <button onClick={() => setIsModalOpen(false)} className="mt-2">Cancelar</button>
            </div>
          </div>
        )}

         {/* View/Edit Modal */}
         {isViewModalOpen && selectedUser && (
          <div className="modal-overlay">
            <div className="modal">
              <h1 className="text_newUser">
                {selectedUser.name}
              </h1> 
              <input
               style={{ width: "98%", borderRadius: "10px", border: "1px solid #ccc", marginBottom: "1rem", padding: "0.6rem" }}
                className="UserInfo"
                type="text"
                placeholder="Name"
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
              />
              <input
               style={{ width: "98%", borderRadius: "10px", border: "1px solid #ccc", marginBottom: "1rem", padding: "0.6rem" }}
                className="UserInfo"
                type="email"
                placeholder="Email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              />
              <input
                style={{ width: "24%", height: "7%", borderRadius: "10px", border: "1px solid #ccc" }}
                className="UserInfo"
                type="date"
                placeholder="Date of Born"
                value={selectedUser.dateOfBirth.split('T')[0]}
                onChange={(e) => setSelectedUser({ ...selectedUser, dateOfBirth: e.target.value })}
                onFocus={(e) => e.target.placeholder = ""}
                onBlur={(e) => e.target.placeholder = "Date of Born"}
              />
              <select
                style={{ width: "24%", marginLeft: "5rem", height: "10%", borderRadius: "10px", border: "1px solid #ccc" }}
                className="UserInfo"
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
              >
                <option value="" disabled>Select Role</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Architect">Architect</option>
                <option value="Engineer">Engineer</option>
              </select>
              <button className="saveButton" onClick={handleSaveUser}>Salvar</button>
              <button onClick={() => setIsViewModalOpen(false)} className="mt-2">Cancelar</button>
            </div>
          </div>
        )}


        {/* User Cards */}
        <div className="grid-container">
        {paginatedUsers.map((user, index) => (
            <div key={index} className="user-card">
              <h3 className="nameUserS">{user.name}</h3>
              <p className="roleUser">{user.role}</p>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={user.isActive}
                  onChange={() => handleToggleActive(index)}
                />
                <span className="slider round"></span>
              </label>
              <button className="viewButton" onClick={() => handleViewUser(index)}>
                <FaEye />
              </button>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <FaAngleLeft style={{fontSize:'16px'}}/>
          </button>
          <span style={{fontSize:'22px', fontWeight: 'Arial, sans-serif'}}>{currentPage}/{totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= filteredUsers.length}
          >
          <FaAngleRight style={{fontSize:'16px'}} />
          </button>
        </div>
      </main>
    </div>
  );
}

export default NewUser;