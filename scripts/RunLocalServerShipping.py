import http.server
import socketserver
import socket
import build
import os

# Step 1: Build the site
build.start_build()

# Step 2: Set working directory
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..', 'built'))
os.chdir(WEB_DIR)

# Step 3: Setup server
PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

# Find local IP
hostname = socket.gethostname()
local_ip = socket.gethostbyname(hostname)

# Step 4: Start server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving locally at: http://localhost:{PORT}")
    print(f"Serving on network at: http://{local_ip}:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()

input("Press Enter to close...")
