import Foundation

@objc public class Source: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
