#!/usr/bin/python3

from kafka import KafkaConsumer,KafkaProducer
import json
import datetime
import time 
import logging
import random
import threading

last_ts=None
scfm=0
max_scfm = 2000
ambient = 70
tstat = 200
gpm = 2
temp = None
gallons = 50
p=None

def produce():
    global last_ts
    global temp
    global scfm
    global tstat
    global gpm
    global ambient
    global gallons


    ts = datetime.datetime.utcfromtimestamp(last_ts/1000)
    data= {
        "payload": 
        {
            'ts': ts,
            'temp': temp,
            'scfm': scfm,
            'gpm': gpm,
            'ambient': ambient,
            'gallons': gallons,
        },
        "schema": 
        {
            "fields": [ 
                { "field": "ts", "optional": False, "type": "string" },
                { "field": "temp", "optional": False, "type": "float" }, 
                { "field": "scfm", "optional": False, "type": "float" }, 
                { "field": "gpm", "optional": False, "type": "float" }, 
                { "field": "ambient", "optional": False, "type": "float" }, 
                { "field": "gallons", "optional": False, "type": "int32" } 
            ], 
            "name": "boiler", "optional": False, "type": "struct" 
        }    
     }
    print("payload: ", data['payload'])
    print("")
    m=json.dumps(data, indent=4, sort_keys=True, default=str)
    p.send("twin_reading_1", m.encode('utf-8'))


def calc(delta):
    global temp
    global scfm
    global tstat
    global gpm
    global ambient
    global gallons

    if temp < tstat:
        print("Heating tank")
        scfm = max_scfm
        temp = temp + ( ( scfm / 96.7 ) * 10000)/ (60*gallons*8.33)
    else:
        temp = (gpm*ambient+(gallons-gpm)*temp)/gallons
        if temp > tstat:
            print("Cooling");
            scfm = 0
        else:
            print("heating flow")
            #btu_1 = (gallons*8.33)*(tstat-new_temp)
            #print("1=",btu_1, "2=",req_btu)
            req_btu = 8.33 * gpm * (tstat - ambient) 
            scfm = (req_btu/10000)*96.7
            temp = tstat
    
    print("scfm=",scfm,"temp=",temp, "tstat=", tstat, "btu_hr=", ( scfm / 96.7 ) * 10000)
    produce()


def reading_thread():
    print("Starting reading consumer...")
    consumer = KafkaConsumer('src_actual_reading_1',
            bootstrap_servers=['localhost:9092'])

    global temp
    global gpm
    global ambient
    global gallons
    global last_ts
    global scfm

    for message in consumer:
        data = json.loads(message.value.decode('utf-8'))
        print("Data=",data['payload'])

        gpm = data['payload']['gpm']
        ambient = data['payload']['ambient']
        gallons = data['payload']['gallons']

        if last_ts == None:
            temp = data['payload']['temp']
            last_ts = data['payload']['ts']
        else:
            last_ts = data['payload']['ts']
            if tstat == None:
                print("tstat not set")
            else:
                delta = data['payload']['ts'] - last_ts 
                if temp < tstat:
                    print("Heating tank")
                    scfm = max_scfm
                    temp = temp + ( ( scfm / 96.7 ) * 10000)/ (60*gallons*8.33)
                else:
                    temp = (gpm*ambient+(gallons-gpm)*temp)/gallons
                    if temp > tstat:
                        print("Cooling");
                        scfm = 0
                    else:
                        print("heating flow")
                        #btu_1 = (gallons*8.33)*(tstat-new_temp)
                        #print("1=",btu_1, "2=",req_btu)
                        req_btu = 8.33 * gpm * (tstat - ambient) 
                        scfm = (req_btu/10000)*96.7
                        temp = tstat
                print("scfm=",scfm,"temp=",temp, "tstat=", tstat, "btu_hr=", ( scfm / 96.7 ) * 10000)
                produce()


def control_thread():
    print("Starting control consumer...")
    consumer = KafkaConsumer('src_boiler_control_1',
            bootstrap_servers=['localhost:9092'])

    global tstat
    for message in consumer:
        data = json.loads(message.value.decode('utf-8'))
        print("Data=",data['payload'])
        tstat = data['payload']['tstat']
        

if __name__ == "__main__":

    p=KafkaProducer(bootstrap_servers=['localhost:9092'])

    rt = threading.Thread(target=reading_thread)
    rt.start()

    ct = threading.Thread(target=control_thread)
    ct.start() 
