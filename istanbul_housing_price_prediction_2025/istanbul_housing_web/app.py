from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
import json

app = Flask(__name__)

with open('utilities/istanbul_housing_model.pickle', 'rb') as model_file:
    model = pickle.load(model_file)

with open('utilities/istanbul_scaler.pickle', 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

with open('datas/columns.json', 'r', encoding='utf-8') as f:
    columns = json.load(f)
    district_cols = [col for col in columns['data_cols'][5:]]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_districts')
def get_districts():
    return jsonify(district_cols)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        total_squaremeter = float(data['total_squaremeter'])
        room = int(data['room'])
        living_room = int(data['living_room'])
        bath = int(data['bath'])
        balcony = int(data['balcony'])
        district = data['district']
        district_vector = [1 if col == district else 0 for col in district_cols]
        input_vector = [total_squaremeter, room, living_room, bath, balcony] + district_vector
        input_array = np.array(input_vector).reshape(1, -1)
        scaled_input = scaler.transform(input_array)
        prediction = model.predict(scaled_input)[0]
        return jsonify({
            'success': True,
            'prediction': f'{prediction:,.2f} TL'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
