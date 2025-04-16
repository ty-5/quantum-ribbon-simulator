import React from 'react';
import QuantumRibbon from '../QuantumRibbon/QuantumRibbon';
import './TwoQubitRibbon.css';

const TwoQubitRibbon = ({ state, phase, isAnimating }) => {
    // Parse the composite state to get individual qubit states
    const getQubitStates = () => {
        // For basis states like |00⟩, |01⟩, |10⟩, |11⟩
        if (['|00⟩', '|01⟩', '|10⟩', '|11⟩'].includes(state)) {
            return {
                qubit1: state.charAt(1) === '0' ? '|0⟩' : '|1⟩',
                qubit2: state.charAt(2) === '0' ? '|0⟩' : '|1⟩',
                entangled: false
            };
        }

        // For separable superposition states (not entangled)
        if (state === '|+0⟩') {
            return {
                qubit1: '|+⟩',
                qubit2: '|0⟩',
                entangled: false
            };
        }
        if (state === '|+1⟩') {
            return {
                qubit1: '|+⟩',
                qubit2: '|1⟩',
                entangled: false
            };
        }
        if (state === '|-0⟩') {
            return {
                qubit1: '|-⟩',
                qubit2: '|0⟩',
                entangled: false
            };
        }
        if (state === '|-1⟩') {
            return {
                qubit1: '|-⟩',
                qubit2: '|1⟩',
                entangled: false
            };
        }
        if (state === '|0+⟩') {
            return {
                qubit1: '|0⟩',
                qubit2: '|+⟩',
                entangled: false
            };
        }
        if (state === '|1+⟩') {
            return {
                qubit1: '|1⟩',
                qubit2: '|+⟩',
                entangled: false
            };
        }
        if (state === '|0-⟩') {
            return {
                qubit1: '|0⟩',
                qubit2: '|-⟩',
                entangled: false
            };
        }
        if (state === '|1-⟩') {
            return {
                qubit1: '|1⟩',
                qubit2: '|-⟩',
                entangled: false
            };
        }

        // For entangled Bell states
        if (['|Φ+⟩', '|Φ-⟩', '|Ψ+⟩', '|Ψ-⟩'].includes(state)) {
            // We'll show both qubits in superposition
            if (state === '|Φ+⟩' || state === '|Φ-⟩') {
                return {
                    qubit1: '|+⟩',
                    qubit2: state === '|Φ+⟩' ? '|+⟩' : '|-⟩',
                    entangled: true
                };
            } else { // |Ψ+⟩, |Ψ-⟩
                return {
                    qubit1: '|+⟩',
                    qubit2: state === '|Ψ+⟩' ? '|+⟩' : '|-⟩',
                    entangled: true
                };
            }
        }

        // Default for unknown states
        return {
            qubit1: '|+⟩',
            qubit2: '|+⟩',
            entangled: false
        };
    };

    const { qubit1, qubit2, entangled } = getQubitStates();

    return (
        <div className="two-qubit-ribbons">
            <div className="qubit-container">
                <div className="qubit-label">Qubit 1 (Control)</div>
                <QuantumRibbon
                    currentState={qubit1}
                    phase={phase}
                    isAnimating={isAnimating}
                />
            </div>

            {/* Entanglement visualization */}
            <div className="entanglement-container">
                {entangled ? (
                    <>
                        <div className="entanglement-line">
                            <svg height="60" width="100">
                                <line x1="50" y1="0" x2="50" y2="60"
                                    stroke="#ff00ff" strokeWidth="2" strokeDasharray="4,4" />
                                <circle cx="50" cy="30" r="8" fill="#ff00ff" opacity="0.6" />
                            </svg>
                        </div>
                        <div className="entanglement-label">Entangled</div>
                    </>
                ) : (
                    <div className="no-entanglement">Not Entangled</div>
                )}
            </div>

            <div className="qubit-container">
                <div className="qubit-label">Qubit 2 (Target)</div>
                <QuantumRibbon
                    currentState={qubit2}
                    phase={phase}
                    isAnimating={isAnimating}
                />
            </div>

            <div className="state-display">
                <div className="composite-state">{state}</div>
                <div className="state-description">
                    {state === '|00⟩' && 'Both qubits in state |0⟩'}
                    {state === '|01⟩' && 'First qubit |0⟩, second qubit |1⟩'}
                    {state === '|10⟩' && 'First qubit |1⟩, second qubit |0⟩'}
                    {state === '|11⟩' && 'Both qubits in state |1⟩'}
                    {state === '|+0⟩' && 'First qubit in superposition, second qubit |0⟩'}
                    {state === '|+1⟩' && 'First qubit in superposition, second qubit |1⟩'}
                    {state === '|-0⟩' && 'First qubit in superposition, second qubit |0⟩'}
                    {state === '|-1⟩' && 'First qubit in superposition, second qubit |1⟩'}
                    {state === '|0+⟩' && 'First qubit |0⟩, second qubit in superposition'}
                    {state === '|1+⟩' && 'First qubit |1⟩, second qubit in superposition'}
                    {state === '|0-⟩' && 'First qubit |0⟩, second qubit in superposition'}
                    {state === '|1-⟩' && 'First qubit |1⟩, second qubit in superposition'}
                    {state === '|Φ+⟩' && 'Bell state (|00⟩ + |11⟩)/√2'}
                    {state === '|Φ-⟩' && 'Bell state (|00⟩ - |11⟩)/√2'}
                    {state === '|Ψ+⟩' && 'Bell state (|01⟩ + |10⟩)/√2'}
                    {state === '|Ψ-⟩' && 'Bell state (|01⟩ - |10⟩)/√2'}
                </div>
            </div>
        </div>
    );
};

export default TwoQubitRibbon;