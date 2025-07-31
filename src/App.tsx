import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login2 from './components/Login2';
import Register from './components/Register';
import TodoList from './components/TodoList';
import PixelTrail from './components/PixelTrail';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login2 />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/todos"
          element={
            <div style={{ position: 'relative', height: '100vh' }}>
              {/* PixelTrail background */}
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              >
                <PixelTrail
                  gridSize={50}
                  trailSize={0.1}
                  maxAge={250}
                  interpolate={5}
                  color="#ecadcd"
                  gooeyFilter={{ id: 'custom-goo-filter', strength: 2 }}
                />
              </div>
              {/* TodoList content */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <TodoList />
              </div>
            </div>
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
