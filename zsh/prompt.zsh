autoload colors && colors
# cheers, @ehrenmurdick
# http://github.com/ehrenmurdick/config/blob/master/zsh/prompt.zsh

if (( $+commands[git] ))
then
  git="$commands[git]"
else
  git="/usr/bin/git"
fi

git_branch() {
  ref=$($git symbolic-ref HEAD 2>/dev/null) || return
  echo "on %{$fg_bold[magenta]%}${ref#refs/heads/}%{$reset_color%}"
}


user_name() {
  echo "%{$fg_bold[cyan]%}$(whoami)%{$reset_color%}"
}

directory_name() {
  echo "%{$fg_bold[green]%}%2/%\/%{$reset_color%}"
}

branch_name() {
  echo "%{$fg_bold[magenta]%}git_branch%{$reset_color%}"
}

export PROMPT=$'\n$(user_name) at $(directory_name) $(git_branch)\n› '

set_prompt () {
  export RPROMPT="%{$fg_bold[orange]%}%{$reset_color%}"
}

precmd() {
  title "zsh" "%m" "%55<...<%~"
  set_prompt
}
