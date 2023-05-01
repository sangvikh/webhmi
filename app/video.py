import cv2

zoomVal = 1

def gen_frames():
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        else:
            frame = zoom(frame, zoomVal)
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

def set_zoom(value = 1):
    global zoomVal
    zoomVal = min(max(value, 1), 10)
    return zoomVal

def zoom(img, zoom, coord=None):
    """
    Simple image zooming without boundary checking.
    Centered at "coord", if given, else the image center.

    img: numpy.ndarray of shape (h,w,:)
    zoom: float
    coord: (float, float)
    """
    # Limit minimum zoom to 1, or else image will be out of frame
    zoom = max(zoom, 1)
    
    # Translate to zoomed coordinates
    h, w, _ = [ zoom * i for i in img.shape ]
    
    if coord is None:
        cx, cy = w/2, h/2
    else:
        cx, cy = [ zoom*c for c in coord ]
        # Limit cx and cy to keep image inside frame at all times
    
    img = cv2.resize( img, (0, 0), fx=zoom, fy=zoom)
    img = img[ int(round(cy - h/zoom * .5)) : int(round(cy + h/zoom * .5)),
               int(round(cx - w/zoom * .5)) : int(round(cx + w/zoom * .5)),
               : ]
    
    return img