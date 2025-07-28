import { Cli, Command } from "../component/cli.js";
import Terminal from "../component/terminal.js";
import TopBar from "../component/top.bar.js";
import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { connectToSignal } from "../lib/signals.js";
import TimeService from "../service/time.service.js";

export default class TerminalView {
  static readonly VIEW_ID = "terminal";
  static cli: Cli;

  /**
   * Show home view
   */
  static async show(parameters: string[], container: HTMLElement) {
    const startTime = TimeService.currentNanoseconds();
    const view = uiComponent({
      type: Html.View,
      id: TerminalView.VIEW_ID,
      classes: [BubbleUI.BoxColumn, BubbleUI.BoxYCenter, BubbleUI.BoxXStart],
      styles: {
        width: "100%",
        height: "100%",
      },
    });

    const bar = TopBar.create("akrck02.org/terminal");
    view.appendChild(bar);

    const content = uiComponent({
      classes: [BubbleUI.BoxColumn],
      styles: {
        width: "100%",
        height: "calc(100% - 2rem)",
        overflowY: "auto",
      },
    });
    view.appendChild(content);

    const terminal = Terminal.getInstance();
    terminal.clear();
    content.appendChild(terminal.ui);

    TerminalView.cli = new Cli();
    TerminalView.cli.execute(new Command("ls -lha"));

    connectToSignal(TerminalView.cli.updated, TerminalView.render);

    const command = new Command("ls -lha");
    TerminalView.cli.execute(command);

    setTimeout(() => {
      command.print(Math.random().toFixed(2));
    }, 1000);

    container.append(view);
  }

  static async render(command: Command) {
    Terminal.getInstance().execute(command);
  }
}
