import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import "./Payroll.css";
import Nav from "../Nav/Nav";
import axios from "../../axiosConfig";

const Payroll = () => {
  const [subcontractors, setSubcontractors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubcontractor, setNewSubcontractor] = useState({ name: "", role: "", hoursWorked: 0, hourlyRate: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get('http://localhost:5000/api/payroll')
      .then(response => {
        setSubcontractors(response.data);
      })
      .catch(error => {
        console.error('Error fetching subcontractors:', error);
      });
  }, []);

  const handleAddSubcontractor = () => {
    axios.post('http://localhost:5000/api/payroll', newSubcontractor)
    .then(response => {
      setSubcontractors([...subcontractors, response.data]);
      setIsModalOpen(false);
      setNewSubcontractor({ name: "", role: "", hoursWorked: 0, hourlyRate: 0 });
    })
    .catch(error => {
      console.error('Error adding subcontractor:', error);
    });
  };

  const handleDeleteSubcontractor = (id) => {
    axios.delete(`http://localhost:5000/api/payroll/${id}`)
    .then(() => {
      setSubcontractors(subcontractors.filter(subcontractor => subcontractor.id !== id));
    })
    .catch(error => {
      console.error('Error deleting subcontractor:', error);
    });
  };

  const handleEditSubcontractor = (subcontractor) => {
    setNewSubcontractor(subcontractor);
    setIsModalOpen(true);
  };

  const handleSaveEditSubcontractor = () => {
    axios.put(`http://localhost:5000/api/payroll/${newSubcontractor.id}`, newSubcontractor)
      .then(response => {
        setSubcontractors(subcontractors.map(subcontractor => 
          subcontractor.id === newSubcontractor.id ? response.data : subcontractor
        ));
        setIsModalOpen(false);
        setNewSubcontractor({ name: "", role: "", hoursWorked: 0, hourlyRate: 0 });
      })
      .catch(error => {
        console.error('Error updating subcontractor:', error);
      });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastRow = currentPage * itemsPerPage;
  const indexOfFirstRow = indexOfLastRow - itemsPerPage;
  const currentRows = Array.isArray(subcontractors) ? subcontractors.slice(indexOfFirstRow, indexOfLastRow) : [];

  const totalPages = Math.max(1, Math.ceil(subcontractors.length / itemsPerPage));

  const calculateTotalPay = (hoursWorked, hourlyRate) => {
    return hoursWorked * hourlyRate;
  };

  

  return (
    <div className="flex h-screen bg-gray-100">
        <Nav />
        <main className="payroll-container">
        <h1>Payroll Management</h1>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
            <FaPlus /> Add Subcontractor
        </button>
        <table className="payroll-table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Hours Worked</th>
                <th>Hourly Rate</th>
                <th>Total Pay</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {currentRows.map((subcontractor) => (
                <tr key={subcontractor.id}>
                <td>{subcontractor.name}</td>
                <td>{subcontractor.role}</td>
                <td>{subcontractor.hoursWorked}</td>
                <td>${subcontractor.hourlyRate}</td>
                <td>${calculateTotalPay(subcontractor.hoursWorked, subcontractor.hourlyRate)}</td>
                <td>
                    <button onClick={() => handleEditSubcontractor(subcontractor)}>
                    <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteSubcontractor(subcontractor.id)}>
                    <FaTrash />
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <FaAngleLeft />
          </button>
          <span>{currentPage}/{totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <FaAngleRight />
          </button>
        </div>

        {isModalOpen && (
            <div className="modalP">
            <div className="modalPayroll">
                <h2>{newSubcontractor.id ? "Edit Subcontractor" : "Add Subcontractor"}</h2>
                <input
                type="text"
                placeholder="Name"
                value={newSubcontractor.name}
                onChange={(e) => setNewSubcontractor({ ...newSubcontractor, name: e.target.value })}
                />
                <input
                type="text"
                placeholder="Role"
                value={newSubcontractor.role}
                onChange={(e) => setNewSubcontractor({ ...newSubcontractor, role: e.target.value })}
                />
                <input
                type="text"
                placeholder="Hours Worked"
                value={newSubcontractor.hoursWorked}
                onChange={(e) => setNewSubcontractor({ ...newSubcontractor, hoursWorked: e.target.value })}
                />
                <input
                type="text"
                placeholder="Hourly Rate"
                value={newSubcontractor.hourlyRate}
                onChange={(e) => setNewSubcontractor({ ...newSubcontractor, hourlyRate: e.target.value })}
                />
                <button className="bottonSave" onClick={newSubcontractor.id ? handleSaveEditSubcontractor : handleAddSubcontractor}>Save</button>
                <button className= 'bottonCancel' onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
            </div>
        )}
        </main>
    </div>
  );
};

export default Payroll;