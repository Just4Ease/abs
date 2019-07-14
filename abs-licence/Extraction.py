import os
from pymvrd import Mvrd
from preprocess import PreProcess
from deepMachine import DeepMachineLearning
from ocr import OCROnObjects
from textclassification import TextClassification
import argparse
from datetime import datetime
import plotting
import time
import numpy as np
import math

# from dbAspect import DBConnection

imagepath = './car.jpg'
listRow = 0
listResult = ''

ap = argparse.ArgumentParser()
ap.add_argument("-u", "--url", type=str, required=True, help="Link to image")
args = vars(ap.parse_args())
url = args['url']


# instantiate the db connection
# db_aspect = DBConnection()

def license_plate_extract(plate_like_objects, pre_process):
    number_of_candidates = len(plate_like_objects)

    if number_of_candidates == 0:
        # wx.MessageBox("License plate could not be located",
        #               "Plate Localization", wx.OK | wx.ICON_ERROR)
        #print("Licence Plate Could Not Be Located")
        return []

    if number_of_candidates == 1:
        license_plate = pre_process.inverted_threshold(plate_like_objects[0])
    else:
        license_plate = pre_process.validate_plate(plate_like_objects)

    return license_plate


def execute_ALPR():
    """
    runs the full license plate recognition process.
    function is called when user clicks on the execute button on the gui
    """

    # time the function execution
    start_time = time.time()

    root_folder = os.path.dirname(os.path.realpath(__file__))
    models_folder = os.path.join(root_folder, 'ml_models')

    # import requests

    # r = requests.get(url, auth=('admin', 'admin'))
    # file = open(imagepath, "w")
    # file.write(r.content)
    # file.close()
    imagepath=url
    pre_process = PreProcess(imagepath)


    plate_like_objects = pre_process.get_plate_like_objects()
    # plotting.plot_cca(pre_process.full_car_image,
    #     pre_process.plate_objects_cordinates)

    license_plate = license_plate_extract(plate_like_objects, pre_process)

    if len(license_plate) == 0:
        return False

    ocr_instance = OCROnObjects(license_plate)

    if ocr_instance.candidates == {}:
        # print("No Characters Was Segmented")
        # wx.MessageBox("No character was segmented",
        #     "Character Segmentation" ,wx.OK|wx.ICON_ERROR)
        return False

    # plotting.plot_cca(license_plate, ocr_instance.candidates['coordinates'])

    deep_learn = DeepMachineLearning()
    text_result = deep_learn \
        .learn(ocr_instance.candidates['fullscale'], os.path.join(models_folder, 'SVC_model', 'SVC_model.pkl'),
               (20, 20))

    text_phase = TextClassification()
    scattered_plate_text = text_phase.get_text(text_result)
    plate_text = text_phase.text_reconstruction(scattered_plate_text, ocr_instance.candidates['columnsVal'])

    # print('ALPR process took ' + str(time.time() - start_time) + ' seconds')

    print(plate_text)
    #print (listRow, plate_text)
    # listResult.InsertStringItem(listRow, plate_text)

    # to make use of the vehicle registration database uncomment the next
    # couple of lines and uncomment line 2
    #plate_num = Mvrd(plate_text)
    #details = plate_num.get_data()
    #if details == False or details == {}:
    #     wx.MessageBox("Vehicle Information could not be retrieved",
    #         "Information Retrieval", wx.OK|wx.ICON_ERROR)
    #    return False;
    #print(details)
    # listResult.SetStringItem(listRow, 1, details['Owner Name'])
    # listResult.SetStringItem(listRow, 2, details['Isssue Date'])
    # listResult.SetStringItem(listRow, 3, details['Expiry Date'])
    # listResult.SetStringItem(listRow, 4, details['Chasis Number'])
    # listResult.SetStringItem(listRow, 5, details['Model'])
    # db_aspect.save_alpr(plate_text, str(datetime.today()))


execute_ALPR()
