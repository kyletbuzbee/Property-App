'use client';
import { useState } from 'react';

export default function TaskManager({ propertyId }: { propertyId: string }) {
  const [tasks, setTasks] = useState<{id: string, title: string, isCompleted: boolean}[]>([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask) return;
    setTasks([...tasks, { id: Date.now().toString(), title: newTask, isCompleted: false }]);
    setNewTask('');
    // TODO: Call API to save to DB
  };

  return (
    <div className="bg-dark-800 p-6 rounded-lg border border-dark-700">
      <h3 className="text-lg font-semibold text-white mb-4">Tasks</h3>
      <div className="flex gap-2 mb-4">
        <input 
          className="bg-dark-900 border border-dark-600 rounded p-2 text-sm text-white w-full"
          placeholder="Add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask} className="bg-primary-600 px-4 rounded text-white text-sm">Add</button>
      </div>
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center gap-2 text-white">
            <input type="checkbox" checked={task.isCompleted} readOnly />
            <span>{task.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}