# Projet 1 - Installation

## Installation de Cypress

Dans un terminal et avec l'aide de npm.

- `npm install cypress`

## Lancer l'application Cypress

Toujours dans un terminal.

- `npx cypress open`

## Configuration pour les tests End 2 End (E2E)

Lors de la première exécution de la commande de l'étape précédente, il faudra sélectionner le type de test que nous souhaitons faire pour le configurer.

En fonction du choix précédent, certains fichiers seront automatiquement créé dans le projet et configuré en fonction de ce choix.

Ces fichiers servent à configurer le comportement de Cypress.

Ensuite, il est demandé de choisir quel est la préférence de navigateur pour effectuer les tests E2E. Le choix sera disponible en fonction des navigateurs installés sur le poste. Cypress prend un large choix de navigateur.

Une fois le choix du navigateur effectué, cypress ouvrira celui-ci en lançant l'application cypress dans le navigateur.

Si aucun test n'est écrit au moment de cette configuration, cypress demandera s'il faut créer des exemples de test pour commencer à travailler avec ou s'l faut créer un fichier presque vide pour écrire soit même les premiers tests.

Pour un fichier vide, il sera demandé de saisir le chemin et le nom de ce fichier, il est conseillé de conserver le chemin suggéré et il faut conserver l'extension `.cy.js`. Une fois validé, il y a aura un premier scénario factice qui sera créé dans le fichier.

## Syntaxe de base des fichiers de test

Dans le premier fichier de test créé à l'aide de l'outil, il y a un premier "spec" et un premier "test".

Un "spec" ou collection de tests est défini par la fonction `describe`. Nous pouvons donner un nom à ce spec pour établir un rangement de nos différents tests. Un grand projet, peut très facilement contenir plusieurs centaines de tests.

```js
describe('template spec', () => {
```

Ensuite, pour écrire un test, il faut utiliser la fonction `it`. Nous pouvons également donner un nom à ce test.

```js
it('first test', () => {}),
it('second test', () => {}),
```

## Visiter une page web, le premier test

Pour indiquer à Cypress à quelle page se rendre pour effectuer des tests, il y a la fonction `cy.visit();`.

```js
cy.visit('http://localhost:5173/');
```

Dans l'application cypress côté navigateur, nous pouvons voir dans le menu de gauche l'onglet "spec", en allant dedans, nous retrouvons nos différents fichiers.

Quand on clique sur un fichier, cela lance automatiquement les tests de celui-ci, il est également possible de les relancer manuellement.

Nous pouvons également voir dans la partie de droite la navigation effectuée par cypress et les screenshots prit au moment de la validation ou non du test.

## Rechercher un élément du DOM

Nous pouvons rechercher un élément du DOM avec un sélecteur CSS avec la fonction `cy.get()`. Le comportement de cette méthode peut être assimilé à la fonction `querySelectorAll()` de javascript, elle retrouvera tous les éléments du DOM qui ont le sélecteur CSS saisi.

```js
cy.get('li');
```

## Formuler une attente "should be" (devrait être)

Nous pouvons passer un large choix d'arguments à une fonction qui nous permet de tester facilement et de valider une attente avec la fonction `should()`.

```js
cy.get('li').should('have.length', 6);
```

Cet exemple de test demande à récupérer tous les éléments `<li>` du DOM suivi d'une attente sur le nombre d'éléments trouvé, ici le test sera validé si cypress trouve exactement six éléments `<li>`.
