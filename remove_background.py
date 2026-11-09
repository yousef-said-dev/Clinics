from PIL import Image
import numpy as np
import requests
from io import BytesIO
import os

# Image URL
image_url = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80"

# Download the image
print("Downloading image...")
response = requests.get(image_url)
img = Image.open(BytesIO(response.content)).convert("RGBA")
print(f"Original size: {img.size}")

# Convert to numpy array
img_array = np.array(img)

# Separate RGBA channels
r, g, b, a = img_array[:,:,0], img_array[:,:,1], img_array[:,:,2], img_array[:,:,3]

# Simple background removal based on color similarity
# The background appears to be a grayish color
# We'll detect non-foreground pixels based on color thresholds

# Create a mask for the foreground (doctor)
# Assuming background is lighter gray - detect darker pixels as foreground
gray = 0.299 * r + 0.587 * g + 0.114 * b

# Threshold: pixels darker than this are likely foreground
# Adjust threshold as needed
threshold = 180

# Create alpha mask - foreground is opaque, background is transparent
alpha_mask = np.where(gray < threshold, 255, 0).astype(np.uint8)

# Apply some feathering to edges for smoother transition
from scipy import ndimage
alpha_mask = ndimage.gaussian_filter(alpha_mask.astype(float), sigma=2)
alpha_mask = np.clip(alpha_mask, 0, 255).astype(np.uint8)

# Apply mask to alpha channel
img_array[:,:,3] = alpha_mask

# Create output image
output_img = Image.fromarray(img_array)

# Save the result
output_path = "doctor_transparent.png"
output_img.save(output_path, "PNG")
print(f"Saved transparent image to: {output_path}")

# Also save a smaller version for web use
output_img.thumbnail((450, 450), Image.Resampling.LANCZOS)
small_path = "doctor_transparent_small.png"
output_img.save(small_path, "PNG")
print(f"Saved small version to: {small_path}")
