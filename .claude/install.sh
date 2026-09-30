#!/usr/bin/env bash
set -e

rm -f "$HOME/.claude/CLAUDE.MD"
ln -s "$DOTFILES/.claude/CLAUDE.MD" "$HOME/.claude/CLAUDE.MD"
