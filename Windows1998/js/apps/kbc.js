/* kbc.js — Kaun Banega Crorepati quiz (Part 2) */
(function() {
  'use strict';
  if (typeof Apps === 'undefined') return;

  var questions = [
    {
      q: "What is the password to Sharma-ji's computer?",
      options: ['sharma123', 'gandhi123', 'password', 'rahul_cool'],
      answer: 1, prize: '₹1,000'
    },
    {
      q: "How much RAM does Sharma-ji's PC have?",
      options: ['16 MB', '32 MB', '64 MB', '128 MB'],
      answer: 2, prize: '₹10,000'
    },
    {
      q: "What is Rahul's school project about?",
      options: ['Quit India Movement', 'Dandi March', 'French Revolution', 'How to fix a printer'],
      answer: 1, prize: '₹50,000'
    },
    {
      q: "What does Y2K stand for?",
      options: ['Year 2 Keyboard', 'Year 2000', 'Your 2nd Keyboard', 'Yahoo 2000'],
      answer: 1, prize: '₹1,00,000'
    },
    {
      q: "What was Sharma-ji's monthly cyber café bill?",
      options: ['₹300', '₹500', '₹1,000', '₹3,000'],
      answer: 3, prize: '₹10,00,000'
    },
    {
      q: "Who is 'xX_Anjali_Xx' in the chat?",
      options: ['A bot', "Rahul's crush", "Papa's colleague", 'Nobody knows, she was always offline'],
      answer: 3, prize: '₹50,00,000'
    },
    {
      q: "Which button do you click to shut down Windows 98?",
      options: ['Start', 'Start', 'Start', 'Start'],
      answer: 0, prize: '₹1 Crore'
    }
  ];

  Apps.register('kbc', {
    title: 'KBC - Kaun Banega Crorepati',
    icon: '🎯',
    open: function() {
      var winId = 'kbc_' + Date.now();
      var currentQ = 0;
      var lifelines = { phone: true, fifty: true, audience: true };
      var fiftyUsedTwice = false;

      WM.open({
        id: winId,
        title: 'Kaun Banega Crorepati',
        icon: '🎯',
        width: 500,
        height: 420,
        render: function(body) {
          body.style.cssText = 'background:linear-gradient(180deg,#000033 0%,#000066 100%);color:#fff;padding:12px;height:calc(100% - 22px);display:flex;flex-direction:column;';

          function renderQuestion() {
            body.innerHTML = '';
            if (currentQ >= questions.length) {
              // Won!
              body.innerHTML =
                '<div style="text-align:center;padding:40px;">' +
                  '<h2 style="color:#ffd700;">🏆 CONGRATULATIONS! 🏆</h2>' +
                  '<p style="font-size:24px;margin:16px 0;">You won ₹1 Crore!</p>' +
                  '<p style="font-size:12px;color:#aaa;">(Prize money is imaginary, like Sharma-ji\'s savings)</p>' +
                '</div>';
              return;
            }

            var q = questions[currentQ];

            // Prize ladder
            var ladder = document.createElement('div');
            ladder.style.cssText = 'text-align:right;font-size:10px;color:#888;margin-bottom:8px;';
            ladder.textContent = 'For ' + q.prize;
            body.appendChild(ladder);

            // Question
            var qEl = document.createElement('div');
            qEl.style.cssText = 'background:rgba(255,255,255,0.1);border:1px solid #336;border-radius:20px;padding:12px 16px;text-align:center;font-size:14px;margin-bottom:12px;';
            qEl.textContent = q.q;
            body.appendChild(qEl);

            // Options
            var optionsGrid = document.createElement('div');
            optionsGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;';
            var labels = ['A', 'B', 'C', 'D'];

            q.options.forEach(function(opt, i) {
              var btn = document.createElement('button');
              btn.style.cssText = 'background:rgba(0,0,80,0.8);color:#fff;border:1px solid #446;border-radius:16px;padding:8px 12px;cursor:pointer;font-size:12px;text-align:left;';
              btn.textContent = labels[i] + ': ' + opt;
              btn.dataset.idx = i;
              btn.onmouseenter = function() { btn.style.background = 'rgba(100,100,255,0.4)'; };
              btn.onmouseleave = function() { btn.style.background = 'rgba(0,0,80,0.8)'; };
              btn.onclick = function() {
                // Show lock confirmation
                lockAndAnswer(body, q, i, optionsGrid);
              };
              optionsGrid.appendChild(btn);
            });
            body.appendChild(optionsGrid);

            // Last question egg
            if (currentQ === questions.length - 1) {
              if (typeof Egg !== 'undefined') Egg.unlock(22, 'KBC final question — Every option says Start');
            }

            // Lifelines
            var lifelineBar = document.createElement('div');
            lifelineBar.style.cssText = 'display:flex;justify-content:center;gap:12px;';

            if (lifelines.phone) {
              var phoneBtn = document.createElement('button');
              phoneBtn.textContent = '📞 Phone a Friend';
              phoneBtn.style.cssText = 'font-size:10px;padding:4px 8px;';
              phoneBtn.onclick = function() {
                lifelines.phone = false;
                if (typeof Sound !== 'undefined' && Sound.modem) Sound.modem();
                if (typeof Popup !== 'undefined' && Popup.info) {
                  Popup.info({ title: '📞 Phone a Friend', msg: '📞 Dialing...<br>🔊 *modem noises*<br><br>"Number busy."<br><br>📞 Trying again...<br>"Number busy."<br><br>📞 Third try...<br>Friend: "Bhai, just press Start."' });
                }
                renderQuestion();
              };
              lifelineBar.appendChild(phoneBtn);
            }

            if (lifelines.fifty) {
              var fiftyBtn = document.createElement('button');
              fiftyBtn.textContent = '50:50';
              fiftyBtn.style.cssText = 'font-size:10px;padding:4px 8px;';
              fiftyBtn.onclick = function() {
                if (!fiftyUsedTwice) {
                  // Remove two wrong options
                  var btns = optionsGrid.querySelectorAll('button');
                  var removed = 0;
                  btns.forEach(function(b) {
                    var idx = parseInt(b.dataset.idx);
                    if (idx !== q.answer && removed < 2) {
                      b.style.opacity = '0.3';
                      b.disabled = true;
                      removed++;
                    }
                  });
                  fiftyUsedTwice = true;
                  fiftyBtn.textContent = '50:50 (once more?)';
                } else {
                  lifelines.fifty = false;
                  if (typeof Popup !== 'undefined' && Popup.error) {
                    Popup.error({ title: 'Technical Glitch', msg: '⚡ Technical glitch!<br>The 50:50 computer has crashed.<br>Please refer to the audience.' });
                  }
                  renderQuestion();
                }
              };
              lifelineBar.appendChild(fiftyBtn);
            }

            if (lifelines.audience) {
              var audBtn = document.createElement('button');
              audBtn.textContent = '👥 Audience Poll';
              audBtn.style.cssText = 'font-size:10px;padding:4px 8px;';
              audBtn.onclick = function() {
                lifelines.audience = false;
                if (typeof Popup !== 'undefined' && Popup.info) {
                  Popup.info({
                    title: '👥 Audience Poll',
                    msg: 'A: 0%<br>B: 0%<br><b>C: 100%</b> — "cyber café guy said so"<br>D: 0%'
                  });
                }
                renderQuestion();
              };
              lifelineBar.appendChild(audBtn);
            }

            body.appendChild(lifelineBar);
          }

          function lockAndAnswer(body, q, chosenIdx, optionsGrid) {
            // "Lock kiya jaye?" confirmation
            var lockDiv = document.createElement('div');
            lockDiv.style.cssText = 'text-align:center;margin-top:8px;';
            var lockBtn = document.createElement('button');
            lockBtn.textContent = '🔒 Lock kiya jaye?';
            lockBtn.style.cssText = 'background:#ffd700;color:#000;font-weight:bold;padding:6px 16px;font-size:13px;cursor:pointer;';
            lockBtn.onclick = function() {
              lockDiv.remove();
              // Highlight answer
              var btns = optionsGrid.querySelectorAll('button');
              btns.forEach(function(b) {
                var idx = parseInt(b.dataset.idx);
                b.disabled = true;
                if (idx === chosenIdx) {
                  b.style.background = idx === q.answer ? '#0a0' : '#a00';
                }
                if (idx === q.answer && idx !== chosenIdx) {
                  b.style.background = '#0a0';
                }
              });
              if (chosenIdx === q.answer) {
                if (typeof Sound !== 'undefined') Sound.chime();
                setTimeout(function() { currentQ++; renderQuestion(); }, 1500);
              } else {
                if (typeof Sound !== 'undefined') Sound.error();
                setTimeout(function() {
                  body.innerHTML =
                    '<div style="text-align:center;padding:40px;">' +
                      '<h2 style="color:#f44;">❌ Wrong Answer!</h2>' +
                      '<p style="margin:12px 0;">You leave with: nothing (like Sharma-ji\'s savings account)</p>' +
                      '<button onclick="WM.close(\'' + winId + '\')">Quit</button>' +
                    '</div>';
                }, 1500);
              }
            };
            lockDiv.appendChild(lockBtn);
            body.appendChild(lockDiv);
          }

          renderQuestion();
        }
      });
    }
  });
})();
