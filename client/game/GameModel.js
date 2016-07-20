import { createStore } from 'redux';

var state = {
  entities: [],
  stage: {}
};


// All stage additions and removals must appear here.
// this is so that the entity can be cleaned from every related game object
var actions = {
  addEntity: function(prevState, entity) {
    var entities = prevState.entities.slice();
    entities.push(entity);
    prevState.stage.addChild(entity.container);
    return Object.assign({}, prevState, {
      entities: entities
    });
  },
  addStage: function(prevState, stage) {
    return Object.assign({}, prevState, {
      stage: stage
    });
  },
  addRenderer: function(prevState, renderer) {
    return Object.assign({}, prevState, {
      renderer: renderer
    });
  },
  removeEntity: function(prevState, target) {
    var entities = prevState.entities.filter(entity => entity !== target);
    prevState.stage.removeChild(target.container);
    return Object.assign({}, prevState, {
      entities: entities
    });
  }
};

var reducer = function(prevState = state, action) {
  if (actions[action.type]) {
    return actions[action.type](prevState, action.data);
  } else {
    console.warn('Game action ' + action.type + ' doesn\'t exist');
    return prevState;
  }
};

var getStore = function() {
  return createStore(reducer);
};

export { getStore };
