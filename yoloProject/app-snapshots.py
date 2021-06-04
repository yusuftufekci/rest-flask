from flask import Flask
from flask import send_file

app = Flask(__name__)

@app.route('/yemekhane', methods=['GET', 'POST'])
def foto():
    return send_file('/Users/yusuftufekci/Desktop/Yolo/yoloProject/snapshots/snapshot2.jpeg',
                     download_name='snapshot2b.jpeg')
@app.route('/servis', methods=['GET', 'POST'])
def foto2():
    return send_file('/Users/yusuftufekci/Desktop/Yolo/yoloProject/snapshots/snapshot1.jpeg',
                     download_name='snapshot1.jpeg')


if __name__ == '__main__':

    # app.run()
    app.run()