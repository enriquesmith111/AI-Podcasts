const express = require('express');
const cors = require('cors'); // Assuming you keep cors for frontend access
const bodyParser = require('body-parser');
require('dotenv').config(); // Assuming proper .env setup in Netlify

const app = express();

app.use(cors({ origin: 'https://ai-podcasts.netlify.app/' })); // Replace with your frontend origin
app.use(bodyParser.json());
// Adjust CORS configuration if needed (consider using cors library for more control)
// app.use(cors({ origin: 'http://localhost:3000/' }));

exports.handler = async (event, context) => {
    const req = event; // Parse the request body
    const message = req.message;
    console.log(message)

    const res = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            // Adjust CORS headers based on your deployment setup
            'Access-Control-Allow-Origin': 'https://ai-podcasts.netlify.app/',
        },
        body: '',
    };

    try {

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                response_format: { type: "json_object" },
                messages: [{
                    role: "system",
                    content: `I ask you a finance question and you provide JSON object with up to 5 topics for my 2 Person podcast in Spanish: 
                    {
                        "topics": [
                            {
                                "name": "title of the topic",
                                "description": "quick description of the topic in quistion",
                            },
                            "topic": [
                            {
                                "name": "title of the topic",
                                "description": "quick description of the topic in quistion",
                            },
                        ]
                    }`,
                },
                { role: "user", content: message },
                ],
                max_tokens: 600,
            }),
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        res.body = JSON.stringify(data);
    } catch (error) {
        console.error(error);
        // Consider returning a more informative error response to the frontend here
        res.statusCode = 500; // Set appropriate error status code
        res.body = JSON.stringify({ message: 'An error occurred' });
    }

    return res;
};

// Local server testing
// const PORT = 8000
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();

// const app = express()
// app.use(express.json())
// app.use(cors());

// app.post('/topics', async (req, res) => {

//     const options = {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             model: 'gpt-3.5-turbo',
//             response_format: { type: "json_object" },
//             messages: [{
//                 role: "system",
//                 content: `I ask you a finance question and you provide JSON object with up to 5 topics for my 2 Person podcast in Spanish: 
//                     {
//                         "topics": [
//                             {
//                                 "name": "title of the topic",
//                                 "description": "quick description of the topic in quistion",
//                             },
//                             "topic": [
//                             {
//                                 "name": "title of the topic",
//                                 "description": "quick description of the topic in quistion",
//                             },
//                         ]
//                     }`,
//             },
//             { role: "user", content: req.body.message },
//             ],
//             max_tokens: 600,
//         })
//     };

//     try {
//         const response = await fetch('https://api.openai.com/v1/chat/completions', options)
//         const data = await response.json();
//         res.send(data)
//     } catch (error) {
//         console.error(error)
//     }
// })

// app.listen(PORT, () => console.log('your server is running on PORT ' + PORT))

