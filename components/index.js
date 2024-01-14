const express = require('express');
const fetch = require('node-fetch'); // Consider using 'node-fetch' or similar library for HTTP requests
const openai = require('openai')
const app = express();
app.use(express.json());

const wppToken = "EAAJpkLpuZBKIBO2B1SO1bQSk8SsxoXOk9ZAnXNPamP8BhxwZBHdEfcQZCbwp3yaDN2tZAZBYyz1dRD0blLgFPvJJJl1yV8ZA0veFXBJMsExdywVgbNCaOcHD4oSdfYf2oZCkLbxpTVZBxXb9y2CEB953H6vcBQ45KV1GqWNFV4f7qWLd0MJEr9Ljr4R4uOfNKsxpaHrKeXTQqNOVxQthUOU8H"
const openaiUrl = 'https://api.openai.com/v1';
const openaiApiKey = "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";
const assistId = "asst_gqshpzlI9AO1rb5gHjIzzU2m"
app.get('/api/assistants', (req, res) => {
  // Extrai os parâmetros da solicitação
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': verifyToken } = req.query;

  // Verifica se o modo é 'subscribe' e o token de verificação é o esperado
  if (mode === 'subscribe' && verifyToken === '9134c33b1b8fe026df74a85f6e4b56ee') {
    // Responde à solicitação com o valor do hub.challenge
    res.status(200).send(challenge);
  } else {
    // Responde à solicitação com erro se os parâmetros não estiverem corretos
    res.sendStatus(403);
  }
});
app.post('/api/assistants', async (req, res) => {
    const requestBody = req.body; // Use req.body para obter o corpo da solicitação
    const msg = JSON.stringify(requestBody);
  const allOk = req.body && req.body.entry && req.body.entry[0] && req.body.entry[0].changes && req.body.entry[0].changes[0] && req.body.entry[0].changes[0].value && req.body.entry[0].changes[0].value.messages && req.body.entry[0].changes[0].value.messages[0] && req.body.entry[0].changes[0].value.messages[0].text && req.body.entry[0].changes[0].value.messages[0].text.body
   if (allOk) {
    // Acesse o valor "eita" dentro do corpo JSON
    const eitaValue = req.body.entry[0].changes[0].value.messages[0].text.body;
    const fromTo = req.body.entry[0].changes[0].value.messages[0].from;
    const message = await addMessageToThread('thread_98RtfO5QCWvlUk90YtMy47Im', eitaValue)
    const run = await startRun('thread_98RtfO5QCWvlUk90YtMy47Im', 'Você é um assistente de FAQ da fotolux')
    const finalStatus = await checkRunStatus('thread_98RtfO5QCWvlUk90YtMy47Im', run.id);
    const messages = await getThreadMessages('thread_98RtfO5QCWvlUk90YtMy47Im')
     const respGPT =  messages.data[0].content[0].text.value;
   await enviarMensagem(fromTo,respGPT);
    res.send(JSON.stringify({success: "ok"}));
  } else {
    res.status(400).send('Requisição inválida');
  }
  
});

async function checkRunStatus(threadId, runId) {
  let status;

  do {
    // Aguarde por algum tempo antes de fazer a próxima verificação
    await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 segundos

    // Faça uma solicitação para verificar o status da execução
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
        'OpenAI-Beta': 'assistants=v1',
      }
    });
    // Atualize o status
    const res = await response.json();
    
    status = res.status;

    console.log(`Status da execução: ${status}`);
  } while (status !== 'completed');

  // Retorna o status final
  return status;
}

async function createThread() {

  try {
    const response = await fetch(openaiUrl+'/threads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
        'OpenAI-Beta': 'assistants=v1',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Erro na solicitação: ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Erro ao criar uma nova thread:', error.message);
    throw error;
  }
}

async function addMessageToThread(threadId, userMessage) {
  const apiUrl = `${openaiUrl}/threads/${threadId}/messages`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
        'OpenAI-Beta': 'assistants=v1',
      },
      body: JSON.stringify({
        role: 'user',
        content: userMessage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na solicitação: ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Erro ao adicionar mensagem à thread:', error.message);
    throw error;
  }
}

async function startRun(threadId, instructions) {
  const apiUrl = `https://api.openai.com/v1/threads/${threadId}/runs`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1',
      },
      body: JSON.stringify({
        assistant_id: assistId,
        instructions: instructions,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na solicitação: ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Erro ao iniciar execução (run) na thread:', error.message);
    throw error;
  }
}

async function getThreadMessages(threadId) {
  const apiUrl = `https://api.openai.com/v1/threads/${threadId}/messages`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na solicitação: ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Erro ao obter mensagens da thread:', error.message);
    throw error;
  }
}

async function enviarMensagem(fromTo, message) {
  const url = `https://graph.facebook.com/v18.0/232083373313630/messages`;
  const accessToken = wppToken;

  const body = {
    messaging_product: 'whatsapp',
    to: fromTo,
    type: 'text',
    text: {
      body: message
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const saposk = await response.json()
    console.log("responsebody: ", saposk)
    if (response.ok) {
      const responseData = await response.json();
      console.log('Mensagem enviada com sucesso:', responseData);
    } else {
      console.error('Erro ao enviar a mensagem:', response.statusText);
    }
  } catch (error) {
    console.error('Erro durante a requisição:', error);
  }
}


// Outras rotas que lidam com criação de Threads, adição de mensagens, execução de Runs, etc

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});