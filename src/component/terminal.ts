import { emitSignal, setSignal } from "../lib/signals.js";

type OutputPipe = (out: string) => void;
type CommandPipe = (out: OutputPipe, cmd: string) => void;

export class Terminal {
	private output: OutputPipe = console.log;
	readonly updated: string = setSignal();
	readonly patterns: Map<string, CommandPipe> = new Map();

	/**
	 * Register a new command
	 * @param pattern The command pattern
	 * @param callback
	 */
	register(pattern: string, callback: CommandPipe) {
		this.patterns.set(pattern, callback);
	}

	/**
	 * Execute a command
	 * @param cmd The command
	 */
	execute(cmd: string) {
		const pipe = this.getCommandPipe(cmd);
		if (undefined == pipe) {
			this.help();
			return;
		}
		pipe(this.output, cmd);
		emitSignal(this.updated);
	}

	/**
	 * help
	 */
	help() {
		this.output("Help");
		this.output("-------------------------------------------");
		this.output("");
		this.output("This are the available commands:");
		for (let key of this.patterns.keys()) {
			this.output(key);
		}
	}

	/**
	 * Get command pipe
	 * @param cmd the command to Execute
	 * @returns the command pipe matching the command
	 */
	private getCommandPipe(cmd: string): CommandPipe {
		return this.patterns.get(cmd);
	}

	/**
	 * Attach the output pipe
	 * @param output the output to attach
	 */
	attach(output: OutputPipe) {
		this.output = output;
	}
}
