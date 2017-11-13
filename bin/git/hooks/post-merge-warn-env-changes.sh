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

warn_frontend_env_update() {
  echo ""
	echo "========================================================"
	echo "============ FRONTEND ENV FILE UPDATED ================="
	echo "========================================================"
	echo ""
	exit 0
}

check_run .env.sample warn_env_update
check_run frontend/.env.sample warn_frontend_env_update
