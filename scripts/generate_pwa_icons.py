import os
import sys
import subprocess

# Ensure PIL (Pillow) is installed
try:
    from PIL import Image, ImageDraw, ImageFilter
except ImportError:
    print("Pillow not found. Installing Pillow...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFilter

def draw_sprout_icon(size):
    # Create image with solid green background (#1D9E75)
    # RGB for #1D9E75 is (29, 158, 117)
    background_color = (29, 158, 117, 255)
    img = Image.new('RGBA', (size, size), color=background_color)
    draw = ImageDraw.Draw(img)

    # Scale coordinates based on size
    scale = size / 512.0
    
    # Coordinates for drawing a stylized sprout/leaf in white
    # Stem: center column
    # Left leaf and right leaf
    
    # Let's draw a professional, minimalist white leaf/sprout
    # Main stem (bottom center to middle)
    # We will draw it using antialiased polygons or thick curves.
    # To get high quality, we can draw at 4x resolution and resize down.
    return img

def generate_high_quality_icons():
    # We will draw at 4x resolution for super crisp antialiasing
    bg_color = (29, 158, 117, 255)
    
    for target_size in [192, 512]:
        render_size = target_size * 4
        img = Image.new('RGBA', (render_size, render_size), color=bg_color)
        draw = ImageDraw.Draw(img)
        
        # Center of the image
        c = render_size / 2.0
        s = render_size
        
        # Draw a beautiful stylized sprout (white)
        # Left leaf: bezier curve representation using polygon approximation
        left_leaf_points = []
        # Draw a nice leaf shape curving up and left
        # Base of leaf at (c - 20*scale, c + 100*scale)
        # Tip of leaf at (c - 120*scale, c - 100*scale)
        # We can construct two curves meeting at the base and tip
        for t in range(101):
            t_frac = t / 100.0
            # Curve 1 (inner): from base to tip
            # P0 = (c - 10*render_size/512, c + 80*render_size/512)
            # P1 = (c - 40*render_size/512, c - 10*render_size/512)
            # P2 = (c - 140*render_size/512, c - 100*render_size/512)
            x = (1-t_frac)**2 * (c - 10*render_size/512) + 2*(1-t_frac)*t_frac*(c - 40*render_size/512) + t_frac**2 * (c - 140*render_size/512)
            y = (1-t_frac)**2 * (c + 80*render_size/512) + 2*(1-t_frac)*t_frac*(c - 10*render_size/512) + t_frac**2 * (c - 100*render_size/512)
            left_leaf_points.append((x, y))
            
        for t in range(101):
            t_frac = (100 - t) / 100.0
            # Curve 2 (outer): from tip back to base
            # P2 = (c - 140*render_size/512, c - 100*render_size/512)
            # P1 = (c - 150*render_size/512, c + 10*render_size/512)
            # P0 = (c - 10*render_size/512, c + 80*render_size/512)
            x = (1-t_frac)**2 * (c - 140*render_size/512) + 2*(1-t_frac)*t_frac*(c - 150*render_size/512) + t_frac**2 * (c - 10*render_size/512)
            y = (1-t_frac)**2 * (c - 100*render_size/512) + 2*(1-t_frac)*t_frac*(c + 10*render_size/512) + t_frac**2 * (c + 80*render_size/512)
            left_leaf_points.append((x, y))
            
        # Draw left leaf
        draw.polygon(left_leaf_points, fill=(255, 255, 255, 255))
        
        # Right leaf (mirrored version of left leaf, slightly smaller and offset for dynamic look)
        right_leaf_points = []
        for t in range(101):
            t_frac = t / 100.0
            # Inner curve
            x = (1-t_frac)**2 * (c + 5*render_size/512) + 2*(1-t_frac)*t_frac*(c + 30*render_size/512) + t_frac**2 * (c + 110*render_size/512)
            y = (1-t_frac)**2 * (c + 90*render_size/512) + 2*(1-t_frac)*t_frac*(c + 10*render_size/512) + t_frac**2 * (c - 60*render_size/512)
            right_leaf_points.append((x, y))
            
        for t in range(101):
            t_frac = (100 - t) / 100.0
            # Outer curve
            x = (1-t_frac)**2 * (c + 110*render_size/512) + 2*(1-t_frac)*t_frac*(c + 120*render_size/512) + t_frac**2 * (c + 5*render_size/512)
            y = (1-t_frac)**2 * (c - 60*render_size/512) + 2*(1-t_frac)*t_frac*(c + 20*render_size/512) + t_frac**2 * (c + 90*render_size/512)
            right_leaf_points.append((x, y))
            
        # Draw right leaf
        draw.polygon(right_leaf_points, fill=(255, 255, 255, 255))

        # Main stem/trunk in the middle, slightly curved
        stem_points = []
        # Left boundary of stem
        for t in range(101):
            t_frac = t / 100.0
            x = (1-t_frac)**2 * (c - 8*render_size/512) + 2*(1-t_frac)*t_frac*(c - 5*render_size/512) + t_frac**2 * (c - 2*render_size/512)
            y = (1-t_frac)**2 * (c + 180*render_size/512) + 2*(1-t_frac)*t_frac*(c + 130*render_size/512) + t_frac**2 * (c + 70*render_size/512)
            stem_points.append((x, y))
        # Top point
        stem_points.append((c - 2*render_size/512, c + 60*render_size/512))
        stem_points.append((c + 8*render_size/512, c + 60*render_size/512))
        # Right boundary of stem back down
        for t in range(101):
            t_frac = (100 - t) / 100.0
            x = (1-t_frac)**2 * (c + 8*render_size/512) + 2*(1-t_frac)*t_frac*(c + 13*render_size/512) + t_frac**2 * (c + 12*render_size/512)
            y = (1-t_frac)**2 * (c + 60*render_size/512) + 2*(1-t_frac)*t_frac*(c + 130*render_size/512) + t_frac**2 * (c + 180*render_size/512)
            stem_points.append((x, y))
            
        # Draw stem
        draw.polygon(stem_points, fill=(255, 255, 255, 255))

        # Optional clean circle around sprout to make it feel badge-like (with thin border)
        border_width = 8 * (render_size / 512.0)
        draw.ellipse(
            [border_width * 2, border_width * 2, render_size - border_width * 2, render_size - border_width * 2],
            outline=(255, 255, 255, 40),
            width=int(border_width)
        )

        # Downsample image for high-quality antialiasing
        final_img = img.resize((target_size, target_size), Image.Resampling.LANCZOS)
        
        # Ensure public folder exists
        os.makedirs('public', exist_ok=True)
        
        # Save output
        filename = f'public/icon-{target_size}x{target_size}.png'
        final_img.save(filename, 'PNG')
        print(f"Generated {filename}")

if __name__ == '__main__':
    generate_high_quality_icons()
