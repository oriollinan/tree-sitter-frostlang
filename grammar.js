/**
 * @file FrostLang grammar for tree-sitter
 * @author Oriol Linan <oriol.linan@epitech.eu>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const INT_BITS = ["8", "16", "32", "64"];

const BINARY_OPERATORS = {
  "+": 2,
  "-": 2,
  "*": 3,
  "/": 3,
  mod: 3,
  "&&": 1,
  and: 1,
  "||": 1,
  or: 1,
  "&": 2,
  "|": 2,
  "^": 2,
  "<<": 2,
  ">>": 2,
  "<=": 2,
  ">=": 2,
  "<": 1,
  ">": 1,
  "==": 1,
  is: 1,
  "!=": 1,
};

const UNARY_OPERATORS = {
  pre: ["!", "not", "~", "&", "++", "--", "-"],
  post: [".", "++", "--"],
};

/**
 * @param {RuleOrLiteral} separator
 * @param {RuleOrLiteral} rule
 */
function sep_by(separator, rule) {
  return seq(rule, repeat(seq(separator, rule)));
}

module.exports = grammar({
  name: "frostlang",
  extras: ($) => [$.line_comment, $.block_comment, /\s/],
  rules: {
    source_file: ($) => repeat($._definition),

    // DEFINITIONS
    _definition: ($) =>
      choice($.function_definition, $.type_definition, $.variable_definition),

    function_definition: ($) =>
      prec(
        1,
        seq(
          $.identifier,
          ":",
          $.function_type,
          "=",
          optional($.parameter_list),
          "=>",
          $.block,
        ),
      ),

    parameter_list: ($) => repeat1($.identifier),

    variable_definition: ($) =>
      seq($.identifier, ":", $._type, optional(seq("=", $._expression))),

    // TYPES
    _type: ($) =>
      choice(
        $.primitive_type,
        $.array_type,
        $.pointer_type,
        $.mutable_type,
        $.function_type,
        $.custom_type,
      ),

    primitive_type: () =>
      choice(
        "bool",
        "int",
        ...INT_BITS.map((size) => `int${size}`),
        "float",
        "double",
        "char",
        "void",
      ),

    array_type: ($) => seq("[", "]", $._type),

    pointer_type: ($) => seq("*", $._type),

    mutable_type: ($) => seq("mut", $._type),

    function_type: ($) => seq("(", repeat($._type), ")", "->", $._type),

    custom_type: ($) => $.identifier,

    type_definition: ($) =>
      seq(
        $.identifier,
        "::",
        choice($.struct_definition, $.union_definition, $.alias_definition),
      ),

    struct_definition: ($) =>
      seq("struct", "{", repeat($.field_definition), "}"),

    union_definition: ($) => seq("union", "{", repeat($.field_definition), "}"),

    alias_definition: ($) => $._type,

    field_definition: ($) => seq($.identifier, "->", $._type),

    // STATEMENTS
    _statement: ($) =>
      choice(
        $.return_statement,
        $.for_statement,
        $.while_statement,
        $.if_statement,
        $.continue_statement,
        $.break_statement,
        $._expression,
      ),

    block: ($) => seq("{", repeat(choice($._definition, $._statement)), "}"),

    return_statement: ($) => seq("return", $._expression),

    for_statement: ($) =>
      seq(
        "from",
        $._expression,
        "to",
        $._expression,
        optional(seq("by", $._expression)),
        $.capture_group,
        $.block,
      ),

    capture_group: ($) => seq("|", $.identifier, ":", $._type, "|"),

    while_statement: ($) => seq("loop", $._expression, $.block),

    if_statement: ($) =>
      seq("if", $._expression, $.block, optional(seq("else", $.block))),

    continue_statement: () => "next",

    break_statement: () => "stop",

    // EXPRESSIONS
    _expression: ($) =>
      choice(
        $.identifier,
        $.number,
        $.string,
        $.array_access,
        $.deep_instance,
        $.binary_expression,
        $.pre_unary_expression,
        $.post_unary_expression,
        $.function_call,
        $.variable_assignment,
      ),

    binary_expression: ($) =>
      choice(
        ...Object.entries(BINARY_OPERATORS).map(([k, v]) =>
          prec.left(v, seq($._expression, k, $._expression)),
        ),
      ),

    pre_unary_expression: ($) =>
      prec(
        Math.max(...Object.values(BINARY_OPERATORS)) + 2,
        seq(choice(...UNARY_OPERATORS.pre), $._expression),
      ),

    post_unary_expression: ($) =>
      prec(
        Math.max(...Object.values(BINARY_OPERATORS)) + 1,
        seq($._expression, ...UNARY_OPERATORS.post),
      ),

    array_access: ($) => prec(1, seq($.identifier, ".", $.number)),

    deep_instance: ($) =>
      seq("{", optional(sep_by(",", $.field_assignment)), "}"),

    field_assignment: ($) => seq($.identifier, "=", $._expression),

    function_call: ($) => seq($.identifier, "(", repeat($._expression), ")"),

    variable_assignment: ($) => prec(0, seq($.identifier, "=", $._expression)),

    // COMMENTS
    line_comment: () => token(seq("%", /[^\n]*/)),

    block_comment: () => token(seq("%%", /[^%]*(?:%[^%]+)*%%/)),

    identifier: () => /[a-zA-Z_][a-zA-Z0-9_]*/,

    number: () => /\d+/,

    string: () => /"([^"\\]|\\.)*"/,
  },
});
