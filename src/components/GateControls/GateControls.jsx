import React from 'react';
import './GateControls.css';

const GateControls = ({ onGateApply }) => {
    const gates = [
        { name: 'I', style: { backgroundColor: '#f0f0f0', borderColor: '#ddd' } },
        { name: 'X', style: { backgroundColor: '#e6f7ff', borderColor: '#91d5ff' } },
        { name: 'Z', style: { backgroundColor: '#f6ffed', borderColor: '#b7eb8f' } },
        { name: 'Y', style: { backgroundColor: '#fff2e8', borderColor: '#ffbb96' } },
        { name: 'H', style: { backgroundColor: '#f9f0ff', borderColor: '#d3adf7' } },
        { name: 'Measure', style: { backgroundColor: '#fff2f0', borderColor: '#ffccc7' } },
        { name: 'Reset', style: { backgroundColor: '#f5f5f5', borderColor: '#d9d9d9' } }
    ];

    return (
        <div className="controls">
            {gates.map(gate => (
                <button
                    key={gate.name}
                    onClick={() => onGateApply(gate.name)}
                    style={{
                        padding: '10px 15px',
                        border: `1px solid ${gate.style.borderColor}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        ...gate.style
                    }}
                >
                    {gate.name} Gate
                </button>
            ))}
        </div>
    );
};

export default GateControls;