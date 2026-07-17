import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function run(command: string) {
  const { stdout, stderr } = await execAsync(command);

  return {
    stdout,
    stderr,
  };
}
