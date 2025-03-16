"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Project } from "@/types";
import { updateProject } from "@/app/actions/project";
import ProjectForm from "@/components/ProjectForm";

export default function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to fetch project");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProject();
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  async function handleSubmit(formData: FormData) {
    try {
      const result = await updateProject(params.id, formData);
      if (result.success) {
        toast.success("Project updated successfully!");
        router.push("/projects");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update project");
      }
    } catch (error) {
      toast.error("An error occurred while updating the project");
      console.error(error);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Dashboard</span>
        <span>/</span>
        <span>Project</span>
        <span>/</span>
        <span>Edit</span>
        <span>/</span>
        <span className="text-gray-400">{params.id}</span>
      </div>
      <ProjectForm
        initialData={project}
        onSubmit={handleSubmit}
        submitLabel="Update Project"
      />
    </div>
  );
}
