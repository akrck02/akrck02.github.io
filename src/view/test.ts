import TerminalUI from "../component/terminal.html.js";
import { Terminal } from "../component/terminal.js";
import TopBar from "../component/top.bar.js";
import { BubbleUI } from "../lib/bubble.js";
import { uiComponent } from "../lib/dom.js";
import { Html } from "../lib/html.js";
import { connectToSignal } from "../lib/signals.js";
import FormatService from "../service/format.service.js";
import TimeService from "../service/time.service.js";

export default class TerminalView {
  static readonly VIEW_ID = "terminal";

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

    const bar = TopBar.create("akrck02.org/test");
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

    const terminal = TerminalUI.getInstance();
    terminal.clear();
    content.appendChild(terminal.ui);

    terminal.core.register("neofetch", async (out, cmd) => {
      out("TERM");
    });

    terminal.execute("neofetch");
    container.append(view);
  }
}
