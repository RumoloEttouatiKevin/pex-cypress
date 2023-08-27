# Projet 5 - Manipulation de donnée

## Remplacement de données en simulant le comportement du navigateur

Il est possible de remplacer le comportement de navigateur avec la fonction `stub()`. Il faut cibler l'objet qui contient la méthode qui nous intéresse et en second paramètre le nom de la méthode (sous forme de string).

Cette fonction n'est utilisable que si nous obtenons l'objet désiré avant son utilisation.

```js
cy.visit('/').then((win) => {
  cy.stub(win.navigator.geolocation, 'geCurrentPosition').as('getUserPosition');
});

cy.get('@getUserPosition').should('have.been.called');
```

## Un stub pour simuler une géolocalisation

```js
cy.visit('/').then((win) => {
  cy.stub(win.navigator.geolocation, 'getCurrentPosition')
    .as('getUserPosition')
    .callsFake((cb) => {
      setTimeout(() => {
        cb({
          coords: {
            latitude: 37.5,
            longitude: 48.01
          }
        });
      }, 100);
    });
});
```

## Un stub pour simuler le press papier

```js
cy.stub(win.navigator.clipboard, 'writeText')
  .as('saveToClipboard')
  .resolves(); // Ceci permet de retourner une promise, une valeur peut être passée.
```

Pour vérifier que le press papier a fonctionné comme attendu.

```js
cy.get('@saveToClipboard').should('have.been.called'); // Vérifie que la méthode est appelé
cy.get('@saveToClipboard').should( // Contenu vérifié par une regex
  'have.been.calledWithMatch',
  new RegExp(`${37.5}.*${48.01}.*${encodeURI('John Doe')}`);
cy.get('@saveToClipboard').should('have.been.calledWith', 'press papier'); // Contenu vérifié avec l'argument
);
```

## Les fixtures

Il est possible de créer de fausses données pour s'en servir facilement et éviter d'avoir besoin de modifier nos tests à chaque changement de données de dev de l'application.

Les fixtures sont principalement des fichiers JSON et installé dans le dossier fixtures de cypress.

```json
{
  "coords": {
    "latitude": 37.5,
    "longitude": 48.01
  }
}
```

Il est facile de s'en servir avec des alias.

```js
cy.fixture('user-location.json').as('userLocation');

cy.visit('/').then((win) => {
  cy.get('@userLocation').then(fakePosition => {
    cy.stub(win.navigator.geolocation, 'getCurrentPosition')
      .as('getUserPosition')
      .callsFake((cb) => {
        setTimeout(() => {
          cb(fakePosition);
        }, 100);
      });
  });
});
```

Nous pouvons également nous en servir donnée par donnée avec ou sans proxy.

```js
cy.get('@userLocation').then(fakePosition => {
  const { latitude, longitude } = fakePosition.coords;
  cy.get('@saveToClipboard').should(
    'have.been.calledWithMatch',
    new RegExp(`${latitude}.*${longitude}.*${encodeURI('John Doe')}`)
  );
})
```

## Espionnage d'utilisation

L'utilisation des espions est à peu de chose près le même que pour les stub, ici nous utiliserons la fonction `spy()`.

Espionnage de l'utilisation du local storage du navigateur.

```js
// Init
cy.spy(win.localStorage, 'setItem').as('storeLocation');
cy.spy(win.localStorage, 'getItem').as('getStoredLocation');

// Check de l'appel
cy.get('@storeLocation').should('have.been.called');

// Check du contenu
cy.get('@storeLocation').should(
  'have.been.calledWithMatch',
  /John Doe/,
  new RegExp(`${latitude}.*${longitude}.*${encodeURI('John Doe')}`)
);
```

## Manipuler le temps

Nous pouvons manipuler les éléments de temps lors de nos tests, les timeout, les interval, etc...

Il faut au préalable informer notre test que nous souhaitons manipuler le temps. `beforeEach()` peut faire l'affaire pour ce cas.

```js
beforeEach(() => {
  cy.clock();
});
```

Nous pouvons ensuite faire avancer le temps par exemple, ceci à un endroit particulier de notre test.

```js
it('mon test', () => {
// Des tests avant

cy.tick(2000);

// Des tests après
});
```
