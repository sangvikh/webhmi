import cv2
from io import BytesIO

# Define the compression quality (lower values for higher compression)
compression_quality = 50
zoomVal = 1

def gen_frames():
    cap = cv2.VideoCapture(0)

    # Define the codec and create VideoWriter object
    fourcc = cv2.VideoWriter_fourcc(*'VP90')  # VP8 codec

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        else:
            frame = zoom(frame, zoomVal)

            # Write frame to the in-memory buffer
            buffer = BytesIO()
            is_success, buf = cv2.imencode('.webp', frame, [cv2.IMWRITE_WEBP_QUALITY, compression_quality])
            if is_success:
                buffer.write(buf)
                frame = buffer.getvalue()
                yield (b'--frame\r\n'
                       b'Content-Type: image/webp\r\n\r\n' + frame + b'\r\n')

    # Release VideoCapture object
    cap.release()

def set_zoom(value = 1):
    global zoomVal
    zoomVal = min(max(value, 1), 10)
    return zoomVal

def zoom(img, zoom, coord=None):
    """
    Simple image zooming with boundary checking.
    Centered at "coord", if given, else the image center.

    img: numpy.ndarray of shape (h,w,:)
    zoom: float
    coord: (float, float)
    """
    h, w, _ = img.shape

    if coord is None:
        cx, cy = w/2, h/2
    else:
        cx, cy = coord

    # Calculate the crop dimensions
    crop_h, crop_w = int(h / zoom), int(w / zoom)

    # Calculate the crop boundaries
    y1, y2 = max(0, int(cy - crop_h / 2)), min(h, int(cy + crop_h / 2))
    x1, x2 = max(0, int(cx - crop_w / 2)), min(w, int(cx + crop_w / 2))

    # Crop the image
    cropped_img = img[y1:y2, x1:x2]

    # Resize the cropped image
    resized_img = cv2.resize(cropped_img, (w, h))

    return resized_img
