import EnrichedMarkdown
import SwiftUI

struct TextScreen: View {
    // MARK: - Properties

    let markdown: String

    // MARK: - Views

    var body: some View {
        ScrollView {
            EnrichedMarkdownText(markdown)
                .markdownTheme(CustomMarkdownTheme)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 16)
                .padding(.vertical, 16)
                .onLinkPress { url in
                    UIApplication.shared.open(url)
                }
        }
        .background(Color.white)
    }
}

// MARK: -

#Preview {
    TextScreen(markdown: Bundle.main.sampleMarkdown)
}

// MARK: - TEMPORARY demo screen (demo recording only, do not commit)

// iOS counterpart of the Android launch video (x.com/swmansion/status/2075227259917554150):
// the same demo document and dark theme, full-screen with an Auto-Scroll pill, native
// selection, and the Copy as Markdown menu. Android-specific wording is swapped for the
// iOS equivalents (Spans -> NSAttributedString, Compose -> SwiftUI, kotlin -> swift snippet).
struct DemoScreen: View {
    // Starts hidden regardless of clipboard state: there is no prompt-free way to
    // distinguish a genuinely empty pasteboard from an empty-string item (which
    // `simctl pbcopy` with empty input leaves behind), so the Paste button only
    // appears after something is copied within this session.
    @State private var isAutoScrolling: Bool = false
    @State private var clipboardHasContent: Bool = false
    @State private var pasteSheetVisible: Bool = false

    var body: some View {
        ScrollViewReader { proxy in
            ZStack(alignment: .bottom) {
                ScrollView(showsIndicators: false) {
                    EnrichedMarkdownText(demoMarkdown)
                        .markdownTheme(DemoMarkdownTheme)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal, 20)
                        .padding(.top, 8)
                        .padding(.bottom, 72)
                        .onLinkPress { url in
                            UIApplication.shared.open(url)
                        }
                    Color.clear
                        .frame(height: 1)
                        .id("demo-bottom")
                }
                HStack(spacing: 10) {
                    autoScrollButton(proxy: proxy)
                    if clipboardHasContent {
                        pasteButton
                    }
                }
                .padding(.bottom, 8)
            }
        }
        .background(DemoColors.background.ignoresSafeArea())
        .markdownSelectionMenu(MarkdownSelectionMenuConfig())
        .preferredColorScheme(.dark)
        .onReceive(NotificationCenter.default.publisher(for: UIPasteboard.changedNotification)) { _ in
            refreshClipboardState()
        }
        .sheet(isPresented: $pasteSheetVisible) {
            DemoPasteSheet()
        }
    }

    // Starts a one-shot smooth scroll to the bottom; a touch on the scroll view
    // interrupts it (SwiftUI offers no way to cancel the animation from the button).
    private func autoScrollButton(proxy: ScrollViewProxy) -> some View {
        Button(isAutoScrolling ? "Stop" : "Auto-Scroll") {
            if isAutoScrolling {
                isAutoScrolling = false
            } else {
                isAutoScrolling = true
                withAnimation(.linear(duration: 4)) {
                    proxy.scrollTo("demo-bottom", anchor: .bottom)
                }
            }
        }
        .buttonStyle(DemoPillButtonStyle())
    }

    private var pasteButton: some View {
        Button {
            pasteSheetVisible = true
        } label: {
            Label("Paste", systemImage: "clipboard")
        }
        .buttonStyle(DemoPillButtonStyle())
        .transition(.opacity.combined(with: .scale))
    }

    // hasStrings never triggers the system paste prompt, unlike reading .string.
    private func refreshClipboardState() {
        withAnimation(.easeOut(duration: 0.2)) {
            clipboardHasContent = UIPasteboard.general.hasStrings
        }
    }
}

private struct DemoPillButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: 15, weight: .semibold))
            .foregroundStyle(.white)
            .frame(height: 20)
            .padding(.horizontal, 22)
            .padding(.vertical, 11)
            .background(DemoColors.accent, in: Capsule())
            .opacity(configuration.isPressed ? 0.7 : 1)
    }
}

// Mimics the paste screen of the Android video: a bare dark editor where the
// copied raw markdown is pasted via the system menu (long-press -> Paste), which
// proves the clipboard contents without the app reading the pasteboard itself.
private struct DemoPasteSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var text: String = ""
    @FocusState private var editorFocused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Button("Done") {
                dismiss()
            }
            .font(.system(size: 15, weight: .semibold))
            .foregroundStyle(DemoColors.background)
            .padding(.horizontal, 18)
            .padding(.vertical, 8)
            .background(DemoColors.headingAccent, in: Capsule())

            Text("From EnrichedMarkdownExample")
                .font(.system(size: 13))
                .foregroundStyle(DemoColors.emphasis)
                .padding(.top, 12)

            TextEditor(text: $text)
                .font(.system(size: 16))
                .foregroundStyle(DemoColors.headingPrimary)
                .scrollContentBackground(.hidden)
                .focused($editorFocused)
        }
        .padding(20)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        .background(DemoColors.pasteSheetBackground.ignoresSafeArea())
        .onAppear {
            editorFocused = true
        }
    }
}

private enum DemoColors {
    static let background = Color(red: 22 / 255, green: 17 / 255, blue: 41 / 255)
    static let headingPrimary = Color(red: 242 / 255, green: 241 / 255, blue: 255 / 255)
    static let headingAccent = Color(red: 154 / 255, green: 165 / 255, blue: 244 / 255)
    static let body = Color(red: 201 / 255, green: 198 / 255, blue: 228 / 255)
    static let strong = Color.white
    static let emphasis = Color(red: 175 / 255, green: 168 / 255, blue: 216 / 255)
    static let inlineCode = Color(red: 245 / 255, green: 184 / 255, blue: 96 / 255)
    static let inlineCodeBackground = Color(red: 54 / 255, green: 42 / 255, blue: 20 / 255)
    static let codeBlockText = Color(red: 214 / 255, green: 221 / 255, blue: 240 / 255)
    static let codeBlockBackground = Color(red: 27 / 255, green: 35 / 255, blue: 52 / 255)
    static let codeBlockBorder = Color(red: 43 / 255, green: 53 / 255, blue: 80 / 255)
    static let link = Color(red: 147 / 255, green: 162 / 255, blue: 255 / 255)
    static let accent = Color(red: 109 / 255, green: 95 / 255, blue: 232 / 255)
    static let quoteText = Color(red: 185 / 255, green: 178 / 255, blue: 230 / 255)
    static let quoteBackground = Color(red: 34 / 255, green: 26 / 255, blue: 63 / 255)
    static let divider = Color(red: 44 / 255, green: 41 / 255, blue: 70 / 255)
    static let pasteSheetBackground = Color(red: 28 / 255, green: 28 / 255, blue: 32 / 255)
}

private let DemoMarkdownTheme = MarkdownTheme {
    Paragraph()
        .fontFamily("Montserrat-Regular", size: 16)
        .foregroundStyle(DemoColors.body)
        .lineHeight(26)
        .marginBottom(16)

    Heading(1)
        .fontFamily("Montserrat-Bold", size: 30)
        .foregroundStyle(DemoColors.headingPrimary)
        .lineHeight(38)
        .marginBottom(8)

    Heading(2)
        .fontFamily("Montserrat-Bold", size: 24)
        .foregroundStyle(DemoColors.headingAccent)
        .lineHeight(32)
        .marginBottom(8)

    Heading(3)
        .fontFamily("Montserrat-SemiBold", size: 20)
        .foregroundStyle(DemoColors.headingAccent)
        .lineHeight(28)
        .marginBottom(8)

    Blockquote()
        .fontFamily("Montserrat-Italic", size: 16)
        .foregroundStyle(DemoColors.quoteText)
        .lineHeight(26)
        .borderColor(DemoColors.accent)
        .borderWidth(3)
        .backgroundStyle(DemoColors.quoteBackground)
        .gapWidth(16)
        .marginBottom(16)

    List()
        .fontFamily("Montserrat-Regular", size: 16)
        .foregroundStyle(DemoColors.body)
        .lineHeight(26)
        .bulletColor(DemoColors.accent)
        .bulletSize(6)
        .markerMinWidth(20)
        .markerColor(DemoColors.accent)
        .gapWidth(8)
        .marginLeft(24)
        .marginBottom(16)

    CodeBlock()
        .fontFamily("CourierPrime-Regular", size: 14)
        .foregroundStyle(DemoColors.codeBlockText)
        .backgroundStyle(DemoColors.codeBlockBackground)
        .borderColor(DemoColors.codeBlockBorder)
        .borderWidth(1)
        .borderRadius(8)
        .padding(16)
        .lineHeight(22)
        .marginBottom(16)

    Code()
        .foregroundStyle(DemoColors.inlineCode)
        .backgroundStyle(DemoColors.inlineCodeBackground)

    Link()
        .fontFamily("Montserrat-Bold", size: 16)
        .foregroundStyle(DemoColors.link)
        .underline(true)

    Strong()
        .foregroundStyle(DemoColors.strong)

    Emphasis()
        .foregroundStyle(DemoColors.emphasis)

    // The SM avatar is a square with transparent padding; block images aspect-fill the
    // container width and center-crop to this height, so 240 is needed to keep the
    // whole box artwork visible (200 clips its top and bottom edges). The art sits high
    // in the square, leaving ~20pt of transparent image below the box after the center
    // crop — no bottom margin so the gap to the divider matches the video.
    BlockImage()
        .height(240)
        .borderRadius(8)
        .marginBottom(0)

    InlineImage()
        .size(20)

    ThematicBreak()
        .color(DemoColors.divider)
        .height(1)
        .marginTop(24)
        .marginBottom(24)
}

private let demoMarkdown: String = #"""
# Enriched Markdown

A **native iOS** library for rendering rich markdown — built for performance, designed for beauty.

---

## Inline Formatting

Mix **bold**, *italic*, and ***bold italic*** freely. Use `inline code` for technical terms like `EnrichedMarkdownText`.

---

## Blockquotes

> The best way to predict the future is to **build it**.
>
> — Alan Kay

---

## Code Blocks

```swift
EnrichedMarkdownText(content)
    .markdownTheme(MarkdownTheme {
        Heading(1).fontSize(32)
        Link().foregroundStyle(.blue)
    })
```

---

## Lists

Ordered features:

1. **Native rendering** — no WebView
   1. Pure `NSAttributedString` spans
   2. Single `UITextView` architecture
2. *SwiftUI API* — declarative and simple
3. *Full styling* — customize every element
4. Customizable `onLinkPress` handlers

Unordered with nesting:

- **Typography** — full control over every element
  - Custom fonts for headings, body, and code
    - Montserrat, Inter, or any `TTF`
    - Weight, size, and color per level
  - Per-level heading sizes and colors
- *Images* — block and inline with auto-sizing
  - Rounded corners and custom height
  - Lazy loading from any URL
- Links with tap and long-press handlers

---

## Links & Images

Built by [Software Mansion](https://swmansion.com) — creators of Reanimated, Gesture Handler, and Screens.

![Software Mansion](https://avatars.githubusercontent.com/u/6952717?s=800)

---

## How It Works

Powered by **md4c** — a fast CommonMark parser written in C, called via Swift's C interop. The markdown AST is converted into a native `NSAttributedString`, giving you pixel-perfect rendering with full platform integration.

*No WebView. No HTML. Pure native text rendering.*
"""#

#Preview {
    DemoScreen()
}
