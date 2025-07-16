from PIL import Image

# 원본 아이콘 파일 경로
original_file = "icon_512x512.png"

# 저장할 사이즈 목록
sizes = [72, 96, 128, 144, 152, 192, 384, 512]

# 이미지 열기
img = Image.open(original_file)

# 각 크기로 리사이즈하고 저장
for size in sizes:
    resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
    filename = f"icon-{size}x{size}.png"
    resized_img.save(filename, format="PNG")
    print(f"Saved: {filename}")
