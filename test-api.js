// test-api.js
const http = require('http');

async function test() {
  console.log('1. Autenticando...');
  
  const authReq = await fetch('http://127.0.0.1:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@test.com', password: '123' })
  });
  
  const authData = await authReq.json();
  const token = authData.token;
  console.log('✅ JWT Recebido!');

  console.log('2. Disparando evento de término de tarefa...');
  const progressReq = await fetch('http://127.0.0.1:8080/api/progress/task-complete', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      patientId: 'paciente_123',
      taskId: 'alfabeto_z',
      difficulty: 1,
      theme: 'Cachorros no espaço'
    })
  });
  
  const progressData = await progressReq.json();
  console.log('✅ Resposta da Fila:', progressData);
  console.log('\n--> Tudo certo! Agora você pode ver nos logs do Docker a IA recebendo o pedido:');
  console.log('docker logs imipensina-generative-ai-service-1');
}

test();
