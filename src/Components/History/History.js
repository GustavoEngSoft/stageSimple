import React, {useState, useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Nav from "../Nav/Nav";


const History = () => {
    const { projectId } = useParams();
    const [history, setHistory] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
    axios.get('http://localhost:5000/api/users/me', { withCredentials: true })
        .then(response => {
        setUser(response.data);
        })
        .catch(error => {
        console.error('Error fetching user:', error);
        });

    axios.get(`http://localhost:5000/api/projects/${projectId}/history`, { withCredentials: true })
        .then(response => {
            if (Array.isArray(response.data)) {
                setHistory(response.data);
              } else {
                console.error('Unexpected response data:', response.data);
              }
        })
        .catch(error => {
        console.error('Error fetching project history:', error);
        });
    }, [projectId]);



  return (
    <div className="flex h-screen bg-gray-100">
      <Nav name={user?.name} />
      <main className="mainContent">
        <h2>Project History</h2>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              <p><strong>Action:</strong> {entry.action}</p>
              <p><strong>User:</strong> {entry.user_name}</p>
              <p><strong>Timestamp:</strong> {entry.timestamp}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};




export default History;