from flask import Flask, render_template, request, jsonify, Response
import app.video as video
import app.watchdog as wd
#from app.motorcontrol import joyControl
import queue

app = Flask(__name__)

# Create a queue to store messages
message_queue = queue.Queue()

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
    if (id == 'right'):
        print("joycontrol")
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
        message_queue.put("Zoom in")
    elif direction == 'out':
        zoom = video.set_zoom(video.zoomVal * 0.95)
        message_queue.put("Zoom out")
    elif direction == 'reset':
        zoom = video.set_zoom()
    else:
        return jsonify(error='Invalid direction specified')

    print("Zoom: {}".format(zoom))
    return jsonify(result=zoom)

@app.route('/ping', methods=['GET'])
def ping():
    watchdog.kick()
    return jsonify({"status": "success", "message": "pong"})

# Watchdog to handle communication loss
def interlock():
    print("interlocked")
    #joyControl(0, 0)
watchdog = wd.Watchdog(func = interlock)

# Message box
@app.route('/get_message', methods=['GET'])
def get_message():
    if not message_queue.empty():
        return jsonify(message=message_queue.get())
    else:
        return jsonify(message=None)


if __name__ == '__main__':
    app.run(debug=False, port=5000, host="0.0.0.0")
