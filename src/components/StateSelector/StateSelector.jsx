import React from 'react';
import './StateSelector.css';

const StateSelector = ({ currentState, availableStates, onStateChange, addHistory }) => {
    return (
        <div className="state-selector">
            <h3>Jump to State:</h3>
            <div className="state-buttons">
                {availableStates.map(state => (
                    <button
                        key={state}
                        onClick={() => {
                            onStateChange(state);
                            addHistory(`Set state to ${state}`);
                        }}
                        className={currentState === state ? 'active' : ''}
                    >
                        {state}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StateSelector;