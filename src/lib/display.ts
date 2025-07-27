import { isMediumDevice, isSmallDevice } from "./browser.js"
import { isMobile } from "./browser.js"
import { getConfiguration, setConfiguration } from "./configuration.js"
import { setDomDataset } from "./dom.js"

export class Display {

  static checkType() {

    if (isMobile() || isSmallDevice() || isMediumDevice()) {
      setDomDataset(document.documentElement, {
        display: "mobile"
      })

      setConfiguration("display", "mobile")
      return
    }

    setDomDataset(document.documentElement, {
      display: "desktop"
    })

    setConfiguration("display", "desktop")
  }

  static isMobile() {
    return "mobile" == getConfiguration("display")
  }
}
