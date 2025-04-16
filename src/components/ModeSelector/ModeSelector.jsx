import React from 'react';
import './ModeSelector.css';

const ModeSelector = ({ mode, onChange }) => {
    return (
        <div className="mode-selector">
            <h3>Select Mode:</h3>
            <div className="mode-buttons">
                <button
                    onClick={() => onChange('1')}
                    className={mode === '1' ? 'active' : ''}
                >
                    1 Qubit
                </button>
                <button
                    onClick={() => onChange('2')}
                    className={mode === '2' ? 'active' : ''}
                >
                    2 Qubits
                </button>
            </div>
        </div>
    );
};

export default ModeSelector;