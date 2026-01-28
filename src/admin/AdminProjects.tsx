import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { addProject } from "@/lib/adminService";

const AdminProjects = () => {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    await addProject({ name, progress: 0 });
    alert("Project added");
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Add Project</h2>
      <input
        className="border p-2 w-full mb-4"
        placeholder="Project Name"
        onChange={e => setName(e.target.value)}
      />
      <button
        onClick={handleAdd}
        className="px-6 py-2 bg-green-600 text-white rounded"
      >
        Add Project
      </button>
    </AdminLayout>
  );
};

export default AdminProjects;
