# Projet 6 - Requête HTTP - Authentification - base de données

## Refresh database avant chaque test

Il est intéressant de pouvoir mettre en place un refresh d'une base de données de test, cela permet d'avoir toujours une BDD propre entre chaque test et non pollué par des tests qui effectuent des actions en BDD.

Mettre en place une tâche récurrente dans le projet.

```js
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) { // On se rappelle qu'ici le code sera exécuté côté machine et non plus dans le navigateur.
      on('task', {
        async seedDatabase() {
          await seed();
          return null;
        }
      })
    },
  },
});
```

Cette tâche peut être appelée avant chaque test par exemple.

```js
beforeEach(() => {
  cy.task('seedDatabase');
});
```

## Intercepter les requêtes HTTP

Il est possible d'intercepter les requêtes HTTP.

```js
cy.intercept('POST', '/newsletter*');
```

En plus d'intercepter une requête HTTP, nous pouvons forcer le retour de celle-ci avec une fausse donnée et donc de ne pas réellement envoyer la requête.

```js
cy.intercept('POST', '/newsletter*', { status: 201 });
```

L'ajout d'un alias à une interception va nous permettre de manipuler le retour de celle-ci.

```js
cy.intercept('POST', '/newsletter*', { status: 201 }).as('subscribe');
```

Nous pouvons mettre en "attente" le script de test, ici, nous attendons que la requête HTTP soit exécutée et remplacée par Cypress, la suite des tests sera effectué uniquement après.

```js
cy.wait('@subscribe');

// Tests suivants...
```

## Tester une requête HTTP

Avec la fonction `intercept()`, notre objectif est de tester notre front, si nous souhaitons tester un endpoint de notre back / API / etc. , nous devons utiliser la fonction `request()`.

```js
it('should successfully create a new contact', () => {
  cy.request({
    method: 'POST',
    url: '/newsletter',
    body: { email: 'test@example.com' },
    form: true,
  }).then(res => {
    expect(res.status).to.eq(201);
  });
})
```

Ce test ne faisant pas appel à une page, le navigateur ne sera pas instancié de la même manière.

## Inspecter les cookies

```js
cy.getCookie('__session').its('value').should('not.be.empty');
```

La fonction `its()` permet d'avoir accès aux propriétés de l'objet précédemment récupéré.

## Assertion sur une interception

Il est possible d'ajouter une assertion sur une interception de requête avec la fonction `its()`.

```js
cy.wait('@createTakeaway')
  .its('request.body')
  .should('match', /TestTitle1.*TestBody1/);
```
