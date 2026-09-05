"""Local dev server that mimics the Vercel rewrite for /view/step.
Run: python tools/serve.py [port]
"""
import sys, os, re, functools, http.server, socketserver

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STEP = re.compile(r'^/([a-z]+)/\d+/?$')

class H(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        m = STEP.match(path.split('?')[0])
        if m and os.path.isdir(os.path.join(ROOT, m.group(1))):
            path = '/' + m.group(1) + '/'
        return super().translate_path(path)
    def log_message(self, *a): pass

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8803
os.chdir(ROOT)
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('127.0.0.1', port), functools.partial(H, directory=ROOT)) as s:
    print(f'serving {ROOT} on http://127.0.0.1:{port}')
    s.serve_forever()
