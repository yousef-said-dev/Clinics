from PIL import Image
import requests
from io import BytesIO

# Image URL
image_url = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80"

# Download the image
print("Downloading image...")
response = requests.get(image_url)
img = Image.open(BytesIO(response.content)).convert("RGBA")
print(f"Original size: {img.size}")

# Simple approach: create transparency based on color similarity
# The background is a light color, so we can make lighter pixels transparent
img_array = img.load()
width, height = img.size

# Create a new image with transparency
transparent_img = Image.new("RGBA", img.size, (0, 0, 0, 0))
transparent_pixels = transparent_img.load()

# Process each pixel
for y in range(height):
    for x in range(width):
        r, g, b, a = img_array[x, y]
        
        # Calculate brightness
        brightness = (r + g + b) / 3
        
        # If pixel is bright (likely background), make it transparent
        # Adjust threshold as needed (0-255)
        if brightness > 180:
            # Transparent (alpha = 0)
            transparent_pixels[x, y] = (r, g, b, 0)
        else:
            # Keep the pixel (alpha = 255)
            transparent_pixels[x, y] = (r, g, b, 255)
            
    # Progress indicator
    if y % 100 == 0:
        print(f"Processing: {y/height*100:.1f}%")

# Save the result
output_path = "doctor_transparent.png"
transparent_img.save(output_path, "PNG")
print(f"\nSaved transparent image to: {output_path}")

# Also create a smaller version
small_img = transparent_img.copy()
small_img.thumbnail((450, 450), Image.Resampling.LANCZOS)
small_path = "doctor_transparent_small.png"
small_img.save(small_path, "PNG")
print(f"Saved small version to: {small_path}")
