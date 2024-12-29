import XCTest
import SwiftTreeSitter
import TreeSitterFrostLang

final class TreeSitterFrostLangTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_frostlang())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading FrostLang grammar")
    }
}
