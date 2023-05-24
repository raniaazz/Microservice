const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const carProtoPath = 'car.proto';
const carProtoDefinition = protoLoader.loadSync(carProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const carProto = grpc.loadPackageDefinition(carProtoDefinition).dealership;

const carService = {
  getCar: (call, callback) => {
    const car = {
      id: call.request.car_id,
      name: 'Example Car',
      description: 'This is an example car.',
    };
    callback(null, { car });
  },
  searchCars: (call, callback) => {
    const { query } = call.request;

    const cars = [
      {
        id: '1',
        name: 'Example Car 1',
        description: 'This is the first example car.',
      },
      {
        id: '2',
        name: 'Example Car 2',
        description: 'This is the second example car.',
      },
    ];
    callback(null, { cars });
  },
};

const server = new grpc.Server();
server.addService(carProto.CarService.service, carService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to bind server:', err);
    return;
  }

  console.log(`Server is running on port ${port}`);
  server.start();
});
console.log(`Car microservice running on port ${port}`);
