# Edukai 🐧

Edukai est une application innovante dédiée à l'auto-génération de quiz et de fiches de révision à partir de contenus de cours fournis sous différents formats (PDF, image, texte, Word, etc.). Que vous souhaitiez réviser ou tester vos connaissances, Edukai rend la préparation des examens simple, rapide et efficace.

## 📌 Description

Le projet Edukai vise à simplifier la création de matériel de révision personnalisé. L'utilisateur peut fournir un document ou une photo de ses cours, et l'application génère automatiquement des quiz et des fiches de révision en fonction du contenu analysé. L'objectif est d'aider les étudiants à se concentrer sur l'apprentissage tout en réduisant le temps passé à préparer des supports de révision.

## 🎨 Technologies utilisées

- **Framework** : [Next.js](https://nextjs.org/)
- **UI** : [Tailwind CSS](https://tailwindcss.com/) et [ShadCN UI](https://shadcn.dev)
- **Langage** : TypeScript (pour une robustesse et une maintenabilité accrues)

## 🚀 Fonctionnalités

- **Génération de quiz automatique** : créez des quiz adaptés au contenu de votre cours.
- **Création de fiches de révision personnalisées** : recevez des fiches de synthèse pour faciliter la révision.
- **Prise en charge de divers formats** : importez vos cours sous forme de PDF, image, fichier Word, texte, etc.
- **Expérience utilisateur fluide** : grâce à une interface intuitive et responsive.

## 📸 Aperçu

<img width="1710" height="1073" alt="image" src="https://github.com/user-attachments/assets/b1a9534a-79b7-4c68-835f-87551e909cdd" />

<img width="1710" height="1073" alt="image" src="https://github.com/user-attachments/assets/0349d70a-a5db-48fe-9248-d723444ffd07" />

<img width="1710" height="1073" alt="image" src="https://github.com/user-attachments/assets/c526ddfc-3859-4764-9a5e-f1d94f212e96" />

## 📖 Utilisation

1. **Clonez le projet :**

   ```bash
    # via SSH
    git clone git@github.com:EdukaiFR/website.git

    # OU via HTTPS
    git clone https://github.com/EdukaiFR/website.git

    cd website
   ```

2. **Choisissez une méthode d'installation & démarrage :**

   **Option 1: Via Docker 🐳 (recommandée)**

   1. Construire l'image
      ```bash
      docker build -t edukai-website .
      ```
   2. Lancer le conteneur
      ```bash
      docker run -it -p 3000:3000 edukai-website
      ```

   **Option 2: Installation & démarrage locaux**

   1. Installer les dependances
      ```bash
      npm install
      ```
   2. **Lancer l'application:**

      Mode **dev** :

      ```bash
      npm run dev
      ```

      Mode **production** :

      ```bash
      npm run build && npm run start
      ```

3. **Accédez à l'application :**

   L'application est lancée sur le port 3000 de votre machine (`http://localhost:3000`).<br>

## 🧪 Tests

```bash
pnpm test              # Unit tests (watch mode)
pnpm test:ci           # Unit tests + coverage
pnpm test:e2e          # Playwright E2E tests
pnpm test:e2e:headed   # E2E with visible browser
```

See [docs/TESTING.md](docs/TESTING.md) for details on test structure and patterns.

## 👥 Équipe

- **Tristan Hourtoulle** - Développeur Frontend
- **Khalid Belkassmi E.H.** - Développeur Backend & IA
- **Lucas Rossignon** - Développeur Mobile

Nous sommes tous motivés par le même objectif : aider les étudiants à apprendre plus efficacement.

## 🔗 Liens

- **Instagram** : [@edukaifr](https://www.instagram.com/edukaifr/?hl=fr)
- **LinkedIn** : _(En cours de création)_

## 🤝 Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez apporter des modifications ou des améliorations, n'hésitez pas à soumettre une _pull request_. Nous sommes impatients de collaborer avec d'autres passionnés de l'éducation et de la technologie.

## 📄 Licence

_Pas encore de licence_

## 📬 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter sur [Instagram](https://www.instagram.com/edukaifr/?hl=fr).
