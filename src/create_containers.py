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

    conInfo = griddb.ContainerInfo(name="actual_reading_1",
                                   column_info_list=
                                   [["ts", griddb.Type.TIMESTAMP],
                                    ["temp", griddb.Type.FLOAT],
                                    ["scfm", griddb.Type.FLOAT],
                                    ["gpm", griddb.Type.FLOAT],
                                    ["ambient", griddb.Type.FLOAT],
                                    ["gallons", griddb.Type.FLOAT]],
                                   type=griddb.ContainerType.TIME_SERIES,
                                   row_key=True)

    col = gridstore.put_container(conInfo)

    conInfo = griddb.ContainerInfo(name="twin_reading_1",
                                   column_info_list=
                                   [["ts", griddb.Type.TIMESTAMP],
                                    ["temp", griddb.Type.FLOAT],
                                    ["scfm", griddb.Type.FLOAT],
                                    ["gpm", griddb.Type.FLOAT],
                                    ["ambient", griddb.Type.FLOAT],
                                    ["gallons", griddb.Type.FLOAT]],
                                   type=griddb.ContainerType.TIME_SERIES,
                                   row_key=True)

    col = gridstore.put_container(conInfo)

    conInfo = griddb.ContainerInfo(name="boiler_control_1",
                                   column_info_list=
                                   [["ts", griddb.Type.TIMESTAMP],
                                    ["tstat", griddb.Type.INTEGER]],
                                   type=griddb.ContainerType.COLLECTION,
                                   row_key=True)


    col = gridstore.put_container(conInfo)


except griddb.GSException as e:
    for i in range(e.get_error_stack_size()):
        print("[", i, "]")
        print(e.get_error_code(i))
        print(e.get_location(i))
        print(e.get_message(i))
