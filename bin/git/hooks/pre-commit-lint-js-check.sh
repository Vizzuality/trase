#!/usr/bin/env bash

header() {
  echo ""
	echo "================= Checking JavaScript Lint ====================="
	echo ""
}

header
cd frontend && npm run lint-js
