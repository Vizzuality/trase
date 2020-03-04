# Code-splitting

This application leverages code-splitting to reduce the amount of code that the browser needs to download and parse.

Our method of splitting the bundle is by defining dynamic imports. Webpack will create a new chunk for every dynamic import that finds in the code, this chunk will be resolved based on the absolute paths. When dealing with React components, we rely heavily on the `React.lazy` util. This utility along with React Suspense handles the dynamic rendering of components once they're loaded.

The code-splitting strategy is the following:

## By route
The first level of code-splitting is by route. We use dynamic imports to split our bundle by pages.

## By Redux reducer and saga
We created a `reducerRegistry` and a `sagaRegistry` that handles the registration of both sagas and reducers on runtime. Dynamic reducers/sagas depend on a trick that works in the following way:

-  We re-export all actions and actions creators from a `.register.js` file. This will be the public API for our redux module.
-  All code that needs to import one of this, THAT IS NOT THE SAME MODULE, will import the code via the register file.
-  When the register file gets parsed, a piece of code registering the reducer and the saga will execute, making the reducer and saga available.
-  In some cases, a saga can register after the action that's supposed to be listening has already triggered. When a saga gets registered, we dispatch an action called `APP__SAGA_REGISTERED`. This gives us an escape hatch for this edge cases.

In order for this to work, we have to be very careful of transitive relations between imports. Sometimes we might import a component that's connected and therefor depends on a module, and therefor importing that module before actually being used. To avoid this, we have to dynamically import all modules and components that aren't necessary at init. 

## Discretionary
When a piece of code can be lazy loaded because it doesn't appear on screen right away we dynamically import it. This could be a component, a library or any other type of code. 