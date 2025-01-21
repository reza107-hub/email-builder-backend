// require
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

const port = 4000;

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// middleware
const app = express();
app.use(cors());
app.use(express.json());

// Store HTML template in memory
let emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            font-family: Arial, sans-serif;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px
        }
        .logo {
            width: 150px;
            height: auto;
            margin-bottom: 20px;
            border-radius: 9999px;
        }
        .email-title {
            color: {{titleColor}};
            font-size: {{titleFontSize}};
            text-align: {{titleAlign}};
            font-weight: {{titleFontWeight}};
            width: 100%;
            word-break: break-all;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        .email-body {
            color: {{contentColor}};
            font-size: {{contentFontSize}};
            text-align: {{contentAlign}};
            font-weight: {{contentFontWeight}};
            width: 100%;
            word-break: break-all;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <img class="logo" src="{{logoUrl}}" alt="Company Logo">
        <h1 class="email-title">{{title}}</h1>
        <div class="email-body">{{body}}</div>
    </div>
</body>
</html>
`;

// Modified function to handle buffer instead of file path
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'email-builder',
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        const bufferStream = new Readable();
        bufferStream.push(buffer);
        bufferStream.push(null);
        bufferStream.pipe(uploadStream);
    });
};

// api
app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/getEmailLayout', (req, res) => {
    res.json({ layout: emailTemplate });
});

// Modified upload endpoint to handle buffer
app.post('/api/uploadImage', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        res.json({
            imageUrl: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Error uploading file',
            details: error.message
        });
    }
});

app.post('/api/updateConfig', (req, res) => {
    const {
        title,
        body,
        logoUrl,
        titleSettings,
        contentSettings
    } = req.body;

    const updatedHtml = emailTemplate
        .replace('{{logoUrl}}', logoUrl || '')
        .replace('{{title}}', title || '')
        .replace('{{body}}', body || '')
        .replace('{{titleColor}}', titleSettings.color)
        .replace('{{titleFontSize}}', titleSettings.fontSize)
        .replace('{{titleAlign}}', titleSettings.textAlign)
        .replace('{{titleFontWeight}}', titleSettings.fontWeight)
        .replace('{{contentColor}}', contentSettings.color)
        .replace('{{contentFontSize}}', contentSettings.fontSize)
        .replace('{{contentAlign}}', contentSettings.textAlign)
        .replace('{{contentFontWeight}}', contentSettings.fontWeight);

    res.json({ html: updatedHtml });
});

app.post('/api/renderAndDownloadTemplate', (req, res) => {
    const { title, body, logoUrl, titleSettings, contentSettings } = req.body;

    const renderedHtml = emailTemplate
        .replace('{{logoUrl}}', logoUrl || '')
        .replace('{{title}}', title || '')
        .replace('{{body}}', body || '')
        .replace('{{titleColor}}', titleSettings.color)
        .replace('{{titleFontSize}}', titleSettings.fontSize)
        .replace('{{titleAlign}}', titleSettings.textAlign)
        .replace('{{titleFontWeight}}', titleSettings.fontWeight)
        .replace('{{contentColor}}', contentSettings.color)
        .replace('{{contentFontSize}}', contentSettings.fontSize)
        .replace('{{contentAlign}}', contentSettings.textAlign)
        .replace('{{contentFontWeight}}', contentSettings.fontWeight);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', 'attachment; filename=emailTemplate.html');
    res.send(renderedHtml);
});

app.listen(port, () => { console.log(`Server is running on port ${port}`) });
