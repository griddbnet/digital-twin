
# Getting Started

Install and start GridDB, GridDB WebAPI, and NodeJS/NPM v18+ per their respective installation guides.

# Setup and Start Kafka

- Download and untar Kafka 2.12-3.2.0.
- Fetch griddb-kafka-connect from Github and build per it's instructions copying the built JAR to /path/to/kafka/libs
- Copy the configuration files in config/ to /path/to/kakfa/config/
- Start zookeeper and the kafka-server:

```
cd /path/to/kafka
./bin/zookeeper-server-start.sh -daemon config/zookeeper.properties
./bin/kafka-server-start.sh -daemon config/server.properties
```  

- In a sperate terminal, start the GridDB Kafka Connector
```
cd /path/to/kafka
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
python3 ./twin.py
```

And then the actual:

```
python3 ./actual.py
```

To ensure correct operation, the twin and actual should display console messages of "Heating tank", "Heating flow", or "Cooling" while the terminal that is running the GridDB Kafka Connector should be writing messages to the console such as "Wrote N records to ..."
