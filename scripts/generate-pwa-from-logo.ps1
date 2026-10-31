Add-Type -AssemblyName System.Drawing

function Generate-Pwa-Icon-From-Image {
    param (
        [string]$SourcePath,
        [int]$Size,
        [string]$OutputPath,
        [bool]$IsMaskable = $false
    )

    $src = [System.Drawing.Image]::FromFile($SourcePath)
    $bmp = [System.Drawing.Bitmap]::new($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    if ($IsMaskable) {
        # Maskable: Android adaptive icon fills entire canvas with white background, emblem scaled to safe zone
        $g.Clear([System.Drawing.Color]::White)
        $pad = [int]($Size * 0.08)
        $destRect = [System.Drawing.Rectangle]::new($pad, $pad, $Size - ($pad * 2), $Size - ($pad * 2))
        $g.DrawImage($src, $destRect)
    } else {
        # Rounded corners squircle clip
        $radius = [int]($Size * 0.22)
        $rect = [System.Drawing.Rectangle]::new(0, 0, $Size, $Size)
        $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
        $d = $radius * 2
        $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
        $path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
        $path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
        $path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
        $path.CloseFigure()

        $g.SetClip($path)
        $g.DrawImage($src, $rect)
        $path.Dispose()
    }

    $g.Dispose()
    $src.Dispose()

    $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated PWA Icon: $OutputPath ($Size x $Size)"
}

$source = "public\desh-eduhub-logo.png"

Generate-Pwa-Icon-From-Image -SourcePath $source -Size 192 -OutputPath "public\icon-192.png"
Generate-Pwa-Icon-From-Image -SourcePath $source -Size 512 -OutputPath "public\icon-512.png"
Generate-Pwa-Icon-From-Image -SourcePath $source -Size 512 -OutputPath "public\icon-maskable-512.png" -IsMaskable $true
Generate-Pwa-Icon-From-Image -SourcePath $source -Size 180 -OutputPath "public\apple-touch-icon.png"

