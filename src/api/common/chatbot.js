// /api/common/chatbot.js
//터미널(명령프롬프트 터미널)에서 npm install openai 실행함
//packge.json 안에 dependencies 항목 안에 openai 추가된 것 확인함

//OpenAI API 키를 .env.local 파일에 저장합니다. 
//프로젝트 루트에 .env.local 파일을 생성하고 다음 한줄의 내용을 추가합니다.
//OPENAI_API_KEY=your_openai_api_key_here

import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  const { message } = req.body;

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    const responseMessage = completion.data.choices[0].message.content;
    res.status(200).json({ message: responseMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
  }
}
