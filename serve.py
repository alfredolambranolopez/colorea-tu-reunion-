"""
Servidor local para ColoreaLaReunión™
Ejecuta este archivo para abrir la tienda en tu navegador:
    python serve.py
"""

import http.server
import socketserver
import webbrowser
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 60)
        print("🎨  ColoreaLaReunión™ - Servidor Local Iniciado con Éxito")
        print(f"👉  Abre tu navegador en: {url}")
        print("    Presiona Ctrl+C para detener el servidor.")
        print("=" * 60)
        webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido. ¡Que sobrevivas a tu próxima reunión!")
