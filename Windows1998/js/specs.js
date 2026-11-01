/* specs.js — Specs Assistant (Part 3) */
(function() {
  'use strict';
  var clickCount = 0;
  var bubbleEl = null;

  function createBubble() {
    if (bubbleEl) return bubbleEl;
    bubbleEl = document.createElement('div');
    bubbleEl.id = 'specs-bubble';
    bubbleEl.style.cssText = 'position:fixed;bottom:40px;right:16px;z-index:9700;display:none;max-width:280px;';
    bubbleEl.innerHTML =
      '<div style="display:flex;align-items:flex-end;gap:8px;">' +
        '<div id="specs-character" style="font-size:48px;cursor:pointer;line-height:1;" title="Click me!">🤓</div>' +
        '<div id="specs-text-box" class="window" style="flex:1;">' +
          '<div class="window-body" style="padding:8px;">' +
            '<p id="specs-text" style="font-size:11px;margin-bottom:6px;"></p>' +
            '<div id="specs-choices" style="display:flex;flex-wrap:wrap;gap:4px;"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(bubbleEl);

    // Click on Specs character
    var character = bubbleEl.querySelector('#specs-character');
    if (character) {
      character.addEventListener('click', function() {
        clickCount++;
        if (clickCount >= 5) {
          Specs.say("You've clicked me " + clickCount + " times. I'm a help assistant, not a toy. Well, actually, I am a toy. This is a fake computer.", ['Sorry', 'Click again']);
        }
      });
    }
    return bubbleEl;
  }

  function hideBubble() {
    if (bubbleEl) bubbleEl.style.display = 'none';
  }

  window.Specs = {
    say: function(text, choices) {
      var bubble = createBubble();
      bubble.style.display = 'block';

      var textEl = document.getElementById('specs-text');
      if (textEl) textEl.textContent = text;

      var choicesEl = document.getElementById('specs-choices');
      if (choicesEl) {
        choicesEl.innerHTML = '';
        if (choices && choices.length) {
          choices.forEach(function(choice) {
            var btn = document.createElement('button');
            btn.textContent = choice;
            btn.style.fontSize = '10px';
            btn.onclick = function() {
              hideBubble();
            };
            choicesEl.appendChild(btn);
          });
        } else {
          var closeBtn = document.createElement('button');
          closeBtn.textContent = 'OK';
          closeBtn.style.fontSize = '10px';
          closeBtn.onclick = hideBubble;
          choicesEl.appendChild(closeBtn);
        }
      }

      // Auto-hide after 15 seconds
      setTimeout(hideBubble, 15000);
    },

    hide: function() { hideBubble(); },

    loveLetter: function() {
      if (typeof Egg !== 'undefined' && Egg.unlock) {
        Egg.unlock(25, 'Specs: love letter — Make it worse');
      }
      Specs.say(
        "It looks like you're writing a love letter! Would you like me to help?",
        ['Make it worse', 'Make it Hinglish', 'Ask Mummy']
      );
    },

    ieOpen: function() {
      Specs.say(
        "It looks like you're using the internet. Would you like me to disconnect? Your phone bill says yes.",
        ['Disconnect', 'Ignore (₹15/min)']
      );
    },

    minesweeperLost: function() {
      Specs.say(
        "It looks like you lost at Minesweeper. The mines were there all along, just like Papa's expectations.",
        ['Try again', 'Accept defeat']
      );
    }
  };
})();
