#!/usr/bin/env bash

header() {
  echo ""
	echo "================= Checking JavaScript Lint ====================="
	echo ""
}

header
npm run lint-js
