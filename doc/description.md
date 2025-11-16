Requisitos Funcionais — Gripo 2.0 (MVP)
Versão: 0.1 — Escopo MVP (prioridade alta)
Foco em torneios, jogos, agenda do jogador, reservas básicas de quadra, experiência mobile superior (Android/iOS) e pipeline DevOps para entrega contínua.

1. Autenticação e Gestão de Conta (MVP — Alta)
Descrição: permitir que usuários criem e acessem contas de forma simples e segura.
 Funcionalidades:
Registro com e-mail e senha.


Login por e-mail/senha.


Recuperação de senha via e-mail.


Autenticação social (Google / Apple) — opcional no MVP. 


Perfil básico editável: nome, foto, telefone, e-mail.


Critérios de aceitação:
Usuário consegue criar conta e confirmar acesso.


A senha pode ser recuperada com e-mail e link temporário.


Perfil salvo e exibido no app.



2. Perfil do Usuário (MVP — Alta)
Descrição: perfil que agrupa informações mínimas necessárias para participação em torneios e comunicação.
 Funcionalidades:
Foto, nome exibido, telefone (opcional), e-mail.


Visualização de histórico básico: lista de torneios/jogos que participou (vazio inicial).


Critérios de aceitação:
Perfil acessível no menu do app.


Histórico mostra eventos onde o usuário foi inscrito ou jogou.



3. Gestão de Clubes e Quadras (MVP — Alta)
Descrição: cadastro e gerenciamento mínimo de locais (clubes) e suas quadras para alocação de jogos.
 Funcionalidades:
Cadastro de clube: nome, endereço, contato e horário de funcionamento.


Cadastro de quadra: nome/identificador, tipo (ex.: Sr padel), disponibilidade horário padrão, duração mínima de reserva.


Bloqueio temporário de quadra (por manutenção ou evento).


Critérios de aceitação:
Organizador pode criar pelo menos um clube e 1+ quadras.


Quadra criada aparece nas listas ao criar jogos/reservas.



4. Criação e Gestão de Torneios (MVP — Alta)
Descrição: funcionalidade central para criar torneios e gerenciar inscrições e chaves (brackets).
 Funcionalidades:
Criar torneio: nome, descrição, data(s), local (clube), quadras envolvidas, formato (chaveamento), limite de participantes/duplas, taxa de inscrição (opcional).


Publicar torneio: torná-lo visível para inscrição.


Encerrar inscrições manualmente pelo organizador.


Visualização pública do torneio (lista de participantes, chaves quando geradas).


Critérios de aceitação:
O Organizador consegue criar e publicar torneios.


Usuários conseguem ver torneios publicados e detalhes básicos.



5. Inscrições em Torneios (MVP — Alta)
Descrição: permitir que jogadores (ou duplas) se inscrevam em torneios.
 Funcionalidades:
Inscrição individual ou por dupla (cada jogador com perfil).
Pagamento da taxa de inscrição via gateway. (Inicialmente sem gerenciar confirmação de pagamento ou redirecionamento)
Lista de inscritos atualizável e visível ao organizador.
Gerenciamento de status do torneio


Critérios de aceitação:
O jogador consegue inscrever-se em torneios publicados.


Organizador vê atualização da lista de inscritos em tempo real (ou com atualização da API).



6. Geração de Chaves / Bracket (MVP — Alta)
Descrição: geração automática de modelo de chaveamento.
 Funcionalidades:
Gerar chaveamentos padrão ou permitir montagem do chaveamento. (Estudar o assunto)
Permitir modificar o chaveamento e posicionamento dos confrontos.
Exibição da chave no app (fase atual e confrontos futuros).
Critérios de aceitação:
Chave gerada corretamente com participantes e confrontos.
Ajustes simples aplicados antes de confirmar a chave.



7. Agendamento de Jogos / Alocação de Quadras (MVP — Alta)
Descrição: agendar partidas associadas à chave do torneio e mapear para quadras/horários.
 Funcionalidades:
Criar jogo: data, hora estimada, quadra, jogadores/duplas, árbitro (texto).
Evitar double-booking: validação que bloqueia reserva de quadra já ocupada no mesmo horário.
Possibilidade de o organizador ajustar data/hora/quadra manualmente.


Critérios de aceitação:
Jogo criado com quadra e horário válidos.
Sistema rejeita tentativa de criar jogo em quadra já ocupada.



8. Registro de Resultados (MVP — Alta)
Descrição: registrar o resultado final dos jogos para avançar chaves.
 Funcionalidades:
Input de resultado por sets (ex.: 6-3, 6-4) ou apenas vencedor.
Atualização automática do próximo confronto na chave (propagação de vencedor).
Histórico de resultados disponível.


Critérios de aceitação:
Resultado registrado e chave atualizada.


Histórico conserva data/hora e resultado do jogo.



9. Agenda do Jogador / Minha Agenda (MVP — Alta)
Descrição: visão pessoal que mostra próximos jogos e histórico.
 Funcionalidades:
Lista filtrada “Meus próximos jogos”.
Notificação de mudanças (horário, cancelamento, resultado).
Acesso rápido ao local/quadra e adversário.


Critérios de aceitação:
Jogador vê ao menos os próximos 7 dias de jogos atribuídos a ele.
Alteração de jogo por organizador gera notificação.



10. Notificações Push (MVP — Alta)
Descrição: mecanismo básico para avisar jogadores sobre jogos, mudanças e resultados.
 Funcionalidades:
Push in-app (via Firebase/OneSignal): confirmação de inscrição, lembrete 1 hora antes do jogo, notificação de resultado.
Preferência de receber/recusar notificações em perfil.


Critérios de aceitação:
Notificações enviadas no momento correto (ex.: lembrete 1h).
Usuário pode ativar/desativar notificações.



11. Interface e Experiência (MVP — Alta)
Descrição: foco em UI/UX mobile-first, responsiva e estética superior como diferencial competitivo.
 Funcionalidades:
Navegação simples: telas principais (home, torneios, criar torneio, minha agenda, perfil).
Visual limpo, legibilidade, uso consistente de espaçamentos, tipografia e cores.
Transições suaves e feedback de ações (toasts, loaders).


Critérios de aceitação:
Fluxo de inscrição e visualização de jogo completáveis em ≤ 3 telas.
App validado com pelo menos 2 testes de usabilidade (mínimo) durante desenvolvimento.



12. API Backend (MVP — Alta)
Descrição: endpoints REST/GraphQL que suportam as operações do app móvel.
 Funcionalidades mínimas:
Autenticação (login, registro, refresh token).
CRUD para: clubes, quadras, torneios, inscrições, jogos, resultados, usuários.
Endpoints para notificações (webhook/invoke ao serviço de push).


Critérios de aceitação:
Documentação mínima (OpenAPI/Swagger) cobrindo endpoints essenciais.
Testes automatizados básicos para fluxos críticos (autenticação, criar torneio, registrar resultado).



13. DevOps — Build & Release Mobile (MVP — Alta)
Descrição: pipeline que permita builds automáticos para Android e iOS e deploy para testes.
 Funcionalidades:
CI (GitHub Actions / similar) para: lint, testes unitários, build do app (React Native).
Artefatos: APK/Bundle Android e IPA para iOS (TestFlight).
Processo de entrega: deploy automático para ambiente de teste (internal testers) e publicação manual para produção.
Documentação mínima do processo de build e chaves (keystore Android, provisioning profile iOS).


Critérios de aceitação:
Push na branch main dispara pipeline que gera builds instaláveis.
Instrutivo para adicionar testers no TestFlight / Play Store Beta.



14. Infraestrutura Backend (MVP — Média-Alta)
Descrição: infra simples, escalável e barata para suportar MVP.
 Requisitos funcionais:
Banco de dados relacional (Postgres).
API hospedada (Heroku/Railway/Render/AWS Elastic Beanstalk).
Armazenamento de mídia (imagens de perfil) em S3 ou serviço equivalente.
Variáveis de ambiente para configurações (gateway de pagamento, credenciais push).


Critérios de aceitação:
Implantação automatizada com variáveis de ambiente e rollback documentado.
Backup básico do banco (snapshot diário).



15. Exportação de Dados Simples (MVP — Média)
Descrição: capacidade mínima de exportar listas para CSV (participantes e partidas).
 Funcionalidades:
Exportar participantes de um torneio em CSV.


Exportar partidas/jogos em CSV.


Critérios de aceitação:
Arquivo CSV gerado e baixável via painel web do organizador ou endpoint protegido.



16. Regras de Negócio Essenciais (MVP — Alta)
Descrição: regras que o sistema aplica automaticamente para consistência operacional.
 Regras:
Overbooking de quadra é proibido; o sistema valida horário/quadra ao criar jogo.
Chave só pode ser gerada quando número mínimo de participantes for atingido (configurável).
Resultado confirmado pelo organizador/árbitro avança chave — um jogador não pode unilateralmente declarar vencedor para avançar.
Política de cancelamento de inscrição é tratada manualmente pelo organizador no MVP (mensagem de orientação ao usuário).


Critérios de aceitação:
Regras implementadas e cobertas por testes de integração.



Observações e Exclusões do MVP
Rankings avançados (ELO/Glicko), métricas analíticas, auditoria extensa, multi-tenant complexa e políticas de cobrança detalhadas ficam fora do escopo inicial.


Segurança avançada, certificações e conformidade legal completas poderão ser introduzidas nas fases seguintes; entretanto, práticas básicas (HTTPS, senhas hasheadas, proteção contra ataques comuns) devem ser aplicadas desde o início.
