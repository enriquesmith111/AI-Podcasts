// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// require('dotenv').config();

// const app = express();

// app.use(cors());

// exports.handler = async (event, context) => {
//     const req = event; // Access the request object from the event
//     const res = {
//         statusCode: 200, // Set default status code
//         headers: {
//             'Content-Type': 'application/json', // Set default content type
//             'Access-Control-Allow-Origin': '*',
//         },
//         body: '',
//     };

//     try {

//         // Attempt to fetch openAi locations JSON 
//         const optionsJSON = {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 model: 'gpt-3.5-turbo',
//                 response_format: { type: "json_object" },
//                 messages: [{
//                     role: "system",
//                     content: `You provide JSON object with longitude and latitude of up to 7 best cities or places to visit in a country following this JSON format: 
//                     {
//                         "locations": [
//                             {
//                                 "name": "Koror",
//                                 "description": "Koror City is the largest city and the commercial center in Palau, home to about half of the country's population, located on Koror Island",
//                                 "latitude": 7.341944,
//                                 "longitude": 134.479167
//                             },
//                         ]
//                     }`,
//                 },
//                 { role: "user", content: `script` },
//                 ],
//                 max_tokens: 500,
//             })
//         };
//         const responseAIJSON = await fetch('https://api.openai.com/v1/chat/completions', optionsJSON);
//         const aiDataJSON = await responseAIJSON.json();
//         console.log('OpenAI JSON API')


//         res.body = JSON.stringify(aiDataJSON);

//     } catch (error) {
//         console.error('Error fetching countries info:', error);
//         res.statusCode = 500;
//         res.body = JSON.stringify({ message: 'Internal Server Error' });
//     }

//     return res;
// };


// Local server testing
const PORT = 8000
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express()
app.use(express.json())
app.use(cors());

app.post('/topics', async (req, res) => {

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
            { role: "user", content: req.body.message },
            ],
            max_tokens: 600,
        })
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json();
        res.send(data)
    } catch (error) {
        console.error(error)
    }
})

app.listen(PORT, () => console.log('your server is running on PORT ' + PORT))

