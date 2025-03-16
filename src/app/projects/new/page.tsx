"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProjectForm from "@/components/ProjectForm";
import { createProject } from "@/app/actions/project";

export default function NewProjectPage() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      const result = await createProject(formData);
      if (result.success) {
        toast.success("Project created successfully!");
        router.push("/projects");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create project");
      }
    } catch (error) {
      toast.error("Failed to create project");
      console.error("Error:", error);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Dashboard</span>
        <span>/</span>
        <span>Project</span>
        <span>/</span>
        <span>New</span>
      </div>
      <ProjectForm onSubmit={handleSubmit} isNew />
    </div>
  );
}
