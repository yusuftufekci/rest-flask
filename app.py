from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import request, jsonify
import pymysql





app = Flask(__name__)









@app.route('/', methods=['GET', 'POST'])
def home():
    var = "nolurrrr
  
    return var

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
