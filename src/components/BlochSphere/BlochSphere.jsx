import React from 'react';
import './BlochSphere.css';

const BlochSphere = ({ currentState }) => {
    const size = 200;
    const center = size / 2;
    const radius = size / 2 - 20;

    // State to coordinate and color mapping
    const getStateRepresentation = () => {
        const angle = {
            '|i⟩': -Math.PI / 2,    // Top (90°)
            '|-i⟩': Math.PI / 2,    // Bottom (270°)
            '|+⟩': 0,             // Right (0°)
            '|-⟩': Math.PI        // Left (180°)
        }[currentState];

        if (angle !== undefined) {
            // Superposition state - dot at edge
            return {
                x: center + radius * Math.cos(angle),
                y: center + radius * Math.sin(angle),
                color: 'url(#half-red-blue)'
            };
        } else {
            // Basis state - dot in center
            return {
                x: center,
                y: center,
                color: currentState === '|0⟩' ? '#3366cc' : '#cc3366'
            };
        }
    };

    const { x, y, color } = getStateRepresentation();

    return (
        <div className="bloch-sphere">
            <h3>Bloch Sphere Representation</h3>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Gradient for half-red-half-blue dot */}
                <defs>
                    <linearGradient id="half-red-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="50%" stopColor="#3366cc" />
                        <stop offset="50%" stopColor="#cc3366" />
                    </linearGradient>
                </defs>

                {/* Sphere outline */}
                <circle cx={center} cy={center} r={radius}
                    fill="#f8f9fa" stroke="#333" strokeWidth="2" />

                {/* Axes */}
                <line x1={center} y1={20} x2={center} y2={size - 20} stroke="#333" strokeWidth="1" /> {/* Vertical (i/-i) */}
                <line x1={20} y1={center} x2={size - 20} y2={center} stroke="#333" strokeWidth="1" />  {/* Horizontal (+/-) */}

                {/* State indicator */}
                <circle cx={x} cy={y} r={8} fill={color} stroke="#333" strokeWidth="1" />

                {/* Labels */}
                <text x={center} y={25} textAnchor="middle">|i⟩</text>          {/* Top */}
                <text x={center} y={size - 10} textAnchor="middle">|-i⟩</text>    {/* Bottom */}
                <text x={size - 10} y={center + 5} textAnchor="end">|+⟩</text>      {/* Right */}
                <text x={10} y={center + 5} textAnchor="start">|-⟩</text>         {/* Left */}
                <text x={center} y={center + 5} textAnchor="middle" fontSize="10">
                    {['|0⟩', '|1⟩'].includes(currentState) ? currentState : ''}
                </text>
            </svg>
        </div>
    );
};

export default BlochSphere;