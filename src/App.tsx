import React from 'react';
import './App.css';
import { CanvasComponent } from './components/canvas.component';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Projectile Motion</h1>
      <CanvasComponent/>
    </div>
  );
}

export default App;
