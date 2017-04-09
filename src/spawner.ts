import { spawn } from 'child_process';
import { EventEmitter } from 'events';

export class Spawner {
    command: string;

    constructor(command, eventEmitter: EventEmitter) {
        this.command = command;

        eventEmitter.on('run-command', () => {
            this.run(this.command);
        });
    }

    run(command: string) {
        try {
            const frags = command.split(' ');
            const exec = frags.splice(0, 1)[0];
            const args = frags;
            const cmd = spawn(exec, args);

            cmd.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            cmd.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
            });

            cmd.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            });
        } catch (e) {
            console.error(e);
        }
    }
}