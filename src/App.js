import React, { useState, useEffect } from 'react';
import QuantumRibbon from './components/QuantumRibbon/QuantumRibbon';
import BlochSphere from './components/BlochSphere/BlochSphere';
import GateControls from './components/GateControls/GateControls';
import History from './components/History/History';
import StateSelector from './components/StateSelector/StateSelector';
import ModeSelector from './components/ModeSelector/ModeSelector';
import TwoQubitControls from './components/TwoQubitControls/TwoQubitControls';
import TwoQubitRibbon from './components/TwoQubitRibbon/TwoQubitRibbon';

import {
  multiplyPhases,
  getBlochPosition,
  getStateDescription,
  getTwoQubitStateDescription,
  singleQubitStates,
  twoQubitStates
} from './utils/quantumUtils';

import './App.css';

const App = () => {
  // Mode selection (1 qubit or 2 qubits)
  const [qubitMode, setQubitMode] = useState('1');

  // Single qubit state
  const [currentState, setCurrentState] = useState('|0⟩');
  const [phase, setPhase] = useState('1');
  const [blochPosition, setBlochPosition] = useState({ theta: 0, phi: 0 });

  // Two qubit state
  const [twoQubitState, setTwoQubitState] = useState('|00⟩');
  const [twoQubitPhase, setTwoQubitPhase] = useState('1');

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
  // Apply single qubit gate to a specific qubit in the two-qubit system
  const applySingleQubitGate = (gate, qubitIndex) => {
    setIsAnimating(true);

    setTimeout(() => {
      let newState = twoQubitState;
      let newPhase = twoQubitPhase;
      let operation = `Applied ${gate} to Qubit ${qubitIndex + 1} of ${twoQubitState}`;

      // Two-qubit basis states (|00⟩, |01⟩, |10⟩, |11⟩)
      if (['|00⟩', '|01⟩', '|10⟩', '|11⟩'].includes(twoQubitState)) {
        const firstBit = twoQubitState.charAt(1);
        const secondBit = twoQubitState.charAt(2);

        // Apply gate to first qubit
        if (qubitIndex === 0) {
          if (gate === 'X') {
            // Flip first bit
            const newFirstBit = firstBit === '0' ? '1' : '0';
            newState = `|${newFirstBit}${secondBit}⟩`;
          } else if (gate === 'H') {
            // Hadamard on first qubit - creates superposition but NOT entanglement
            if (firstBit === '0') {
              newState = `|+${secondBit}⟩`; // |0⟩ → |+⟩ for first qubit
            } else { // firstBit === '1'
              newState = `|-${secondBit}⟩`; // |1⟩ → |-⟩ for first qubit
            }
          } else if (gate === 'Z') {
            // Z gate on first qubit
            if (firstBit === '1') {
              // Phase flip for |1⟩
              newPhase = multiplyPhases(twoQubitPhase, '-1');
            }
            // |0⟩ is unchanged by Z
          }
        }

        // Apply gate to second qubit
        else if (qubitIndex === 1) {
          if (gate === 'X') {
            // Flip second bit
            const newSecondBit = secondBit === '0' ? '1' : '0';
            newState = `|${firstBit}${newSecondBit}⟩`;
          } else if (gate === 'H') {
            // Hadamard on second qubit - creates superposition but NOT entanglement
            if (secondBit === '0') {
              newState = `|${firstBit}+⟩`; // |0⟩ → |+⟩ for second qubit
            } else { // secondBit === '1'
              newState = `|${firstBit}-⟩`; // |1⟩ → |-⟩ for second qubit
            }
          } else if (gate === 'Z') {
            // Z gate on second qubit
            if (secondBit === '1') {
              // Phase flip for |1⟩
              newPhase = multiplyPhases(twoQubitPhase, '-1');
            }
            // |0⟩ is unchanged by Z
          }
        }
      }

      // Handle superposition states (not entangled)
      else if (['|+0⟩', '|+1⟩', '|-0⟩', '|-1⟩', '|0+⟩', '|1+⟩', '|0-⟩', '|1-⟩'].includes(twoQubitState)) {
        const firstSymbol = twoQubitState.charAt(1);
        const secondSymbol = twoQubitState.charAt(2);

        // Apply gate to first qubit
        if (qubitIndex === 0) {
          if (gate === 'X') {
            if (firstSymbol === '0') newState = `|1${secondSymbol}⟩`;
            else if (firstSymbol === '1') newState = `|0${secondSymbol}⟩`;
            else if (firstSymbol === '+') newState = `|+${secondSymbol}⟩`; // |+⟩ unchanged by X
            else if (firstSymbol === '-') {
              newState = `|-${secondSymbol}⟩`; // |-⟩ unchanged but phase flips
              newPhase = multiplyPhases(twoQubitPhase, '-1');
            }
          } else if (gate === 'H') {
            if (firstSymbol === '+') newState = `|0${secondSymbol}⟩`; // |+⟩ → |0⟩
            else if (firstSymbol === '-') newState = `|1${secondSymbol}⟩`; // |-⟩ → |1⟩
            else if (firstSymbol === '0') newState = `|+${secondSymbol}⟩`; // |0⟩ → |+⟩
            else if (firstSymbol === '1') newState = `|-${secondSymbol}⟩`; // |1⟩ → |-⟩
          } else if (gate === 'Z') {
            if (firstSymbol === '+') newState = `|-${secondSymbol}⟩`; // |+⟩ → |-⟩
            else if (firstSymbol === '-') newState = `|+${secondSymbol}⟩`; // |-⟩ → |+⟩
            else if (firstSymbol === '1') {
              // Phase flip for |1⟩
              newPhase = multiplyPhases(twoQubitPhase, '-1');
            }
            // |0⟩ is unchanged by Z
          }
        }

        // Apply gate to second qubit
        else if (qubitIndex === 1) {
          if (gate === 'X') {
            if (secondSymbol === '0') newState = `|${firstSymbol}1⟩`;
            else if (secondSymbol === '1') newState = `|${firstSymbol}0⟩`;
            else if (secondSymbol === '+') newState = `|${firstSymbol}+⟩`; // |+⟩ unchanged by X
            else if (secondSymbol === '-') {
              newState = `|${firstSymbol}-⟩`; // |-⟩ unchanged but phase flips
              newPhase = multiplyPhases(twoQubitPhase, '-1');
            }
          } else if (gate === 'H') {
            if (secondSymbol === '+') newState = `|${firstSymbol}0⟩`; // |+⟩ → |0⟩
            else if (secondSymbol === '-') newState = `|${firstSymbol}1⟩`; // |-⟩ → |1⟩
            else if (secondSymbol === '0') newState = `|${firstSymbol}+⟩`; // |0⟩ → |+⟩
            else if (secondSymbol === '1') newState = `|${firstSymbol}-⟩`; // |1⟩ → |-⟩
          } else if (gate === 'Z') {
            if (secondSymbol === '+') newState = `|${firstSymbol}-⟩`; // |+⟩ → |-⟩
            else if (secondSymbol === '-') newState = `|${firstSymbol}+⟩`; // |-⟩ → |+⟩
            else if (secondSymbol === '1') {
              // Phase flip for |1⟩
              newPhase = multiplyPhases(twoQubitPhase, '-1');
            }
            // |0⟩ is unchanged by Z
          }
        }
      }

      // Bell states and other entangled states
      else if (['|Φ+⟩', '|Φ-⟩', '|Ψ+⟩', '|Ψ-⟩'].includes(twoQubitState)) {
        // Applying gates to entangled states
        if (gate === 'X') {
          if (qubitIndex === 0 || qubitIndex === 1) { // Same effect on either qubit for Bell states
            if (twoQubitState === '|Φ+⟩') newState = '|Ψ+⟩';
            else if (twoQubitState === '|Φ-⟩') newState = '|Ψ-⟩';
            else if (twoQubitState === '|Ψ+⟩') newState = '|Φ+⟩';
            else if (twoQubitState === '|Ψ-⟩') newState = '|Φ-⟩';
          }
        } else if (gate === 'Z') {
          // Phase changes for Z gate on Bell states
          if (qubitIndex === 0 || qubitIndex === 1) { // Same effect on either qubit for Bell states
            if (twoQubitState === '|Φ+⟩') newState = '|Φ-⟩';
            else if (twoQubitState === '|Φ-⟩') newState = '|Φ+⟩';
            else if (twoQubitState === '|Ψ+⟩') newState = '|Ψ-⟩';
            else if (twoQubitState === '|Ψ-⟩') newState = '|Ψ+⟩';
          }
        } else if (gate === 'H') {
          // H gate on Bell states - more complex transformations
          if (qubitIndex === 0) { // H on first qubit of Bell state
            if (twoQubitState === '|Φ+⟩') newState = '|Φ+⟩';
            else if (twoQubitState === '|Φ-⟩') newState = '|Ψ-⟩';
            else if (twoQubitState === '|Ψ+⟩') newState = '|Ψ+⟩';
            else if (twoQubitState === '|Ψ-⟩') newState = '|Φ-⟩';
          } else if (qubitIndex === 1) { // H on second qubit of Bell state
            if (twoQubitState === '|Φ+⟩') newState = '|Φ+⟩';
            else if (twoQubitState === '|Φ-⟩') newState = '|Ψ-⟩';
            else if (twoQubitState === '|Ψ+⟩') newState = '|Ψ+⟩';
            else if (twoQubitState === '|Ψ-⟩') newState = '|Φ-⟩';
          }
        }
      }

      operation += ` → ${newState}`;
      if (newPhase !== twoQubitPhase) operation += ` with phase ${newPhase}`;

      setTwoQubitState(newState);
      setTwoQubitPhase(newPhase);
      setHistory([...history, operation]);
      setIsAnimating(false);
    }, 500);
  };

// Apply two-qubit gate
  // Apply two-qubit gate
  const applyTwoQubitGate = (gate) => {
    setIsAnimating(true);

    setTimeout(() => {
      let newState = twoQubitState;
      let newPhase = twoQubitPhase;
      let operation = `Applied ${gate} to ${twoQubitState}`;

      switch (gate) {
        case 'CNOT':
          // CNOT gate logic
          // Basis states
          if (twoQubitState === '|00⟩') newState = '|00⟩'; // No change
          else if (twoQubitState === '|01⟩') newState = '|01⟩'; // No change
          else if (twoQubitState === '|10⟩') newState = '|11⟩'; // Flip second qubit
          else if (twoQubitState === '|11⟩') newState = '|10⟩'; // Flip second qubit

          // Separable superposition states - this is where entanglement happens
          else if (twoQubitState === '|+0⟩') newState = '|Φ+⟩'; // Creates entanglement!
          else if (twoQubitState === '|+1⟩') newState = '|Ψ+⟩'; // Creates entanglement!
          else if (twoQubitState === '|-0⟩') newState = '|Φ-⟩'; // Creates entanglement!
          else if (twoQubitState === '|-1⟩') newState = '|Ψ-⟩'; // Creates entanglement!

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
          }
          newPhase = '1'; // Reset phase after measurement
          break;

        case 'Reset':
          newState = '|00⟩';
          newPhase = '1';
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
      setTwoQubitPhase(newPhase);

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
  setTwoQubitPhase('1'); // Reset phase when changing state
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
      {qubitMode === '2' && (
        <>
          {twoQubitPhase === '1' && <p>Phase factor: +1</p>}
          {twoQubitPhase === '-1' && <p>Phase factor: -1</p>}
          {twoQubitPhase === 'i' && <p>Phase factor: i</p>}
          {twoQubitPhase === '-i' && <p>Phase factor: -i</p>}
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
          phase={twoQubitPhase}
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
      availableStates={qubitMode === '1' ? singleQubitStates : twoQubitStates}
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