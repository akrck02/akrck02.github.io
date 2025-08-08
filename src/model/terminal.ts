type Command = () => Promise<HTMLElement[]>;
const registry: Map<string, Map<string, Command>> = new Map(); // channel -> <pattern, command>

/**
 * Register a new command
 * @param channel The channel to which the command is registered
 * @param pattern The command pattern
 * @param callback The command execution callback
 */
export function registerCommand(
	channel: string,
	pattern: string,
	callback: Command,
) {
	if (!registry.has(channel)) registry.set(channel, new Map());
	registry.get(channel).set(pattern, callback);
}

/**
 * Execute a command
 * @param channel The channel to which the command is sent
 * @param cmd The command to execute
 */
export async function executeCommand(
	channel: string,
	cmd: string,
): Promise<HTMLElement[]> {
	console.debug(`Executing: ${cmd}`);

	if (!registry.has(channel) || !registry.get(channel).has(cmd)) {
		console.warn(`The command ${cmd} was not found on channel ${channel}.`);
		return undefined;
	}

	return await registry.get(channel).get(cmd)();
}
/**
 * Get available commands of a channel
 * @param channel the channel to search for
 * @returns the available commands of a channel
 */
export function getAvailableCommands(channel: string): MapIterator<string> {
	return registry.get(channel)?.keys();
}
