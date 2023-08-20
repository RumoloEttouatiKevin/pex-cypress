# Projet 2 - Les bases

## Descriptions/noms des spec et des tests

Il est important de rappeler que pour la bonne cohérence d'un projet, les noms des collections de test et des tests eux-mêmes sont très important.

## Autocomplétion Cypress dans l'IDE

L'autocomplétion est souvent mal intégrée aux IDE, pour forcer son intégration, il faut ajouter son référencement, comme un import au début du fichier `.cy.js`.

```js
/// <reference types="Cypress" />
```

## Formuler une attente "contains" (contient)

Comme pour `should()` nous pouvons vérifier le contenu d'un élément.

```js
cy.get('h1').contains('My Cypress Course Tasks');
```

Il est également possible de vérifier dans l'intégralité du DOM.

```js
cy.contains('My Cypress Course Tasks');
```

!! Attention, à bien définir les tests, si ce dernier est réellement ce que nous voulons tester alors pas de problème, mais souvent nous voulons être très précis dans nos tests.

## Enchaînement de fonction

Pour optimiser les tests et éviter de multiplier un inutilement les cas déjà testés, nous pouvons chaîner les différents tests sur un même élément.

```js
// Ici, il est recherché deux fois le sélecteur "h1" pour ensuite effectuer un test "should" et un "contains"
cy.get('h1').should('have.length', 1);
cy.get('h1').contains('My Cypress Course Tasks');

// Enchaînement pour éviter de rechercher et donc de tester deux fois le sélecteur "h1"
cy.get('h1').should('have.length', 1).contains('My Cypress Course Tasks');
```

Il est très utile de pouvoir enchaîner les fonctions avec cypress, mais attention à certaines fonctions, si l'on enchaîne deux `get()` par exemple, la deuxième fonction n'ira pas chercher dans le contenu retourné par la première, mais dans ce cas elle recommence au début du fichier.

```js
cy.get('h1').should('have.length', 1);
cy.get('h1').contains('My Cypress Course Tasks');
```

## Rechercher dans les éléments enfants

Il est en revanche possible de rechercher des éléments à l'intérieur d’éléments retournés par `get()` avec la fonction `find()`.

```js
cy.get('.main-header').find('img');
```

Il n'est pas possible d'utiliser cette fonction en première étape, `find()` est forcément précédé d'au moins un `get()`.

## Aller plus loin avec contains

Dans le but d'optimiser nos tests, il est important de savoir que la fonction `contains()` va vérifier si un contenu est présent, mais il va aussi récupérer le premier élément qu'il trouve.

```js
// Le test avec un présélecteur
cy.get('button').contains('Add Task');

// Le même test
cy.contains('Add Task');
```

Attention tout de même à être plus précis si le besoin doit être plus explicite.

Attention `get()` récupère tous les éléments du sélecteur CSS, `contains()` ne récupère que le premier élément trouvé.

## Simuler un clic utilisateur sur un élément

Pour simuler un clic sur un élément, il y a la fonction `click()`, elle doit être précédée d'un sélecteur d'élément.

```js
cy.contains('Add Task').click();
```

!! Par défaut, l'utilisation de cette fonction va simuler le clic au centre de l'élément sélectionné.

Si l'élément sélectionné est recouvert par un autre élément, alors le clic ne sera pas effectué sur l'élément souhaité, en revanche, nous pouvons lui passer un paramètre pour forcer le click sur l'élément sélectionné bien qu'il soit recouvert par un autre.

```js
cy.get('.backdrop').click({ force: true});
```

!! Attention, le test de simuler un clic sera validé si cypress arrive à cliquer sur l'élément, le comportement du site après le clic n'est pas testé.

Il faut donc ajouter un test à la suite pour s'assurer que l'action a fait ce que nous voulions.

```js
cy.get('.backdrop').click({ force: true });
cy.get('.backdrop').should('not.exist');
```

## Simuler la saisie dans un champ

Pour simuler un utilisateur tapant dans un champ de saisie, nous utilisons la fonction `type()`.

```js
cy.get('#title').type('New Task');
```

## Sélectionner un élément d'une liste déroulante

Il est possible de sélectionner facilement un élément d'une liste déroulante avec la fonction `select()`. L'argument fourni peut alors être la valeur, le texte ou l'index de l'élément.

```js
cy.get('#category').select('urgent');
```

## Parcourir une collection d'éléments

Après avoir récupéré plusieurs éléments avec la fonction `get()` par exemple, il est possible de parcourir facilement le contenu de cette liste pour effectuer des tests avec précision.

Pour sélectionner le premier élément :

```js
// Sélectionner le premier élément
cy.get('.task').first();

// Sélectionner le dernier élément
cy.get('.task').last();

// Sélectionner un élément par son index (commence à zéro)
cy.get('.task').eq(1);
```

## La documentation officielle depuis les docs block

Depuis les docs block avec l'autocomplétion activé, la plupart des fonctions, actions, etc... font référence à la documentation officielle de Cypress.

Exemple :

- `should()` [https://docs.cypress.io/api/commands/should](https://docs.cypress.io/api/commands/should)
- `contains()` [https://docs.cypress.io/api/commands/contains](https://docs.cypress.io/api/commands/contains)
- `click()` [https://docs.cypress.io/api/commands/click](https://docs.cypress.io/api/commands/click)
- etc ...
