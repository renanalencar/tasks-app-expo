# App de Tarefas (Tasks App)

Um aplicativo simples de lista de tarefas (Tasks app) desenvolvido com **React Native**, **Expo** e **TypeScript**.

## 🚀 Funcionalidades

- **Adicionar Tarefas:** Crie novas tarefas a serem feitas.
- **Visualizar Tarefas:** Lista e rola por todas as tarefas salvas.
- **Atualizar Tarefas:** Edite o texto de uma tarefa existente rapidamente.
- **Excluir Tarefas:** Remova tarefas que já foram concluídas ou que não são mais úteis.
- **Integração com Banco de Dados:** Conecta-se a um backend hospedado (Express) para persistência real de dados.

## 🛠️ Tecnologias Utilizadas

- **React Native** (com Expo SDK)
- **TypeScript** (Tipagem estática que facilita o desenvolvimento)
- **Axios** (Para requisições HTTP para a API)
- **Componentes Nativos:** `ScrollView`, `SafeAreaView`, `TextInput`, `TouchableOpacity`, etc.

## 📦 Como rodar o projeto localmente

### Pré-requisitos

Você vai precisar do **Node.js** instalado na sua máquina. Para testar o aplicativo em um dispositivo físico, instale o aplicativo **Expo Go** no seu celular (Android ou iOS).

### Instalação

1. Acesse o diretório do projeto no seu terminal:
   ```bash
   cd tasks-app-expo
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Inicie o servidor local do Expo:
   ```bash
   npx expo start
   ```

4. **Rodando o aplicativo:**
   - **No celular:** Abra o app **Expo Go** e escaneie o código QR gerado no terminal.
   - **No emulador:** Pressione `a` no terminal para abrir no Android Emulator, ou `i` para o iOS Simulator (apenas macOS).

## 🔌 API e Backend

As requisições (operações CRUD) são feitas no arquivo `src/utils/handle-api.ts`. A URL base já está configurada apontando para um serviço externo (`https://todo-app-express-backend-rtbt.onrender.com`). Caso deseje rodar o backend localmente, basta atualizar a constante `baseURL` neste mesmo arquivo.

## 📂 Estrutura do Projeto

- `App.tsx`: Ponto de entrada do aplicativo, interface principal e gerenciamento da lista de **tarefas** (`tasks`).
- `src/components/Task.tsx`: Componente visual responsável por renderizar cada tarefa individualmente.
- `src/utils/handle-api.ts`: Funções utilitárias (`getAllTasks`, `addTask`, `updateTask`, `deleteTask`) e interface de tipagem (`TaskItem`) para a comunicação unificada com o back-end.

## Deploy com EAS 🚀

- O EAS é um serviço onde ocorre o build de uma aplicação nativa nos servidores da EAS, servindo para Android, iOS Simulator e Iphone device
- Diferença entre os perfis development, preview e production:

- O perfil development: Eles são builds especializados no projeto que incluem ferramentas de desenvolvimento do Expo, esses tipos de builds incluem todas as dependências nativas dentro do seu projeto, fazendo com que você rode como se fosse uma build de produção dentro do seu projeto em um simulador, emulator ou dispositivo físico.

- O perfil preview: Ele serve para quando você fizer mudanças no seu projeto, você poder compartilhar uma prévia de suas mudanças com o seu time. Isso é útil para quando você quiser revisar mudanças com seu time.

- O perfil production: Ele serve para publicar o aplicativo e distribuir o app para Google Play Store(Android) ou no Apple Pay Store (iOS)

- Como executar o build de preview:  eas build --profile preview --platform android
