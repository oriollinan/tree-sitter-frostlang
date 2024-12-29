package tree_sitter_frostlang_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_frostlang "github.com/oriollinan/tree-sitter-frostlang.git/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_frostlang.Language())
	if language == nil {
		t.Errorf("Error loading FrostLang grammar")
	}
}
