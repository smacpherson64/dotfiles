alias cls='clear' # Good 'ol Clear Screen command

# List declared aliases, functions, paths
alias aliases="alias | sed 's/=.*//'"
alias functions="declare -f | grep '^[a-z].* ()' | sed 's/{$//'"
alias paths='echo -e ${PATH//:/\\n}'

# Opens a new terminal in current working directory
alias start="open -a Terminal '`pwd`'"

alias wait-for="wait-on-url"
alias wait-for-url="wait-on-url"
alias wait-for-site="wait-on-url"
alias wait-on-site="wait-on-site"
