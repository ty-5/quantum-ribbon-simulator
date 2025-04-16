import React, { useState, useEffect } from 'react';
import { multiplyPhases, getBlochPosition, getStateDescription } from './utils/quantumMath';
import QuantumRibbon from './components/QuantumRibbon/QuantumRibbon';
import BlochSphere from './components/BlochSphere/BlochSphere';
import GateControls from './components/GateControls/GateControls';
import History from './components/History/History';
import StateSelector from './components/StateSelector/StateSelector';
import './App.css';

const App = () => {
  const [currentState, setCurrentState] = useState('|0⟩');
  const [phase, setPhase] = useState('1');
  const [history, setHistory] = useState(['Initial state: |0⟩']);
  const [isAnimating, setIsAnimating] = useState(false);
  const [blochPosition, setBlochPosition] = useState({ theta: 0, phi: 0 });

  useEffect(() => {
    setBlochPosition(getBlochPosition(currentState, phase));
  }, [currentState, phase]);

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

  return (
    <div className="quantum-ribbon-simulator">
      <h1>Quantum Ribbon Simulator</h1>

      <div className="state-info">
        <h2>Current State: {currentState}</h2>
        <p>{getStateDescription(currentState)}</p>
        {phase === '1' && <p>Phase factor: +1 (arrows pointing right →)</p>}
        {phase === '-1' && <p>Phase factor: -1 (arrows pointing left ←)</p>}
        {phase === 'i' && <p>Phase factor: i (arrows pointing up ↑)</p>}
        {phase === '-i' && <p>Phase factor: -i (arrows pointing down ↓)</p>}
      </div>

      <QuantumRibbon currentState={currentState} phase={phase} isAnimating={isAnimating} />
      <BlochSphere theta={blochPosition.theta} phi={blochPosition.phi} />

      <GateControls onGateApply={applyGate} />
      <StateSelector
        currentState={currentState}
        onStateChange={handleStateChange}
        addHistory={(op) => setHistory([...history, op])}
      />
      <History operations={history} />

      <div className="footer">
        <p>This simulator demonstrates the quantum ribbon model with directional arrows representing phase.</p>
        <p>Phase is shown with arrows: right (→) = +1, left (←) = -1, up (↑) = +i, down (↓) = -i</p>
      </div>
    </div>
  );
};

export default App;