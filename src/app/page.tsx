import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Housing Mantra Admin</h1>
        <p className="mb-8">Real Estate Property Management Dashboard</p>
        <Link href="/projects">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
