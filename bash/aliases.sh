# Reload Terminal
alias reload!='. ~/.zshrc'

alias cls='clear' # Good 'ol Clear Screen command

# List declared aliases, functions, paths
alias aliases="alias | sed 's/=.*//'"
alias functions="declare -f | grep '^[a-z].* ()' | sed 's/{$//'"
alias paths='echo -e ${PATH//:/\\n}'