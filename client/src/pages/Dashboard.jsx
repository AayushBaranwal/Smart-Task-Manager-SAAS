import { useEffect, useState } from "react";
import API from "../services/api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  // ✅ FETCH TASKS
  const loadTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ LOAD ON START
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTasks();
  }, []);

  // ✅ CREATE TASK
  const createTask = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tasks", form);

      setForm({
        title: "",
        description: "",
        priority: "medium",
      });

      loadTasks();
    } catch (err) {
      console.log(err);
      alert("Failed to create task");
    }
  };

  // ✅ DELETE TASK
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      loadTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ DRAG & DROP UPDATE
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;

    try {
      await API.put(`/tasks/${draggableId}`, {
        status: destination.droppableId,
      });

      loadTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ GROUP TASKS
  const groupedTasks = {
    todo: tasks.filter((t) => t.status === "todo"),
    "in-progress": tasks.filter((t) => t.status === "in-progress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </div>

      {/* ✅ CREATE TASK FORM */}
      <form onSubmit={createTask} className="mb-6 bg-gray-800 p-4 rounded">
        <h2 className="text-lg mb-3">Create Task</h2>

        <input
          className="w-full p-2 mb-2 rounded text-black"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          className="w-full p-2 mb-2 rounded text-black"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          className="w-full p-2 mb-2 rounded text-black"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button className="bg-green-500 px-4 py-2 rounded">Add Task</button>
      </form>

      {/* ✅ KANBAN BOARD */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          {["todo", "in-progress", "done"].map((col) => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-800 p-4 rounded min-h-[300px]"
                >
                  <h2 className="mb-3 font-bold uppercase">{col}</h2>

                  {groupedTasks[col].map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-700 p-3 mb-2 rounded shadow"
                        >
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-sm">{task.description}</p>

                          <p className="text-xs text-gray-400">
                            Priority: {task.priority}
                          </p>

                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-gray-400">
                              {task.status}
                            </span>

                            <button
                              onClick={() => deleteTask(task._id)}
                              className="bg-red-500 px-2 py-1 text-xs rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
