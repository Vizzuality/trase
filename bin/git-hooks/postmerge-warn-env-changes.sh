#!/usr/bin/env bash
# MIT © Sindre Sorhus - sindresorhus.com

PREV_COMMIT=ORIG_HEAD
POST_COMMIT=ORIG_HEAD

check_run() {
    echo "Checking for changes in $1"
    if [[ -f $1 ]]; then
        DIFF=`git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD | grep $1`
        if [[ $DIFF != "" ]]; then
            echo "$1 has changed. Running $2..."
            eval "$2"
        else
            echo "No changes detected in $1"
        fi
    fi
}

warn_env_update() {
    echo ""
    echo "========================================================"
    echo "================= ENV FILE UPDATED ====================="
    echo "========================================================"
    echo "Check your $1 file"
    exit 0
}

check_run .env.sample warn_env_update
check_run frontend/.env.sample warn_env_update
