import React from 'react';
import './QuantumRibbon.css';

const QuantumRibbon = ({ currentState, phase, isAnimating }) => {
    const width = 300;
    const height = 120;

    // Check if state is a superposition
    const isSuperposition = ['|+⟩', '|-⟩', '|i⟩', '|-i⟩'].includes(currentState);

    // Complete state configuration with accurate percentages
    const getRibbonConfig = () => {
        return {
            '|0⟩': {
                leftColor: '#c6dcf1', rightColor: '#c6dcf1',
                label: 'Pure |0⟩',
                bluePercent: 100, redPercent: 0
            },
            '|1⟩': {
                leftColor: '#f1c6d9', rightColor: '#f1c6d9',
                label: 'Pure |1⟩',
                bluePercent: 0, redPercent: 100
            },
            '|+⟩': {
                leftColor: '#c6dcf1', rightColor: '#f1c6d9',
                label: '|+⟩ (Red Up)',
                bluePercent: 50, redPercent: 50,
                redUp: true
            },
            '|-⟩': {
                leftColor: '#c6dcf1', rightColor: '#f1c6d9',
                label: '|-⟩ (Blue Up)',
                bluePercent: 50, redPercent: 50,
                redUp: false
            },
            '|i⟩': {
                leftColor: '#c6dcf1', rightColor: '#f1c6d9',
                label: '|i⟩ (Red Up)',
                bluePercent: 50, redPercent: 50,
                redUp: true
            },
            '|-i⟩': {
                leftColor: '#c6dcf1', rightColor: '#f1c6d9',
                label: '|-i⟩ (Blue Up)',
                bluePercent: 50, redPercent: 50,
                redUp: false
            }
        }[currentState] || {
            leftColor: '#c6dcf1', rightColor: '#f1c6d9',
            label: 'Unknown State',
            bluePercent: 50, redPercent: 50
        };
    };

    const config = getRibbonConfig();

    const renderPhaseArrows = () => {
        const arrowSpacing = 30;
        const arrowCount = Math.floor((width - 40) / arrowSpacing);

        return Array.from({ length: arrowCount }).map((_, i) => {
            const x = 20 + i * arrowSpacing;
            let arrowY = 40; // default position

            // If superposition, arrows should follow the ribbon curve 
            if (isSuperposition) {
                // Only adjust Y for arrows in the middle section
                const distFromCenter = Math.abs(x - width / 2);
                if (distFromCenter < 60) {
                    // Slight curve for arrows in the middle section
                    arrowY = 40 + (distFromCenter < 30 ? 10 : 5);
                }
            }

            if (phase === '1' || phase === '-1') {
                return (
                    <g key={`h-${i}`}>
                        <line
                            x1={x} y1={arrowY}
                            x2={x + (phase === '1' ? 10 : -10)} y2={arrowY}
                            stroke="#000000"
                            strokeWidth={1.5}
                        />
                        <polygon
                            points={
                                phase === '1'
                                    ? `${x + 10},${arrowY} ${x + 5},${arrowY - 3} ${x + 5},${arrowY + 3}`
                                    : `${x - 10},${arrowY} ${x - 5},${arrowY - 3} ${x - 5},${arrowY + 3}`
                            }
                            fill="#000000"
                        />
                    </g>
                );
            } else {
                return (
                    <g key={`v-${i}`}>
                        <line
                            x1={x} y1={arrowY}
                            x2={x} y2={phase === 'i' ? arrowY - 10 : arrowY + 10}
                            stroke="#000000"
                            strokeWidth={1.5}
                        />
                        <polygon
                            points={
                                phase === 'i'
                                    ? `${x},${arrowY - 10} ${x - 3},${arrowY - 5} ${x + 3},${arrowY - 5}`
                                    : `${x},${arrowY + 10} ${x - 3},${arrowY + 5} ${x + 3},${arrowY + 5}`
                            }
                            fill="#000000"
                        />
                    </g>
                );
            }
        });
    };

    // For pure states, render a simple ribbon
    const renderPureStateRibbon = () => {
        return (
            <rect
                x={10} y={30}
                width={width - 20} height={40}
                fill={config.leftColor}
                stroke="#000000"
                strokeWidth={1}
            />
        );
    };

    // For superposition states, render a twisted ribbon
    const renderTwistedRibbon = () => {
        const isRedUp = config.redUp;

        return (
            <g className="twisted-ribbon">
                {/* Left side (blue) - always visible */}
                <path
                    d={`M 10,30 
                       L 130,30 
                       Q 150,30 160,50
                       L 160,70
                       Q 150,70 130,70
                       L 10,70 Z`}
                    fill="#c6dcf1"
                    stroke="#000"
                    strokeWidth="1"
                />

                {/* Right side (red) - always visible */}
                <path
                    d={`M 290,30 
                       L 170,30 
                       Q 150,30 140,50
                       L 140,70
                       Q 150,70 170,70
                       L 290,70 Z`}
                    fill="#f1c6d9"
                    stroke="#000"
                    strokeWidth="1"
                />

                {/* Twist in the middle - the part that flips */}
                <path
                    d={`M 130,${isRedUp ? '30' : '70'} 
                       Q 150,${isRedUp ? '30' : '70'} 160,50
                       L 140,50
                       Q 150,${isRedUp ? '70' : '30'} 170,${isRedUp ? '70' : '30'}`}
                    fill={isRedUp ? '#f1c6d9' : '#c6dcf1'}
                    stroke="#000"
                    strokeWidth="1"
                />
                <path
                    d={`M 130,${!isRedUp ? '30' : '70'} 
                       Q 150,${!isRedUp ? '30' : '70'} 140,50
                       L 160,50
                       Q 150,${!isRedUp ? '70' : '30'} 170,${!isRedUp ? '70' : '30'}`}
                    fill={!isRedUp ? '#f1c6d9' : '#c6dcf1'}
                    stroke="#000"
                    strokeWidth="1"
                />

                {/* Twist line */}
                <line
                    x1="150" y1="30"
                    x2="150" y2="70"
                    stroke="#000"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                />

                {/* Center point indicator */}
                <circle
                    cx="150"
                    cy="50"
                    r="3"
                    fill="#000"
                />

                {/* "Up" indicator label */}
                <text
                    x="150"
                    y={config.redUp ? "25" : "85"}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill={config.redUp ? "#cc3366" : "#3366cc"}
                >
                    {config.redUp ? "Red Up" : "Blue Up"}
                </text>
            </g>
        );
    };

    return (
        <div className={`ribbon-container ${isAnimating ? 'animating' : ''}`}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Render either pure or twisted ribbon */}
                {isSuperposition ? renderTwistedRibbon() : renderPureStateRibbon()}

                {/* Phase Arrows */}
                {renderPhaseArrows()}

                {/* Labels */}
                <text x={width / 2} y={15} textAnchor="middle" fontSize="14" fontWeight="bold">
                    {config.label}
                </text>
                <text x={width * 0.25} y={height - 10} textAnchor="middle" fontSize="12" fill="#3366cc">
                    Blue: {config.bluePercent}%
                </text>
                <text x={width * 0.75} y={height - 10} textAnchor="middle" fontSize="12" fill="#cc3366">
                    Red: {config.redPercent}%
                </text>
            </svg>

            {/* Phase Label */}
            <div className="phase-label" style={{
                marginTop: '5px',
                fontWeight: 'bold',
                color: phase === '1' ? '#22cc22' :
                    phase === '-1' ? '#cc2222' :
                        phase === 'i' ? '#2222cc' : '#cc22cc'
            }}>
                Phase: {phase} {phase === '1' ? '(→)' :
                    phase === '-1' ? '(←)' :
                        phase === 'i' ? '(↑)' : '(↓)'}
            </div>
        </div>
    );
};

export default QuantumRibbon;