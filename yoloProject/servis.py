# import the necessary packages
import numpy as np
import time
import cv2
import os
import pafy
import datetime
import mysql.connector

# construct the argument parse and parse the arguments
personNumber = 0
classname = []
personNumberTempSql = 0

mydb = mysql.connector.connect(
    host="34.68.250.214",
    user="root",
    password="karadeniz",
    database="lecture_schedule1"
)

mycursor = mydb.cursor()

# load the COCO class labels our YOLO model was trained on
labelsPath = "/Users/yusuftufekci/Desktop/Yolo/yoloProject/yolo-coco/coco.names"
LABELS = open(labelsPath).read().strip().split("\n")
# initialize a list of colors to represent each possible class label


weightsPath = "/Users/yusuftufekci/Desktop/Yolo/yoloProject/yolo-coco/yolov3.weights"
configPath = "/Users/yusuftufekci/Desktop/Yolo/yoloProject/yolo-coco/yolov3.cfg"
net = cv2.dnn.readNetFromDarknet(configPath, weightsPath)


video1 = "https://www.youtube.com/watch?v=nFqtN2ri6fA"
cctv_camera = "http://77.243.103.105:8081/mjpg/video.mjpg"
video = pafy.new(video1)
best = video.getbest()
#kyk,street,video2-kısa
#cap = cv2.VideoCapture(best.url)
cap = cv2.VideoCapture("street.mp4")

'''cap.set(3, 300)
cap.set(4, 300)
cap.set(cv2.CAP_PROP_FPS, int(10))'''
while True:
    ret, image = cap.read()
    frame = image.copy()

    (H, W) = image.shape[:2]
    # determine only the *output* layer names that we need from YOLO
    ln = net.getLayerNames()
    ln = [ln[i[0] - 1] for i in net.getUnconnectedOutLayers()]
    # construct a blob from the input image and then perform a forward
    # pass of the YOLO object detector, giving us our bounding boxes and
    # associated probabilities
    blob = cv2.dnn.blobFromImage(image, 1 / 255.0, (416, 416),
                                 swapRB=True, crop=False)
    net.setInput(blob)
    start = time.time()
    layerOutputs = net.forward(ln)
    end = time.time()

    # initialize our lists of detected bounding boxes, confidences, and
    # class IDs, respectively
    boxes = []
    confidences = []
    classIDs = []

    # loop over each of the layer outputs
    for output in layerOutputs:
        # loop over each of the detections
        for detection in output:
            # extract the class ID and confidence (i.e., probability) of
            # the current object detection
            scores = detection[5:]
            classID = np.argmax(scores)
            confidence = scores[classID]
            # filter out weak predictions by ensuring the detected
            # probability is greater than the minimum probability
            if confidence > 0.5:
                # scale the bounding box coordinates back relative to the
                # size of the image, keeping in mind that YOLO actually
                # returns the center (x, y)-coordinates of the bounding
                # box followed by the boxes' width and height
                box = detection[0:4] * np.array([W, H, W, H])
                (centerX, centerY, width, height) = box.astype("int")
                # use the center (x, y)-coordinates to derive the top and
                # and left corner of the bounding box
                x = int(centerX - (width / 2))
                y = int(centerY - (height / 2))
                # update our list of bounding box coordinates, confidences,
                # and class IDs
                boxes.append([x, y, int(width), int(height)])
                confidences.append(float(confidence))
                classIDs.append(classID)
                classname.append(LABELS[classID])

    # apply non-maxima suppression to suppress weak, overlapping bounding
    # boxes

    idxs = cv2.dnn.NMSBoxes(boxes, confidences, 0.5,
                            0.3)

    # ensure at least one detection exists
    if len(idxs) > 0:
        for i in idxs:
            i = i[0]
            box = boxes[i]
            if classIDs[i] == 0:
                label = str(LABELS[classID])

                cv2.rectangle(image, (round(box[0]), round(box[1])), (round(box[0] + box[2]), round(box[1] + box[3])),
                              (0, 0, 0), 2)
                cv2.putText(image, label, (round(box[0]) - 10, round(box[1]) - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                            (0, 0, 0), 2)
                personNumber += 1
    cv2.putText(image, "total: " + str(personNumber), (50, 50), cv2.FONT_HERSHEY_SIMPLEX,
                2, 2, thickness=3)
    if (datetime.datetime.now().second % 5 == 0) or (personNumber > personNumberTempSql + 10):
        now = datetime.datetime.now()
        date_and_time = now.strftime("%Y-%m-%d %H:%M:%S")
        sql = "INSERT INTO people_count (date, number_of_people, camera) VALUES (%s, %s, %s)"
        val = (date_and_time, personNumber, "Servis")
        mycursor.execute(sql, val)
        personNumberTempSql = personNumber
        mydb.commit()
        cv2.imwrite("/Users/yusuftufekci/Desktop/Yolo/yoloProject/snapshots/snapshot1.jpeg", frame)
        time.sleep(0.2)

    personNumber = 0
    cv2.imshow("Servis", image)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
