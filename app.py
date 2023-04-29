from flask import Flask, render_template, request, jsonify, Response
import app.video as video

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/joystick-data', methods=['POST'])
def joystick_data():
    data = request.json
    x = data['x']
    y = data['y']
    
    # Process joystick data
    print("x: {}, y: {}".format(x, y))
    
    return jsonify({'result': 'success'})

@app.route('/video_feed')
def video_feed():
    return Response(video.gen_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=False, port=5000, host="0.0.0.0")
