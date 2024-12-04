// const express = require('express');
// const multer = require('multer');
// const mysql = require('mysql2');
// const { BlobServiceClient } = require('@azure/storage-blob');
// const cors = require('cors');
// const path = require('path');

// const app = express();
// const upload = multer();
// app.use(cors());


// const connection = mysql.createConnection({
//     host: 'serverkapil.mysql.database.azure.com',
//     user: 'kapil',
//     password: 'BajrangBali@9411',
//     database: 'file_upload',
//     ssl: { rejectUnauthorized: false }
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL: ', err);
//         return;
//     }
//     console.log('Connected to MySQL');
// });

// // Azure Blob Storage
// const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=projectkapil;AccountKey=IL3cZRpnBL7yX4Ud1g5q19xPsMBR+I285eVxMdLt2fpLNe6C6UO4wMv2V1ozT8RJOQ5tZRqRHu5k+AStxaPkvw==;EndpointSuffix=core.windows.net";
// const containerName = "new";
// const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
// const containerClient = blobServiceClient.getContainerClient(containerName);

// app.post('/upload', upload.single('file'), async (req, res) => {
//     try {
//         const file = req.file;

//         // Upload to Azure Blob Storage
//         const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);
//         await blockBlobClient.uploadData(file.buffer);
        
//         // Store metadata in MySQL
//         const query = 'INSERT INTO file_metadata (name, type, size) VALUES (?, ?, ?)';
//         const values = [file.originalname, file.mimetype, file.size];
//         connection.query(query, values, (err, results) => {
//             if (err) {
//                 console.error('Error storing file metadata: ', err);
//                 return res.status(500).send('Error storing file metadata');
//             }
//             console.log('File metadata stored successfully');
//             res.send('File uploaded successfully');
//         });

//     } catch (error) {
//         console.error('Error uploading file: ', error);
//         res.status(500).send('Error uploading file');
//     }
// });

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });


const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');
const cors = require('cors');
const path = require('path');

const app = express();
const upload = multer();
app.use(cors());

const connection = mysql.createConnection({
    host: 'serverkapil.mysql.database.azure.com',
    user: 'kapil',
    password: 'BajrangBali@9411',
    database: 'file_upload',
    ssl: { rejectUnauthorized: false }
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL');
});

const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=projectkapil;AccountKey=IL3cZRpnBL7yX4Ud1g5q19xPsMBR+I285eVxMdLt2fpLNe6C6UO4wMv2V1ozT8RJOQ5tZRqRHu5k+AStxaPkvw==;EndpointSuffix=core.windows.net";
const accountName = "projectkapil";
const accountKey = "IL3cZRpnBL7yX4Ud1g5q19xPsMBR+I285eVxMdLt2fpLNe6C6UO4wMv2V1ozT8RJOQ5tZRqRHu5k+AStxaPkvw==";
const containerName = "new";
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        // Upload to Azure Blob Storage
        const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);
        await blockBlobClient.uploadData(file.buffer);
        const fileUrl = blockBlobClient.url;

        // Store metadata in MySQL
        const query = 'INSERT INTO file_metadata (name, type, size, url) VALUES (?, ?, ?, ?)';
        const values = [file.originalname, file.mimetype, file.size, fileUrl];
        connection.query(query, values, (err, results) => {
            if (err) {
                console.error('Error storing file metadata: ', err);
                return res.status(500).send('Error storing file metadata');
            }
            console.log('File metadata stored successfully');
            res.send('File uploaded successfully');
        });

    } catch (error) {
        console.error('Error uploading file: ', error);
        res.status(500).send('Error uploading file');
    }
});

app.get('/metadata', (req, res) => {
    const query = 'SELECT * FROM file_metadata';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving file metadata: ', err);
            return res.status(500).send('Error retrieving file metadata');
        }
        res.json(results);
    });
});

app.get('/download', async (req, res) => {
    try {
        const fileName = req.query.fileName;

        // Generate SAS token for the file
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        const sasToken = generateBlobSASQueryParameters({
            containerName,
            blobName: fileName,
            permissions: BlobSASPermissions.parse("r"),
            expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour expiration
        }, sharedKeyCredential).toString();

        const sasUrl = `${blockBlobClient.url}?${sasToken}`;
        res.json({ url: sasUrl });
    } catch (error) {
        console.error('Error generating SAS token: ', error);
        res.status(500).send('Error generating SAS token');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
