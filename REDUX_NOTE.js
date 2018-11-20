/*
Redux Note:

The most common use case for server-side rendering is to handle the initial render when a user (or search engine crawler) first requests our app.

Redux's only job on the server side is to provide the initial state of our app.

When using Redux with server rendering, we must also send the state of our app along in our response, so the client can use it as the initial state.

A reducer is just a Javascript function. A reducer takes two parameters: the current state and an action.

The third principle of Redux says that the state is immutable and cannot change in place.

In plain React the local state changes in place with setState. In Redux you cannot do that.

Redux reducers are without doubt the most important concept in Redux. Reducers produce the state of the application

The second principle of Redux says the only way to change the state is by sending a signal to the store.
This signal is an action. “Dispatching an action” is the process of sending out a signal.

Redux actions are nothing more than Javascript objects.

It is a best pratice to wrap every action within a function. Such function is an action creator.

Since strings are prone to typos and duplicates it’s better to have action types declared as constants.


## main redux concepts ##
1. the Redux store is like a brain: it’s in charge for orchestrating all the moving parts in Redux
2. the state of the application lives as a single, immutable object within the store
3. as soon as the store receives an action it triggers a reducer
4. the reducer returns the next state

The reducer calculates the next state depending on the action type. Moreover, it should return at least the initial state when no action type matches.

The most important methods (Redux store methods) are
getState for accessing the current state of the application
dispatch for dispatching an action
subscribe for listening on state changes

# react-redux is a Redux binding for React #
connect: it connects a React component with the Redux store.
mapStateToProps: connects a portion of the Redux state to the props of a React component
mapDispatchToProps: for actions

Provider is an high order component coming from react-redux.
Provider wraps up your React application and makes it aware of the entire Redux’s store.

A stateless component does not have its own local state. Data gets passed to it as props.
A stateful component in React is a component carrying its own local state. (e.g. a form)


Even when using Redux it is totally fine to have stateful components.
Not every piece of the application’s state should go inside Redux.
In this example I don’t want any other component to be aware of the Form local state.


*/

//action
{
  type: 'ADD_ARTICLE',
  payload: { name: 'React Redux Tutorial', id: 1 }
}

// action creator
// src/js/actions/index.js
export const addArticle = article => ({ type: "ADD_ARTICLE", payload: article });

// action type
// src/js/constants/action-types.js
export const ADD_ARTICLE = "ADD_ARTICLE";


// reducer
// src/js/reducers/index.js
import { ADD_ARTICLE } from "../constants/action-types";
const initialState = {
  articles: []
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ARTICLE:
    state.articles.push(action.payload);
    return state;
    default:
    return state;
  }
};
export default rootReducer;


// provider
// src/js/index.js

import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./store/index";
import App from "./components/App";
render(
       <Provider store={store}>
       <App />
       </Provider>,
       document.getElementById("app")
       );

/*

# Thunk #
Note how the function is almost identical to the one we wrote in the previous section.
However it doesn’t accept dispatch as the first argument. Instead it returns a function that accepts dispatch as the first argument.

*/
// Traditional
let nextNotificationId = 0
export function showNotificationWithTimeout(dispatch, text) {
  const id = nextNotificationId++
  dispatch(showNotification(id, text))

  setTimeout(() => {
    dispatch(hideNotification(id))
  }, 5000)
}

// with Thunk
let nextNotificationId = 0
export function showNotificationWithTimeout(text) {
  return function (dispatch) {
    const id = nextNotificationId++
    dispatch(showNotification(id, text))

    setTimeout(() => {
      dispatch(hideNotification(id))
    }, 5000)
  }
}

// e.g. to use above in component.js
showNotificationWithTimeout('You just logged in.')(this.props.dispatch)
// with Thunk, we can do this in component.js
this.props.dispatch(showNotificationWithTimeout('You just logged in.'))


// thunk with action creator
export function itemsHasErrored(bool) {
  return {
    type: 'ITEMS_HAS_ERRORED',
    hasErrored: bool
  };
}

export function itemsIsLoading(bool) {
  return {
    type: 'ITEMS_IS_LOADING',
    isLoading: bool
  };
}

export function itemsFetchDataSuccess(items) {
  return {
    type: 'ITEMS_FETCH_DATA_SUCCESS',
    items
  };
}

export function itemsFetchData(url) {
  return (dispatch) => {
    dispatch(itemsIsLoading(true));

    fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }

      dispatch(itemsIsLoading(false));

      return response;
    })
    .then((response) => response.json())
    .then((items) => dispatch(itemsFetchDataSuccess(items)))
    .catch(() => dispatch(itemsHasErrored(true)));
  };
}


// thunk with reducers
export function itemsHasErrored(state = false, action) {
  switch (action.type) {
    case 'ITEMS_HAS_ERRORED':
    return action.hasErrored;

    default:
    return state;
  }
}

export function itemsIsLoading(state = false, action) {
  switch (action.type) {
    case 'ITEMS_IS_LOADING':
    return action.isLoading;

    default:
    return state;
  }
}

export function items(state = [], action) {
  switch (action.type) {
    case 'ITEMS_FETCH_DATA_SUCCESS':
    return action.items;

    default:
    return state;
  }
}

// thunk's maps examples
const mapStateToProps = (state) => {
  return {
    items: state.items,
    hasErrored: state.itemsHasErrored,
    isLoading: state.itemsIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url) => dispatch(itemsFetchData(url))
  };
};



// access other state in reducer, thunk way
export function updateProduct(product) {
  return (dispatch, getState) => {
    const { accountDetails } = getState();

    dispatch({
      type: UPDATE_PRODUCT,
      stateOfResidenceId: accountDetails.stateOfResidenceId,
      product,
    });
  };
}


// generating action creator
function makeActionCreator(type, ...argNames) {
  return function(...args) {
    const action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}
​
const ADD_TODO = 'ADD_TODO'
const EDIT_TODO = 'EDIT_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
​
export const addTodo = makeActionCreator(ADD_TODO, 'text')
export const editTodo = makeActionCreator(EDIT_TODO, 'id', 'text')
export const removeTodo = makeActionCreator(REMOVE_TODO, 'id')


// generating reducer
function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

export const todos = createReducer([], {
  [ActionTypes.ADD_TODO]: (state, action) => {
    const text = action.text.trim()
    return [...state, text]
  }
})


/*
 reusable reducer creator util
*/
// Reusable utility functions
function updateObject(oldObject, newValues) {
  // Encapsulate the idea of passing a new object as the first parameter
  // to Object.assign to ensure we correctly copy data instead of mutating
  return Object.assign({}, oldObject, newValues)
}
​
function updateItemInArray(array, itemId, updateItemCallback) {
  const updatedItems = array.map(item => {
    if (item.id !== itemId) {
      // Since we only want to update one item, preserve all others as they are now
      return item
    }
​
    // Use the provided callback to create an updated item
    const updatedItem = updateItemCallback(item)
    return updatedItem
  })
​
  return updatedItems
}
​
function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}
​
// Handler for a specific case ("case reducer")
function setVisibilityFilter(visibilityState, action) {
  // Technically, we don't even care about the previous state
  return action.filter
}
​
// Handler for an entire slice of state ("slice reducer")
const visibilityReducer = createReducer('SHOW_ALL', {
  SET_VISIBILITY_FILTER: setVisibilityFilter
})
​
// Case reducer
function addTodo(todosState, action) {
  const newTodos = todosState.concat({
    id: action.id,
    text: action.text,
    completed: false
  })
​
  return newTodos
}
​
// Case reducer
function toggleTodo(todosState, action) {
  const newTodos = updateItemInArray(todosState, action.id, todo => {
    return updateObject(todo, { completed: !todo.completed })
  })
​
  return newTodos
}
​
// Case reducer
function editTodo(todosState, action) {
  const newTodos = updateItemInArray(todosState, action.id, todo => {
    return updateObject(todo, { text: action.text })
  })
​
  return newTodos
}
​
// Slice reducer
const todosReducer = createReducer([], {
  ADD_TODO: addTodo,
  TOGGLE_TODO: toggleTodo,
  EDIT_TODO: editTodo
})
​
// "Root reducer"
const appReducer = combineReducers({
  visibilityFilter: visibilityReducer,
  todos: todosReducer
})


// generic filtering higher-order reducer
function createFilteredReducer(reducerFunction, reducerPredicate) {
    return (state, action) => {
        const isInitializationCall = state === undefined;
        const shouldRunWrappedReducer = reducerPredicate(action) || isInitializationCall;
        return shouldRunWrappedReducer ? reducerFunction(state, action) : state;
    }
}
​
const rootReducer = combineReducers({
    // check for suffixed strings
    counterA : createFilteredReducer(counter, action => action.type.endsWith('_A')),
    // check for extra data in the action
    counterB : createFilteredReducer(counter, action => action.name === 'B'),
    // respond to all 'INCREMENT' actions, but never 'DECREMENT'
    counterC : createFilteredReducer(counter, action => action.type === 'INCREMENT')
})


// default deconstruct assignment
const {
  nextPageUrl = `repos/${fullName}/stargazers`,
  pageCount = 0
} = getState().pagination.stargazersByRepo[fullName] || {}
