# Browsers
alias firefox="open -a ~/Applications/Firefox.app"

alias chrome="open -a ~/Applications/Google\ Chrome.app"
alias canary="open -a ~/Applications/Google\ Chrome\ Canary.app"

# Kill all the tabs in Chrome to free up memory
# [C] explained: http://www.commandlinefu.com/commands/view/402/exclude-grep-from-your-grepped-output-of-ps-alias-included-in-description
alias chromekill="ps ux | grep '[C]hrome Helper --type=renderer' | grep -v extension-process | tr -s ' ' | cut -d ' ' -f2 | xargs kill"
