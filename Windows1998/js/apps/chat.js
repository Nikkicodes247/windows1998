/* chat.js — ICQ-style Chat (Part 3) */
(function() {
  'use strict';
  if (typeof Apps === 'undefined') return;

  Apps.register('chat', {
    title: 'DesiChat 99',
    icon: '💬',
    open: function() {
      var winId = 'chat_' + Date.now();
      var messageCount = 0;

      var botScript = [
        { delay: 2000, msg: 'a/s/l?' },
        { delay: 5000, msg: '17/m/bhilai' },
        { delay: 8000, msg: 'asl plz' },
        { delay: 12000, msg: 'u there??' },
        { delay: 16000, msg: 'hello????' },
        { delay: 22000, msg: 'ok fine bye' },
        { delay: 28000, msg: 'jk im still here lol' },
        { delay: 35000, msg: 'bro do u know how to download ram' },
        { delay: 42000, msg: 'gupta said u can download ram from internet' },
        { delay: 50000, msg: 'nvm mummy is calling gtg' }
      ];

      WM.open({
        id: winId,
        title: 'DesiChat 99',
        icon: '💬',
        width: 350,
        height: 420,
        render: function(body) {
          body.style.cssText = 'display:flex;flex-direction:column;height:calc(100% - 22px);background:#e8e8e8;';

          // Contact bar
          var contactBar = document.createElement('div');
          contactBar.style.cssText = 'background:#006600;color:#fff;padding:6px 8px;font-size:11px;display:flex;justify-content:space-between;';
          contactBar.innerHTML =
            '<div>' +
              '<span style="color:#0f0;">●</span> <b>cool_dude_98</b> (Online)' +
            '</div>' +
            '<div style="color:#aaa;">' +
              '<span style="color:#888;">●</span> xX_Anjali_Xx (Offline)' +
            '</div>';
          body.appendChild(contactBar);

          // Chat area
          var chatArea = document.createElement('div');
          chatArea.style.cssText = 'flex:1;overflow:auto;padding:8px;background:#fff;font-size:11px;';
          chatArea.innerHTML =
            '<p style="color:#888;text-align:center;font-size:10px;margin-bottom:8px;">— Chat session started —</p>' +
            '<p style="color:#888;text-align:center;font-size:10px;">xX_Anjali_Xx is offline. She\'s been offline since 1999.</p>';
          body.appendChild(chatArea);

          // Input area
          var inputArea = document.createElement('div');
          inputArea.style.cssText = 'display:flex;gap:4px;padding:6px;background:#c0c0c0;border-top:1px solid #808080;';
          var chatInput = document.createElement('input');
          chatInput.type = 'text';
          chatInput.placeholder = 'Type a message...';
          chatInput.style.cssText = 'flex:1;font-size:11px;padding:3px;';
          var sendBtn = document.createElement('button');
          sendBtn.textContent = 'Send';
          sendBtn.style.fontSize = '10px';
          inputArea.appendChild(chatInput);
          inputArea.appendChild(sendBtn);
          body.appendChild(inputArea);

          function addMessage(sender, text, color) {
            var p = document.createElement('p');
            p.style.cssText = 'margin:4px 0;';
            p.innerHTML = '<b style="color:' + (color || '#000') + ';">' + sender + ':</b> ' + text;
            chatArea.appendChild(p);
            chatArea.scrollTop = chatArea.scrollHeight;
          }

          function sendMessage() {
            var text = chatInput.value.trim();
            if (!text) return;
            addMessage('You', text, '#000080');
            chatInput.value = '';
            messageCount++;
          }

          sendBtn.onclick = sendMessage;
          chatInput.onkeydown = function(e) {
            if (e.key === 'Enter') sendMessage();
          };

          // Bot messages
          botScript.forEach(function(entry) {
            setTimeout(function() {
              if (!WM.isOpen(winId)) return;
              addMessage('cool_dude_98', entry.msg, '#008000');
              if (typeof Sound !== 'undefined') Sound.uhoh();
            }, entry.delay);
          });
        }
      });
    }
  });
})();
