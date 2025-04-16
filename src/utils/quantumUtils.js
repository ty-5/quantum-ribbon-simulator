// Utility functions for quantum state manipulations
export const multiplyPhases = (phase1, phase2) => {
    if (phase1 === '1') return phase2;
    if (phase1 === '-1') {
        if (phase2 === '1') return '-1';
        if (phase2 === '-1') return '1';
        if (phase2 === 'i') return '-i';
        if (phase2 === '-i') return 'i';
    }
    if (phase1 === 'i') {
        if (phase2 === '1') return 'i';
        if (phase2 === '-1') return '-i';
        if (phase2 === 'i') return '-1';
        if (phase2 === '-i') return '1';
    }
    if (phase1 === '-i') {
        if (phase2 === '1') return '-i';
        if (phase2 === '-1') return 'i';
        if (phase2 === 'i') return '1';
        if (phase2 === '-i') return '-1';
    }
    return '1'; // Default
};

export const getBlochPosition = (state, phase) => {
    // Default position for unknown states
    let theta = 0;
    let phi = 0;

    // Map the state directly to the correct position regardless of phase
    // This ensures when a specific state is selected, it always appears in the right spot
    if (state === '|0⟩') {
        // North pole
        theta = 0;
        phi = 0;
    } else if (state === '|1⟩') {
        // South pole
        theta = Math.PI;
        phi = 0;
    } else if (state === '|+⟩') {
        // Right side of equator (positive x-axis)
        theta = Math.PI / 2;
        phi = 0;
    } else if (state === '|-⟩') {
        // Left side of equator (negative x-axis)
        theta = Math.PI / 2;
        phi = Math.PI;
    } else if (state === '|i⟩') {
        // Top of equator (positive y-axis)
        theta = Math.PI / 2;
        phi = Math.PI / 2;
    } else if (state === '|-i⟩') {
        // Bottom of equator (negative y-axis)
        theta = Math.PI / 2;
        phi = 3 * Math.PI / 2;
    }

    // Phase is now separate from state - it only applies when we need to
    // represent a phase on a state that doesn't inherently have one
    // For example, applying phase i to |0⟩ might rotate it, but not when
    // we're directly selecting |i⟩
    if (state !== '|i⟩' && state !== '|-i⟩') {
        if (phase === '-1') {
            // Rotate 180 degrees around z-axis
            phi = (phi + Math.PI) % (2 * Math.PI);
        } else if (phase === 'i') {
            // Rotate 90 degrees around z-axis
            phi = (phi + Math.PI / 2) % (2 * Math.PI);
        } else if (phase === '-i') {
            // Rotate -90 degrees around z-axis
            phi = (phi - Math.PI / 2);
            if (phi < 0) phi += 2 * Math.PI; // Ensure phi stays in [0, 2π]
        }
    }

    return { theta, phi };
};

export const getStateDescription = (state) => {
    switch (state) {
        case '|0⟩':
            return 'Computational basis state |0⟩ - 100% blue';
        case '|1⟩':
            return 'Computational basis state |1⟩ - 100% red';
        case '|+⟩':
            return 'Equal superposition |+⟩ = (|0⟩ + |1⟩)/√2 - 50% blue, 50% red';
        case '|-⟩':
            return 'Equal superposition |-⟩ = (|0⟩ - |1⟩)/√2 - 50% blue, 50% red';
        case '|i⟩':
            return 'Equal superposition |i⟩ = (|0⟩ + i|1⟩)/√2 - 50% blue, 50% red';
        case '|-i⟩':
            return 'Equal superposition |-i⟩ = (|0⟩ - i|1⟩)/√2 - 50% blue, 50% red';
        default:
            return 'Unknown quantum state';
    }
};

// Two-qubit state descriptions
export const getTwoQubitStateDescription = (state) => {
    switch (state) {
        case '|00⟩':
            return 'Both qubits in state |0⟩ - 100% probability of measuring 00';
        case '|01⟩':
            return 'First qubit |0⟩, second qubit |1⟩ - 100% probability of measuring 01';
        case '|10⟩':
            return 'First qubit |1⟩, second qubit |0⟩ - 100% probability of measuring 10';
        case '|11⟩':
            return 'Both qubits in state |1⟩ - 100% probability of measuring 11';

        // Separable superposition states (not entangled)
        case '|+0⟩':
            return 'First qubit in |+⟩ superposition, second qubit in |0⟩ - Not entangled';
        case '|+1⟩':
            return 'First qubit in |+⟩ superposition, second qubit in |1⟩ - Not entangled';
        case '|-0⟩':
            return 'First qubit in |-⟩ superposition, second qubit in |0⟩ - Not entangled';
        case '|-1⟩':
            return 'First qubit in |-⟩ superposition, second qubit in |1⟩ - Not entangled';
        case '|0+⟩':
            return 'First qubit in |0⟩, second qubit in |+⟩ superposition - Not entangled';
        case '|1+⟩':
            return 'First qubit in |1⟩, second qubit in |+⟩ superposition - Not entangled';
        case '|0-⟩':
            return 'First qubit in |0⟩, second qubit in |-⟩ superposition - Not entangled';
        case '|1-⟩':
            return 'First qubit in |1⟩, second qubit in |-⟩ superposition - Not entangled';

        // Bell states (entangled)
        case '|Φ+⟩':
            return 'Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2 - Entangled state with 50% probability of 00, 50% probability of 11';
        case '|Φ-⟩':
            return 'Bell state |Φ-⟩ = (|00⟩ - |11⟩)/√2 - Entangled state with 50% probability of 00, 50% probability of 11';
        case '|Ψ+⟩':
            return 'Bell state |Ψ+⟩ = (|01⟩ + |10⟩)/√2 - Entangled state with 50% probability of 01, 50% probability of 10';
        case '|Ψ-⟩':
            return 'Bell state |Ψ-⟩ = (|01⟩ - |10⟩)/√2 - Entangled state with 50% probability of 01, 50% probability of 10';
        default:
            return 'Unknown two-qubit state';
    }
};

// Available states for the 2-qubit system
export const twoQubitStates = [
    '|00⟩', '|01⟩', '|10⟩', '|11⟩',
    '|+0⟩', '|+1⟩', '|-0⟩', '|-1⟩',
    '|0+⟩', '|1+⟩', '|0-⟩', '|1-⟩',
    '|Φ+⟩', '|Φ-⟩', '|Ψ+⟩', '|Ψ-⟩'
];

// Single qubit states
export const singleQubitStates = [
    '|0⟩', '|1⟩', '|+⟩', '|-⟩', '|i⟩', '|-i⟩'
];