# SmartReceipts

SmartReceipts is a project that allows users to upload their supermarket receipts and extract important information, such as item names and prices, into an Excel sheet. The project uses Google's Vision API for text extraction and a large language model from Hugging Face to categorize spending into various categories.

## Features

Text Extraction: SmartReceipts uses Google's Vision API to extract text from uploaded supermarket receipts.

Data Formatting: The extracted text is formatted and organized into an Excel sheet for easy viewing and analysis.

Category Overview: SmartReceipts provides an overview of spending on various categories such as Apparel, Electronics, Food, Finance, Medical, Supplies, Toys, and Others.


## Technologies Used
```
Frontend: ReactJS

Backend: Node.js, Express.js

Text Extraction: Google's Vision API

Category Overview: Hugging Face's large language model
```
## Getting Started

### To get started with SmartReceipts, follow these steps:

1. Clone the repository: git clone https://github.com/bhavyom-singh/SmartReceipts.git
2. Install the required dependencies for the frontend and backend:
```
        Frontend: cd frontend && npm install

        Backend: cd backend && npm install
```
3. Set up Google's Vision API as per their documentation, or if you get lost, read this medium article about the setup [here](https://medium.com/analytics-vidhya/setting-up-google-cloud-vision-api-with-node-js-db29d1b6fbe2)
4. Once the setup is complete, save the JSON file with Google's API key, which is downloaded in the last step in the folder named server.
5. Create a .env file in the server folder, open it, and set GOOGLE_APPLICATION_CREDENTIALS to the path of Google's API key file.
6. I am using the default Hugging Face's language model for zero-shot classification, so no installation is required(npm install took care of it already).
7. Run the frontend and backend servers:
```
        Frontend: cd frontend && npm start

        Backend: cd backend && npm run start
```
8. Upload your supermarket receipt through the front end and wait for the extraction and formatting.
9. Download the Excel sheet with the extracted information.

### Major Dependencies
```
Frontend:
    React: npm install react
    Axios (for making API requests): npm install axios
Backend:
    Express: npm install express
    Multer (for handling file uploads): npm install multer
Text Extraction: Google Cloud Vision API
Category Overview: Hugging Face Transformers
```
## Acknowledgments

Thank you to Google for providing the Vision API.

Thank you to Hugging Face for providing the language model.

