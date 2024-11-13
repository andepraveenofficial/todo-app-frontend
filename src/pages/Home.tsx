// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<{ data: Task[] }>(
          'http://localhost:5000/api/v1/task',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setTasks(response.data.data);
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? (err as AxiosError).response?.data || 'Failed to load tasks'
          : 'An unexpected error occurred';
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6">
      <h1 className="text-3xl font-bold mb-4">All Tasks</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {task.title}
            </h2>
            <p className="text-gray-600">{task.description}</p>
            <p className="mt-2 text-sm text-gray-500">Status: {task.status}</p>
            <p className="mt-1 text-xs text-gray-400">
              Created: {new Date(task.createdAt).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">
              Updated: {new Date(task.updatedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
