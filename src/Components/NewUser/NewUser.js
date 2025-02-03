import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import './NewUser.css';
import { FaSearch, FaEye, FaAngleLeft, FaAngleRight } from "react-icons/fa";

const NewUser = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [numberSsn, setNumberSsn] = useState("");
  const [users, setUsers] = useState([]);
  const [ssnError, setSsnError] = useState("");
  const [role, setRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const navigate = useNavigate();

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(savedUsers);
  }, []);


  const handleAddUser = () => {
    const newUser = { email, password, name, photo,  dateOfBirth, numberSsn, role};
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setIsModalOpen(false);
    setEmail("");
    setPassword("");
    setName("");
    setPhoto(null);
    setDateOfBirth("");
    setNumberSsn("");
    setRole("");
    setSsnError("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const validateSsn = (ssn) => {
    const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
    return ssnPattern.test(ssn);
  };

  const handleToggleActive = (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].isActive = !updatedUsers[index].isActive;
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleViewUser = (index) => {
    setSelectedUser(users[index]);
    setIsViewModalOpen(true);
  };

  const handleSaveUser = () => {
    const updatedUsers = users.map(user => 
      user.email === selectedUser.email ? selectedUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setIsViewModalOpen(false);
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
  

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <Nav handleLogout={handleLogout} />
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
              <div className="photo-upload">
                {photo ? (
                  <img src={photo} alt="User" className="photo-preview" />
                ) : (
                  <div className="photo-placeholder">Upload Photo</div>
                )}
                <input type="file" onChange={handlePhotoChange} />
              </div>
              <input
                className="UserInfo"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="UserInfo"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="UserInfo"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                style={{ width: "24%" }}
                className="UserInfo"
                type="date"
                placeholder="Date of birth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                onFocus={(e) => e.target.placeholder = ""}
                onBlur={(e) => e.target.placeholder = "Date of birth"}
              />
              <input
                style={{ width: "24%" , marginLeft: "5rem" }}
                className="UserInfo"
                type="text"
                placeholder="SSN"
                value={numberSsn}
                onChange={(e) => setNumberSsn(e.target.value)}
                onBlur={() => {
                  if (!validateSsn(numberSsn)) {
                    setSsnError("SSN must be in the format 123-45-6789");
                  } else {
                    setSsnError("");
                  }
                }}
              />
              <select
                style={{ width: "24%", marginLeft: "5rem", height: "10%", borderRadius: "10px", border: "1px solid #ccc" }}
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
              <div className="photo-upload">
                {selectedUser.photo ? (
                  <img src={selectedUser.photo} alt="User" className="photo-preview" />
                ) : (
                  <div className="photo-placeholder">Upload Photo</div>
                )}
                <input type="file" onChange={(e) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setSelectedUser({ ...selectedUser, photo: reader.result });
                  };
                  if (file) {
                    reader.readAsDataURL(file);
                  }
                }} />
              </div>
              <input
                className="UserInfo"
                type="text"
                placeholder="Name"
                value={selectedUser.name}
                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
              />
              <input
                className="UserInfo"
                type="email"
                placeholder="Email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              />
              <input
                style={{ width: "24%" }}
                className="UserInfo"
                type="date"
                placeholder="Date of Born"
                value={selectedUser.dateOfBirth}
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
          <span style={{fontSize:'26px', border:'1px solid #ccc'}}>{currentPage}</span>
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