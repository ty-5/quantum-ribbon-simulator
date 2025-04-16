import React from 'react';
import './BlochSphere3D.css';

const BlochSphere3D = ({ theta, phi }) => {
    // Simplified version without Three.js
    // This uses basic SVG to create a simple 3D-like representation

    // Get coordinates on a circle (simplified 3D projection)
    const radius = 80;
    const centerX = 150;
    const centerY = 150;

    // Convert spherical coordinates to 2D projection
    const x = centerX + radius * Math.sin(theta) * Math.cos(phi);
    const y = centerY + radius * Math.sin(theta) * Math.sin(phi);
    const scale = 0.5 + 0.5 * Math.cos(theta); // Size based on z-position

    // Determine state name
    const getStateName = () => {
        // Check if we're at a pole or on the equator
        if (Math.abs(Math.cos(theta)) > 0.95) {
            return Math.cos(theta) > 0 ? '|0⟩' : '|1⟩';
        }

        if (Math.abs(Math.sin(theta)) > 0.95) {
            if (Math.abs(phi) < 0.1) return '|+⟩';
            if (Math.abs(phi - Math.PI) < 0.1) return '|-⟩';
            if (Math.abs(phi - Math.PI / 2) < 0.1) return '|i⟩';
            if (Math.abs(phi + Math.PI / 2) < 0.1) return '|-i⟩';
        }

        return 'mixed';
    };

    const stateName = getStateName();
    const isRedUp = ['|+⟩', '|i⟩'].includes(stateName);

    // Dot color based on state
    const getDotColor = () => {
        if (stateName === '|0⟩') return '#3366cc'; // Blue
        if (stateName === '|1⟩') return '#cc3366'; // Red
        if (['|+⟩', '|i⟩'].includes(stateName)) return '#cc3366'; // Red Up states
        if (['|-⟩', '|-i⟩'].includes(stateName)) return '#3366cc'; // Blue Up states
        return '#9966aa'; // Mixed state
    };

    return (
        <div className="bloch-sphere-3d">
            <h3>Simplified 3D Bloch Sphere</h3>
            <svg width="300" height="300" viewBox="0 0 300 300">
                {/* Circle outline representing the sphere */}
                <circle cx={centerX} cy={centerY} r={radius} fill="#f0f0f0" stroke="#333" />

                {/* X axis */}
                <line x1={centerX - radius} y1={centerY} x2={centerX + radius} y2={centerY} stroke="#666" />
                <text x={centerX + radius + 10} y={centerY + 5} fontSize="12">|+⟩</text>
                <text x={centerX - radius - 20} y={centerY + 5} fontSize="12">|-⟩</text>

                {/* Y axis */}
                <line x1={centerX} y1={centerY - radius} x2={centerX} y2={centerY + radius} stroke="#666" />
                <text x={centerX + 5} y={centerY - radius - 5} fontSize="12">|i⟩</text>
                <text x={centerX + 5} y={centerY + radius + 15} fontSize="12">|-i⟩</text>

                {/* Z axis indicator (simplified) */}
                <text x={centerX - 25} y={centerY - radius / 2} fontSize="12">|0⟩</text>
                <text x={centerX - 25} y={centerY + radius / 2} fontSize="12">|1⟩</text>

                {/* State dot */}
                <circle
                    cx={x}
                    cy={y}
                    r={10 * scale}
                    fill={getDotColor()}
                    stroke="#000"
                    strokeWidth="1"
                />

                {/* State label */}
                {stateName !== 'mixed' && (
                    <text
                        x={x}
                        y={y - 15}
                        fontSize="12"
                        textAnchor="middle"
                        fontWeight="bold"
                    >
                        {stateName}
                    </text>
                )}

                {/* Up indicator for superposition states */}
                {['|+⟩', '|-⟩', '|i⟩', '|-i⟩'].includes(stateName) && (
                    <text
                        x={x}
                        y={y + 20}
                        fontSize="10"
                        textAnchor="middle"
                        fill={isRedUp ? '#cc3366' : '#3366cc'}
                        fontWeight="bold"
                    >
                        {isRedUp ? 'Red Up' : 'Blue Up'}
                    </text>
                )}
            </svg>

            <div className="state-info">
                <p>Current state: {stateName}</p>
                <p>θ = {(theta * 180 / Math.PI).toFixed(1)}°, φ = {(phi * 180 / Math.PI).toFixed(1)}°</p>
            </div>
        </div>
    );
};

export default BlochSphere3D;