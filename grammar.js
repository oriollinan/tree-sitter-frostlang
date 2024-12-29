/**
 * @file FrostLang grammar for tree-sitter
 * @author Oriol Linan <oriol.linan@epitech.eu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "frostlang",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
