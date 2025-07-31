import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Todo {
  id: number;
  text: string;
  completed: 0 | 1;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [currentUser, setCurrentUser] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const navigate = useNavigate();

  // Load user data and todos on component mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    
    if (!loggedInUser) {
      // If no logged in user, redirect to login
      navigate('/login');
      return;
    }

    // Set user info
    setUserEmail(loggedInUser);
    setCurrentUser(loggedInUsername || loggedInUser);

    // Load user-specific todos
    const userTodosKey = `todos_${loggedInUser}`;
    const storedTodos = localStorage.getItem(userTodosKey);
    
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos);
        setTodos(Array.isArray(parsedTodos) ? parsedTodos : []);
      } catch (error) {
        console.error('Error parsing todos from localStorage:', error);
        setTodos([]);
      }
    } else {
      setTodos([]);
    }

    // Set background with better centering
    document.body.style.backgroundImage = `url('/sky2.png')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';
    };
  }, [navigate]);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (userEmail) {
      const userTodosKey = `todos_${userEmail}`;
      try {
        localStorage.setItem(userTodosKey, JSON.stringify(todos));
        console.log(`Saved ${todos.length} todos for user: ${userEmail}`);
      } catch (error) {
        console.error('Error saving todos to localStorage:', error);
      }
    }
  }, [todos, userEmail]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const newTodoItem: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: 0,
    };
    
    setTodos(prevTodos => [...prevTodos, newTodoItem]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: todo.completed === 1 ? 0 : 1 } : todo
      )
    );
  };

  const removeTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const removeSelectedTodos = () => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.completed === 0));
  };

  const handleLogout = () => {
    // Force save current todos before logout
    if (userEmail) {
      const userTodosKey = `todos_${userEmail}`;
      try {
        localStorage.setItem(userTodosKey, JSON.stringify(todos));
        console.log(`Final save: ${todos.length} todos for user: ${userEmail}`);
      } catch (error) {
        console.error('Error saving todos during logout:', error);
      }
    }

    // Clear session data
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInUsername');
    
    // Navigate to login
    navigate('/login');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className='todoList'>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>To Do List - {currentUser}</h2>
        <button 
          onClick={handleLogout} 
          style={{ 
            backgroundColor: '#e46569', 
            padding: '8px 16px',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '20px'
          }}
        >
          Logout
        </button>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          className='todoInput'
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new to do"
          style={{ marginRight: '10px' }}
        />
        <button className='todoButton' onClick={addTodo}>Add</button>
        <button 
          className='deleteSelectedButton' 
          onClick={removeSelectedTodos} 
          style={{ 
            marginLeft: '10px',
            backgroundColor: '#e46569',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Delete Selected
        </button>
      </div>

      {todos.length === 0 ? (
        <p style={{ marginLeft: '20px', fontStyle: 'italic', color: '#666' }}>
          No todos yet. Add one above!
        </p>
      ) : (
        <ul>
          {todos.map(todo => (
            <li key={todo.id} className={`todoItem ${todo.completed === 1 ? 'completed' : ''}`}>
              <input
                className='todoCheckbox'
                type="checkbox"
                checked={todo.completed === 1}
                onChange={() => toggleTodo(todo.id)}
              />
              <span style={{ 
                textDecoration: todo.completed === 1 ? 'line-through' : 'none',
                marginLeft: '8px',
                marginRight: '8px'
              }}>
                {todo.text}
              </span>
              <button 
                className='deleteButton' 
                onClick={() => removeTodo(todo.id)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(223, 78, 78, 0.774)',
                  fontSize: '16px'
                }}
              >
                <span className="material-icons">close</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      
      <div style={{ marginTop: '20px', marginLeft: '20px', fontSize: '14px', color: '#666' }}>
        Total: {todos.length} | Completed: {todos.filter(t => t.completed === 1).length} | 
        Remaining: {todos.filter(t => t.completed === 0).length}
      </div>
    </div>
  );
};

export default TodoList;