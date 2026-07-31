/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from "react";
import { FaCode, FaPlus, FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import Modal from "@/components/utils/Modal";
import ProjectForm from "./ProjectForm";

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectsChanged: () => void;
}

export default function ProjectsModal({
  isOpen,
  onClose,
  onProjectsChanged,
}: ProjectsModalProps) {
  const [activeView, setActiveView] = useState<"list" | "add" | "edit">("list");
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const fetchAllProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjectsList(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllProjects();
      setActiveView("list");
    }
  }, [isOpen]);

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchAllProjects();
        onProjectsChanged();
      } else {
        alert("Failed to delete project");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting project");
    }
  };

  const handleSaveSuccess = () => {
    fetchAllProjects();
    onProjectsChanged();
    setActiveView("list");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center justify-between w-full pr-6">
          <div className="flex items-center space-x-2">
            <FaCode className="text-blue-500 text-lg" />
            <span className="font-bold text-white text-base">
              {activeView === "list" ? "Manage My Projects" : activeView === "add" ? "Add New Project" : "Edit Project"}
            </span>
          </div>

          {activeView === "list" && (
            <button
              onClick={() => {
                setEditingProject(null);
                setActiveView("add");
              }}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1 shadow-md"
            >
              <FaPlus size={10} /> Add New
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {activeView === "list" ? (
          <>
            {isLoadingProjects ? (
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-blue-500 text-2xl" />
              </div>
            ) : projectsList.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs italic">
                No projects found. Click &quot;Add New&quot; to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {projectsList.map((project) => (
                  <div
                    key={project.id}
                    className="flex justify-between items-center bg-neutral-900 border border-neutral-855 p-3 rounded-lg hover:bg-neutral-850/80 transition"
                  >
                    <div className="grow min-w-0 pr-3 text-left">
                      <h3 className="text-white text-sm font-semibold truncate">
                        {project.title}
                      </h3>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                        {project.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingProject(project);
                          setActiveView("edit");
                        }}
                        className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-blue-400 hover:text-blue-300 rounded-md cursor-pointer transition"
                        title="Edit Project"
                      >
                        <FaEdit size={12} />
                      </button>

                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-1.5 bg-neutral-800 hover:bg-red-900/40 text-gray-400 hover:text-red-400 rounded-md cursor-pointer transition"
                        title="Delete Project"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2 border-t border-neutral-800 pt-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-neutral-900 hover:bg-neutral-855 border border-neutral-800 text-gray-400 font-bold py-2 rounded-lg hover:text-white active:scale-98 transition text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <ProjectForm
            project={editingProject}
            projectsList={projectsList}
            onSaveSuccess={handleSaveSuccess}
            onCancel={() => setActiveView("list")}
          />
        )}
      </div>
    </Modal>
  );
}
