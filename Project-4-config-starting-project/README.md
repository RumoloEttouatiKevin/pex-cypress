# Projet 4 - Configuration

## Le fichier de configuration principal

Le fichier de configuration principal est généralement installé à la racine du projet et il se nomme `cypress.config.js`.

Dans la fonction `defineConfig()` nous pouvons ajouter beaucoup de paramètre, nous pouvons ouvrir l'autocomplétion pour en avoir un apercu.

Comme à l’accoutumé, la documentation officielle nous donnera plus d'information sur la [configuration de Cypress](https://docs.cypress.io/guides/references/configuration).

## Configuration par spec

Il est possible de configurer nos tests par spec, la fonction `describe()` peut prendre en second paramètre un objet de définition de configuration global à notre spec.

```js
describe('contact form', {
  defaultCommandTimeout: 10000,
}, () => {
  it();
  it();
  it();
});
```

## Configuration par test

Il est également possible de configurer directement nos tests, la fonction `it()` peut aussi prendre en second paramètre un objet de définition de configuration global à notre spec.

```js
it('should submit the form', {
  defaultCommandTimeout: 5000
}, () => {
  cy.get();
  cy.get();
  cy.get();
});
```

## Lancer les tests en utilisant un autre navigateur

Il est possible de lancer les tests en ligne de commande en utilisant un autre navigateur que celui par défaut.

- `npx cypress run --browser firefox`

## Base URL

Il est possible de définir de manière global la base URL que nous souhaitons utiliser pour nos tests et ceci à du sens, si nous venons à modifier cette base URL, il faudrait alors la modifier dans tous les fichiers.

Dans le fichier de configuration global

```js
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
  }
})
```

## Instruction - hook

Il est possible de fournir une suite d'instruction en début de spec qui seront utilisé pour chacun de nos tests avec la fonction `beforeEach()`. L'emplacement de cette fonction au début ou entre deux tests est important, c'est au moment ou le lecteur Cypress arrive à la fonction que ses instructions sont exécuté.

```js
describe('contact form', () => {
  beforeEach(() => {
    cy.visit('/about');
  });
});
```

!! ATTENTION, ici on aurait tendance à croire que l'ouverture de la page **/about** ne se fera d'une seule fois, mais ce n'est pas ce qui ce produit, cette fonction `beforeEach()` est exécuté avant chaque lancement de test `it()`.

Cette fonction permet principalement de factoriser proprement les répétitions en début de test.

Il y a aussi les hooks suivant.

```js
describe('contact form', () => {
  before(() => {}); // Lancer avant tous les tests
  beforeEach(() => {}); // Lancer avant chaque test
  afterEach(() => {}); // Lancer après chaque test
  after(() => {}); // Lancer après tous les tests
});
```

Il n'est pas recommandé par Cypress d'utiliser afterEach ou after pour effectuer du nettoyage entre les tests, mais plutôt beforeEach ou before.

## Création d'une commande custom

Il peut être utile de factoriser un type de réalisation qui est régulièrement effectué. Créer une commande va nous permettre de factoriser un peu cela, dans le fichier `cypress/support/commands.js` nous écrirons toutes nos commandes.

En premier paramètre nous aurons la clé de cette commande (le nom pour être vulgaire), cette clé doit être unique dans le projet.

En deuxième argument, nous aurons une fonction anonyme qui peut prendre des paramètres pour les traiter dans la fonction.

```js
// Déclaration dans le fichier commands.js
Cypress.Commands.add('submitForm', () => {
  cy.get('form button[type="submit"}').click();
});

// Utilisations dans les tests
cy.submitForm();
```

!! ATTENTION, la factorisation de cette manière peut être très attirant, mais c'est une pratique peut recommandé si la commande effectue beaucoup de chose et si son nommage n'est pas suffisamment explicite. Il faut bien réfléchir au réel besoin de création d'une commande.

## Création d'une requête custom

Il peut être intéressant de factoriser une méthode de récupération d'éléments. Ceci sera déclaré comme une commande, mais au lieu d'utiliser `add()` nous utilisons `addQuery()`.

Une requête doit quand à elle retourner une fonction. Il est très important que l'instruction retournée soit à l’intérieur d'une fonction renvoyé, car c'est cette fonction qui sera réessayée pendant 4 secondes (default time).

```js
Cypress.Commands.addQuery('getById', (id) => {
  const getFn = cy.now('get', `[data-cy="${id}"]`); // Fonction exécuté immédiatement à l'appel de getById()
  return () => {
    return getFn(); // Fonction exécuté à chaque rerun du test dans la file d'attente de "4 secondes"
  }
});
```

!! ATTENTION, comme le point précédent, il faut avoir une réel réflexion sur l'utilisation de requête custom.

## Les tâches

Il est possible d'intercepter les tâches, comme un écouteur d'événement.

Dans le fichier de configuration.

```js
export default defineConfig({
  e2e: {
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
```

Dans les tests.

```js
describe('spec', () => {
  it('test', () => {
    cy.task('nameMethod').then(returnValue => {
      //... use return value
    });
  });
});
```
