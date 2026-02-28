import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('brutalist-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');

  useEffect(() => {
    localStorage.setItem('brutalist-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: inputValue.trim(),
          completed: false,
          createdAt: Date.now(),
        },
      ]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'done') return todo.completed;
    return true;
  });

  const activeTodos = todos.filter((t) => !t.completed).length;
  const completedTodos = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-black relative overflow-x-hidden">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main container */}
      <div className="relative z-10 px-4 py-6 md:px-8 md:py-12 lg:px-16 lg:py-16 max-w-4xl mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <div className="border-4 border-black bg-black text-[#f5f5f0] p-4 md:p-6 transform -rotate-1">
            <h1 className="font-mono text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter">
              TO_DO
            </h1>
            <p className="font-mono text-xs md:text-sm mt-2 opacity-70">
              // RAW TASK MANAGEMENT
            </p>
          </div>

          {/* Stats bar */}
          <div className="flex gap-4 md:gap-8 mt-4 font-mono text-xs md:text-sm">
            <span className="border-2 border-black px-2 py-1 md:px-3 md:py-1">
              ACTIVE: {activeTodos}
            </span>
            <span className="border-2 border-black px-2 py-1 md:px-3 md:py-1 bg-black text-[#f5f5f0]">
              DONE: {completedTodos}
            </span>
          </div>
        </header>

        {/* Input section */}
        <section className="mb-6 md:mb-8">
          <div className="border-4 border-black p-3 md:p-4 bg-white">
            <label className="font-mono text-xs uppercase mb-2 block opacity-60">
              &gt; NEW_TASK
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                placeholder="TYPE SOMETHING..."
                className="flex-1 font-mono text-base md:text-lg bg-transparent border-2 border-black px-3 py-3 md:py-2 placeholder:text-black/30 focus:outline-none focus:bg-yellow-200 transition-colors"
              />
              <button
                onClick={addTodo}
                className="font-mono text-base md:text-lg uppercase px-6 py-3 md:py-2 bg-black text-[#f5f5f0] border-2 border-black hover:bg-[#f5f5f0] hover:text-black transition-colors min-h-[48px] active:transform active:translate-y-[2px]"
              >
                ADD+
              </button>
            </div>
          </div>
        </section>

        {/* Filter tabs */}
        <nav className="mb-4 md:mb-6 flex flex-wrap gap-2">
          {(['all', 'active', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono text-sm uppercase px-4 py-2 border-2 border-black transition-all min-h-[44px] ${
                filter === f
                  ? 'bg-black text-[#f5f5f0]'
                  : 'bg-transparent hover:bg-black/10'
              }`}
            >
              [{f}]
            </button>
          ))}
          {completedTodos > 0 && (
            <button
              onClick={clearCompleted}
              className="font-mono text-sm uppercase px-4 py-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors ml-auto min-h-[44px]"
            >
              PURGE_DONE
            </button>
          )}
        </nav>

        {/* Todo list */}
        <main className="flex-1">
          {filteredTodos.length === 0 ? (
            <div className="border-4 border-dashed border-black/30 p-8 md:p-12 text-center">
              <p className="font-mono text-lg md:text-xl opacity-40">
                {filter === 'all'
                  ? '// EMPTY_STATE'
                  : filter === 'active'
                  ? '// NO_ACTIVE_TASKS'
                  : '// NOTHING_DONE_YET'}
              </p>
            </div>
          ) : (
            <ul className="space-y-2 md:space-y-3">
              {filteredTodos.map((todo, index) => (
                <li
                  key={todo.id}
                  className={`border-4 border-black p-3 md:p-4 bg-white flex items-start gap-3 md:gap-4 group transition-all hover:translate-x-1 ${
                    todo.completed ? 'bg-black/5' : ''
                  }`}
                  style={{
                    transform: `rotate(${index % 2 === 0 ? '0.3' : '-0.3'}deg)`,
                  }}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`w-6 h-6 md:w-8 md:h-8 border-3 border-black flex-shrink-0 flex items-center justify-center transition-colors mt-1 ${
                      todo.completed ? 'bg-black' : 'hover:bg-yellow-200'
                    }`}
                    style={{ borderWidth: '3px' }}
                  >
                    {todo.completed && (
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-[#f5f5f0]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                          strokeWidth={4}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Text */}
                  <span
                    className={`font-mono text-base md:text-lg flex-1 break-words ${
                      todo.completed
                        ? 'line-through decoration-4 opacity-40'
                        : ''
                    }`}
                  >
                    {todo.text}
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="font-mono text-lg md:text-xl opacity-30 hover:opacity-100 hover:text-red-600 transition-opacity px-2 py-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="Delete"
                  >
                    [X]
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>

        {/* Decorative elements */}
        <div className="hidden md:block fixed top-20 right-8 lg:right-16 font-mono text-xs opacity-20 transform rotate-90 origin-right">
          BRUTALIST_TODO_V1.0
        </div>
        <div className="hidden md:block fixed bottom-32 left-4 lg:left-8 w-4 h-32 bg-black" />
        <div className="hidden md:block fixed top-40 left-4 lg:left-8 w-8 h-8 border-4 border-black transform rotate-45" />

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t-2 border-black/20">
          <p className="font-mono text-xs text-black/40 text-center">
            Requested by @web-user · Built by @clonkbot
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
