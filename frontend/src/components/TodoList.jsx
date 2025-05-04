import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

function TodoList() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const fetchTodos = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      handleLogout();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/todos`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const addTodo = async () => {
    if (!text.trim()) return;
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      handleLogout();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ text })
      });
      
      if (response.ok) {
        setText('');
        await fetchTodos();
      } else {
        console.error('Failed to add todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const toggleComplete = async (id, completed) => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      handleLogout();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ completed: !completed })
      });
      if (response.ok) {
        await fetchTodos();
      } else {
        console.error('Error toggling todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const deleteTodo = async (id) => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      handleLogout();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      if (response.ok) {
        await fetchTodos();
      } else {
        console.error('Error deleting todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      handleLogout();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({ text: editText })
      });

      if (response.ok) {
        setEditingId(null);
        setEditText('');
        await fetchTodos();
      } else {
        console.error('Failed to update todo:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  useEffect(() => {
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      setToken(currentToken);
      fetchTodos();
    } else {
      handleLogout();
    }
  }, []);

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2 className="todo-title">Your Todos</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="todo-input-container">
        <input
          className="todo-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new todo..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button className="add-button" onClick={addTodo}>
          Add Todo
        </button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-content">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo._id, todo.completed)}
                className="todo-checkbox"
              />
              {editingId === todo._id ? (
                <input
                  className="edit-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo._id)}
                  autoFocus
                />
              ) : (
                <span className="todo-text">{todo.text}</span>
              )}
            </div>
            <div className="todo-actions">
              {editingId === todo._id ? (
                <>
                  <button className="save-button" onClick={() => saveEdit(todo._id)}>
                    Save
                  </button>
                  <button className="cancel-button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="edit-button" onClick={() => startEdit(todo)}>
                  Edit
                </button>
              )}
              <button className="delete-button" onClick={() => deleteTodo(todo._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
