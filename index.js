// require

const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 4000;

// middleware
const app = express();
app.use(cors());
app.use(express.json());



// api
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, ()=>{console.log(`Server is running on port ${port}`)});