import { NextResponse } from 'next/server';
import OpenAI from 'openai';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {
  const { messages } = await req.json();
  const res = await sendMessageToAssistant(messages)
  return NextResponse.json(res)

}

async function sendMessageToAssistant(message:string) : Promise<string>{
  try {
    const response = await fetch('https://caring-foregoing-surgeon.glitch.me/api/assistants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na solicitação: ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Erro ao enviar mensagem para o assistente:', error);
    throw error;
  }
}