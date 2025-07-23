from flask_cors import CORS
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from io import BytesIO

app = Flask(__name__)
CORS(app)
model = load_model("model.h5")

# Replace with your actual class names (You can copy them from your notebook: `class_names`)
class_names = ['Apple___Apple_scab',
 'Apple___Black_rot',
 'Apple___Cedar_apple_rust',
 'Apple___healthy',
 'Banana_Cordana',
 'Banana_Healthy',
 'Banana_Pestalotiopsis',
 'Banana_Sigatoka',
 'Cherry_(including_sour)_Powdery_mildew',
 'Cherry_(including_sour)_healthy',
 'Cucumber_Downy_Mildew',
 'Cucumber_Healthy',
 'Cucumber_Powedery_Mildew',
 'Grape___Black_rot',
 'Grape___Esca_(Black_Measles)',
 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
 'Grape___healthy',
 'Guava_Anthracnose',
 'Guava_Dot',
 'Guava_Healthy',
 'Mango_Bacterial Canker',
 'Mango_Gall Midge',
 'Mango_Healthy',
 'Mango_Powdery Mildew',
 'Mango_Sooty Mould',
 'Peach___Bacterial_spot',
 'Peach___healthy',
 'watermelon___downy_mildew',
 'watermelon___healthy',
 'watermelon___mosaic_virus']

pesticide_recommendations = {
    'Apple___Apple_scab': 'Use Captan or Mancozeb-based fungicides regularly during early season',
    'Apple___Black_rot': 'Apply Thiophanate-methyl or Mancozeb',
    'Apple___Cedar_apple_rust': 'Use Myclobutanil or Fenarimol; remove nearby junipers if possible',
    'Apple___healthy': 'None',

    'Banana_Cordana': 'Use Benomyl or Carbendazim fungicides',
    'Banana_Healthy': 'None',
    'Banana_Pestalotiopsis': 'Apply Chlorothalonil or Copper-based fungicides',
    'Banana_Sigatoka': 'Use Propiconazole or Difenoconazole for control',

    'Cherry_(including_sour)_Powdery_mildew': 'Apply Sulfur or Potassium bicarbonate; use systemic fungicides like Myclobutanil',
    'Cherry_(including_sour)_healthy': 'None',

    'Cucumber_Downy_Mildew': 'Use Copper fungicides or Chlorothalonil; rotate fungicides to prevent resistance',
    'Cucumber_Healthy': 'None',
    'Cucumber_Powedery_Mildew': 'Apply sulfur, potassium bicarbonate, or triflumizole',

    'Grape___Black_rot': 'Use Mancozeb, Captan, or Ziram at pre-bloom stages',
    'Grape___Esca_(Black_Measles)': 'No curative pesticide; use pruning to remove infected wood',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': 'Use Dithane M-45 or Mancozeb-based fungicides',
    'Grape___healthy': 'None',

    'Guava_Anthracnose': 'Apply Copper oxychloride or Carbendazim',
    'Guava_Dot': 'Use Carbendazim or Chlorothalonil',
    'Guava_Healthy': 'None',

    'Mango_Bacterial Canker': 'Apply Streptomycin sulfate or Copper oxychloride',
    'Mango_Gall Midge': 'Use Dimethoate or Imidacloprid sprays at early infestation',
    'Mango_Healthy': 'None',
    'Mango_Powdery Mildew': 'Use Sulfur-based fungicides or systemic fungicides like Hexaconazole',
    'Mango_Sooty Mould': 'Control underlying pests with Imidacloprid; clean leaves with neem oil',

    'Peach___Bacterial_spot': 'Apply Oxytetracycline or Copper hydroxide early in the season',
    'Peach___healthy': 'None',

    'watermelon___downy_mildew': 'Use Metalaxyl-M, Mancozeb, or Chlorothalonil',
    'watermelon___healthy': 'None',
    'watermelon___mosaic_virus': 'Use Imidacloprid to control aphid vectors; remove infected plants'
}

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    img_bytes = file.read()
    img = image.load_img(BytesIO(img_bytes), target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    

    predictions = model.predict(img_array)
    predicted_class = class_names[np.argmax(predictions[0])]
    confidence = round(float(np.max(predictions[0])) * 100, 2)
    pesticide = pesticide_recommendations.get(predicted_class, "No recommendation available")


    return jsonify({
        "predicted_class": predicted_class,
        "confidence": f"{confidence}%",
        "pesticide": pesticide
    })

if __name__ == '__main__':
    app.run(debug=True)