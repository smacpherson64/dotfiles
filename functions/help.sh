#!/usr/bin/env zsh
set -e

# The Helper Function
applyHelp() {
    local desc="$1"
    local usage_block="$2"
    local mode="$3"
    shift 3 # Remove the first 3 internal args so $@ only contains user flags

    # Define the full help output
    local full_help="$(echo -e "${desc}\n\n${usage_block}")"

    # When arguments are required and there are no more arguments show help.
    if [[ "$mode" == "has required arguments" && $# -eq 0 ]]; then
        echo "$full_help"
        exit 0
    fi

    # Check flags for help or description
    for arg in "$@"; do
        case "${arg}" in
            -h|--h|-help|--help)
                echo "$full_help"
                exit 0
                ;;
            --description)
                echo "$desc"
                exit 0
                ;;
        esac
    done
}
