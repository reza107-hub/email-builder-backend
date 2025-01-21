// require

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 4000;

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

// Serve static files from 'uploads' directory
app.use('/uploads', express.static('uploads')); // Add this line

// Make sure uploads directory exists

if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// upload image
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage });



// api
app.get('/', (req, res) => {
    res.send('Hello World');
});

// image post method
app.post('/api/uploadImage', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ imageUrl: `http://localhost:4000/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});

app.get('/api/getEmailLayout', (req, res) => {
    res.json({ layout: emailTemplate });
});

app.post('/api/updateConfig', (req, res) => {
    const {
        title,
        body,
        logoUrl,
        titleSettings,
        contentSettings
    } = req.body;

    // Create HTML with updated content and styles
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
    const { title, body, logoUrl, titleSettings, contentSettings } = req.body

    const renderedHtml = emailTemplate.replace('{{logoUrl}}', logoUrl || '').replace('{{title}}', title || '')
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
})


app.listen(port, () => { console.log(`Server is running on port ${port}`) });