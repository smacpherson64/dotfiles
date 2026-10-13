#!/usr/bin/env bash
set -e

rm -f "$HOME/.claude/CLAUDE.MD"
ln -s "$DOTFILES/.claude/CLAUDE.MD" "$HOME/.claude/CLAUDE.MD"
ln -s "$DOTFILES/.claude/TEAM.MD" "$HOME/.claude/TEAM.MD"
ln -s "$DOTFILES/.claude/A11Y.MD" "$HOME/.claude/A11Y.MD"
