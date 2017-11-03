#!/usr/bin/env bash
# MIT © Sindre Sorhus - sindresorhus.com

changed_files="$(git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD)"

check_run() {
	echo "$changed_files" | grep --quiet "$1" && eval "$2"
}

check_run Gemfile.lock "bundle install"