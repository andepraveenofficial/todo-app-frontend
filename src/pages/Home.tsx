import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../services/api';

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const url = `${API_URL}/task`;
        const response = await axios.get<{ data: Task[] }>(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTasks(response.data.data);
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? `Failed to load tasks: ${err.message}`
          : 'An unexpected error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6">
      <h1 className="text-3xl font-bold mb-4">All Tasks</h1>
      {loading && <p>Loading...</p>} {/* Loading state */}
      {error && <p className="text-red-500">{error}</p>} {/* Error message */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tasks.length === 0 ? (
          <p>No tasks Found</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {task.title}
              </h2>
              <p className="text-gray-600">{task.description}</p>
              <p className="mt-2 text-sm text-gray-500">
                Status: {task.status}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Created: {new Date(task.createdAt).toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">
                Updated: {new Date(task.updatedAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
