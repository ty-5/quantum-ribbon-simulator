export const multiplyPhases = (phase1, phase2) => {
    const phaseMultiplication = {
        '1': { '1': '1', '-1': '-1', 'i': 'i', '-i': '-i' },
        '-1': { '1': '-1', '-1': '1', 'i': '-i', '-i': 'i' },
        'i': { '1': 'i', '-1': '-i', 'i': '-1', '-i': '1' },
        '-i': { '1': '-i', '-1': 'i', 'i': '1', '-i': '-1' }
    };
    return phaseMultiplication[phase1][phase2];
};

export const getBlochPosition = (state, phase) => {
    let theta = 0;
    let phi = 0;

    switch (state) {
        case '|0⟩': theta = 0; break;
        case '|1⟩': theta = Math.PI; break;
        case '|+⟩': theta = Math.PI / 2; phi = 0; break;
        case '|-⟩': theta = Math.PI / 2; phi = Math.PI; break;
        case '|i⟩': theta = Math.PI / 2; phi = Math.PI / 2; break;
        case '|-i⟩': theta = Math.PI / 2; phi = 3 * Math.PI / 2; break;
    }

    if (phase === '-1' && (state === '|1⟩' || state === '|-⟩')) {
        phi += Math.PI;
    }

    return { theta, phi };
};

export const getStateDescription = (state) => {
    switch (state) {
        case '|0⟩': return 'Pure |0⟩ state (100% blue)';
        case '|1⟩': return 'Pure |1⟩ state (100% red)';
        case '|+⟩': return 'Equal superposition (|0⟩+|1⟩)/√2, red up - 50% blue, 50% red';
        case '|-⟩': return 'Equal superposition (|0⟩-|1⟩)/√2, blue up - 50% blue, 50% red';
        case '|i⟩': return 'Complex superposition (|0⟩+i|1⟩)/√2 - 50% blue, 50% red';
        case '|-i⟩': return 'Complex superposition (|0⟩-i|1⟩)/√2 - 50% blue, 50% red';
        default: return 'Unknown state';
    }
};