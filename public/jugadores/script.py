from PIL import Image
import os

# Directorio actual
input_dir = "./"

# Recorremos todos los archivos del directorio
for filename in os.listdir(input_dir):
    if filename.lower().endswith(".png"):
        png_path = os.path.join(input_dir, filename)
        webp_path = os.path.splitext(png_path)[0] + ".webp"

        # Abrir y convertir la imagen
        with Image.open(png_path) as img:
            img.save(webp_path, "WEBP", quality=90)

        print(f"Convertido: {filename} → {os.path.basename(webp_path)}")

print("✅ Conversión completada.")
