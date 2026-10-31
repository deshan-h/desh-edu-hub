Add-Type -AssemblyName System.Drawing

function Generate-Navbar-Icon {
    param (
        [int]$Size,
        [string]$OutputPath,
        [bool]$IsMaskable = $false
    )

    $bmp = [System.Drawing.Bitmap]::new($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    # Gradient: from blue-600 (#2563EB) at bottom-left to indigo-700 (#4338CA) at top-right
    $color1 = [System.Drawing.Color]::FromArgb(255, 37, 99, 235)  # #2563eb
    $color2 = [System.Drawing.Color]::FromArgb(255, 67, 56, 202)  # #4338ca

    $pt1 = [System.Drawing.PointF]::new(0, $Size)
    $pt2 = [System.Drawing.PointF]::new($Size, 0)
    $gradBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($pt1, $pt2, $color1, $color2)

    if ($IsMaskable) {
        $g.FillRectangle($gradBrush, 0, 0, $Size, $Size)
    } else {
        $padding = [int]($Size * 0.04)
        $rectSize = $Size - ($padding * 2)
        $radius = [int]($Size * 0.22)
        $rect = [System.Drawing.Rectangle]::new($padding, $padding, $rectSize, $rectSize)
        
        $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
        $d = $radius * 2
        $path.AddArc($rect.X, $rect.Y, $d, $d, 180, 90)
        $path.AddArc($rect.Right - $d, $rect.Y, $d, $d, 270, 90)
        $path.AddArc($rect.Right - $d, $rect.Bottom - $d, $d, $d, 0, 90)
        $path.AddArc($rect.X, $rect.Bottom - $d, $d, $d, 90, 90)
        $path.CloseFigure()

        $g.FillPath($gradBrush, $path)
        $path.Dispose()
    }
    $gradBrush.Dispose()

    # Graduation cap icon in white
    $scaleFactor = if ($IsMaskable) { $Size * 0.52 / 24.0 } else { $Size * 0.58 / 24.0 }
    $offsetX = ($Size - (24.0 * $scaleFactor)) / 2.0
    $offsetY = ($Size - (24.0 * $scaleFactor)) / 2.0

    # In GDI+, pen width is in local coordinates, so 1.9f gives exact match to SVG stroke-width=2
    $whitePen = [System.Drawing.Pen]::new([System.Drawing.Color]::White, 1.9)
    $whitePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $whitePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $whitePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    # Transform
    $g.TranslateTransform($offsetX, $offsetY)
    $g.ScaleTransform($scaleFactor, $scaleFactor)

    # Mortarboard Diamond: M2 10l10-5 10 5-10 5z
    $pts = [System.Drawing.PointF[]]@(
        [System.Drawing.PointF]::new(2.0, 10.0),
        [System.Drawing.PointF]::new(12.0, 5.0),
        [System.Drawing.PointF]::new(22.0, 10.0),
        [System.Drawing.PointF]::new(12.0, 15.0)
    )
    $g.DrawPolygon($whitePen, $pts)

    # Tassel: M22 10v6
    $g.DrawLine($whitePen, 22.0, 10.0, 22.0, 16.0)

    # Cap lower band: M6 12v5c0 2 2 3 6 3s6-1 6-3v-5
    $bandPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $bandPath.AddLine(6.0, 12.0, 6.0, 17.0)
    $bandPath.AddBezier(6.0, 17.0, 6.0, 20.0, 18.0, 20.0, 18.0, 17.0)
    $bandPath.AddLine(18.0, 17.0, 18.0, 12.0)
    $g.DrawPath($whitePen, $bandPath)
    $bandPath.Dispose()

    $whitePen.Dispose()
    $g.Dispose()

    $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Generated: $OutputPath ($Size x $Size)"
}

Generate-Navbar-Icon -Size 192 -OutputPath "public\icon-192.png"
Generate-Navbar-Icon -Size 512 -OutputPath "public\icon-512.png"
Generate-Navbar-Icon -Size 512 -OutputPath "public\icon-maskable-512.png" -IsMaskable $true
Generate-Navbar-Icon -Size 180 -OutputPath "public\apple-touch-icon.png"
