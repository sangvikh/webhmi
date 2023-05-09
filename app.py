from flask import Flask, render_template, request, jsonify, Response
import app.video as video
#from app.motorcontrol import joyControl

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/joystick-data', methods=['POST'])
def joystick_data():
    data = request.json
    id = data['id']
    x = data['x']
    y = data['y']
    
    # Process joystick data 
    print("{}: x: {}, y: {}".format(id, x, y))
    #joyControl(float(x), float(y))
    
    return jsonify({'result': 'success'})

@app.route('/video_feed')
def video_feed():
    return Response(video.gen_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/zoom', methods=['POST'])
def zoom():
    data = request.get_json()

    if 'direction' not in data:
        return jsonify(error='No direction specified'), 400

    direction = data['direction']

    if direction == 'in':
        zoom = video.set_zoom(video.zoomVal * 1.05)
    elif direction == 'out':
        zoom = video.set_zoom(video.zoomVal * 0.95)
    elif direction == 'reset':
        zoom = video.set_zoom()
    else:
        return jsonify(error='Invalid direction specified'), 400

    print("Zoom: {}".format(zoom))
    return jsonify(result=zoom)

@app.route('/watchdog', methods=['GET'])
def watchdog():
    return jsonify({"status": "success", "message": "pong"})

if __name__ == '__main__':
    app.run(debug=False, port=5000, host="0.0.0.0")
