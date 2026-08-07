import SwiftUI

@main
struct EnrichedMarkdownExampleApp: App {
    init() {
        ExampleFontRegistrar.registerBundledFonts()
    }

    var body: some Scene {
        WindowGroup {
            // TEMPORARY (demo recording only, do not commit): shell commented out,
            // launching straight into the full-screen demo document like the Android video.
            // AppShell()
            DemoScreen()
        }
    }
}
