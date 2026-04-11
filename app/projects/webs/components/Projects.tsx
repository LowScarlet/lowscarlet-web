'use client'

import ProjectCard from "@/components/project/ProjectCard";
import { projects } from "../data";

export default function Projects() {
  return (
    <div className="space-y-5 pb-10">
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          {...project}
          isLast={index === projects.length - 1}
        />
      ))}
    </div>
  );
}