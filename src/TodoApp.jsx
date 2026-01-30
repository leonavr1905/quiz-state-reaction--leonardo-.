import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('pibiti_todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [activeMenu, setActiveMenu] = useState(null); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const themeColor = '#4db6ac'; 

  useEffect(() => {
    localStorage.setItem('pibiti_todos', JSON.stringify(todos));
  }, [todos]);

  const playDoneSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine'; 
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log("Audio blocked");
    }
  };

  const handleAddTodo = () => {
    if (inputValue.trim() === '') return;
    setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);
    setInputValue('');
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        if (!todo.completed) playDoneSound();
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    }));
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div style={{
      display: 'flex', backgroundColor: '#1a1a1a', color: 'white', borderRadius: '20px',
      width: '750px', height: '550px', fontFamily: 'Segoe UI, sans-serif',
      boxShadow: '0 15px 35px rgba(0,0,0,0.7)', border: '1px solid #333', overflow: 'hidden'
    }}>
      
      <div style={{ width: '220px', backgroundColor: '#141414', padding: '20px 0', borderRight: '1px solid #333' }}>
        <div onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ display: 'flex', alignItems: 'center', padding: '0 25px 20px 25px', gap: '15px', cursor: 'pointer' }}>
          <div style={{ fontSize: '20px', color: isMenuOpen ? themeColor : '#888' }}>☰</div>
          <div style={{ fontWeight: 'bold', color: themeColor, fontSize: '12px' }}>MENU</div>
        </div>

        {isMenuOpen && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ padding: '0 25px 20px 25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px', color: '#888' }}>
                <span>Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#333', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: themeColor, transition: 'width 0.4s ease-in-out' }} />
              </div>
            </div>

            <div onClick={() => setActiveMenu(activeMenu === 'inbox' ? null : 'inbox')} 
              style={{
                display: 'flex', alignItems: 'center', backgroundColor: activeMenu === 'inbox' ? '#252525' : 'transparent',
                color: activeMenu === 'inbox' ? themeColor : '#888', padding: '12px 25px', cursor: 'pointer',
                borderLeft: activeMenu === 'inbox' ? `4px solid ${themeColor}` : '4px solid transparent',
              }}>
              <span style={{ marginRight: '15px', fontSize: '18px' }}>📥</span>
              <span style={{ flex: 1, fontSize: '14px' }}>Inbox</span>
              <span style={{ fontSize: '11px' }}>{totalCount}</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ backgroundColor: themeColor, padding: '18px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#1a1a1a', fontWeight: '800' }}>
          <span>ToDo List Pibiti</span> 
          <span style={{ fontSize: '20px' }}>✎</span> 
        </div>

        <div style={{ padding: '30px', flex: 1 }}>
          <h2 style={{ fontSize: '18px', marginBottom: '15px', color: themeColor }}>Add New Task</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '35px' }}>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()} 
              placeholder="Apa yang ingin dikerjakan?"
              style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#0f0f0f', color: 'white', outline: 'none' }}
            />
            <button onClick={handleAddTodo} style={{ padding: '0 25px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: themeColor, color: '#1a1a1a' }}>Add</button>
          </div>

          {activeMenu === 'inbox' && (
            <div style={{ backgroundColor: '#222', padding: '25px', borderRadius: '15px', border: '1px solid #333', maxHeight: '280px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ margin: 0, color: themeColor, fontSize: '11px', letterSpacing: '2px' }}>CURRENT TASKS</h4>
                <button onClick={() => setTodos([])} style={{ background: 'none', border: 'none', color: '#888', textDecoration: 'underline', fontSize: '11px', cursor: 'pointer' }}>Clear All</button>
              </div>
              <div style={{ overflowY: 'auto' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {todos.map((todo) => (
                    <li key={todo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #2d2d2d' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => toggleComplete(todo.id)}>
                        <div style={{ width: '18px', height: '18px', border: `2px solid ${themeColor}`, borderRadius: '4px', backgroundColor: todo.completed ? themeColor : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {todo.completed && <span style={{ color: '#1a1a1a', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
                        </div>
                        <span style={{ fontSize: '15px', textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#666' : '#ddd' }}>{todo.text}</span>
                      </div>
                      <button onClick={() => handleDeleteTodo(todo.id)} style={{ color: '#ff4d4d', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;