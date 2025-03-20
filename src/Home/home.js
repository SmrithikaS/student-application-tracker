import React, { useEffect, useState } from "react";
import axios from "axios";
import './home.css'
const App = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/application")
        .then(response => {
            console.log("API Response:", response.data);
            setItems(response.data);
        })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="container">
            <h1>My Application</h1>
            <div className="card-grid">
                {items.map(item => (
                    <div key={item.id} className="card">
                    <h2>{item.name}</h2>
                    <p>Status: {item.status}</p>
                    <p>Interview Date: {item.interview ? item.interview : "Not Scheduled"}</p>
                    <p>Result: {item.result || "Pending"}</p>

                </div>                
                ))}
            </div>
        </div>
    );
};

export default App;
