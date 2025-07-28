import {
  connectToSignal,
  disconnectSignal,
  emitSignal,
  setSignal,
} from "../lib/signals.js";

export class Command {
  updated = setSignal();
  input: string;
  private output: string[] = [];

  constructor(input: string) {
    this.input = input;
  }

  print(out: string) {
    this.output.push(out);
    emitSignal(this.updated);
  }

  getOutput(): string[] {
    return this.output;
  }
}

export class Cli {
  updated = setSignal();
  private commands: Command[] = [];

  execute(command: Command) {
    this.commands.push(command);
    connectToSignal(command.updated, () => emitSignal(this.updated, command));
    emitSignal(this.updated, command);
  }

  clear() {
    this.commands.forEach((cmd) => disconnectSignal(cmd.updated));
    this.commands = [];
    emitSignal(this.updated);
  }
}
