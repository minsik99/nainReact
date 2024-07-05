import axios from 'axios';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }
  // console.log(message);

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'OpenAI API key is missing' });
    return;
  }
  //console.log(apiKey);

  const data = {
    model: 'gpt-3.5-turbo',  // 사용할 모델
    messages: [{ role: 'user', content: message.content }],
    max_tokens: 1000,
  };

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    res.status(200).json({ result: response.data.choices[0].message.content });

  } catch (error) {
    console.error('Error generating response from OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error generating response from OpenAI' });
  }
};

export default handler;
