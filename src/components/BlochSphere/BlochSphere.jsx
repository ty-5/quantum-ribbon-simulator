import React from 'react';
import './BlochSphere.css';

const BlochSphere = ({ theta, phi }) => {
    const size = 240; // Increased size
    const center = size / 2;
    const radius = size / 2 - 40; // Maintain good margins

    // Convert spherical to Cartesian coordinates for positioning the state dot
    const x = center + radius * Math.sin(theta) * Math.cos(phi);
    const y = center + radius * Math.sin(theta) * Math.sin(phi);

    // Determine state based on coordinates
    const getStateFromCoordinates = () => {
        // If we're at or near a pole (|0⟩ or |1⟩)
        if (Math.abs(Math.cos(theta)) > 0.95) {
            return Math.cos(theta) > 0 ? '|0⟩' : '|1⟩';
        }

        // If we're on the equator (superposition states)
        if (Math.abs(Math.sin(theta) - 1) < 0.05) {
            // Check angle around equator with better precision
            if (Math.abs(phi) < 0.1 || Math.abs(phi - 2 * Math.PI) < 0.1) {
                return '|+⟩';  // Right side (0° or 360°)
            }
            if (Math.abs(Math.abs(phi) - Math.PI) < 0.1) {
                return '|-⟩';  // Left side (180°)
            }
            if (Math.abs(phi - Math.PI / 2) < 0.1) {
                return '|i⟩';  // Top (90°)
            }
            if (Math.abs(phi + Math.PI / 2) < 0.1 || Math.abs(phi - 3 * Math.PI / 2) < 0.1) {
                return '|-i⟩';  // Bottom (270° or -90°)
            }
        }

        // Default for points between named states
        return 'superposition';
    };

    const currentState = getStateFromCoordinates();
    const isRedUp = ['|+⟩', '|i⟩'].includes(currentState);

    // Determine dot color
    const getDotColor = () => {
        if (currentState === '|0⟩') {
            return '#3366cc'; // Blue
        } else if (currentState === '|1⟩') {
            return '#cc3366'; // Red
        } else if (['|+⟩', '|-⟩', '|i⟩', '|-i⟩'].includes(currentState)) {
            return `url(#gradient-${currentState.replace(/[|⟩]/g, '')})`;
        }
        return "url(#gradient-mixed)"; // Mixed state
    };

    return (
        <div className="bloch-sphere">
            <div className="bloch-title">Bloch Sphere</div>
            <div className="sphere-container">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {/* Gradients for different states */}
                    <defs>
                        {/* For |+⟩ state - Red Up */}
                        <linearGradient id="gradient-+" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#cc3366" />
                            <stop offset="50%" stopColor="#cc3366" />
                            <stop offset="50%" stopColor="#3366cc" />
                            <stop offset="100%" stopColor="#3366cc" />
                        </linearGradient>

                        {/* For |-⟩ state - Blue Up */}
                        <linearGradient id="gradient--" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3366cc" />
                            <stop offset="50%" stopColor="#3366cc" />
                            <stop offset="50%" stopColor="#cc3366" />
                            <stop offset="100%" stopColor="#cc3366" />
                        </linearGradient>

                        {/* For |i⟩ state - Red Up */}
                        <linearGradient id="gradient-i" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#cc3366" />
                            <stop offset="50%" stopColor="#cc3366" />
                            <stop offset="50%" stopColor="#3366cc" />
                            <stop offset="100%" stopColor="#3366cc" />
                        </linearGradient>

                        {/* For |-i⟩ state - Blue Up */}
                        <linearGradient id="gradient--i" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3366cc" />
                            <stop offset="50%" stopColor="#3366cc" />
                            <stop offset="50%" stopColor="#cc3366" />
                            <stop offset="100%" stopColor="#cc3366" />
                        </linearGradient>

                        {/* For mixed superpositions */}
                        <linearGradient id="gradient-mixed" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="50%" stopColor="#3366cc" />
                            <stop offset="50%" stopColor="#cc3366" />
                        </linearGradient>
                    </defs>

                    {/* Sphere outline */}
                    <circle cx={center} cy={center} r={radius}
                        fill="#f8f9fa" stroke="#333" strokeWidth="2" />

                    {/* Axes */}
                    <line x1={center} y1={40} x2={center} y2={size - 40} stroke="#666" strokeWidth="1.5" /> {/* Vertical (i/-i) */}
                    <line x1={40} y1={center} x2={size - 40} y2={center} stroke="#666" strokeWidth="1.5" />  {/* Horizontal (+/-) */}

                    {/* State indicator - smaller dot */}
                    <circle
                        cx={x}
                        cy={y}
                        r={8}
                        fill={getDotColor()}
                        stroke="#333"
                        strokeWidth="1.5"
                    />

                    {/* Axis labels - much farther from sphere */}
                    <text x={center - 35} y={25} textAnchor="end" fontSize="16" fontWeight="bold">-i</text>      {/* Top */}
                    <text x={center + 35} y={size - 15} textAnchor="start" fontSize="16" fontWeight="bold">i</text>  {/* Bottom */}
                    <text x={size - 15} y={center - 20} textAnchor="end" fontSize="16" fontWeight="bold">+</text>    {/* Right */}
                    <text x={15} y={center - 20} textAnchor="start" fontSize="16" fontWeight="bold">-</text>        {/* Left */}

                    {/* Current State Label */}
                    {currentState !== 'superposition' && (
                        <text
                            x={x}
                            y={y - 15}
                            textAnchor="middle"
                            fontSize="12"
                            fontWeight="bold"
                        >
                            {currentState}
                        </text>
                    )}

                    {/* "Up" indicator for superposition states */}
                    {['|+⟩', '|-⟩', '|i⟩', '|-i⟩'].includes(currentState) && (
                        <text
                            x={x}
                            y={y + 18}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="bold"
                            fill={isRedUp ? "#cc3366" : "#3366cc"}
                        >
                            {isRedUp ? "Red Up" : "Blue Up"}
                        </text>
                    )}
                </svg>
            </div>
        </div>
    );
};

export default BlochSphere;