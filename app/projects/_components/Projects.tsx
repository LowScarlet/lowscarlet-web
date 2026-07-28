/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from "react";
import ProjectCard from "@/components/project/ProjectCard";
import { mapProjectFromDb } from "@/libs/projectMapper";

export function ProjectSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-video rounded-2xl bg-neutral-800/70" />

      <div className="space-y-4">
        {/* Title + Tags Skeleton */}
        <div>
          <div className="h-6 w-1/3 bg-neutral-800 rounded-md mt-4" />
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="h-5 w-16 bg-neutral-800/60 rounded-md" />
            <div className="h-5 w-20 bg-neutral-800/60 rounded-md" />
            <div className="h-5 w-14 bg-neutral-800/60 rounded-md" />
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mt-3">
          <div className="h-4 w-full bg-neutral-800/50 rounded" />
          <div className="h-4 w-11/12 bg-neutral-800/50 rounded" />
          <div className="h-4 w-4/5 bg-neutral-800/50 rounded" />
        </div>

        {/* Action Links Skeleton */}
        <div className="flex gap-3 mt-6 py-2">
          <div className="w-10 h-10 bg-neutral-800/70 rounded-md" />
          <div className="w-10 h-10 bg-neutral-800/70 rounded-md" />
        </div>

        {/* Date Skeleton */}
        <div className="h-4 w-44 bg-neutral-800/50 rounded mt-4" />

        {/* Tech Stack Skeleton */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <div className="h-4 w-20 bg-neutral-800/60 rounded" />
          <div className="h-7 w-20 bg-neutral-800/70 rounded-md" />
          <div className="h-7 w-24 bg-neutral-800/70 rounded-md" />
          <div className="h-7 w-16 bg-neutral-800/70 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function ProjectsSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-10 pb-10">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-6">
          <ProjectSkeleton />
          {index < count - 1 && (
            <div className="pt-6">
              <div className="bg-neutral-800 w-full h-px" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Projects({
  category = "webs",
  projectId,
}: {
  category?: string;
  projectId?: string;
}) {
  const [projectList, setProjectList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const url = projectId ? `/api/projects/${projectId}` : `/api/projects?category=${category}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        if (projectId) {
          setProjectList(data ? [mapProjectFromDb(data)] : []);
        } else {
          setProjectList(data.map(mapProjectFromDb));
        }
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category, projectId]);

  if (loading) {
    return <ProjectsSkeleton count={2} />;
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