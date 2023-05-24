const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const dealershipProtoPath = 'dealership.proto';
const carProtoPath = 'car.proto';

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

const clientDealerships = new dealershipProto.DealershipService('localhost:50051', grpc.credentials.createInsecure());
const clientCars = new carProto.CarService('localhost:50052', grpc.credentials.createInsecure());

const resolvers = {
  Query: {
    dealership: (_, { id }) => {
      return new Promise((resolve, reject) => {
        clientDealerships.getDealership({ dealership_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.dealership);
          }
        });
      });
    },
    dealerships: () => {
      return new Promise((resolve, reject) => {
        clientDealerships.searchDealerships({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.dealerships);
          }
        });
      });
    },
    car: (_, { id }) => {
      return new Promise((resolve, reject) => {
        clientCars.getCar({ car_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.car);
          }
        });
      });
    },
    
    cars: () => {
      return new Promise((resolve, reject) => {
        clientCars.searchCars({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.cars);
          }
        });
      });
    },
  },
  Mutation: {
    createDealership: (_, { id, name, description }) => {
      return new Promise((resolve, reject) => {
        clientDealerships.createDealership({ dealership_id: id, name: name, description: description }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.dealership);
          }
        });
      });
    },
  },
};

module.exports = resolvers;
