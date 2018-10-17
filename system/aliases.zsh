###############################
# gls and ls (listing files)
###############################

# grc
#   Made possible through contributions from generous benefactors like
#   `brew install coreutils`
if $(gls &>/dev/null)
then
  alias gls="gls -F --color"
  alias glsall="gls -lAh --color"
fi

# Detect which `ls` flavor is in use
if ls --color > /dev/null 2>&1; then # GNU `ls`
    colorflag="--color"
else # OS X `ls`
    colorflag="-G"
fi

# Always use color output for `ls`
alias lscolor="command ls ${colorflag}"

# List all files colorized in long format
alias lslong="ls -lF ${colorflag}"

# List all files colorized in long format, including dot files
alias lsall="ls -laF ${colorflag}"

# List only directories
alias lsdirs="ls -lF ${colorflag} | grep --color=never '^d'"

# Intuitive map function
# For example, to list all directories that contain a certain file:
# find . -name .gitattributes | map dirname
alias map="xargs -n1"



###############################
# Network
###############################

# IP addresses
alias ip="dig +short myip.opendns.com @resolver1.opendns.com"
alias localip="ipconfig getifaddr en0"
alias ips="ifconfig -a | grep -o 'inet6\? \(addr:\)\?\s\?\(\(\([0-9]\+\.\)\{3\}[0-9]\+\)\|[a-fA-F0-9:]\+\)' | awk '{ sub(/inet6? (addr:)? ?/, \"\"); print }'"

# Flush Directory Service cache
alias flushdns="dscacheutil -flushcache && killall -HUP mDNSResponder"

alias speedtest="wget -O /dev/null http://speed.transip.nl/100mb.bin"

# One of @janmoesen’s ProTip™s
for method in GET HEAD POST PUT DELETE TRACE OPTIONS; do
    alias "$method"="lwp-request -m '$method'"
done



###############################
# Hash Sum 
###############################

# OS X has no `md5sum`, so use `md5` as a fallback
command -v md5sum > /dev/null || alias md5sum="md5"

# OS X has no `sha1sum`, so use `shasum` as a fallback
command -v sha1sum > /dev/null || alias sha1sum="shasum"



###############################
# Text
###############################

# Trim new lines and copy to clipboard
alias copyline ="tr -d '\n' | pbcopy"

# URL-encode strings
alias urlencode='python -c "import sys, urllib as ul; print ul.quote_plus(sys.argv[1]);"'



###############################
# Utils
###############################

#------------------------------
# Utils - Date & Time
#------------------------------

# Get week number
alias getweek='date +%V'

# Stopwatch
alias timer='echo "Timer started. Stop with Ctrl-D." && date && time cat && date'


#------------------------------
# Utils - Cleanup Files
#------------------------------

# Recursively remove Apple meta files
alias cleanupds="find . -type f -name '*.DS_Store' -ls -delete"
alias cleanupad="find . -type d -name '.AppleD*' -ls -exec /bin/rm -r {} \;"
alias cleanup="cleanupds && cleanupad"


#------------------------------
# Utils - Sys Info
#------------------------------

# Show system information
alias displays="system_profiler SPDisplaysDataType"
alias cpu="sysctl -n machdep.cpu.brand_string"
alias systeminfo="displays && cpu"

#------------------------------
# Utils - Preview File
#------------------------------

# Quick-Look preview files from the command line
alias ql="qlmanage -p &>/dev/null"

#------------------------------
# Utils - Zip
#------------------------------

# Zip Files without Apple items
alias zip="zip -x *.DS_Store -x *__MACOSX* -x *.AppleDouble*"


#------------------------------
# Utils - System
#------------------------------

#  Update Homebrew and npm installed packages
alias update='brew update; brew upgrade brew-cask; brew upgrade --all; brew cleanup; brew cask cleanup; npm update -g; yarn global upgrade'

# Clean up LaunchServices to remove duplicates in the “Open With” menu
alias lscleanup="/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -kill -r -domain local -domain system -domain user && killall Finder"

# Log off
alias logoff="/System/Library/CoreServices/Menu\ Extras/User.menu/Contents/Resources/CGSession -suspend"

# Show/hide hidden files in Finder
alias showhidden="defaults write com.apple.finder AppleShowAllFiles -bool true && killall Finder"
alias hidehidden="defaults write com.apple.finder AppleShowAllFiles -bool false && killall Finder"

# Hide/show all desktop icons (useful when presenting)
alias hideicons="defaults write com.apple.finder CreateDesktop -bool false && killall Finder"
alias showicons="defaults write com.apple.finder CreateDesktop -bool true && killall Finder"

# Lock the screen (when going AFK)
alias afk="/System/Library/CoreServices/Menu\ Extras/User.menu/Contents/Resources/CGSession -suspend"

# Ring the terminal bell, and put a badge on Terminal.app’s Dock icon
# (useful when executing time-consuming commands)
alias badge="tput bel"

# Stuff I never really use but cannot delete either because of http://xkcd.com/530/
alias mute="osascript -e 'set volume output muted true'"
alias loud="osascript -e 'set volume 7'"

# PlistBuddy alias, because sometimes `defaults` just doesn’t cut it
alias plistbuddy="/usr/libexec/PlistBuddy"


#------------------------------
# Utils - PDF
#------------------------------

# Merge PDF files
# Usage: `mergepdf -o output.pdf input{1,2,3}.pdf`
alias mergepdf='/System/Library/Automator/Combine\ PDF\ Pages.action/Contents/Resources/join.py'
