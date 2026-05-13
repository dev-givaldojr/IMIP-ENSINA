# Architecture Trade-offs (TRADEOFFS.md)

## 1. Segurança Rigorosa vs. Performance

- **O Trade-off**: Criptografar e descriptografar dados clínicos toda vez que um perfil for acessado custa ciclos de CPU, o que aumenta sutilmente o tempo de resposta das requisições na API.
- **Mitigação**: Utilizamos o cache distribuído (Redis) para manter informações não sensíveis que são consultadas frequentemente (ex: barra de XP do paciente, avatar e streak de ofensiva), não impactando a experiência de gamificação que precisa ser ágil. Os dados restritos e criptografados só são buscados sob demanda pontual do Professor.

## 2. Latência da IA vs. Experiência de Usuário (UX)

- **O Trade-off**: Respostas de IA Generativa de alta qualidade demoram mais. No meio de uma lição interativa com uma criança, esperas longas quebram o engajamento e a imersão.
- **Mitigação**: 
  1. A comunicação para gerar a base da história é síncrona (acontece no início, talvez durante uma tela de "Carregando a sua aventura...").
  2. Geração das imagens é estritamente **assíncrona**. A criança começa a ler e interagir enquanto a ilustração correspondente é renderizada em background.
  3. Durante qualquer demora, o mascote ("Luminho") se mantém animado, dando instruções curtas para mascarar a latência da rede e garantir o dinamismo (estilo Duolingo).

## 3. Monorepo (por Pastas) vs. Multi-repo

- **O Trade-off**: Colocar todos os serviços no mesmo repositório facilita o desenvolvimento inicial, rodar o `docker-compose` de forma integrada, e compartilhar a cultura técnica. Porém, à medida que a plataforma cresce, pode dificultar deploys independentes (CI/CD) se não configurado com ferramentas avançadas (Turborepo, Nx).
- **Mitigação**: Manteremos tudo junto (pastas separadas no mesmo repositório) para o MVP e agilidade de execução, dado o contexto atual, aceitando que futuramente poderemos segmentar o CI/CD por subdiretório.
