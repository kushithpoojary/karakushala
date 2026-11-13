param(
    [int]$Port = 8080
)

$distPath = Join-Path $PSScriptRoot "frontend\dist"
if (-not (Test-Path $distPath)) {
    Write-Error "Could not find frontend\dist folder at $distPath"
    exit 1
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  KaraKushala Local Server Running!" -ForegroundColor Green
Write-Host "  URL: http://localhost:$Port" -ForegroundColor Yellow
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "==========================================================" -ForegroundColor Cyan

# Try opening in default browser automatically
try { Start-Process "http://localhost:$Port" } catch {}

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream)
        $requestLine = $reader.ReadLine()
        
        if ($requestLine) {
            $tokens = $requestLine.Split(" ")
            if ($tokens.Length -ge 2) {
                $rawPath = $tokens[1].Split("?")[0].TrimStart('/')
                $filePath = Join-Path $distPath ($rawPath -replace '/', '\')
                
                # SPA routing: default to index.html if file doesn't exist or is root
                if ([string]::IsNullOrWhiteSpace($rawPath) -or (-not (Test-Path $filePath -PathType Leaf))) {
                    $filePath = Join-Path $distPath "index.html"
                }

                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".svg"  { "image/svg+xml" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    default { "application/octet-stream" }
                }

                if (Test-Path $filePath -PathType Leaf) {
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                    $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($bytes, 0, $bytes.Length)
                } else {
                    $notFound = "HTTP/1.1 404 Not Found`r`nContent-Length: 0`r`nConnection: close`r`n`r`n"
                    $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes($notFound)
                    $stream.Write($notFoundBytes, 0, $notFoundBytes.Length)
                }
            }
        }
        $stream.Flush()
        $client.Close()
    }
}
finally {
    $listener.Stop()
}
