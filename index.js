// require

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const port = process.env.PORT || 4000;

// middleware
const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from 'uploads' directory
app.use('/uploads', express.static('uploads')); // Add this line

// Make sure uploads directory exists
const fs = require('fs');
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
app.post('/api/upload-image', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ imageUrl: `http://localhost:4000/uploads/${req.file.filename}` });
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});

app.listen(port, () => { console.log(`Server is running on port ${port}`) });