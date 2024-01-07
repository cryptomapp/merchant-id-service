# MerchantID Service

## Description

MerchantID Service is a backend service designed to handle merchant data, including uploading images and merchant metadata, and then creating NFTs using the Metaplex protocol. It efficiently handles image and data uploads, validates merchant data, and interfaces with Irys for data persistence.

## Features

- Uploads merchant images and data.
- Validates incoming merchant data according to specified rules.
- Integrates with Irys for storing images and metadata.
- Generates and manages NFTs for each merchant.

## Getting Started

### Dependencies

- Node.js
- Express.js
- Multer for handling `multipart/form-data`.
- Other dependencies listed in `package.json`.

### Installing

1. Clone the repository: `git clone https://github.com/cryptomapp/merchant-id-service.git`
2. Navigate to the project directory: `cd merchant-id-service`
3. Install the necessary packages: `yarn install`

### Configuration

- Set environment variables for Irys integration and other configurations in a `.env` file or your environment.

```
MERCHANT_ID_ISSUER_DEV=[solana-private-key]
```

### Running the Service

1. Start the server: `yarn start`

## Usage

Send a POST request to `/upload` with `multipart/form-data` containing the merchant data and image file. The service will validate, process the data, upload it to Irys, and handle NFT creation.

### Example Request

- Use `curl` or Postman to send a request to `http://localhost:3000/upload`.
- Include the merchant data and image as part of the request body.

## API Reference

### Endpoints

- `POST /upload`: For uploading merchant data and images.
- `POST /fundNode`: For topping up the Irys node.

### Request & Response Formats

- Details on request payload structure and response formats.

## Contributing

If you would like to contribute to this project, please adhere to the following guidelines:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Submit a pull request with a clear description of your changes or feature.

## License

This project is licensed under the MIT - see the LICENSE.md file for details.

## Contact Information

- Project Maintainer: @TwentyOne37
- Project Link: [https://github.com/cryptomapp/merchant-id-service.git](https://github.com/cryptomapp/merchant-id-service.git)
