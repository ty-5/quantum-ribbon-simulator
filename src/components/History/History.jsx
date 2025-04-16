import React from 'react';
import './History.css';

const History = ({ operations }) => {
    return (
        <div className="history-container">
            <h3>Operation History:</h3>
            <ul>
                {operations.map((operation, index) => (
                    <li key={index}>
                        {operation}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default History;