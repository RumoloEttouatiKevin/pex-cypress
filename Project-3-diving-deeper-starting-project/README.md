# Projet 3 - Les bases plus

## Best practices

Une des bonnes pratiques avec Cypress concernant la sélection d'éléments qui pourrait potentiellement être volatile est de définir un dataset, il est recommandé d'utiliser `data-cy=""` pour cibler de façon très précise un élément qui a pour but d'être utilisé pour les tests avec Cypress, ça revient à fournir un ID unique à un élément.

```jsx
<ul>
  <li>
    <Link to="/" data-cy="header-home-link">Home</Link>
  </li>
  <li>
    <Link to="/about" data-cy="header-about-link">About</Link>
  </li>
</ul>
```

Il est aussi possible de fournir ce dataset à plusieurs éléments si l'on souhaite une fois de plus récupérer de façon précise une liste de ces éléments.

```html
<ul>
  <li data-cy="my-element"></li>
  <li data-cy="my-element"></li>
  <li data-cy="my-element"></li>
  <li data-cy="my-element"></li>
  <li data-cy="my-element"></li>
</ul>
```

!! Il faut donc garder en tête de cibler nos tests sur des éléments ayant des dataset spécifique à nos tests, il est toujours possible d'utiliser les sélecteurs CSS comme avant, mais le moins possible.

Les "[best practices](https://docs.cypress.io/guides/references/best-practices)" sont disponible dans la documentation de Cypress.

## Information de la localisation courante

Nous pouvons récupérer plusieurs informations sur la page courante où nous sommes, comme le 'pathname', cette fonction fait référence à `window.location`.

```js
cy.location('pathname').should('eq', '/about');
```

## Simuler la navigation par navigateur

Nous pouvons simuler l'action de l'utilisateur qui souhaite revenir à la page précédente ou à la page suivante en utilisant les boutons du navigateur.

```js
cy.go('back');
cy.go('forward');
```

## Alias de should()

Pour une question de lecture du code, nous pouvons utiliser la fonction `and()` qui est un alias de `should()`. Ce n'est qu'une question de facilité de lecture, les deux fonctions font la même chose.

```js
cy.get('[data-cy="contact-btn-submit"]')  // Dans cet élément
  .contains('Send Message')               // Il contient ce texte
  .and('not.have.attr', 'disabled');      // et ne doit pas avoir d'attribut "disabled"

// est égale à cette assertion
cy.get('[data-cy="contact-btn-submit"]')  // Dans cet élément
  .contains('Send Message')               // Il contient ce texte
  .should('not.have.attr', 'disabled');   // Ne doit pas avoir d'attribut "disabled"
```

## Chaînage, enchaînement de fonction

Il n'est pas clairement défini dans la documentation que le chaînage de fonction soit plus conseillée, mais il faudrait voir sur de très nombreux tests s'l nous pouvons gagner en perf à limiter le nombre d'action faites par Cypress.

```js
// Ce code effectue 10 actions
cy.get('[data-cy="contact-btn-submit"]').contains('Send Message');
cy.get('[data-cy="contact-btn-submit"]').should('not.have.attr', 'disabled');
cy.get('[data-cy="contact-btn-submit"]').click();
cy.get('[data-cy="contact-btn-submit"]').contains('Sending...');
cy.get('[data-cy="contact-btn-submit"]').should('have.attr', 'disabled');

// Tandis que celui-ci effectue 7 actions
cy.get('[data-cy="contact-btn-submit"]')
  .contains('Send Message')
  .and('not.have.attr', 'disabled');
cy.get('[data-cy="contact-btn-submit"]')
  .click()
  .contains('Sending...')
  .and('have.attr', 'disabled');
```

J'ai fait le test avec c'est deux bout de code, 90 exécutions du premier et ensuite 90 exécutions du suivant, le premier test a mis 01:54 minutes, tandis que le second en a mis 01:46, ok là on parle d'avoir gagner 8 secondes, mais peut-être à l'échelle d'un gros projet avec plusieurs centaines voir millier de tests, le gains est peut-être intéressant.

## Les aliases

Il peut être tentant de stocker le retour d'un `get()` ou d'un `contains()` pour ensuite relancer des tests dessus, sauf que ceci est une mauvaise pratique et n'est pas recommandé par Cypress, car ces objets ne retournent pas l'élément attendu, mais un objet => `Chainable`.

Nous pouvons par contre créer des aliases et revenir à un type d'écriture non chainable si ce type de lecture n'est pas de son goût.

```js
// Ce code effectue 6 actions
cy.get('[data-cy="contact-btn-submit"]').click();
cy.get('[data-cy="contact-btn-submit"]').contains('Sending...');
cy.get('[data-cy="contact-btn-submit"]').should('have.attr', 'disabled');

// Celui-ci effectue 8 actions, c'est plus, mais la vérification de la présence de l'élément n'est effectué que lors du premier `get()` et immédiatement stocké en alias, ce qui réellement comptabilisé, ce code revient à effectuer 4 actions.
cy.get('[data-cy="contact-btn-submit"]').as('submitBtn');
cy.get('@submitBtn').click();
cy.get('@submitBtn').contains('Sending...');
cy.get('@submitBtn').should('have.attr', 'disabled');
```

La création et l'utilisation d'alias sont fortement recommandées dans les bonnes pratiques de Cypress.

En reprennent le test précédent, j'ai testé ces bouts de code.

```js
// 100 fois
cy.get('[data-cy="contact-btn-submit"]').contains('Send Message');
cy.get('[data-cy="contact-btn-submit"]').should('not.have.attr', 'disabled');
cy.get('[data-cy="contact-btn-submit"]').click();
cy.get('[data-cy="contact-btn-submit"]').contains('Sending...');
cy.get('[data-cy="contact-btn-submit"]').should('have.attr', 'disabled');

// VS

// 1 fois
cy.get('[data-cy="contact-btn-submit"]').as('submitBtn');
// 100 fois
cy.get('@submitBtn')
  .contains('Send Message')
  .should('not.have.attr', 'disabled');
cy.get('@submitBtn')
  .click()
  .contains('Sending...')
  .should('have.attr', 'disabled');
```

Le premier cas est effectué en 02:08 minutes, tandis que le second cas est effectué en 01:59, ici, nous sommes à 9 secondes de gain (mais 10 scénarios de plus), comme précédemment, il faudrait calculer ce gain sur une application avec des milliers de tests, mais ce petit test est plutôt concluant.

## Accès direct à un élément

Pour aller encore plus loin dans la manipulation d'un élément, nous pouvons utiliser la fonction `then()`, celle-ci va nous permettre de manipuler un élément particulier qui entoure le ou les éléments précédemment récupérés dans une fonction anonyme, nous allons pouvoir passer des valeurs et en attendre le retour.

La fonction `expect()` va nous permettre de fournir l'élément que nous attendons puis de définir l'assertion en chaînant des propriétés comme si nous écrivions une phrase complète.

```js
cy.get('[data-cy="contact-btn-submit"]').then((el) => {
  expect(el.attr('disabled')).to.be.undefined;
});
```

Encore une fois [toutes les assertions](https://docs.cypress.io/guides/references/assertions) sont listées dans la documentation officielle.

Les assertions sont donc les mêmes que nous pouvons utiliser dans la fonction `should()`, mais cette fois-ci, ce n'est pas en argument d'une fonction, mais en chaînant les propriétés après notre `expect()`.

!! A NOS TESTS, cette fois, on va tester les trois dernières méthode que l'on connaît et avec de très petits test.

```js
// 100 fois
cy.get('[data-cy="contact-btn-submit"]').contains('Send Message');
cy.get('[data-cy="contact-btn-submit"]').should('not.have.attr', 'disabled');

// 1 déclaration
cy.get('[data-cy="contact-btn-submit"]').as('submitBtn');
// 100 fois
cy.get('@submitBtn')
  .contains('Send Message')
  .should('not.have.attr', 'disabled');

// 1 déclaration
cy.get('[data-cy="contact-btn-submit"]').then((el) => {
  // 100 fois
  expect(el.attr('disabled')).to.be.undefined;
  expect(el.text()).to.contain('Send Message');
});
```

Le premier cas est effectué en 6 secondes, le second en 3 secondes et le dernier en 1 seconde.

Si notre fonction `then()` entoure une liste d'éléments, nous pouvons cibler précisément l'un d'eux comme ceci.

```js
cy.get('[data-cy="contact-btn-submit"]').then((el) => {
  el[0].click();
  expect(el.text()).to.contain('Sending...');
  expect(el.attr('disabled')).not.to.be.undefined;
});
```

## Simuler l'appuie sur une touche

Il peut être nécessaire de vérifier le fonctionnement d'un élément en lien avec une touche du clavier. Avec la fonction `type()` nous pouvons facilement simuler l'appui sur une touche à un moment précis d'une suite de caractères par exemple.

```js
cy.get('[data-cy="contact-input-email"]').type('test@example.com{enter}');
```

Encore une fois les [différentes possibilités](https://docs.cypress.io/api/commands/type) sont listé dans la documentation officielle.

## Simuler le focus d'un élément

Pour avoir le focus d'un élément, nous avons la fonction `focus()`.

```js
cy.get('[data-cy="contact-input-message"]').focus();
```

## Simuler la sortie d'un élément

Pour perdre le focus d'un élément, nous avons la fonction `blur()`.

```js
cy.get('[data-cy="contact-input-message"]').blur();
```

## Sélectionner l'élément parent ou enfant

Il est possible de sélectionner l'élément parent d'un élément, ce qui peut nous éviter de devoir le sélectionner avec un sélecteur farfelu.

```js
// Récupère le parent
cy.get('[data-cy="contact-input-message"]').parent();

// Récupère l'enfant ou le groupe d'enfant direct
cy.get('[data-cy="contact-input-message"]').children();
```

## Lancer Cypress en ligne de commande

Il est possible de lancer Cypress en ligne de commande et ne pas utiliser Cypress Studio.

- `npx cypress run`

Cette commande va lancer tous les tests du projet, s'l y a des erreurs, nous aurons des screenshots qui seront prit de l'erreur.

Mais nous aurons surtout des vidéos de chaque spec montrant les tests en action.

## Instabilité entre les versions la version ligne de commande et Cypress Studio

Il peut arriver que nous n'aillons pas les mêmes résultats entre la version de Cypress en ligne de commande et Cypress Studio, la plupart du temps, il s'agit d'erreur de sélection d'éléments ou d'affirmations incorrectes.

Il faut donc faire attention à tester régulièrement en ligne de commande, surtout si nous avons branché Cypress à une CI/CD.

## Forcer la prise de screenshot

Les screenshots sont généralement prit automatiquement par Cypress lorsqu'une erreur de test est relevée. Il est aussi possible de forcer la prise d'un screenshot à un moment précis.

```js
cy.screenshot();
```

## Diminuer le chaînage de `should()` et `and()`

Pour éviter d'avoir à multiplier le nombre d'appels aux fonctions `should()` et `and()` sur un même élément, nous pouvons fournir une fonction anonyme comme argument à la fonction `should()`.

```js
cy.get('[data-cy="contact-input-email"]')
  .parent()
  .should((el) => {
    expect(el.attr('class')).not.to.be.undefined;
    expect(el.attr('class')).contain('invalid');
  });
```

Cela fonctionne globalement comme la fonction `then()` pour l'écriture d'assertion.
