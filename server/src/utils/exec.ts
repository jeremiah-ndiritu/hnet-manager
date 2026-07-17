import { exec } from 'child_process';
import sudo from '@vscode/sudo-prompt';

export const runCmd = (command: string, useSudo = false): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (useSudo) {
      sudo.exec(command, { name: 'HNet Manager' }, (err, stdout) => {
        if (err) reject(err);
        else resolve(stdout ? stdout.toString() : '');
      });
    } else {
      exec(command, (err, stdout, stderr) => {
        if (err) reject(err || stderr);
        else resolve(stdout);
      });
    }
  });
};
