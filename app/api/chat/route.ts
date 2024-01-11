import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';
 
export async function POST(req: Request) {
  const { messages } = await req.json();
 
  messages.push({
    role: 'system',
    content: 'Se alguém te perguntar sobre frete, responda com base no texto a seguir: \n' +
      'Duvidas Frete e Prazo\n' +
      'Resposta padrão pergunta sobre quando será despachado: "Olá, o prazo\n' +
      'estimado de entrega do pedido já inclui todas as etapas do processo de\n' +
      'logística. Atenciosamente."\n' +
      'Olá (nome do cliente), Agradecemos pela sua compra! Quanto à logística,\n' +
      'informamos que a responsabilidade é do Mercado Livre. O prazo estimado de\n' +
      'entrega do seu pedido já considera todas as etapas do processo logístico.\n' +
      'Estamos à disposição para mais esclarecimentos.\n' +
      'Atenciosamente,Equipe Fotolux\n' +
      'Olá! Trabalhamos exclusivamente online, sem ponto de retirada. A gestão\n' +
      'do estoque e entrega é terceirizada pelo Mercado Livre. A maior parte está em\n' +
      'SC, e o restante é distribuído nos depósitos deles em vários estados do Brasil.\n' +
      'Prazo e condições de entrega podem ser consultados na página do produto\n' +
      'ou no carrinho de compras. Estamos à disposição para ajudar!\n' +
      'Equipe Fotolux\n' +
      'Olá! 😊 Queremos compartilhar que nossa operação é exclusivamente online, e\n' +
      'infelizmente, não oferecemos entrega por motoboy, pois todo o processo é gerenciado\n' +
      'pelo Mercado Livre. A maior parte do nosso estoque está em SC, com o restante nos\n' +
      'depósitos deles espalhados pelo Brasil. 🚚 Para conferir prazos e condições de entrega,\n' +
      'sugerimos dar uma olhada na página do produto ou no carrinho de compras. Estamos\n' +
      'à disposição para qualquer outra dúvida ou ajuda que precisar! 🌟 Equipe Fotolux\n' +
      'Que ótimo saber que está tudo bem! Para verificar prazos e valores de entrega, siga os\n' +
      'passos abaixo:\n' +
      '1-Adicione o produto desejado ao carrinho no nosso site.\n' +
      '2-Digite o CEP de destino no campo indicado.\n' +
      '3-O site fornecerá informações sobre a taxa de entrega e a estimativa do prazo de\n' +
      'entrega.\n' +
      'É um processo simples e rápido. Se precisar de mais alguma ajuda ou tiver outras\n' +
      'dúvidas, estou à disposição! 🚚📦😊\n' +
      'Olá! Sim, fazemos envios para todo o Brasil. Fique à vontade para fazer a sua\n' +
      'compra. Estamos à disposição para qualquer outra dúvida. Atenciosamente.\n' +
      'Olá! O prazo de entrega é determinado pelo Mercado Livre e pode variar de acordo\n' +
      'com a sua localidade e a disponibilidade do serviço de entrega. Infelizmente, não tenho\n' +
      'acesso a essa informação específica. Recomendo que você verifique a disponibilidade\n' +
      'do serviço de entrega full e o prazo estimado de entrega durante o processo de\n' +
      'compra. O Mercado Livre é responsável pelo cumprimento do prazo de entrega. Estou\n' +
      'à disposição para ajudar com outras dúvidas. Obrigado!',
  });
  

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,

  });
 
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}