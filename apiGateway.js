const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const dealershipProtoPath = 'dealership.proto';
const carProtoPath = 'car.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const app = express();
app.use(bodyParser.json());

const dealershipProtoDefinition = protoLoader.loadSync(dealershipProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const carProtoDefinition = protoLoader.loadSync(carProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const dealershipProto = grpc.loadPackageDefinition(dealershipProtoDefinition).dealership;
const carProto = grpc.loadPackageDefinition(carProtoDefinition).car;

const clientDealerships = new dealershipProto.DealershipService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);
const clientCars = new carProto.CarService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
  app.use(cors(), bodyParser.json(), expressMiddleware(server));
});

app.get('/dealerships', (req, res) => {
  clientDealerships.searchDealerships({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.dealerships);
    }
  });
});

app.post('/dealership', (req, res) => {
  const { id, name, description } = req.body;
  clientDealerships.createDealership(
    { dealership_id: id, name: name, description: description },
    (err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response.dealership);
      }
    }
  );
});

app.get('/dealerships/:id', (req, res) => {
  const id = req.params.id;
  clientDealerships.getDealership({ dealership_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.dealership);
    }
  });
});

app.get('/cars', (req, res) => {
  clientCars.searchCars({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.cars);
    }
  });
});

app.get('/cars/:id', (req, res) => {
  const id = req.params.id;
  clientCars.getCar({ car_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.car);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
