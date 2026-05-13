const io = require('socket.io-client');

async function runTest() {
  console.log('1. Autenticando para obter Token JWT...');
  const authRes = await fetch('http://127.0.0.1:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@imip.org', password: '123' })
  });
  const authData = await authRes.json();
  
  if (!authData.token) {
    console.error('Falha na autenticação', authData);
    return;
  }
  
  const token = authData.token;
  console.log('✅ Token obtido:', token.substring(0, 20) + '...');

  const patientId = 'paciente_test_1';

  console.log('2. Conectando ao WebSocket do API Gateway...');
  const socket = io('http://127.0.0.1:8080');
  
  socket.on('connect', () => {
    console.log('✅ Conectado ao WebSocket com ID:', socket.id);
  });

  socket.on(`patient_events_${patientId}`, (data) => {
    console.log('\n🎉 EVENTO WEBSOCKET RECEBIDO DA IA:');
    console.log(JSON.stringify(data, null, 2));
    console.log('\nTeste concluído com sucesso!');
    process.exit(0);
  });

  console.log('3. Solicitando geração de historinha na fila do RabbitMQ...');
  const progressRes = await fetch('http://127.0.0.1:8080/api/progress/task-complete', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      patientId: patientId,
      taskId: 'alfabeto_1',
      difficulty: 2,
      theme: 'dinossauros e astronautas no espaço'
    })
  });
  const progressData = await progressRes.json();
  console.log('✅ Resposta da API:', progressData);
  console.log('Aguardando a IA do OpenAI processar (RabbitMQ -> FastAPI -> Gateway -> WebSocket)...');
  
  setTimeout(() => {
    console.error('❌ Tempo esgotado (15s). A IA não respondeu ou houve falha de roteamento.');
    process.exit(1);
  }, 15000);
}

runTest().catch(console.error);
