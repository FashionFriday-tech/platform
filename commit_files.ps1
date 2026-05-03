$env:GIT_COMMITTER_DATE="2026-05-03T12:00:00"
$date="2026-05-03T12:00:00"
$files = git status -s | ForEach-Object { $_.Substring(3) }

foreach ($file in $files) {
    if (-not [string]::IsNullOrWhiteSpace($file)) {
        git add $file
        $basename = Split-Path $file -Leaf
        git commit -m "Update $basename" --date=$date --no-verify
    }
}
