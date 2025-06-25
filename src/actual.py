#!/usr/bin/python3

from kafka import KafkaProducer, KafkaConsumer
import json
import datetime
import time 
import logging
import random
import threading

p=KafkaProducer(bootstrap_servers=['localhost:9092'])

error=False
error_count=0
scfm=0
max_scfm = 2000
ambient = 70
tstat = 200
gpm = 2
temp = ambient
gallons = 50

def control_thread():
    print("Starting control consumer...")
    consumer = KafkaConsumer('src_boiler_control_1',
            bootstrap_servers=['localhost:9092'])

    global tstat
    for message in consumer:
        data = json.loads(message.value.decode('utf-8'))
        print("Data=",data['payload'])
        tstat = data['payload']['tstat']

def add_error():

    global error
    global error_count
    error_count = error_count+1
    if error_count == 30:
        print("resetting error")
        error = not error
        error_count = 0
        
    if error:
        print("Introducing error")
        return 0.75
    else:
        return 1        
        
def calc():
    global temp
    global scfm
    global tstat
    global gpm
    global ambient
    global gallons

    gpm = gpm + random.randrange(-5, 10, 1)/2
    if gpm < 0:
        gpm = 0
    elif gpm > 10:
        gpm = 10

    ambient = ambient + random.randrange(-2, 2, 1)/2
    if ambient < 50:
        ambient = 50
    elif ambient > 90:
        ambient = 90

    if temp < tstat:
        print("Heating tank")
        scfm = max_scfm
        temp = temp + ((( scfm / 96.7 ) * 10000)/ (60*gallons*8.33)*add_error())

    else:
        temp = (gpm*ambient+(gallons-gpm)*temp)/gallons
        if temp > tstat:
            print("Cooling");
            scfm = 0
        else:
            print("heating flow")
            req_btu = 8.33 * gpm * (tstat - ambient) 
            scfm = ((req_btu/10000)*96.7)/add_error()
            temp = tstat
    
    produce()


def produce(usagemodel=None):
    now = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    global temp
    global scfm
    global tstat
    global gpm
    global ambient
    global gallons


    data= {
        "payload": 
        {
            'ts': now,
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
    print("payload=",data['payload'])
    m=json.dumps(data, indent=4, sort_keys=True, default=str)
    p.send("actual_reading_1", m.encode('utf-8'))

if __name__ == '__main__':

    ct = threading.Thread(target=control_thread)
    ct.start()

    while True: 
        if tstat != None:
            calc()
        else:
            print("Tstat is not set")
        time.sleep(60.0) 


