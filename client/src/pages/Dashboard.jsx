import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;


  
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  
  

  

  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const taskRes = await API.get("/tasks?page=1&limit=5");

        setTasks(taskRes.data.data);
        setPages(taskRes.data.pages);
        setPage(taskRes.data.page);

        if (role === "admin") {
          const userRes = await API.get("/auth/users");
          setUsers(userRes.data.data);
        }

      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/");
        }
      }

      setLoading(false);
    };

    loadData();
  }, [role, navigate]);

 
  const fetchTasks = async (pageNumber) => {
    setLoading(true);

    try {
      const res = await API.get(
        `/tasks?page=${pageNumber}&limit=5`
      );

      setTasks(res.data.data);
      setPages(res.data.pages);
      setPage(res.data.page);

    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    }

    setLoading(false);
  };

  
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      await API.post("/tasks", {
        title,
        assignedTo: assignedTo || undefined,
      });

      setMessage("Task created successfully");
      setTitle("");
      setAssignedTo("");
      fetchTasks(page);

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error creating task"
      );
    }
  };

  
  const updateStatus = async (id, currentStatus) => {
    try {
      await API.put(`/tasks/${id}`, {
        status:
          currentStatus === "completed"
            ? "pending"
            : "completed",
      });

      fetchTasks(page);

    } catch (err) {
      console.log(err);
    }
  };

  
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks(page);
    } catch (err) {
      console.log(err);
    }
  };

 let filteredTasks = tasks.filter((task) =>
  task.title.toLowerCase().includes(search.toLowerCase())
);

if (activeTab === "completed") {
  filteredTasks = filteredTasks.filter(
    (task) => task.status === "completed"
  );
}

if (activeTab === "pending") {
  filteredTasks = filteredTasks.filter(
    (task) => task.status === "pending"
  );
}


const completedCount = filteredTasks.filter(
  (task) => task.status === "completed"
).length;


  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => {
      setMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }
}, [message]);

return (
  <div className="relative min-h-screen bg-black text-white overflow-hidden">

   
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-purple-900"></div>

   
    {message && (
      <div className="fixed top-6 right-6 bg-green-500/20 border border-green-400 text-green-300 px-6 py-3 rounded-xl backdrop-blur-lg shadow-lg z-50">
        {message}
      </div>
    )}

    <div className="relative z-10 flex min-h-screen">

     
      <aside className="w-72 backdrop-blur-xl bg-white/10 border-r border-white/20 p-6 flex flex-col justify-between">

  
  <div>
    <h2 className="text-2xl font-bold mb-10 text-purple-400">
      TaskFlow
    </h2>

    <nav className="space-y-3">

      <button
        onClick={() => setActiveTab("all")}
        className={`w-full text-left px-4 py-3 rounded-xl transition ${
          activeTab === "all"
            ? "bg-purple-600/40"
            : "hover:bg-white/20"
        }`}
      >
        📋 All Tasks
      </button>

      <button
        onClick={() => setActiveTab("completed")}
        className={`w-full text-left px-4 py-3 rounded-xl transition ${
          activeTab === "completed"
            ? "bg-green-500/40"
            : "hover:bg-white/20"
        }`}
      >
        ✅ Completed
      </button>

      <button
        onClick={() => setActiveTab("pending")}
        className={`w-full text-left px-4 py-3 rounded-xl transition ${
          activeTab === "pending"
            ? "bg-yellow-500/40"
            : "hover:bg-white/20"
        }`}
      >
        ⏳ Pending
      </button>

    </nav>
  </div>

  
  <div className="space-y-4">

    <div className="bg-white/10 p-4 rounded-xl border border-white/20">
      <p className="font-semibold">{user?.name}</p>
      <p className="text-xs text-gray-300 capitalize">
        {role}
      </p>
    </div>

    <button
      onClick={() => {
        localStorage.clear();
        navigate("/");
      }}
      className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 transition"
    >
      Logout
    </button>

  </div>
</aside>

      <main className="flex-1 p-10">

        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome {user?.name}
            </h1>
            <p className="text-gray-300 text-sm capitalize">
              {role}'s TaskFlow
            </p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
            <p className="text-sm text-gray-300 uppercase">Total</p>
            <p className="text-4xl font-bold text-indigo-400 mt-2">
              {tasks.length}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
            <p className="text-sm text-gray-300 uppercase">Completed</p>
            <p className="text-4xl font-bold text-green-400 mt-2">
              {completedCount}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl">
            <p className="text-sm text-gray-300 uppercase">Pending</p>
            <p className="text-4xl font-bold text-yellow-400 mt-2">
              {tasks.length - completedCount}
            </p>
          </div>
        </div>

        
        {role === "admin" && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl mb-10">
            <h2 className="text-lg font-semibold mb-4 text-purple-300">
              Create New Task
            </h2>

            <form
              onSubmit={handleCreateTask}
              className="flex flex-col md:flex-row gap-4"
            >
              <input
                type="text"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 outline-none"
              />

              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/20"
              >
                <option value="">Assign User</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id} className="text-black">
                    {u.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition"
              >
                Create
              </button>
            </form>
          </div>
        )}

        
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-3 rounded-xl bg-white/5 border border-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 outline-none"
          />
        </div>

        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
                No tasks available.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl flex justify-between items-center hover:scale-[1.02] transition"
                >
                  <div>
                    <h3 className="text-lg font-semibold">
                      {task.title}
                    </h3>

                    <span
                      className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                        task.status === "completed"
                          ? "bg-green-500/20 text-green-400 border border-green-400"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-400"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        updateStatus(task._id, task.status)
                      }
                      className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400 text-blue-300 hover:bg-blue-500/30 transition"
                    >
                      Change Status
                    </button>

                    {role === "admin" && (
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-400 text-red-300 hover:bg-red-500/30 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        
        <div className="flex justify-center gap-4 mt-12">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              onClick={() => fetchTasks(i + 1)}
              className={`px-4 py-2 rounded-xl transition ${
                page === i + 1
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg"
                  : "bg-white/10 border border-white/20 hover:bg-white/20"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

      </main>
    </div>
  </div>
);
}

export default Dashboard;
