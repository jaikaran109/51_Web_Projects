#!/usr/bin/env python3
"""
Generate high-resolution (1200x630) Open Graph / Twitter Card preview banner.
Usage: python3 scripts/generate-og-image.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
img = Image.new('RGB', (W, H), color='#0B0F19')
draw = ImageDraw.Draw(img)

# Background gradient
for y in range(H):
    r = int(11 + (22 - 11) * (y / H))
    g = int(15 + (27 - 15) * (y / H))
    b = int(25 + (50 - 25) * (y / H))
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Outer border
draw.rounded_rectangle([30, 30, W - 30, H - 30], radius=24, outline='#312E81', width=3)

# Fonts
font_title = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 64)
font_subtitle = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 30)
font_badge = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
font_footer = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22)
font_tag = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)

# Top badge
badge_text = "✦ CURATED FRONTEND SHOWCASE ✦"
draw.rounded_rectangle([80, 75, 490, 115], radius=20, fill='#1E1B4B', outline='#6366F1', width=2)
draw.text((105, 83), badge_text, font=font_badge, fill='#A5B4FC')

# Main Title
draw.text((80, 150), "51 Web Projects", font=font_title, fill='#FFFFFF')

# Accent line under title
draw.rounded_rectangle([80, 235, 260, 241], radius=3, fill='#6366F1')

# Subtitle
subtitle1 = "Learn Frontend Development with Hands-on Practice"
subtitle2 = "From Beginner Games to Full-Stack Web Applications"
draw.text((80, 265), subtitle1, font=font_subtitle, fill='#E2E8F0')
draw.text((80, 315), subtitle2, font=font_subtitle, fill='#94A3B8')

# Tech Stack Badges
tags = [
    ("HTML5", "#F97316"),
    ("CSS3", "#38BDF8"),
    ("JavaScript", "#FACC15"),
    ("Tailwind", "#34D399"),
    ("Full Stack", "#A855F7")
]
curr_x = 80
badge_y = 390
for tag_name, tag_color in tags:
    tw = int(font_tag.getlength(tag_name))
    box_w = tw + 36
    draw.rounded_rectangle([curr_x, badge_y, curr_x + box_w, badge_y + 44], radius=12, fill='#1E293B', outline=tag_color, width=2)
    draw.text((curr_x + 18, badge_y + 11), tag_name, font=font_tag, fill='#F8FAFC')
    curr_x += box_w + 16

# Footer info
draw.line([(80, 480), (W - 80, 480)], fill='#1E293B', width=2)
draw.text((80, 520), "🌐 Live Demos Included", font=font_footer, fill='#38BDF8')
draw.text((390, 520), "⭐ Open Source Community", font=font_footer, fill='#FBBF24')
draw.text((750, 520), "github.com/jaikaran109/51_Web_Projects", font=font_footer, fill='#94A3B8')

os.makedirs('assets', exist_ok=True)
img.save('assets/og-preview.png', 'PNG', optimize=True)
print("Saved assets/og-preview.png (1200x630)")

