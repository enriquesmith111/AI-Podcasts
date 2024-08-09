const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors'); // Assuming you keep cors for frontend access
require('dotenv').config(); // Assuming proper .env setup in Netlify


const app = express()
app.use(bodyParser.json());
app.use(cors({ origin: 'https://ai-podcasts.netlify.app/' })); // Replace with your frontend origin

exports.handler = async (event, context) => {
    console.log(` line 12${event}`)
    const req = JSON.parse(event.body); // Parse the request body
    const message = req.message;
    console.log(`line 15 ${message}`)
    console.log(message)
    const res = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://ai-podcasts.netlify.app/',
        },
        body: '',
    };

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            response_format: { type: "json_object" },
            messages: [{
                role: "system",
                content: `Give me 5 more in depth sub-topics conversation, duscussion, debate examples to talk about in the finance subject I provide for my podcast, following this JSON format:
                    {
                        "subtopics": [
                            {
                                "subjecttitle": "Title of Topic",
                                "subjectconversation": "This will be a more complex and detailed help on what topics to discuss and guides on points of interest for this financial discussion.",
                            },
                        ]
                    }`,
            },
            { role: "user", content: message },
            ],
            max_tokens: 700,
        })
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json();
        res.body = JSON.stringify(data);
    } catch (error) {
        console.error(error)
    }
    return res;
}


// LOCAL TESTING
// const PORT = 8001
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();

// const app = express()
// app.use(express.json())
// app.use(cors());

// app.post('/sub-topics', async (req, res) => {

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
//                 content: `Give me 5 more in depth sub-topics conversation, duscussion, debate examples to talk about in the finance subject I provide for my podcast, following this JSON format:
//                     {
//                         "subtopics": [
//                             {
//                                 "subjecttitle": "Title of Topic",
//                                 "subjectconversation": "This will be a more complex and detailed help on what topics to discuss and guides on points of interest for this financial discussion.",
//                             },
//                         ]
//                     }`,
//             },
//             { role: "user", content: req.body.message },
//             ],
//             max_tokens: 700,
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