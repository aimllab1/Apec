from PIL import Image

def main():
    png_path = r"Z:\src\lakshmi_sidhar.png"
    target_jpeg_src = r"Z:\src\Sakthi Tmt. V. Lakshmi Bangaru Sidhar.jpeg"
    target_jpeg_public = r"Z:\public\lakshmi_sidhar.jpg"
    
    print("Opening source image...")
    img = Image.open(png_path)
    
    # Convert to RGB
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        print("Image has alpha channel, converting with white background...")
        background = Image.new('RGB', img.size, (255, 255, 255))
        # Handle RGBA transparent split
        if img.mode == 'RGBA':
            background.paste(img, mask=img.split()[3])
        else:
            background.paste(img)
        img = background
    else:
        img = img.convert('RGB')
        
    print("Saving to src as JPEG...")
    img.save(target_jpeg_src, "JPEG", quality=90)
    
    print("Saving to public as JPEG...")
    img.save(target_jpeg_public, "JPEG", quality=90)
    
    print("Done!")

if __name__ == "__main__":
    main()
