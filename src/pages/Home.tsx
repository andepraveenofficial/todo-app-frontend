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
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<Task>({
    id: '',
    title: '',
    description: '',
    status: 'Pending',
    createdAt: '',
    updatedAt: '',
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const authToken = localStorage.getItem('token'); // assuming the token is saved in localStorage

  // Fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const url = `${API_URL}/task`;
        const response = await axios.get<{ data: Task[] }>(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
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
  }, [authToken]);

  // Handle adding a new task
  const handleAddTask = async () => {
    try {
      const url = `${API_URL}/task`;
      const response = await axios.post(url, newTask, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setTasks([...tasks, response.data.data]);
      setIsAdding(false);
      setNewTask({
        id: '',
        title: '',
        description: '',
        status: 'Pending',
        createdAt: '',
        updatedAt: '',
      });
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? `Failed to add task: ${err.message}`
        : 'An unexpected error occurred';
      setError(errorMessage);
    }
  };

  // Handle editing an existing task
  const handleEditTask = async () => {
    if (!editingTask) return;

    try {
      const url = `${API_URL}/task/${editingTask.id}`;
      const response = await axios.put(url, editingTask, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id ? response.data.data : task
      );
      setTasks(updatedTasks);
      setEditingTask(null);
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? `Failed to edit task: ${err.message}`
        : 'An unexpected error occurred';
      setError(errorMessage);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const url = `${API_URL}/task/${taskId}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? `Failed to delete task: ${err.message}`
        : 'An unexpected error occurred';
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6">
      <h1 className="text-3xl font-bold mb-4">All Tasks</h1>
      {loading && <p>Loading...</p>} {/* Loading state */}
      {error && <p className="text-red-500">{error}</p>} {/* Error message */}
      {/* Button to open Add Task form */}
      <button
        onClick={() => setIsAdding(true)}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Add New Task
      </button>
      {/* Add Task Form */}
      {isAdding && (
        <div className="p-4 bg-white shadow-md rounded-lg w-full max-w-md mb-4">
          <h3 className="text-xl font-semibold mb-2">Add Task</h3>
          <input
            type="text"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <textarea
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <select
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button
            onClick={handleAddTask}
            className="w-full p-2 bg-green-500 text-white rounded"
          >
            Add Task
          </button>
        </div>
      )}
      {/* Edit Task Form */}
      {editingTask && (
        <div className="p-4 bg-white shadow-md rounded-lg w-full max-w-md mb-4">
          <h3 className="text-xl font-semibold mb-2">Edit Task</h3>
          <input
            type="text"
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Title"
            value={editingTask.title}
            onChange={(e) =>
              setEditingTask({ ...editingTask, title: e.target.value })
            }
          />
          <textarea
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            placeholder="Description"
            value={editingTask.description}
            onChange={(e) =>
              setEditingTask({ ...editingTask, description: e.target.value })
            }
          />
          <select
            className="w-full p-2 mb-2 border border-gray-300 rounded"
            value={editingTask.status}
            onChange={(e) =>
              setEditingTask({ ...editingTask, status: e.target.value })
            }
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button
            onClick={handleEditTask}
            className="w-full p-2 bg-yellow-500 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      )}
      {/* Task List */}
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
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
            <button
              onClick={() => setEditingTask(task)}
              className="m-2 p-1 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="m-2 p-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        ))}
        {tasks.length === 0 && <p>No tasks found</p>}
      </div>
    </div>
  );
};

export default Home;
