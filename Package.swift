// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterFrostLang",
    products: [
        .library(name: "TreeSitterFrostLang", targets: ["TreeSitterFrostLang"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterFrostLang",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterFrostLangTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterFrostLang",
            ],
            path: "bindings/swift/TreeSitterFrostLangTests"
        )
    ],
    cLanguageStandard: .c11
)
