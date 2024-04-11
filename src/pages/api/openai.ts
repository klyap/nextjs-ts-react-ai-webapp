// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from 'openai';

export const config = {
  api: {
    externalResolver: true,
  },
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


type Message = OpenAI.Chat.Completions.ChatCompletionMessageParam;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const systemPrompt = ``;
  const messages = req.body.messages as Message[];

  return openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      ...messages
      // { role: "user", content: userMessage }
    ],
    model: process.env.OPENAI_MODEL_NAME || '', // "gpt-3.5-turbo"
  }).then(
    (completion) => {
      let data = completion.choices[0].message.content || ''
      res.status(200).json(data);
    }
  ).catch((error) => {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  });
}
