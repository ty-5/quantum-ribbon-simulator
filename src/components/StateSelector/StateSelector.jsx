import React from 'react';
import './StateSelector.css';

const StateSelector = ({ currentState, onStateChange, addHistory }) => {
    const states = ['|0⟩', '|1⟩', '|+⟩', '|-⟩', '|i⟩', '|-i⟩'];

    return (
        <div className="state-selector">
            <h3>Jump to State:</h3>
            <div className="state-buttons">
                {states.map(state => (
                    <button
                        key={state}
                        onClick={() => {
                            onStateChange(state);
                            addHistory(`Set state to ${state}${state === '|i⟩' ? ' with phase i' : state === '|-i⟩' ? ' with phase -i' : ''}`);
                        }}
                        style={{
                            padding: '8px 12px',
                            backgroundColor: currentState === state ? '#1890ff' : '#f0f2f5',
                            color: currentState === state ? 'white' : 'black',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {state}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StateSelector;