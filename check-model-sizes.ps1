# 3D Model File Size Checker
# Run this after optimization to verify file sizes

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "3D MODEL FILE SIZE CHECK" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$path = "public\models\live_grass"
$files = Get-ChildItem "$path\*" -Include *.glb,*.usdz

$totalSizeBefore = 0
$totalSizeAfter = 0
$issues = @()

foreach ($file in $files) {
    $sizeMB = [math]::Round($file.Length / 1MB, 2)
    $ext = $file.Extension
    
    # Determine status and targets
    if ($ext -eq ".glb") {
        $idealMax = 2
        $absoluteMax = 5
        $type = "GLB"
    } else {
        $idealMax = 5
        $absoluteMax = 10
        $type = "USDZ"
    }
    
    # Status indicators
    if ($sizeMB -le $idealMax) {
        $status = "✅"
        $statusText = "Great"
        $color = "Green"
    } elseif ($sizeMB -le $absoluteMax) {
        $status = "⚠️"
        $statusText = "OK"
        $color = "Yellow"
        $issues += $file.Name
    } else {
        $status = "❌"
        $statusText = "TOO LARGE"
        $color = "Red"
        $issues += $file.Name
    }
    
    # Calculate estimated loading time
    # Rough estimate: 1 MB = ~3 seconds on 4G
    $loadTimeSec = [math]::Round($sizeMB * 3, 0)
    if ($loadTimeSec -lt 60) {
        $loadTime = "${loadTimeSec}s"
    } else {
        $loadTimeMin = [math]::Round($loadTimeSec / 60, 1)
        $loadTime = "${loadTimeMin}min"
    }
    
    # Display info
    Write-Host "$status " -NoNewline
    Write-Host "$($file.Name.PadRight(25))" -NoNewline
    Write-Host "${sizeMB} MB".PadRight(12) -NoNewline -ForegroundColor $color
    Write-Host "Load: ${loadTime}".PadRight(15) -NoNewline
    Write-Host "$statusText" -ForegroundColor $color
    
    $totalSizeBefore += $file.Length
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$totalMB = [math]::Round($totalSizeBefore / 1MB, 2)
Write-Host "Total Size: ${totalMB} MB" -ForegroundColor White
Write-Host ""

if ($issues.Count -eq 0) {
    Write-Host "✅ ALL FILES OPTIMIZED - Ready to deploy!" -ForegroundColor Green
} else {
    Write-Host "⚠️  FILES NEEDING OPTIMIZATION: $($issues.Count)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Files to optimize:" -ForegroundColor Yellow
    foreach ($issue in $issues) {
        Write-Host "  - $issue" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "See URGENT_FILE_OPTIMIZATION_GUIDE.md for instructions" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TARGETS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "GLB files:  Ideal <2 MB  |  Max 5 MB" -ForegroundColor White
Write-Host "USDZ files: Ideal <5 MB  |  Max 10 MB" -ForegroundColor White
Write-Host ""
Write-Host "Estimated loading time:" -ForegroundColor White
Write-Host "  - Under 5 MB:  5-15 seconds  ✅" -ForegroundColor Green
Write-Host "  - 5-10 MB:     15-30 seconds ⚠️" -ForegroundColor Yellow
Write-Host "  - Over 10 MB:  30+ seconds  ❌" -ForegroundColor Red
Write-Host ""

