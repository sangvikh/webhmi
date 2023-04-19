from flask import Flask, render_template, request, jsonify

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
    # ...
    print(x)
    
    return jsonify({'result': 'success'})

if __name__ == '__main__':
    app.run(debug=True)
