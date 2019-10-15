# modified from: https://github.com/simonw/cougar-or-not
# also see: https://medium.com/backticks-tildes/dockerizing-a-flask-application-2b17ca9c1d1c
from pathlib import Path
from io import BytesIO
import sys
import json

from fastai.vision import (
    ImageDataBunch,
    cnn_learner,
    open_image,
    get_transforms,
    models,
)
from fastai.vision import *
from flask import Flask, render_template, request
from pathlib import Path

model_url = 'https://drive.google.com/open?id=1B7LpFWqcviYw61KZuozZouBrGMUAg49t'

app = Flask(__name__)
path = Path('./')
learn = load_learner(path)
defaults.device = torch.device('cpu')  # try inference with cpu

import requests
from io import BytesIO
import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)
from pprint import pprint
@app.route('/upload', methods=['GET', 'POST'])
def upload():
    app.logger.info("CJT")
    if request.method == 'POST':
        data = request.data  # already in bytes? 
        predictions = predict_image_from_bytes(data)
        pprint(predictions)
        return json.dumps({'success':True, 'label':'soup',**predictions}), 200, {'ContentType':'application/json'} 
    return json.dumps({'label': 'upload failed'})

@app.route('/classify_url', methods=['GET','POST'])
def classify_url():
    print('classify url')
    if request.method == "POST":
        # get url that the user has entered
        url = request.data
        response = requests.get(url)
        img_bytes = BytesIO(response.content)
        predictions = predict_image_from_bytes(response.content)
        pprint(predictions)
        return json.dumps({'success':True, 'label':'soup',**predictions}), 200, {'ContentType':'application/json'} 
    return json.dumps({'label': 'upload failed'})


def predict_image_from_bytes(bytes):
    img = open_image(BytesIO(bytes))
    _, _, losses = learn.predict(img)
    return {"predictions": sorted(
            zip(learn.data.classes, map(float, losses)),
            key=lambda p: p[1],
            reverse=True
            )}

@app.route("/")
def home():
    return render_template('index.html')


if __name__ == "__main__":
    logger.info("Starting Flask server!")
    app.run(host='0.0.0.0', port=8008, debug=True)

