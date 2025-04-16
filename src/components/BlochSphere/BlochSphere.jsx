import React from 'react';
import './BlochSphere.css';

const BlochSphere = ({ theta, phi }) => {
    const size = 200;
    const center = size / 2;
    const radius = size / 2 - 20;

    // Determine state based on Bloch coordinates
    const getStateFromCoordinates = () => {
        // If we're at a pole (|0⟩ or |1⟩)
        if (Math.abs(Math.cos(theta)) > 0.95) {
            return Math.cos(theta) > 0 ? '|0⟩' : '|1⟩';
        }

        // If we're on the equator (superposition states)
        if (Math.abs(Math.sin(theta)) > 0.95) {
            // Check angle around equator
            if (Math.abs(phi) < 0.1) return '|+⟩';  // Right side
            if (Math.abs(phi - Math.PI) < 0.1) return '|-⟩';  // Left side
            if (Math.abs(phi - Math.PI / 2) < 0.1) return '|i⟩';  // Top
            if (Math.abs(phi + Math.PI / 2) < 0.1) return '|-i⟩';  // Bottom
        }

        // Default for points between named states
        return 'superposition';
    };

    // Calculate position on the sphere for the current state
    const getPositionOnSphere = () => {
        // Convert spherical to Cartesian coordinates
        const x = center + radius * Math.sin(theta) * Math.cos(phi);
        const y = center + radius * Math.sin(theta) * Math.sin(phi);

        return { x, y };
    };

    // Determine which state is "up" based on theta and phi
    const isRedUp = () => {
        const state = getStateFromCoordinates();
        return ['|+⟩', '|i⟩'].includes(state);
    };

    // Calculate dot color and properties
    const getDotProperties = () => {
        const state = getStateFromCoordinates();

        // Pure states
        if (state === '|0⟩') {
            return {
                color: '#3366cc',
                gradientId: null,
                size: 8,
                label: state
            };
        }
        if (state === '|1⟩') {
            return {
                color: '#cc3366',
                gradientId: null,
                size: 8,
                label: state
            };
        }

        // Known superposition states
        if (['|+⟩', '|-⟩', '|i⟩', '|-i⟩'].includes(state)) {
            return {
                color: null,
                gradientId: `gradient-${state.replace(/[|⟩]/g, '')}`,
                size: 10,
                label: state
            };
        }

        // Other superposition states
        return {
            color: null,
            gradientId: 'gradient-mixed',
            size: 9,
            label: null
        };
    };

    // Get position and properties
    const position = getPositionOnSphere();
    const dotProps = getDotProperties();
    const redUp = isRedUp();
    const currentState = getStateFromCoordinates();

    // Determine if we're at center (pure state)
    const isAtCenter = ['|0⟩', '|1⟩'].includes(currentState);
    const centerColor = currentState === '|0⟩' ? '#3366cc' : '#cc3366';

    return (
        <div className="bloch-sphere">
            <h3>Bloch Sphere Representation</h3>
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
                <line x1={center} y1={20} x2={center} y2={size - 20} stroke="#666" strokeWidth="1.5" /> {/* Vertical (i/-i) */}
                <line x1={20} y1={center} x2={size - 20} y2={center} stroke="#666" strokeWidth="1.5" />  {/* Horizontal (+/-) */}

                {/* Equator circle */}
                <circle cx={center} cy={center} r={radius}
                    fill="none" stroke="#aaa" strokeWidth="1" strokeDasharray="3,3" />

                {/* State indicators at axis points (more visible) */}
                <circle cx={center} cy={20} r="4" fill="#888" /> {/* Top (i) */}
                <circle cx={center} cy={size - 20} r="4" fill="#888" /> {/* Bottom (-i) */}
                <circle cx={size - 20} cy={center} r="4" fill="#888" /> {/* Right (+) */}
                <circle cx={20} cy={center} r="4" fill="#888" /> {/* Left (-) */}

                {/* Center indicator for pure states */}
                {isAtCenter && (
                    <circle
                        cx={center}
                        cy={center}
                        r="12"
                        fill={centerColor}
                        stroke="#333"
                        strokeWidth="1.5"
                    />
                )}

                {/* Current state indicator (not shown if at center) */}
                {!isAtCenter && (
                    <circle
                        cx={position.x}
                        cy={position.y}
                        r={dotProps.size}
                        fill={dotProps.color || `url(#${dotProps.gradientId})`}
                        stroke="#333"
                        strokeWidth="1.5"
                    />
                )}

                {/* Labels */}
                <text x={center} y={18} textAnchor="middle" fontSize="14" fontWeight="bold">i</text>        {/* Top */}
                <text x={center} y={size - 6} textAnchor="middle" fontSize="14" fontWeight="bold">-i</text>  {/* Bottom */}
                <text x={size - 8} y={center + 5} textAnchor="end" fontSize="14" fontWeight="bold">+</text>  {/* Right */}
                <text x={8} y={center + 5} textAnchor="start" fontSize="14" fontWeight="bold">-</text>      {/* Left */}

                {/* State name at current position (if at a named state) */}
                {currentState === '|0⟩' && (
                    <text
                        x={center}
                        y={center - 20}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        fill="#3366cc"
                    >
                        |0⟩
                    </text>
                )}

                {currentState === '|1⟩' && (
                    <text
                        x={center}
                        y={center + 25}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        fill="#cc3366"
                    >
                        |1⟩
                    </text>
                )}

                {/* State label for superposition states */}
                {!isAtCenter && ['|+⟩', '|-⟩', '|i⟩', '|-i⟩'].includes(currentState) && (
                    <text
                        x={position.x}
                        y={position.y - 15}
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                    >
                        {currentState}
                    </text>
                )}

                {/* "Up" indicator for superposition states */}
                {!isAtCenter && ['|+⟩', '|-⟩', '|i⟩', '|-i⟩'].includes(currentState) && (
                    <text
                        x={position.x}
                        y={position.y + 15}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill={redUp ? "#cc3366" : "#3366cc"}
                    >
                        {redUp ? "Red Up" : "Blue Up"}
                    </text>
                )}
            </svg>
        </div>
    );
};

export default BlochSphere;