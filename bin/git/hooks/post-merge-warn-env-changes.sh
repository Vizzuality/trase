#!/usr/bin/env bash
# MIT © Sindre Sorhus - sindresorhus.com

# git hook to run a command after `git pull` if a specified file was changed
# Run `chmod +x post-merge` to make it executable then put it into `.git/hooks/`.

changed_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"

check_run() {
	echo "$changed_files" | grep --quiet "$1" && eval "$2"
}

warn_env_update() {
  echo ""
	echo "========================================================"
	echo "================= ENV FILE UPDATED ====================="
	echo "========================================================"
	echo ""
	exit 0
}

# Example usage
# In this example it's used to run `npm install` if package.json changed
check_run .env.sample warn_env_update
