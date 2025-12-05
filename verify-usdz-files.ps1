# PowerShell Script to Verify USDZ Files
# Run this after converting your files to check if they're valid

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "USDZ FILE VERIFICATION" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$path = "public\models\artificial_grass"
$files = @("15mm.usdz", "25mm.usdz", "30mm.usdz", "35mm.usdz", "40mm.usdz")

$allValid = $true

foreach ($file in $files) {
    $filePath = Join-Path $path $file
    
    if (Test-Path $filePath) {
        $fileInfo = Get-Item $filePath
        $sizeKB = [math]::Round($fileInfo.Length / 1KB, 2)
        
        # Check if file is likely valid (> 10KB)
        if ($sizeKB -gt 10) {
            Write-Host "✓ $file" -ForegroundColor Green -NoNewline
            Write-Host " - $sizeKB KB " -ForegroundColor White -NoNewline
            
            # Check file header (USDZ files are ZIP archives starting with "PK")
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            if ($bytes[0] -eq 0x50 -and $bytes[1] -eq 0x4B) {
                Write-Host "[Valid ZIP/USDZ]" -ForegroundColor Green
            } else {
                Write-Host "[Warning: Not a ZIP file]" -ForegroundColor Yellow
                $allValid = $false
            }
        } else {
            Write-Host "✗ $file" -ForegroundColor Red -NoNewline
            Write-Host " - $sizeKB KB [TOO SMALL - Likely fake/corrupted]" -ForegroundColor Red
            $allValid = $false
        }
    } else {
        Write-Host "✗ $file" -ForegroundColor Red -NoNewline
        Write-Host " [FILE NOT FOUND]" -ForegroundColor Red
        $allValid = $false
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan

if ($allValid) {
    Write-Host "✓ ALL FILES VALID - Ready to test!" -ForegroundColor Green
} else {
    Write-Host "✗ SOME FILES NEED ATTENTION - Check errors above" -ForegroundColor Red
}

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Show comparison with GLB files
Write-Host "Comparison with GLB files:" -ForegroundColor Yellow
Write-Host ""
Get-ChildItem -Path $path -Filter "*.glb" | ForEach-Object {
    $glbSize = [math]::Round($_.Length / 1KB, 2)
    $usdzFile = $_.Name.Replace(".glb", ".usdz")
    $usdzPath = Join-Path $path $usdzFile
    
    if (Test-Path $usdzPath) {
        $usdzSize = [math]::Round((Get-Item $usdzPath).Length / 1KB, 2)
        $ratio = [math]::Round($usdzSize / $glbSize, 2)
        Write-Host "  $($_.Name.PadRight(15)) $glbSize KB  →  $usdzFile.PadRight(15) $usdzSize KB  (${ratio}x)" -ForegroundColor White
    }
}

Write-Host ""

