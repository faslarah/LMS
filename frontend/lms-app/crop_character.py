from PIL import Image

img_path = "/Users/habeeb/.gemini/antigravity/brain/f85bc182-bebb-4329-b067-b0309b1c14a3/media__1782575437798.jpg"
img = Image.open(img_path)

# Let's crop a few bounding boxes to find the character
# 1024x682
# Character is roughly in the center-right top area.
# x from ~400 to 750, y from ~50 to 350
crops = [
    (400, 50, 750, 350),
    (450, 80, 750, 420),
    (500, 70, 780, 430),
    (420, 60, 780, 430)
]

for i, box in enumerate(crops):
    c = img.crop(box)
    c.save(f"/Users/habeeb/.gemini/antigravity/brain/f85bc182-bebb-4329-b067-b0309b1c14a3/scratch/crop_{i}.png")
print("Crops saved!")
