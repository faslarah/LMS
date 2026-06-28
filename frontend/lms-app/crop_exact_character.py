from PIL import Image

img_path = "/Users/habeeb/.gemini/antigravity/brain/f85bc182-bebb-4329-b067-b0309b1c14a3/media__1782575437798.jpg"
try:
    img = Image.open(img_path)
    
    # The hero banner is roughly at y=70 to y=420.
    # The character illustration (including cap, bulb, laptop) is from x=450 to x=750 roughly.
    # Let's crop x: 420 to 780, y: 70 to 420
    box = (420, 70, 780, 420)
    character_crop = img.crop(box)
    
    # Save it directly to the public folder
    dest_path = "/Users/habeeb/Desktop/lmsPro/frontend/lms-app/public/hero-character.png"
    character_crop.save(dest_path)
    print("Character cropped and saved!")
except Exception as e:
    print(f"Error: {e}")
