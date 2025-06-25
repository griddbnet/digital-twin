
# Getting Started

Install and start GridDB, GridDB WebAPI, and NodeJS/NPM v18+ per their respective installation guides.

# Setup and Start Kafka

- Download and untar Kafka 2.12-3.2.0.
- Fetch griddb-kafka-connect from Github (https://github.com/griddb/griddb-kafka-connect) and build per its instructions copying the built JAR to /path/to/kafka/libs
- Install griddb_python using the instructions here: https://docs.griddb.net/gettingstarted/python.html
- Copy the configuration files in /path/to/digital-twin/config/ to /path/to/kakfa/config/
- Start zookeeper and the kafka-server:

```
cd /path/to/kafka
./bin/zookeeper-server-start.sh -daemon config/zookeeper.properties
./bin/kafka-server-start.sh -daemon config/server.properties
```  

- Create containers used by the GridDB Kafka Connector:

```
cd /path/to/digital-twin/src/
python3 ./create-connectors.py
```

- In a sperate terminal, start the GridDB Kafka Connector
```
cd /path/to/kafka
export KAFKA_HOME=/path/to/kafka
export PATH=$KAFKA_HOME/bin
export CLASSPATH=:/usr/share/java/gridstore.jar:/usr/share/java/gridstore-jdbc.jar
./bin/connect-standalone.sh config/connect-standalone.properties config/griddb-sink.properties config/griddb-source.properties
```

# Setup and Start Frontend

To install the dependencies and the start the frontend run:

```
cd frontend/
npm install
npm run dev
```

The Frontend will be available at http://localhost:3000/ but will display errors until Actual and Twin have started producing data.

# Start The Actual & Twin

Install the Kafka Python library:

```
pip3 install kafka-python
```

In seperate terminals, start the twin first:

```
cd /path/to/digital-twin/src
python3 ./twin.py
```

And then the actual:

```
cd /path/to/digital-twin/src
python3 ./actual.py
```

To ensure correct operation, the twin and actual should display console messages of "Heating tank", "Heating flow", or "Cooling" while the terminal that is running the GridDB Kafka Connector should be writing messages to the console such as "Wrote N records to ..."
