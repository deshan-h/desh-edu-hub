Add-Type -AssemblyName System.Drawing

$bmp = [System.Drawing.Bitmap]::FromFile("public\icon-192.png")
$thumb = New-Object System.Drawing.Bitmap($bmp, 64, 64)
$hIcon = $thumb.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)

$stream1 = [System.IO.FileStream]::new("public\favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($stream1)
$stream1.Dispose()

$stream2 = [System.IO.FileStream]::new("src\app\favicon.ico", [System.IO.FileMode]::Create)
$icon.Save($stream2)
$stream2.Dispose()

$icon.Dispose()
$thumb.Dispose()
$bmp.Dispose()

Write-Host "favicon.ico successfully created in public\ and src\app\"

