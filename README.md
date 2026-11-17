# Plataforma PRECE

Plataforma escolar responsiva para apoiar a aprendizagem cooperativa, as rotinas de estudo e a comunicação da comunidade PRECE. A interface está em português do Brasil e prioriza o uso em celular.

## Perfis

- **Aluno (`ALUNO`)**: página inicial com visão da rotina e navegação para as áreas da plataforma.
- **Professor (`PROFESSOR`)**: página inicial com visão geral pedagógica.
- **Administrador (`ADMIN`)**: página inicial de gestão e área **Pessoas e acessos** para criar contas.

Todos os perfis autenticados usam a mesma estrutura de navegação: menu lateral em computadores e drawer à esquerda em celulares. As páginas iniciais variam conforme o perfil.

## Estado das páginas

As páginas públicas disponíveis são Início, Sobre, Contato, Login e Recuperação de senha. Após o login, cada perfil acessa sua página inicial; o Administrador também pode acessar Pessoas e acessos.

As demais opções do menu permanecem visíveis, mas abrem a mensagem **“Esta página está em construção”**. Isso inclui calendário dentro da área autenticada, tarefas, materiais, grupos, metas, autoavaliação/mentoria, relatórios, mural e perfil. O calendário público da página Início continua disponível.

## Como rodar

```bash
# 1. Banco de dados local
docker compose up -d

# 2. Backend Spring Boot em http://localhost:8080
cd backend && ./mvnw spring-boot:run

# 3. Frontend Vite em http://localhost:5173
cd frontend && npm install && npm run dev
```

O backend cria um administrador inicial (`admin@prece.org` / `admin12345`), configurável por `PRECE_ADMIN_EMAIL` e `PRECE_ADMIN_SENHA`. Defina `PRECE_JWT_SECRET` com pelo menos 32 caracteres fora do ambiente de desenvolvimento.

O administrador cria contas de Aluno e Professor em **Pessoas e acessos**. O sistema gera uma senha temporária que deve ser copiada e enviada ao usuário. No primeiro login, o usuário completa seus dados e define uma senha pessoal com pelo menos 12 caracteres, uma letra maiúscula, um número e um caractere especial. Não há cadastro público.

Para publicar uma versão PWA, gere o build do frontend e hospede `frontend/dist` em HTTPS. O service worker guarda a interface básica para abrir novamente sem conexão; ele não sincroniza dados da API nem guarda respostas privadas.

## Cobertura atual

| Área | Comportamento atual |
|---|---|
| Login, contas administrativas, primeiro acesso e perfil | API Spring Boot, JWT e papéis de acesso; perfil e primeiro acesso são gravados no servidor |
| Usuários e acessos | API Spring Boot para listar e criar contas; senha temporária exibida uma única vez |
| Calendário público | API Spring Boot para listar eventos |
| Páginas iniciais por perfil | Interface disponível; indicadores e alguns conteúdos usam dados demonstrativos no navegador |
| Demais páginas autenticadas | Temporariamente substituídas pela tela “Esta página está em construção” |
| Instalação PWA | Manifest e cache do app shell; sem sincronização offline de dados |

Dados demonstrativos não representam registros reais da escola nem são compartilhados entre contas e dispositivos. As páginas temporariamente bloqueadas ainda não fazem parte do escopo funcional desta entrega.

## API disponível

| Método | Rota | Acesso |
|---|---|---|
| `POST` | `/api/auth/login` | Público |
| `GET` | `/api/auth/me` | Autenticado |
| `GET`, `POST` | `/api/admin/users` | `ADMIN`; criação retorna a senha temporária uma única vez |
| `PUT` | `/api/usuarios/me` | Autenticado; conclui primeiro acesso ou atualiza perfil |
| `GET` | `/api/eventos?start_date=&end_date=` | Público |
| `POST`, `PUT`, `DELETE` | `/api/eventos[/{id}]` | `PROFESSOR` ou `ADMIN` |

## Próximos passos

1. Implementar e validar as páginas autenticadas que hoje estão em construção.
2. Sincronizar tarefas, materiais, grupos, metas e autoavaliações em endpoints do backend.
3. Conectar materiais a armazenamento de arquivos e definir limites para evidências leves.
4. Definir notificações e sincronização offline sem armazenar respostas privadas no cache do service worker.
5. Validar os fluxos com estudantes, professores e coordenação do PRECE.
