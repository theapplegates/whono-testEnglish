#!/usr/bin/env bash
# -------------------------------------------------
# Purpose: locate Chinese UI strings (raw or escaped) in the repo
# -------------------------------------------------
# 0️⃣  Clean up any gigantic leftover from a previous run
if [[ -f escaped_strings.txt ]]; then
  rm -f escaped_strings.txt
  echo "🗑️  Removed old escaped_strings.txt (was huge)."
fi

# 1️⃣  Go to the project root (adjust the path if yours differs)
cd /Users/thor3/Documents/theastro-whono.git || { echo "❌ cd failed – check the path";
exit 1; }

# 2️⃣  Make sure we are inside a Git repository
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "❌ Not a Git repository. Check the path and try again."
  exit 1
fi

# 3️⃣  Pull the latest refs (quietly – you can omit if you don’t need it)
git fetch --all --quiet

# 4️⃣  Switch to the branch that should still contain Chinese text
git checkout main   # change “main” to another branch name if you discover a different
one later

# 5️⃣  Show the current branch
echo "✅ Current branch: $(git branch --show-current)"

# -------------------------------------------------
# 6️⃣  Search **raw** Chinese characters (U+4E00‑U+9FFF)
#     Limit the search to typical source‑file extensions to avoid huge binaries.
#     You can extend the regex list if you have other text files.
source_files=$(git ls-files \
  | grep -E '\.(js|jsx|ts|tsx|vue|html|md|json|yml|yaml|txt|svelte)$' \
  | grep -vE 'node_modules|dist|\.git|public/static|coverage')

perl -ne 'print "$ARGV:$.:$_" if /[\x{4e00}-\x{9fff}]/' $source_files >
chinese_strings.txt

raw_count=$(wc -l < chinese_strings.txt)
echo "🔎 Raw Chinese lines found: $raw_count"

# -------------------------------------------------
# 7️⃣  If no raw characters, look for **escaped Unicode** (\u4eXX…)
if [[ $raw_count -eq 0 ]]; then
  echo "⚠️ No raw characters → searching for escaped Unicode..."
  grep -R -n '\\u4e' $source_files > escaped_strings.txt
  esc_count=$(wc -l < escaped_strings.txt)
  echo "🔎 Escaped Unicode lines found: $esc_count"
fi
