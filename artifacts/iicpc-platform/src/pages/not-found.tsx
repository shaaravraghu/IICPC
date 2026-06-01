import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <div className="font-mono text-7xl font-bold text-border mb-4">404</div>
      <h1 className="text-xl font-semibold mb-2">Page Not Found</h1>
      <p className="text-sm text-muted-foreground mb-6">This route doesn't exist in the platform.</p>
      <Button asChild variant="outline" size="sm">
        <Link href="/">Go to Monitor</Link>
      </Button>
    </div>
  );
}
