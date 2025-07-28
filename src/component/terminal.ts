import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Command } from "./cli.js";

export default class Terminal {
  private static readonly CLASS = "terminal";
  private static instance: Terminal;

  public ui: HTMLElement;

  /**
   * Get current terminal instance
   */
  static getInstance(): Terminal {
    // if instance does exist, return it
    if (undefined == this.instance) this.instance = new Terminal();
    return this.instance;
  }

  /**
   * Create ui
   */
  constructor() {
    this.ui = uiComponent({
      classes: [Terminal.CLASS],
    });
  }

  /**
   * Clear the terminal
   */
  clear() {
    this.ui.innerHTML = "";
  }

  /**
   * Execute a command
   */
  execute(cmd: Command) {
    this.render(cmd);
  }

  /**
   * Render the terminal
   */
  async render(cmd: Command) {
    console.log(cmd);
    const commandBlock = uiComponent({
      classes: ["command", BubbleUI.BoxColumn],
    });

    const input = uiComponent({
      classes: ["in"],
      text: `$ user [${new Date().toLocaleTimeString()}] → ${cmd.input}`,
    });
    commandBlock.appendChild(input);

    const output = uiComponent({
      classes: ["out"],
      text: cmd.getOutput().join(),
    });
    commandBlock.appendChild(output);
    this.ui.appendChild(commandBlock);

    // output.appendChild(content);
  }
}
