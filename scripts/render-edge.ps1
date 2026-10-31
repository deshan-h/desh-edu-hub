$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
$curr = (Get-Location).Path
$htmlIcon = "file:///" + ($curr -replace "\\", "/") + "/scripts/icon-renderer.html"
$htmlMask = "file:///" + ($curr -replace "\\", "/") + "/scripts/maskable-renderer.html"

$out192 = Join-Path $curr "public\icon-192.png"
$out512 = Join-Path $curr "public\icon-512.png"
$out180 = Join-Path $curr "public\apple-touch-icon.png"
$outMask = Join-Path $curr "public\icon-maskable-512.png"

Write-Host "Rendering 192..."
& $edge --headless --disable-gpu --default-background-color=00000000 --window-size=192,192 "--screenshot=$out192" $htmlIcon
Start-Sleep -Milliseconds 600

Write-Host "Rendering 512..."
& $edge --headless --disable-gpu --default-background-color=00000000 --window-size=512,512 "--screenshot=$out512" $htmlIcon
Start-Sleep -Milliseconds 600

Write-Host "Rendering 180..."
& $edge --headless --disable-gpu --default-background-color=00000000 --window-size=180,180 "--screenshot=$out180" $htmlIcon
Start-Sleep -Milliseconds 600

Write-Host "Rendering maskable..."
& $edge --headless --disable-gpu --default-background-color=00000000 --window-size=512,512 "--screenshot=$outMask" $htmlMask
Start-Sleep -Milliseconds 600

Write-Host "All Edge screenshots saved successfully!"
