import React from 'react';
import './TwoQubitControls.css';

const TwoQubitControls = ({ onGateApply, onSingleQubitGateApply }) => {
    // Single qubit gates
    const singleQubitGates = [
        { name: 'X', style: { backgroundColor: '#e6f7ff', borderColor: '#91d5ff' } },
        { name: 'Z', style: { backgroundColor: '#f6ffed', borderColor: '#b7eb8f' } },
        { name: 'H', style: { backgroundColor: '#f9f0ff', borderColor: '#d3adf7' } },
    ];

    // Two-qubit gates
    const twoQubitGates = [
        { name: 'CNOT', style: { backgroundColor: '#fff1f0', borderColor: '#ffa39e' } },
        { name: 'Measure', style: { backgroundColor: '#fff2f0', borderColor: '#ffccc7' } },
        { name: 'Reset', style: { backgroundColor: '#f5f5f5', borderColor: '#d9d9d9' } },
    ];

    return (
        <div className="two-qubit-controls">
            <div className="qubit-section">
                <h3>Qubit 1 (Control)</h3>
                <div className="controls">
                    {singleQubitGates.map(gate => (
                        <button
                            key={`q1-${gate.name}`}
                            onClick={() => onSingleQubitGateApply(gate.name, 0)}
                            style={gate.style}
                        >
                            {gate.name} Gate
                        </button>
                    ))}
                </div>
            </div>

            <div className="qubit-section">
                <h3>Qubit 2 (Target)</h3>
                <div className="controls">
                    {singleQubitGates.map(gate => (
                        <button
                            key={`q2-${gate.name}`}
                            onClick={() => onSingleQubitGateApply(gate.name, 1)}
                            style={gate.style}
                        >
                            {gate.name} Gate
                        </button>
                    ))}
                </div>
            </div>

            <div className="two-qubit-section">
                <h3>Two-Qubit Operations</h3>
                <div className="controls">
                    {twoQubitGates.map(gate => (
                        <button
                            key={gate.name}
                            onClick={() => onGateApply(gate.name)}
                            style={gate.style}
                        >
                            {gate.name} Gate
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TwoQubitControls;