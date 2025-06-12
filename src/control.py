#!/usr/bin/python3

import griddb_python as griddb
import sys
import random
import datetime
import time

factory = griddb.StoreFactory.get_instance()

argv = sys.argv

try:

    # Get GridStore object
    gridstore = factory.get_store(notification_member="127.0.0.1:10001", cluster_name="myCluster", username="admin", password="admin");

    # When operations such as container creation and acquisition are performed, it is connected to the cluster.
    gridstore.get_container("containerName")
    print("Connect to Cluster")


    conInfo = griddb.ContainerInfo(name="boiler_control_1",
                                   column_info_list=
                                   [["ts", griddb.Type.TIMESTAMP],
                                    ["tstat", griddb.Type.INTEGER]],
                                   type=griddb.ContainerType.COLLECTION,
                                   row_key=True)


    col = gridstore.put_container(conInfo)

    tstat = int(sys.argv[1])
    col.put([datetime.datetime.utcnow(), tstat])
    print("Set tstat=",tstat)

except griddb.GSException as e:
    for i in range(e.get_error_stack_size()):
        print("[", i, "]")
        print(e.get_error_code(i))
        print(e.get_location(i))
        print(e.get_message(i))
