/* dialup.js — Dial-up Connection (Part 3) */
(function() {
  'use strict';
  if (typeof Apps === 'undefined') return;

  var connected = false;
  var disconnectCount = 0;

  Apps.register('dialup', {
    title: 'Connect to Desi Net',
    icon: '📞',
    open: function(opts) {
      if (connected) {
        if (opts && opts.onConnect) opts.onConnect();
        return;
      }

      var winId = 'dialup_' + Date.now();
      WM.open({
        id: winId,
        title: 'Connect to Desi Net',
        icon: '📞',
        width: 340,
        height: 280,
        render: function(body) {
          body.style.cssText = 'padding:12px;height:calc(100% - 22px);';

          var statusEl = document.createElement('div');
          statusEl.style.cssText = 'margin-bottom:12px;';
          statusEl.innerHTML =
            '<p><b>🌐 Desi Net — Dial-Up Connection</b></p>' +
            '<p style="font-size:10px;margin-top:4px;">Phone number: 0788-DESI-NET</p>' +
            '<p style="font-size:10px;">Plan: ₹15,000/year (Public dial-up launched 15 August 1995)</p>';
          body.appendChild(statusEl);

          var logEl = document.createElement('div');
          logEl.style.cssText = 'background:#000;color:#0f0;font-family:monospace;font-size:11px;padding:8px;height:100px;overflow:auto;border:1px inset;margin-bottom:8px;';
          body.appendChild(logEl);

          var btnRow = document.createElement('div');
          btnRow.style.cssText = 'display:flex;gap:8px;justify-content:center;';
          var connectBtn = document.createElement('button');
          connectBtn.textContent = '📞 Connect';
          var cancelBtn = document.createElement('button');
          cancelBtn.textContent = 'Cancel';
          cancelBtn.onclick = function() { WM.close(winId); };
          btnRow.appendChild(connectBtn);
          btnRow.appendChild(cancelBtn);
          body.appendChild(btnRow);

          var finePrint = document.createElement('p');
          finePrint.style.cssText = 'font-size:9px;color:#888;margin-top:8px;text-align:center;';
          finePrint.textContent = 'Public dial-up launched 15 August 1995. Plan: ₹15,000 a year. Charges apply per minute.';
          body.appendChild(finePrint);

          function log(text) {
            logEl.textContent += text + '\n';
            logEl.scrollTop = logEl.scrollHeight;
          }

          connectBtn.onclick = function() {
            connectBtn.disabled = true;
            log('Dialing 0788-DESI-NET...');
            if (typeof Sound !== 'undefined') Sound.modem();

            setTimeout(function() {
              log('Connecting at 33.6 kbps...');
            }, 1000);

            setTimeout(function() {
              disconnectCount++;
              if (disconnectCount <= 2) {
                // Mummy picks up the phone
                if (typeof Egg !== 'undefined') Egg.unlock(28, 'Dial-up: Mummy picked up the phone');
                log('');
                log('--- CONNECTION INTERRUPTED ---');
                log('Mummy picked up the phone. Disconnected.');
                log('');
                if (typeof Popup !== 'undefined') {
                  Popup.warn({
                    title: '📞 Disconnected',
                    msg: 'Mummy picked up the phone.<br>Connection lost.<br><br>"Rahul! Are you on that internet again?!"',
                    onButton: function() {
                      connectBtn.disabled = false;
                      connectBtn.textContent = '📞 Retry (' + disconnectCount + '/3)';
                    }
                  });
                } else {
                  connectBtn.disabled = false;
                }
              } else {
                // Success!
                log('Handshaking...');
                setTimeout(function() {
                  log('CONNECTED at 33.6 kbps!');
                  log('Welcome to Desi Net!');
                  connected = true;
                  setTimeout(function() {
                    WM.close(winId);
                    if (opts && opts.onConnect) opts.onConnect();
                  }, 800);
                }, 1000);
              }
            }, 3500);
          };
        }
      });
    },

    isConnected: function() { return connected; }
  });
})();
