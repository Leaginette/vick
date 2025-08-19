# Victor Automations — Chatbot avec API OpenAI

## Démarrage rapide

1. Installer les dépendances
   ```bash
   npm install
   ```
2. Créer un fichier `.env` à la racine en copiant `.env.example` puis remplacer la clé OpenAI
   ```env
   OPENAI_API_KEY=sk-...votre_clef...
   PORT=3000
   ```
3. Lancer le serveur
   ```bash
   npm start
   ```
4. Ouvrir dans le navigateur
   - `http://localhost:3000` puis utiliser le bouton chat.

Le client enverra les messages à `/api/chat`, qui relaie vers OpenAI (`gpt-4o-mini`).

## Utiliser DeepSeek (ou autre API compatible OpenAI)

1. Créez une clé API DeepSeek
   - Tableau de bord DeepSeek → API Keys
2. Dans `.env`, remplacez/ajoutez:
   ```env
   OPENAI_API_KEY=sk-deepseek-...votre_clef...
   OPENAI_BASE_URL=https://api.deepseek.com/v1
   OPENAI_MODEL=deepseek-chat
   PORT=3000
   ```
3. Redémarrez le serveur:
   ```bash
   npm start
   ```

Le serveur utilise le SDK `openai` avec une URL et un modèle configurables, ce qui permet d’utiliser des fournisseurs compatibles OpenAI.


