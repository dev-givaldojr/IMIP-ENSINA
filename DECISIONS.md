# Architecture Decisions (DECISIONS.md)

Este documento registra as decisões arquiteturais tomadas durante o projeto IMIP Aprende.

## 1. Arquitetura em Microsserviços

**Decisão**: O backend foi estruturado utilizando uma arquitetura baseada em microsserviços.
**Motivo**: 
- Escabilidade independente: Serviços como o `Generative AI Service` podem demandar recursos computacionais diferentes e tempos de resposta maiores (comunicação assíncrona) do que o `Auth Service` ou o `Patient Profile Service`.
- Resiliência: Se o serviço de geração de imagens falhar, o serviço de perfil do paciente e as rotas críticas de login continuam operando.
- Flexibilidade Tecnológica: Permite o uso de FastAPI (Python) para as rotas de IA (devido ao ecossistema rico e integrações nativas) e Node.js para os serviços de I/O intensivo e tempo real.

## 2. Filas Assíncronas para Geração de Imagens (RabbitMQ)

**Decisão**: Utilizar mensageria (RabbitMQ) para comunicação entre os serviços, especialmente ao solicitar a geração de ilustrações para as histórias.
**Motivo**:
- A geração de imagens com IAs Generativas (ex: DALL-E, Imagen) pode ser lenta (segundos). Se a requisição fosse síncrona (HTTP direta), a interface do usuário travava e ocorreria *timeout* no API Gateway.
- Usando RabbitMQ, o serviço de sessão apenas envia o evento "Gerar Imagem", a interface segue operando (talvez mostrando um placeholder ou animação), e quando a imagem fica pronta, um evento é devolvido (ou notificado via WebSocket) para o frontend.

## 3. Estratégia LGPD e Segurança dos Pacientes

**Decisão**: Implementar rígidos padrões de anonimização e criptografia em todas as camadas de dados referentes aos menores de idade.
**Motivo**:
- É uma exigência legal e ética em ambientes hospitalares.
- **Criptografia em repouso**: Os dados sensíveis (histórico médico) no PostgreSQL serão salvos com criptografia AES-256.
- **Anonimização**: Exportação de KPIs não conterá Nomes, CPFs ou Prontuários (ex: mostrará apenas "Paciente A - Idade 8").
- **Exibição Frontend**: Dados clínicos só serão trafegados do backend para o frontend se o JWT do professor for válido e a rota chamada ativamente pelo usuário autorizado. Nenhuma URL conterá o ID real do paciente exposto e logs de servidor não gravarão os "payloads" envolvendo informações de pacientes.
