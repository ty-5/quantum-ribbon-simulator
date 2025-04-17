import React from 'react';
import QuantumRibbon from '../QuantumRibbon/QuantumRibbon';
import './TwoQubitRibbon.css';

const TwoQubitRibbon = ({ state, qubit1Phase, qubit2Phase, isAnimating }) => {
    // Determine if the state is entangled and what type
    const isEntangled = ['|Φ+⟩', '|Φ-⟩', '|Ψ+⟩', '|Ψ-⟩'].includes(state);
    const isPhiState = state.startsWith('|Φ');
    const isPsiState = state.startsWith('|Ψ');
    const isPlusState = state.includes('+⟩');
    const isMinusState = state.includes('-⟩');

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
        if (['|+0⟩', '|+1⟩', '|-0⟩', '|-1⟩', '|0+⟩', '|1+⟩', '|0-⟩', '|1-⟩'].includes(state)) {
            // Extract the state of each qubit from the composite state
            const firstSymbol = state.charAt(1);
            const secondSymbol = state.charAt(2);

            let qubit1State = '|0⟩';
            let qubit2State = '|0⟩';

            if (firstSymbol === '+') qubit1State = '|+⟩';
            else if (firstSymbol === '-') qubit1State = '|-⟩';
            else if (firstSymbol === '1') qubit1State = '|1⟩';

            if (secondSymbol === '+') qubit2State = '|+⟩';
            else if (secondSymbol === '-') qubit2State = '|-⟩';
            else if (secondSymbol === '1') qubit2State = '|1⟩';

            return {
                qubit1: qubit1State,
                qubit2: qubit2State,
                entangled: false
            };
        }

        // For entangled Bell states
        if (isPhiState) {
            // For Phi states (|00⟩ + |11⟩)/√2 or (|00⟩ - |11⟩)/√2
            // Use matching colors in each section (first both blue, then both red)
            return {
                qubit1: 'phi-first', // Custom state for rendering
                qubit2: 'phi-second',
                entangled: true,
                phaseMatch: isPlusState // Whether phases match (+ or -)
            };
        }

        if (isPsiState) {
            // For Psi states (|01⟩ + |10⟩)/√2 or (|01⟩ - |10⟩)/√2
            // Use opposite colors in each section
            return {
                qubit1: 'psi-first', // Custom state for rendering
                qubit2: 'psi-second',
                entangled: true,
                phaseMatch: isPlusState // Whether phases match (+ or -)
            };
        }

        // Default for unknown states
        return {
            qubit1: '|+⟩',
            qubit2: '|+⟩',
            entangled: false
        };
    };

    const { qubit1, qubit2, entangled, phaseMatch } = getQubitStates();

    // Custom renderer for Bell state ribbons
    const renderBellStateRibbon = (qubitType, isFirst) => {
        const width = 300;
        const height = 120;

        // Different visuals for Phi vs Psi states
        if (qubitType.startsWith('phi')) {
            // Phi states: same colors aligned (blue-blue, red-red)
            return (
                <div className="custom-ribbon">
                    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                        {/* Background */}
                        <rect x={10} y={40} width={width - 20} height={20} fill="#f8f8f8" stroke="#000" strokeWidth="1" />

                        {/* First half - blue */}
                        <rect x={10} y={40} width={(width - 20) / 2} height={20} fill="#c6dcf1" stroke="#000" strokeWidth="1" />

                        {/* Second half - red */}
                        <rect x={10 + (width - 20) / 2} y={40} width={(width - 20) / 2} height={20} fill="#f1c6d9" stroke="#000" strokeWidth="1" />

                        {/* Divider */}
                        <line x1={width / 2} y1={40} x2={width / 2} y2={60} stroke="#000" strokeWidth="1.5" />

                        {/* Phase arrows based on +/- state */}
                        {renderPhaseArrows(phaseMatch, isFirst)}

                        {/* Labels */}
                        <text x={width / 2} y={20} textAnchor="middle" fontWeight="bold" fontSize="14">
                            {isFirst ? "Qubit 1" : "Qubit 2"} (Phi State)
                        </text>
                        <text x={(width - 20) / 4 + 10} y={75} textAnchor="middle" fontSize="12" fill="#3366cc">|0⟩</text>
                        <text x={3 * (width - 20) / 4 + 10} y={75} textAnchor="middle" fontSize="12" fill="#cc3366">|1⟩</text>
                    </svg>
                </div>
            );
        } else {
            // Psi states: opposite colors (blue-red, red-blue)
            // First qubit: blue then red
            // Second qubit: red then blue
            const firstColor = isFirst ? "#c6dcf1" : "#f1c6d9";
            const secondColor = isFirst ? "#f1c6d9" : "#c6dcf1";
            const firstLabel = isFirst ? "|0⟩" : "|1⟩";
            const secondLabel = isFirst ? "|1⟩" : "|0⟩";
            const firstLabelColor = isFirst ? "#3366cc" : "#cc3366";
            const secondLabelColor = isFirst ? "#cc3366" : "#3366cc";

            return (
                <div className="custom-ribbon">
                    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                        {/* Background */}
                        <rect x={10} y={40} width={width - 20} height={20} fill="#f8f8f8" stroke="#000" strokeWidth="1" />

                        {/* First half */}
                        <rect x={10} y={40} width={(width - 20) / 2} height={20} fill={firstColor} stroke="#000" strokeWidth="1" />

                        {/* Second half */}
                        <rect x={10 + (width - 20) / 2} y={40} width={(width - 20) / 2} height={20} fill={secondColor} stroke="#000" strokeWidth="1" />

                        {/* Divider */}
                        <line x1={width / 2} y1={40} x2={width / 2} y2={60} stroke="#000" strokeWidth="1.5" />

                        {/* Phase arrows based on +/- state */}
                        {renderPhaseArrows(phaseMatch, isFirst)}

                        {/* Labels */}
                        <text x={width / 2} y={20} textAnchor="middle" fontWeight="bold" fontSize="14">
                            {isFirst ? "Qubit 1" : "Qubit 2"} (Psi State)
                        </text>
                        <text x={(width - 20) / 4 + 10} y={75} textAnchor="middle" fontSize="12" fill={firstLabelColor}>{firstLabel}</text>
                        <text x={3 * (width - 20) / 4 + 10} y={75} textAnchor="middle" fontSize="12" fill={secondLabelColor}>{secondLabel}</text>
                    </svg>
                </div>
            );
        }
    };

    // Render phase arrows for Bell states
    const renderPhaseArrows = (phaseMatch, isFirst) => {
        const width = 300;
        const arrowSpacing = 30;
        const arrowCount = Math.floor((width - 40) / arrowSpacing);
        const arrows = [];

        // For minus states, second qubit arrows should point in opposite direction
        const reverseArrows = !phaseMatch && !isFirst;

        for (let i = 0; i < arrowCount; i++) {
            const x = 20 + i * arrowSpacing;
            const direction = reverseArrows ? -10 : 10;

            arrows.push(
                <g key={`arrow-${i}`}>
                    <line
                        x1={x} y1={50}
                        x2={x + direction} y2={50}
                        stroke="#000"
                        strokeWidth="1.5"
                    />
                    <polygon
                        points={
                            direction > 0
                                ? `${x + direction},50 ${x + direction - 5},47 ${x + direction - 5},53`
                                : `${x + direction},50 ${x + direction + 5},47 ${x + direction + 5},53`
                        }
                        fill="#000"
                    />
                </g>
            );
        }

        return arrows;
    };

    // Connection visualization between ribbons
    const renderEntanglementConnection = () => {
        if (!entangled) return null;

        // Different connection styles for Phi vs Psi
        if (isPhiState) {
            return (
                <div className="entanglement-connection phi-connection">
                    <svg height="60" width="100">
                        {/* Wavy line for Phi states */}
                        <path
                            d="M 50,0 Q 40,15 50,30 Q 60,45 50,60"
                            stroke="#9966cc"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray="none"
                        />
                        <circle cx="50" cy="30" r="8" fill="#9966cc" fillOpacity="0.4" />
                    </svg>
                    <div className="connection-label phi-label">
                        00/11 Correlation
                    </div>
                </div>
            );
        } else {
            return (
                <div className="entanglement-connection psi-connection">
                    <svg height="60" width="100">
                        {/* Crossed lines for Psi states */}
                        <path
                            d="M 30,0 L 70,60"
                            stroke="#9966cc"
                            strokeWidth="3"
                            fill="none"
                        />
                        <path
                            d="M 70,0 L 30,60"
                            stroke="#9966cc"
                            strokeWidth="3"
                            fill="none"
                        />
                        <circle cx="50" cy="30" r="8" fill="#9966cc" fillOpacity="0.4" />
                    </svg>
                    <div className="connection-label psi-label">
                        01/10 Correlation
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="two-qubit-ribbons">
            <div className="qubit-container">
                <div className="qubit-label">Qubit 1 (Control)</div>
                {qubit1.startsWith('phi') || qubit1.startsWith('psi')
                    ? renderBellStateRibbon(qubit1, true)
                    : <QuantumRibbon
                        currentState={qubit1}
                        phase={qubit1Phase}
                        isAnimating={isAnimating}
                    />
                }
            </div>

            {/* Entanglement visualization */}
            <div className="entanglement-container">
                {entangled ? renderEntanglementConnection() : <div className="no-entanglement">Not Entangled</div>}
            </div>

            <div className="qubit-container">
                <div className="qubit-label">Qubit 2 (Target)</div>
                {qubit2.startsWith('phi') || qubit2.startsWith('psi')
                    ? renderBellStateRibbon(qubit2, false)
                    : <QuantumRibbon
                        currentState={qubit2}
                        phase={qubit2Phase}
                        isAnimating={isAnimating}
                    />
                }
            </div>

            <div className="state-display">
                <div className="composite-state">{state}</div>
                <div className="state-description">
                    {state === '|00⟩' && 'Both qubits in state |0⟩'}
                    {state === '|01⟩' && 'First qubit |0⟩, second qubit |1⟩'}
                    {state === '|10⟩' && 'First qubit |1⟩, second qubit |0⟩'}
                    {state === '|11⟩' && 'Both qubits in state |1⟩'}
                    {state === '|Φ+⟩' && 'Bell state (|00⟩ + |11⟩)/√2 - Same basis states'}
                    {state === '|Φ-⟩' && 'Bell state (|00⟩ - |11⟩)/√2 - Same basis states with phase difference'}
                    {state === '|Ψ+⟩' && 'Bell state (|01⟩ + |10⟩)/√2 - Opposite basis states'}
                    {state === '|Ψ-⟩' && 'Bell state (|01⟩ - |10⟩)/√2 - Opposite basis states with phase difference'}
                    {!['|00⟩', '|01⟩', '|10⟩', '|11⟩', '|Φ+⟩', '|Φ-⟩', '|Ψ+⟩', '|Ψ-⟩'].includes(state) &&
                        'Superposition state - not entangled'}
                </div>
            </div>
        </div>
    );
};

export default TwoQubitRibbon;