const isColorSupported =
  process.env.FORCE_COLOR ||
  process.platform === "win32" ||
  (process.stdout.isTTY && process.env.TERM && process.env.TERM !== "dumb")

const EMPTY_REGEX = /(?:)/
const NO_STYLE = { open: "", close: "", strip: EMPTY_REGEX }

const Style = (open, close) =>
  isColorSupported
    ? {
        open: `\x1b[${open}m`,
        close: `\x1b[${close}m`,
        strip: new RegExp(`\\x1b\\[${close}m`, "g")
      }
    : NO_STYLE

const STYLES = {
  black: Style(30, 39),
  red: Style(31, 39),
  green: Style(32, 39),
  yellow: Style(33, 39),
  blue: Style(34, 39),
  magenta: Style(35, 39),
  cyan: Style(36, 39),
  white: Style(37, 39),
  gray: Style(90, 39),
  bgBlack: Style(40, 49),
  bgRed: Style(41, 49),
  bgGreen: Style(42, 49),
  bgYellow: Style(43, 49),
  bgBlue: Style(44, 49),
  bgMagenta: Style(45, 49),
  bgCyan: Style(46, 49),
  bgWhite: Style(47, 49),
  reset: Style(0, 0),
  bold: Style(1, 22),
  dim: Style(2, 22),
  italic: Style(3, 23),
  underline: Style(4, 24),
  inverse: Style(7, 27),
  hidden: Style(8, 28),
  strikethrough: Style(9, 29)
}

const Clorox = styles => {
  const self = Object.setPrototypeOf(s => {
    const styles = self.styles
    const length = styles.length

    for (let i = 0; i < length; i++) {
      let style = STYLES[styles[i]]
      s = `${style.open}${s.replace(style.strip, style.open)}${style.close}`
    }

    return s
  }, Clorox)

  self.styles = styles

  return self
}

for (const style in STYLES) {
  Object.defineProperty(Clorox, style, {
    get() {
      return this.styles === undefined
        ? Clorox([style])
        : (this.styles.push(style), this)
    }
  })
}

exports.Clorox = Clorox
exports.STYLES = STYLES
