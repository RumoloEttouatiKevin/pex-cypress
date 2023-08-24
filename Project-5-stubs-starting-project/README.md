# Projet 5 - Manipulation de donnée

## Simuler le comportement du navigateur

Il est possible de remplacer le comportement de navigateur avec la fonction `stub()`. Il faut cibler l'objet qui contient la méthode qui nous intéresse et en second paramètre le nom de la méthode (sous forme de string).

Cette fonction n'est utilisable que si nous obtenons l'objet désiré avant son utilisation.

```js
cy.visit('/').then((win) => {
  cy.stub(win.navigator.geolocation, 'geCurrentPosition').as('getUserPosition');
});

cy.get('@getUserPosition').should('have.been.called');
```

## Simuler une géolocalisation

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
