import React, { useState, useEffect } from 'react';
import QuantumRibbon from './components/QuantumRibbon/QuantumRibbon';
import BlochSphere from './components/BlochSphere/BlochSphere';
import GateControls from './components/GateControls/GateControls';
import History from './components/History/History';
import StateSelector from './components/StateSelector/StateSelector';
import ModeSelector from './components/ModeSelector/ModeSelector';
import TwoQubitControls from './components/TwoQubitControls/TwoQubitControls';
import TwoQubitRibbon from './components/TwoQubitRibbon/TwoQubitRibbon';
import './App.css';

// Utility functions for quantum state manipulations
const multiplyPhases = (phase1, phase2) => {
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

const getBlochPosition = (state, phase) => {
  // Direct mapping for each state to exact Bloch sphere coordinates
  // Ignoring phase for named states that already have specific positions

  if (state === '|0⟩') {
    // |0⟩ state at North pole
    return { theta: 0, phi: 0 };
  }

  if (state === '|1⟩') {
    // |1⟩ state at South pole
    return { theta: Math.PI, phi: 0 };
  }

  if (state === '|+⟩') {
    // |+⟩ state at right side
    return { theta: Math.PI / 2, phi: 0 };
  }

  if (state === '|-⟩') {
    // |-⟩ state at left side
    return { theta: Math.PI / 2, phi: Math.PI };
  }

  if (state === '|i⟩') {
    // |i⟩ state explicitly at bottom
    return { theta: Math.PI / 2, phi: Math.PI / 2 };
  }

  if (state === '|-i⟩') {
    // |-i⟩ state explicitly at top
    return { theta: Math.PI / 2, phi: 3 * Math.PI / 2 };
  }

  // Default position for unknown states
  return { theta: 0, phi: 0 };
};

const getStateDescription = (state) => {
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

// Helper function to extract individual qubit states from a composite state
const extractQubitStates = (twoQubitState) => {
  // For basis states like |00⟩, |01⟩, |10⟩, |11⟩
  if (['|00⟩', '|01⟩', '|10⟩', '|11⟩'].includes(twoQubitState)) {
    return {
      qubit1: twoQubitState.charAt(1) === '0' ? '|0⟩' : '|1⟩',
      qubit2: twoQubitState.charAt(2) === '0' ? '|0⟩' : '|1⟩',
      entangled: false
    };
  }

  // For separable superposition states
  if (['|+0⟩', '|+1⟩', '|-0⟩', '|-1⟩', '|0+⟩', '|1+⟩', '|0-⟩', '|1-⟩'].includes(twoQubitState)) {
    const firstSymbol = twoQubitState.charAt(1);
    const secondSymbol = twoQubitState.charAt(2);

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

  // For entangled Bell states, we'll return the Bell state name
  if (['|Φ+⟩', '|Φ-⟩', '|Ψ+⟩', '|Ψ-⟩'].includes(twoQubitState)) {
    return {
      qubit1: twoQubitState,
      qubit2: twoQubitState,
      entangled: true
    };
  }

  // Default for unknown states
  return {
    qubit1: '|+⟩',
    qubit2: '|+⟩',
    entangled: false
  };
};

// Helper function to combine two single-qubit states into a two-qubit state
const combineQubitStates = (qubit1, qubit2, entangled) => {
  if (entangled) {
    return qubit1; // For entangled states, return the Bell state name
  }

  // For separable states, combine the individual states
  if (qubit1 === '|0⟩' && qubit2 === '|0⟩') return '|00⟩';
  if (qubit1 === '|0⟩' && qubit2 === '|1⟩') return '|01⟩';
  if (qubit1 === '|1⟩' && qubit2 === '|0⟩') return '|10⟩';
  if (qubit1 === '|1⟩' && qubit2 === '|1⟩') return '|11⟩';

  // Handle superposition states
  if (qubit1 === '|+⟩') return `|+${qubit2.charAt(1)}⟩`;
  if (qubit1 === '|-⟩') return `|-${qubit2.charAt(1)}⟩`;
  if (qubit2 === '|+⟩') return `|${qubit1.charAt(1)}+⟩`;
  if (qubit2 === '|-⟩') return `|${qubit1.charAt(1)}-⟩`;

  // Default for unknown combination
  return '|++⟩';
};

// Apply single-qubit gate to individual qubit state
const applySingleGateToState = (gate, state, phase) => {
  let newState = state;
  let newPhase = phase;

  switch (gate) {
    case 'X':
      if (state === '|0⟩') newState = '|1⟩';
      else if (state === '|1⟩') newState = '|0⟩';
      else if (state === '|+⟩') newState = '|+⟩'; // No change
      else if (state === '|-⟩') {
        newState = '|-⟩'; // No change in state but phase flips
        newPhase = multiplyPhases(phase, '-1');
      }
      else if (state === '|i⟩') newState = '|-i⟩';
      else if (state === '|-i⟩') newState = '|i⟩';
      break;

    case 'Z':
      if (state === '|0⟩') newState = '|0⟩'; // No change
      else if (state === '|1⟩') {
        newState = '|1⟩'; // No change in state but phase flips
        newPhase = multiplyPhases(phase, '-1');
      }
      else if (state === '|+⟩') newState = '|-⟩';
      else if (state === '|-⟩') newState = '|+⟩';
      else if (state === '|i⟩') newState = '|-i⟩';
      else if (state === '|-i⟩') newState = '|i⟩';
      break;

    case 'Y':
      if (state === '|0⟩') {
        newState = '|1⟩';
        newPhase = multiplyPhases(phase, 'i');
      }
      else if (state === '|1⟩') {
        newState = '|0⟩';
        newPhase = multiplyPhases(phase, '-i');
      }
      else if (state === '|+⟩') {
        newState = '|-⟩';
        newPhase = multiplyPhases(phase, 'i');
      }
      else if (state === '|-⟩') {
        newState = '|+⟩';
        newPhase = multiplyPhases(phase, '-i');
      }
      else if (state === '|i⟩') newState = '|0⟩';
      else if (state === '|-i⟩') {
        newState = '|0⟩';
        newPhase = multiplyPhases(phase, '-1');
      }
      break;

    case 'H':
      if (state === '|0⟩') newState = '|+⟩';
      else if (state === '|1⟩') newState = '|-⟩';
      else if (state === '|+⟩') newState = '|0⟩';
      else if (state === '|-⟩') newState = '|1⟩';
      else if (state === '|i⟩') {
        newState = '|+⟩';
        newPhase = multiplyPhases(phase, 'i');
      }
      else if (state === '|-i⟩') {
        newState = '|-⟩';
        newPhase = multiplyPhases(phase, 'i');
      }
      break;
  }

  return { newState, newPhase };
};

// Get two-qubit state description
const getTwoQubitStateDescription = (state) => {
  switch (state) {
    case '|00⟩':
      return 'Both qubits in state |0⟩ - 100% probability of measuring 00';
    case '|01⟩':
      return 'First qubit |0⟩, second qubit |1⟩ - 100% probability of measuring 01';
    case '|10⟩':
      return 'First qubit |1⟩, second qubit |0⟩ - 100% probability of measuring 10';
    case '|11⟩':
      return 'Both qubits in state |1⟩ - 100% probability of measuring 11';
    // Superposition states
    case '|+0⟩':
      return 'First qubit in |+⟩ superposition, second qubit in |0⟩ state';
    case '|+1⟩':
      return 'First qubit in |+⟩ superposition, second qubit in |1⟩ state';
    case '|-0⟩':
      return 'First qubit in |-⟩ superposition, second qubit in |0⟩ state';
    case '|-1⟩':
      return 'First qubit in |-⟩ superposition, second qubit in |1⟩ state';
    case '|0+⟩':
      return 'First qubit in |0⟩ state, second qubit in |+⟩ superposition';
    case '|1+⟩':
      return 'First qubit in |1⟩ state, second qubit in |+⟩ superposition';
    case '|0-⟩':
      return 'First qubit in |0⟩ state, second qubit in |-⟩ superposition';
    case '|1-⟩':
      return 'First qubit in |1⟩ state, second qubit in |-⟩ superposition';
    // Bell states
    case '|Φ+⟩':
      return 'Bell state (|00⟩ + |11⟩)/√2 - Entangled state with 50% probability of 00, 50% probability of 11';
    case '|Φ-⟩':
      return 'Bell state (|00⟩ - |11⟩)/√2 - Entangled state with 50% probability of 00, 50% probability of 11';
    case '|Ψ+⟩':
      return 'Bell state (|01⟩ + |10⟩)/√2 - Entangled state with 50% probability of 01, 50% probability of 10';
    case '|Ψ-⟩':
      return 'Bell state (|01⟩ - |10⟩)/√2 - Entangled state with 50% probability of 01, 50% probability of 10';
    default:
      return 'Unknown quantum state';
  }
};

const App = () => {
  // Mode selection (1 qubit or 2 qubits)
  const [qubitMode, setQubitMode] = useState('1');

  // Single qubit state
  const [currentState, setCurrentState] = useState('|0⟩');
  const [phase, setPhase] = useState('1');
  const [blochPosition, setBlochPosition] = useState({ theta: 0, phi: 0 });

  // Two qubit state with individual phases
  const [twoQubitState, setTwoQubitState] = useState('|00⟩');
  const [qubit1Phase, setQubit1Phase] = useState('1');
  const [qubit2Phase, setQubit2Phase] = useState('1');

  // Common state
  const [history, setHistory] = useState(['Initial state: |0⟩']);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update Bloch sphere position when single qubit state changes
  useEffect(() => {
    setBlochPosition(getBlochPosition(currentState, phase));
  }, [currentState, phase]);

  // Apply gate to single qubit
  const applyGate = (gate) => {
    setIsAnimating(true);

    setTimeout(() => {
      let newState = currentState;
      let newPhase = phase;
      let operation = `Applied ${gate} to ${currentState}`;

      switch (gate) {
        case 'I':
          operation += ' → No change';
          break;
        case 'X':
          if (currentState === '|0⟩') newState = '|1⟩';
          else if (currentState === '|1⟩') newState = '|0⟩';
          else if (currentState === '|+⟩') newState = '|+⟩';
          else if (currentState === '|-⟩') {
            newState = '|-⟩';
            newPhase = multiplyPhases(phase, '-1');
          }
          else if (currentState === '|i⟩') newState = '|-i⟩';
          else if (currentState === '|-i⟩') newState = '|i⟩';
          operation += ` → ${newState}`;
          if (newPhase !== phase) operation += ` with phase ${newPhase}`;
          break;
        case 'Z':
          if (currentState === '|0⟩') newState = '|0⟩';
          else if (currentState === '|1⟩') {
            newState = '|1⟩';
            newPhase = multiplyPhases(phase, '-1');
          }
          else if (currentState === '|+⟩') newState = '|-⟩';
          else if (currentState === '|-⟩') newState = '|+⟩';
          else if (currentState === '|i⟩') newState = '|-i⟩';
          else if (currentState === '|-i⟩') newState = '|i⟩';
          operation += ` → ${newState}`;
          if (newPhase !== phase) operation += ` with phase ${newPhase}`;
          break;
        case 'Y':
          if (currentState === '|0⟩') {
            newState = '|1⟩';
            newPhase = multiplyPhases(phase, 'i');
          }
          else if (currentState === '|1⟩') {
            newState = '|0⟩';
            newPhase = multiplyPhases(phase, '-i');
          }
          else if (currentState === '|+⟩') {
            newState = '|-⟩';
            newPhase = multiplyPhases(phase, 'i');
          }
          else if (currentState === '|-⟩') {
            newState = '|+⟩';
            newPhase = multiplyPhases(phase, '-i');
          }
          else if (currentState === '|i⟩') newState = '|0⟩';
          else if (currentState === '|-i⟩') {
            newState = '|0⟩';
            newPhase = multiplyPhases(phase, '-1');
          }
          operation += ` → ${newState}`;
          if (newPhase !== phase) operation += ` with phase ${newPhase}`;
          break;
        case 'H':
          if (currentState === '|0⟩') newState = '|+⟩';
          else if (currentState === '|1⟩') newState = '|-⟩';
          else if (currentState === '|+⟩') newState = '|0⟩';
          else if (currentState === '|-⟩') newState = '|1⟩';
          else if (currentState === '|i⟩') {
            newState = '|+⟩';
            newPhase = multiplyPhases(phase, 'i');
          }
          else if (currentState === '|-i⟩') {
            newState = '|-⟩';
            newPhase = multiplyPhases(phase, 'i');
          }
          operation += ` → ${newState}`;
          if (newPhase !== phase) operation += ` with phase ${newPhase}`;
          break;
        case 'Measure':
          if (currentState === '|0⟩') {
            newState = '|0⟩';
            newPhase = '1';
            operation += ' → |0⟩ (100% probability)';
          }
          else if (currentState === '|1⟩') {
            newState = '|1⟩';
            newPhase = '1';
            operation += ' → |1⟩ (100% probability)';
          }
          else if (['|+⟩', '|-⟩', '|i⟩', '|-i⟩'].includes(currentState)) {
            const rand = Math.random();
            if (rand < 0.5) {
              newState = '|0⟩';
              newPhase = '1';
              operation += ' → |0⟩ (50% probability)';
            } else {
              newState = '|1⟩';
              newPhase = '1';
              operation += ' → |1⟩ (50% probability)';
            }
          }
          break;
        case 'Reset':
          newState = '|0⟩';
          newPhase = '1';
          operation = 'Reset to |0⟩ state';
          setHistory(['Initial state: |0⟩']);
          break;
        default:
          operation += ' → Unknown gate';
      }

      setCurrentState(newState);
      setPhase(newPhase);

      if (gate !== 'Reset') {
        setHistory([...history, operation]);
      }
      setIsAnimating(false);
    }, 500);
  };

  // Apply single qubit gate to a specific qubit in the two-qubit system
  const applySingleQubitGate = (gate, qubitIndex) => {
    setIsAnimating(true);

    setTimeout(() => {
      let newState = twoQubitState;
      let newQubit1Phase = qubit1Phase;
      let newQubit2Phase = qubit2Phase;
      let operation = `Applied ${gate} to Qubit ${qubitIndex + 1} of ${twoQubitState}`;

      // Handle entangled Bell states specially
      if (['|Φ+⟩', '|Φ-⟩', '|Ψ+⟩', '|Ψ-⟩'].includes(twoQubitState)) {
        // Bell state transformations
        if (gate === 'X') {
          if (qubitIndex === 0) { // X on first qubit of Bell state
            if (twoQubitState === '|Φ+⟩') newState = '|Ψ+⟩';
            else if (twoQubitState === '|Φ-⟩') newState = '|Ψ-⟩';
            else if (twoQubitState === '|Ψ+⟩') newState = '|Φ+⟩';
            else if (twoQubitState === '|Ψ-⟩') newState = '|Φ-⟩';
          } else { // X on second qubit of Bell state
            if (twoQubitState === '|Φ+⟩') newState = '|Ψ+⟩';
            else if (twoQubitState === '|Φ-⟩') newState = '|Ψ-⟩';
            else if (twoQubitState === '|Ψ+⟩') newState = '|Φ+⟩';
            else if (twoQubitState === '|Ψ-⟩') newState = '|Φ-⟩';
          }
        }
        else if (gate === 'Z') {
          if (qubitIndex === 0) { // Z on first qubit of Bell state
            if (twoQubitState === '|Φ+⟩') newState = '|Φ-⟩';
            else if (twoQubitState === '|Φ-⟩') newState = '|Φ+⟩';
            else if (twoQubitState === '|Ψ+⟩') newState = '|Ψ-⟩';
            else if (twoQubitState === '|Ψ-⟩') newState = '|Ψ+⟩';
          } else { // Z on second qubit of Bell state
            if (twoQubitState === '|Φ+⟩') newState = '|Φ-⟩';
            else if (twoQubitState === '|Φ-⟩') newState = '|Φ+⟩';
            else if (twoQubitState === '|Ψ+⟩') newState = '|Ψ-⟩';
            else if (twoQubitState === '|Ψ-⟩') newState = '|Ψ+⟩';
          }
        }
        else if (gate === 'H') {
          // Hadamard on Bell states - complex transformations
          if (qubitIndex === 0) {
            if (twoQubitState === '|Φ+⟩') newState = '|Φ+⟩'; // No change
            else if (twoQubitState === '|Φ-⟩') newState = '|Ψ-⟩';
            else if (twoQubitState === '|Ψ+⟩') newState = '|Ψ+⟩'; // No change
            else if (twoQubitState === '|Ψ-⟩') newState = '|Φ-⟩';
          } else {
            if (twoQubitState === '|Φ+⟩') newState = '|Φ+⟩'; // No change
            else if (twoQubitState === '|Φ-⟩') newState = '|Ψ-⟩';
            else if (twoQubitState === '|Ψ+⟩') newState = '|Ψ+⟩'; // No change
            else if (twoQubitState === '|Ψ-⟩') newState = '|Φ-⟩';
          }
        }
        else if (gate === 'Y') {
          // Y gate on Bell states
          if (qubitIndex === 0) {
            if (twoQubitState === '|Φ+⟩') newState = '|Ψ-⟩';
            else if (twoQubitState === '|Φ-⟩') newState = '|Ψ+⟩';
            else if (twoQubitState === '|Ψ+⟩') newState = '|Φ-⟩';
            else if (twoQubitState === '|Ψ-⟩') newState = '|Φ+⟩';
          } else {
            if (twoQubitState === '|Φ+⟩') newState = '|Ψ-⟩';
            else if (twoQubitState === '|Φ-⟩') newState = '|Ψ+⟩';
            else if (twoQubitState === '|Ψ+⟩') newState = '|Φ-⟩';
            else if (twoQubitState === '|Ψ-⟩') newState = '|Φ+⟩';
          }
        }
      }
      else {
        // Extract individual qubit states
        const states = extractQubitStates(twoQubitState);

        if (qubitIndex === 0) {
          // Apply gate to first qubit
          const result = applySingleGateToState(gate, states.qubit1, qubit1Phase);
          states.qubit1 = result.newState;
          newQubit1Phase = result.newPhase;
        } else {
          // Apply gate to second qubit
          const result = applySingleGateToState(gate, states.qubit2, qubit2Phase);
          states.qubit2 = result.newState;
          newQubit2Phase = result.newPhase;
        }

        // Recombine the states
        newState = combineQubitStates(states.qubit1, states.qubit2, states.entangled);
      }

      // Update operation text
      operation += ` → ${newState}`;
      if (newQubit1Phase !== qubit1Phase && qubitIndex === 0)
        operation += ` with qubit 1 phase ${newQubit1Phase}`;
      if (newQubit2Phase !== qubit2Phase && qubitIndex === 1)
        operation += ` with qubit 2 phase ${newQubit2Phase}`;

      // Update states
      setTwoQubitState(newState);
      setQubit1Phase(newQubit1Phase);
      setQubit2Phase(newQubit2Phase);
      setHistory([...history, operation]);
      setIsAnimating(false);
    }, 500);
  };

  // Apply two-qubit gate
  const applyTwoQubitGate = (gate) => {
    setIsAnimating(true);

    setTimeout(() => {
      let newState = twoQubitState;
      let newQubit1Phase = qubit1Phase;
      let newQubit2Phase = qubit2Phase;
      let operation = `Applied ${gate} to ${twoQubitState}`;

      switch (gate) {
        case 'CNOT':
          // CNOT gate logic
          // Basis states
          if (twoQubitState === '|00⟩') newState = '|00⟩'; // No change
          else if (twoQubitState === '|01⟩') newState = '|01⟩'; // No change
          else if (twoQubitState === '|10⟩') newState = '|11⟩'; // Flip second qubit
          else if (twoQubitState === '|11⟩') newState = '|10⟩'; // Flip second qubit

          // Separable superposition states - this creates entanglement
          else if (twoQubitState === '|+0⟩') {
            newState = '|Φ+⟩'; // Creates entanglement - (|00⟩ + |11⟩)/√2
            newQubit1Phase = '1';
            newQubit2Phase = '1';
          }
          else if (twoQubitState === '|+1⟩') {
            newState = '|Ψ+⟩'; // Creates entanglement - (|01⟩ + |10⟩)/√2
            newQubit1Phase = '1';
            newQubit2Phase = '1';
          }
          else if (twoQubitState === '|-0⟩') {
            newState = '|Φ-⟩'; // Creates entanglement - (|00⟩ - |11⟩)/√2
            newQubit1Phase = '1';
            newQubit2Phase = '1';
          }
          else if (twoQubitState === '|-1⟩') {
            newState = '|Ψ-⟩'; // Creates entanglement - (|01⟩ - |10⟩)/√2
            newQubit1Phase = '1';
            newQubit2Phase = '1';
          }

          // Superposition on second qubit doesn't create entanglement
          else if (twoQubitState === '|0+⟩') newState = '|0+⟩'; // No change
          else if (twoQubitState === '|0-⟩') newState = '|0-⟩'; // No change
          else if (twoQubitState === '|1+⟩') newState = '|1-⟩'; // Flips the superposition
          else if (twoQubitState === '|1-⟩') newState = '|1+⟩'; // Flips the superposition

          // CNOT on Bell states - no effect or converts between types
          else if (twoQubitState === '|Φ+⟩') newState = '|Φ+⟩'; // No change
          else if (twoQubitState === '|Φ-⟩') newState = '|Ψ-⟩';
          else if (twoQubitState === '|Ψ+⟩') newState = '|Ψ+⟩'; // No change
          else if (twoQubitState === '|Ψ-⟩') newState = '|Φ-⟩';
          break;

        case 'Measure':
          // Measure collapses superpositions and entangled states
          if (['|00⟩', '|01⟩', '|10⟩', '|11⟩'].includes(twoQubitState)) {
            // Computational basis states remain unchanged
            operation += ` → ${twoQubitState} (100% probability)`;
          }
          // Handle separable superposition states
          else if (['|+0⟩', '|-0⟩', '|+1⟩', '|-1⟩'].includes(twoQubitState)) {
            const secondBit = twoQubitState.charAt(2);
            const rand = Math.random();
            if (rand < 0.5) {
              newState = `|0${secondBit}⟩`;
              operation += ` → ${newState} (50% probability)`;
            } else {
              newState = `|1${secondBit}⟩`;
              operation += ` → ${newState} (50% probability)`;
            }
            newQubit1Phase = '1';
          }
          else if (['|0+⟩', '|0-⟩', '|1+⟩', '|1-⟩'].includes(twoQubitState)) {
            const firstBit = twoQubitState.charAt(1);
            const rand = Math.random();
            if (rand < 0.5) {
              newState = `|${firstBit}0⟩`;
              operation += ` → ${newState} (50% probability)`;
            } else {
              newState = `|${firstBit}1⟩`;
              operation += ` → ${newState} (50% probability)`;
            }
            newQubit2Phase = '1';
          }
          // Bell states measurement
          else if (['|Φ+⟩', '|Φ-⟩'].includes(twoQubitState)) {
            // Bell states |Φ+⟩ and |Φ-⟩ collapse to |00⟩ or |11⟩
            const rand = Math.random();
            if (rand < 0.5) {
              newState = '|00⟩';
              operation += ' → |00⟩ (50% probability)';
            } else {
              newState = '|11⟩';
              operation += ' → |11⟩ (50% probability)';
            }
            newQubit1Phase = '1';
            newQubit2Phase = '1';
          } else if (['|Ψ+⟩', '|Ψ-⟩'].includes(twoQubitState)) {
            // Bell states |Ψ+⟩ and |Ψ-⟩ collapse to |01⟩ or |10⟩
            const rand = Math.random();
            if (rand < 0.5) {
              newState = '|01⟩';
              operation += ' → |01⟩ (50% probability)';
            } else {
              newState = '|10⟩';
              operation += ' → |10⟩ (50% probability)';
            }
            newQubit1Phase = '1';
            newQubit2Phase = '1';
          }
          break;

        case 'Reset':
          newState = '|00⟩';
          newQubit1Phase = '1';
          newQubit2Phase = '1';
          operation = 'Reset to |00⟩ state';
          setHistory(['Initial state: |00⟩']);
          break;

        default:
          operation += ' → Unknown gate';
      }

      if (!operation.includes('→')) {
        operation += ` → ${newState}`;
      }

      setTwoQubitState(newState);
      setQubit1Phase(newQubit1Phase);
      setQubit2Phase(newQubit2Phase);

      if (gate !== 'Reset') {
        setHistory([...history, operation]);
      }

      setIsAnimating(false);
    }, 500);
  };

  // Handle state changes
  const handleStateChange = (state) => {
    setCurrentState(state);
    if (state === '|i⟩') {
      setPhase('i');
    } else if (state === '|-i⟩') {
      setPhase('-i');
    } else {
      setPhase('1');
    }
  };

  // Handle two-qubit state changes
  const handleTwoQubitStateChange = (state) => {
    setTwoQubitState(state);
    setQubit1Phase('1'); // Reset phases when changing state
    setQubit2Phase('1');
  };

  // Mode change handler
  const handleModeChange = (mode) => {
    setQubitMode(mode);

    // Reset history when switching modes
    if (mode === '1') {
      setHistory(['Initial state: |0⟩']);
    } else {
      setHistory(['Initial state: |00⟩']);
    }
  };

  return (
    <div className="quantum-ribbon-simulator">
      <h1>Quantum Ribbon Simulator</h1>

      <ModeSelector mode={qubitMode} onChange={handleModeChange} />

      <div className="state-info">
        <h2>Current State: {qubitMode === '1' ? currentState : twoQubitState}</h2>
        <p>{qubitMode === '1'
          ? getStateDescription(currentState)
          : getTwoQubitStateDescription(twoQubitState)}</p>
        {qubitMode === '1' && (
          <>
            {phase === '1' && <p>Phase factor: +1 (arrows pointing right →)</p>}
            {phase === '-1' && <p>Phase factor: -1 (arrows pointing left ←)</p>}
            {phase === 'i' && <p>Phase factor: i (arrows pointing up ↑)</p>}
            {phase === '-i' && <p>Phase factor: -i (arrows pointing down ↓)</p>}
          </>
        )}
        {qubitMode === '2' && !['|Φ+⟩', '|Φ-⟩', '|Ψ+⟩', '|Ψ-⟩'].includes(twoQubitState) && (
          <>
            <p>Qubit 1 phase:
              {qubit1Phase === '1' && <span> +1 (arrows pointing right →)</span>}
              {qubit1Phase === '-1' && <span> -1 (arrows pointing left ←)</span>}
              {qubit1Phase === 'i' && <span> i (arrows pointing up ↑)</span>}
              {qubit1Phase === '-i' && <span> -i (arrows pointing down ↓)</span>}
            </p>
            <p>Qubit 2 phase:
              {qubit2Phase === '1' && <span> +1 (arrows pointing right →)</span>}
              {qubit2Phase === '-1' && <span> -1 (arrows pointing left ←)</span>}
              {qubit2Phase === 'i' && <span> i (arrows pointing up ↑)</span>}
              {qubit2Phase === '-i' && <span> -i (arrows pointing down ↓)</span>}
            </p>
          </>
        )}
      </div>

      {qubitMode === '1' ? (
        // Single qubit mode
        <div className="visualizations">
          <QuantumRibbon
            currentState={currentState}
            phase={phase}
            isAnimating={isAnimating}
          />
          <BlochSphere
            theta={blochPosition.theta}
            phi={blochPosition.phi}
          />
          <GateControls onGateApply={applyGate} />
        </div>
      ) : (
        // Two qubit mode
        <div className="visualizations">
          <TwoQubitRibbon
            state={twoQubitState}
            qubit1Phase={qubit1Phase}
            qubit2Phase={qubit2Phase}
            isAnimating={isAnimating}
          />
          <TwoQubitControls
            onGateApply={applyTwoQubitGate}
            onSingleQubitGateApply={applySingleQubitGate}
          />
        </div>
      )}

      <StateSelector
        currentState={qubitMode === '1' ? currentState : twoQubitState}
        availableStates={qubitMode === '1' ?
          ['|0⟩', '|1⟩', '|+⟩', '|-⟩', '|i⟩', '|-i⟩'] :
          ['|00⟩', '|01⟩', '|10⟩', '|11⟩', '|+0⟩', '|+1⟩', '|-0⟩', '|-1⟩', '|0+⟩', '|1+⟩', '|0-⟩', '|1-⟩', '|Φ+⟩', '|Φ-⟩', '|Ψ+⟩', '|Ψ-⟩']
        }
        onStateChange={qubitMode === '1' ? handleStateChange : handleTwoQubitStateChange}
        addHistory={(op) => setHistory([...history, op])}
      />

      <History operations={history} />

      <div className="footer">
        <p>This simulator demonstrates the quantum ribbon model with directional arrows representing phase.</p>
        <p>Phase is shown with arrows: right (→) = +1, left (←) = -1, up (↑) = +i, down (↓) = -i</p>
        {qubitMode === '2' && (
          <p>Two-qubit mode shows entanglement created by the CNOT gate.</p>
        )}
      </div>
    </div>
  );
};

export default App;