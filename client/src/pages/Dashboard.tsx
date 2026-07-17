import { Button, Card } from "../components/ui";

export default function Dashboard() {
  return (
    <div className="page">
      <Card className="p-6">
        <h1 className="text-2xl font-bold">HNet Manager</h1>

        <div className="mt-4 flex gap-3">
          <Button>Start</Button>

          <Button variant="danger">Stop</Button>

          <Button variant="secondary">Diagnose</Button>
        </div>
      </Card>
    </div>
  );
}
