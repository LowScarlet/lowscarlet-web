/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from "react";
import ProjectCard from "@/components/project/ProjectCard";
import { mapProjectFromDb } from "@/libs/projectMapper";

export default function Projects({ category = "webs" }: { category?: string }) {
  const [projectList, setProjectList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects?category=${category}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        const mappedData = data.map(mapProjectFromDb);
        setProjectList(mappedData);
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-400">
        Failed to load projects.
      </div>
    );
  }

  if (projectList.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No projects posted yet.
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10">
      {projectList.map((project, index) => (
        <ProjectCard
          key={project.id || index}
          {...project}
          isLast={index === projectList.length - 1}
        />
      ))}
    </div>
  );
}