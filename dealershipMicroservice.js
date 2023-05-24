const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const dealershipProtoPath = 'dealership.proto';
const dealershipProtoDefinition = protoLoader.loadSync(dealershipProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const dealershipProto = grpc.loadPackageDefinition(dealershipProtoDefinition).dealership;

const dealershipService = {
  getDealership: (call, callback) => {

    const dealership = {
      id: call.request.dealership_id,
      name: 'Example Dealership',
      description: 'This is an example dealership.',
  
    };
    callback(null, {dealership});
  },
  searchDealerships: (call, callback) => {
    const { query } = call.request;

    const dealerships = [
      {
        id: '1',
        name: 'Example Dealership 1',
        description: 'This is the first example dealership.',
      },
      {
        id: '2',
        name: 'Example Dealership 2',
        description: 'This is the second example dealership.',
      },

    ];
    callback(null, { dealerships });
  },
  createDealership: (call, callback) => {
    const dealership = {
      id: call.request.dealership_id,
      name: call.request.name,
      description: call.request.description,

    };
    callback(null, {dealership});
  }

};


const server = new grpc.Server();
server.addService(dealershipProto.DealershipService.service, dealershipService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Failed to bind server:', err);
      return;
    }
  
    console.log(`Server is running on port ${port}`);
    server.start();
  });
console.log(`Dealership microservice running on port ${port}`);
