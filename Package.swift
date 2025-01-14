// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "GetSource",
    platforms: [.iOS(.v13)],
    products: [
        .library(
            name: "GetSource",
            targets: ["SourcePlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", branch: "main")
    ],
    targets: [
        .target(
            name: "SourcePlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/SourcePlugin"),
        .testTarget(
            name: "SourcePluginTests",
            dependencies: ["SourcePlugin"],
            path: "ios/Tests/SourcePluginTests")
    ]
)