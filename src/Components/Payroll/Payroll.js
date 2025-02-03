import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./Payroll.css";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";

const Payroll = () => {
  const [subcontractors, setSubcontractors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubcontractor, setNewSubcontractor] = useState({ name: "", role: "", hoursWorked: 0, hourlyRate: 0 });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const savedSubcontractors = JSON.parse(localStorage.getItem("subcontractors")) || [];
    setSubcontractors(savedSubcontractors);
  }, []);

  const handleAddSubcontractor = () => {
    const updatedSubcontractors = [...subcontractors, newSubcontractor];
    setSubcontractors(updatedSubcontractors);
    localStorage.setItem("subcontractors", JSON.stringify(updatedSubcontractors));
    setIsModalOpen(false);
    setNewSubcontractor({ name: "", role: "", hoursWorked: 0, hourlyRate: 0 });
  };

  const handleDeleteSubcontractor = (index) => {
    const updatedSubcontractors = subcontractors.filter((_, i) => i !== index);
    setSubcontractors(updatedSubcontractors);
    localStorage.setItem("subcontractors", JSON.stringify(updatedSubcontractors));
  };

  const handleEditSubcontractor = (index) => {
    const subcontractorToEdit = subcontractors[index];
    setNewSubcontractor(subcontractorToEdit);
    handleDeleteSubcontractor(index);
    setIsModalOpen(true);
  };

  const calculateTotalPay = (hoursWorked, hourlyRate) => {
    return hoursWorked * hourlyRate;
  };

  

  return (
    <div className="flex h-screen bg-gray-100">
        <Nav handleLogout={handleLogout} />
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
            {subcontractors.map((subcontractor, index) => (
                <tr key={index}>
                <td>{subcontractor.name}</td>
                <td>{subcontractor.role}</td>
                <td>{subcontractor.hoursWorked}</td>
                <td>${subcontractor.hourlyRate}</td>
                <td>${calculateTotalPay(subcontractor.hoursWorked, subcontractor.hourlyRate)}</td>
                <td>
                    <button onClick={() => handleEditSubcontractor(index)}>
                    <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteSubcontractor(index)}>
                    <FaTrash />
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        {isModalOpen && (
            <div className="modalP">
            <div className="modalPayroll">
                <h2>Add/Edit Subcontractor</h2>
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
                <button className="bottonSave" onClick={handleAddSubcontractor}>Save</button>
                <button className= 'bottonCancel' onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
            </div>
        )}
        </main>
    </div>
  );
};

export default Payroll;