/* egg.js — Easter egg tracker (Part 1) */
(function() {
  'use strict';
  var found = {};
  var labels = {};
  var total = 30;

  window.Egg = {
    total: total,

    unlock: function(id, label) {
      if (!id) return;
      if (!found[id]) {
        found[id] = true;
        labels[id] = label || id;
        console.log('%c🥚 Easter Egg #' + id + ': ' + (label || id), 'color: #ff6600; font-weight: bold;');
      }
    },

    isUnlocked: function(id) {
      return !!found[id];
    },

    list: function() {
      var result = [];
      for (var i = 1; i <= total; i++) {
        result.push({
          id: i,
          label: labels[i] || '???',
          unlocked: !!found[i]
        });
      }
      return result;
    },

    count: function() {
      return Object.keys(found).length;
    },

    reset: function() {
      found = {};
      labels = {};
    }
  };
})();
