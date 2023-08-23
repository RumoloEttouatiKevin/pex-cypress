import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      on('task', {
        nameMethod(parameter) {
          // On peut exécuter n'importe quel code javascript valide
          // Ce code n'est pas exécuté côté navigateur

          return parameter;
        }
      });
    },
  },
});
