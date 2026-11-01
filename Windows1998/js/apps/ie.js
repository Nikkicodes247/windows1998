/* ie.js — Internet Explorer (Part 3) */
(function() {
  'use strict';
  if (typeof Apps === 'undefined') return;

  Apps.register('ie', {
    title: 'Internet Explorer',
    icon: '🌐',
    open: function(opts) {
      // Check for dial-up first
      var dialupApp = (typeof Apps !== 'undefined' && Apps.get) ? Apps.get('dialup') : null;
      var isConnected = (dialupApp && typeof dialupApp.isConnected === 'function') ? dialupApp.isConnected() : false;
      if (!isConnected) {
        if (typeof Apps !== 'undefined' && Apps.launch) {
          Apps.launch('dialup', {
            onConnect: function() { openIE(opts); }
          });
        }
        return;
      }
      openIE(opts);
    }
  });

  function openIE(opts) {
    var winId = 'ie_' + Date.now();
    var timerSeconds = 180; // 3 minutes
    var timerInterval = null;
    var currentPage = 'search';

    if (typeof Specs !== 'undefined' && Specs.ieOpen) {
      setTimeout(function() { Specs.ieOpen(); }, 2000);
    }

    WM.open({
      id: winId,
      title: 'Internet Explorer — Cyber Café Edition',
      icon: '🌐',
      width: 600,
      height: 480,
      render: function(body) {
        body.style.cssText = 'display:flex;flex-direction:column;height:calc(100% - 22px);background:#fff;';

        // Toolbar
        var toolbar = document.createElement('div');
        toolbar.style.cssText = 'display:flex;align-items:center;gap:4px;padding:4px;background:#c0c0c0;border-bottom:1px solid #808080;flex-shrink:0;';

        var backBtn = document.createElement('button');
        backBtn.textContent = '← Back';
        backBtn.style.fontSize = '10px';
        backBtn.onclick = function() { navigateTo('search'); };
        toolbar.appendChild(backBtn);

        var fwdBtn = document.createElement('button');
        fwdBtn.textContent = 'Forward →';
        fwdBtn.style.fontSize = '10px';
        toolbar.appendChild(fwdBtn);

        var stopBtn = document.createElement('button');
        stopBtn.textContent = '✕ Stop';
        stopBtn.style.fontSize = '10px';
        toolbar.appendChild(stopBtn);

        var addressBar = document.createElement('input');
        addressBar.type = 'text';
        addressBar.value = 'http://www.search.bhilai.net';
        addressBar.style.cssText = 'flex:1;font-size:11px;padding:2px 4px;';
        addressBar.onkeydown = function(e) {
          if (e.key === 'Enter') {
            var val = addressBar.value.toLowerCase();
            if (val.indexOf('geocities') !== -1 || val.indexOf('sharma') !== -1) navigateTo('geocities');
            else if (val.indexOf('result') !== -1) navigateTo('results');
            else navigateTo('search');
          }
        };
        toolbar.appendChild(addressBar);

        var goBtn = document.createElement('button');
        goBtn.textContent = 'Go';
        goBtn.style.fontSize = '10px';
        goBtn.onclick = function() { addressBar.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); };
        toolbar.appendChild(goBtn);

        // Cyber café timer
        var timerEl = document.createElement('div');
        timerEl.style.cssText = 'font-family:monospace;font-size:10px;background:#000;color:#0f0;padding:2px 6px;min-width:80px;text-align:center;';
        timerEl.textContent = 'Time: 03:00 ₹30/hr';
        toolbar.appendChild(timerEl);

        body.appendChild(toolbar);

        // Content area
        var content = document.createElement('div');
        content.style.cssText = 'flex:1;overflow:auto;padding:0;';
        body.appendChild(content);

        // Timer
        timerInterval = setInterval(function() {
          if (!WM.isOpen(winId)) { clearInterval(timerInterval); return; }
          timerSeconds--;
          var m = Math.floor(timerSeconds / 60);
          var s = timerSeconds % 60;
          timerEl.textContent = 'Time: ' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + ' ₹30/hr';

          if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            if (typeof Egg !== 'undefined' && Egg.unlock) Egg.unlock(29, 'IE: Cyber café timer ended — Add ₹10?');
            if (typeof Popup !== 'undefined' && Popup.info) {
              Popup.info({
                title: '⏰ Time Up!',
                msg: 'Your cyber café time is up!<br>Add ₹10 for 5 more minutes?<br><br>Total bill so far: ₹30<br>(Sharma-ji\'s monthly bill: ₹3,000)',
                buttons: ['Add ₹10', 'Log off'],
                onButton: function(btn) {
                  if (btn === 'Add ₹10') {
                    timerSeconds = 300;
                    timerInterval = setInterval(function() {
                      if (!WM.isOpen(winId)) { clearInterval(timerInterval); return; }
                      timerSeconds--;
                      var m2 = Math.floor(timerSeconds / 60);
                      var s2 = timerSeconds % 60;
                      timerEl.textContent = 'Time: ' + String(m2).padStart(2, '0') + ':' + String(s2).padStart(2, '0') + ' ₹30/hr';
                    }, 1000);
                  } else {
                    WM.close(winId);
                  }
                }
              });
            }
          }
        }, 1000);

        function navigateTo(page) {
          currentPage = page;
          content.innerHTML = '';
          content.style.padding = '16px';

          switch(page) {
            case 'search':
              addressBar.value = 'http://www.search.bhilai.net';
              renderSearch(content);
              break;
            case 'geocities':
              addressBar.value = 'http://www.geocities.com/sharmaji_bhilai';
              renderGeocities(content);
              break;
            case 'results':
              addressBar.value = 'http://www.examresults1999.nic.in';
              renderResults(content);
              break;
            default:
              renderSearch(content);
          }
        }

        function renderSearch(el) {
          el.innerHTML =
            '<div style="text-align:center;padding:40px 0;">' +
              '<h1 style="font-size:36px;color:#333;font-family:serif;margin-bottom:4px;">Bhilai Search</h1>' +
              '<p style="color:#888;font-size:11px;margin-bottom:16px;">Index contains ~25 million pages (soon to be much bigger)</p>' +
              '<div style="max-width:400px;margin:0 auto;">' +
                '<input id="ie-search-input" type="text" style="width:100%;padding:4px;font-size:12px;margin-bottom:8px;" placeholder="Search the World Wide Web...">' +
                '<div style="display:flex;gap:8px;justify-content:center;">' +
                  '<button onclick="document.getElementById(\'ie-search-input\').value&&ieShowResults()">Search</button>' +
                  '<button id="ie-lucky-btn" style="position:relative;">I\'m Feeling Lucky</button>' +
                '</div>' +
              '</div>' +
              '<div style="margin-top:24px;font-size:11px;">' +
                '<a href="#" onclick="ieNavigate(\'geocities\');return false;" style="color:#0000ff;">Sharma-ji\'s GeoCities Page</a> | ' +
                '<a href="#" onclick="ieNavigate(\'results\');return false;" style="color:#0000ff;">Check Board Results</a>' +
              '</div>' +
            '</div>';

          // "I'm Feeling Lucky" dodge
          var luckyBtn = document.getElementById('ie-lucky-btn');
          if (luckyBtn) {
            luckyBtn.addEventListener('mouseover', function() {
              if (typeof Egg !== 'undefined') Egg.unlock(26, "IE: I'm Feeling Lucky — button dodges cursor");
              var parent = luckyBtn.parentElement;
              luckyBtn.style.position = 'relative';
              luckyBtn.style.left = (Math.random() * 100 - 50) + 'px';
              luckyBtn.style.top = (Math.random() * 40 - 20) + 'px';
            });
          }
        }

        function renderGeocities(el) {
          var visitorCount = 7;
          el.innerHTML =
            '<div style="background:linear-gradient(90deg,#ff0,#f0f,#0ff,#ff0);padding:4px;text-align:center;font-weight:bold;font-size:14px;color:#000;">' +
              '🚧 UNDER CONSTRUCTION 🚧' +
            '</div>' +
            '<div style="background:#000080;color:#fff;padding:12px;text-align:center;">' +
              '<h1 style="font-family:\'Comic Sans MS\',cursive;font-size:20px;">★ SHARMA-JI\'S OFFICIAL HOME PAGE ★</h1>' +
              '<marquee style="color:#ff0;font-size:12px;">Welcome to my website! Best viewed in Internet Explorer 4.0 at 800x600!</marquee>' +
            '</div>' +
            '<div style="background:#fff;padding:16px;text-align:center;">' +
              '<p style="font-size:14px;">👋 Namaste! I am Sharma-ji from Bhilai Steel Plant.</p>' +
              '<p style="font-size:12px;color:#888;">This page has been visited by:</p>' +
              '<div id="ie-visitor-counter" style="font-family:monospace;font-size:24px;color:#f00;background:#000;display:inline-block;padding:4px 12px;margin:8px 0;">' +
                String(visitorCount).padStart(6, '0') +
              '</div>' +
              '<p style="font-size:10px;">people (mostly me refreshing)</p>' +
              '<hr>' +
              '<h3 style="color:#800000;">📖 Guestbook</h3>' +
              '<div style="border:1px solid #ccc;padding:8px;text-align:left;font-size:11px;max-width:400px;margin:8px auto;background:#ffffee;">' +
                '<p><b>Gupta</b> (12 Nov 1999): "Nice website Sharma-ji! How to download RAM?"</p>' +
                '<p><b>Verma</b> (15 Nov 1999): "Your page crashed my computer. Good job."</p>' +
                '<p><b>Anonymous</b> (20 Nov 1999): "Please fix the visitor counter it keeps going up when I refresh"</p>' +
              '</div>' +
              '<hr>' +
              '<div style="margin-top:12px;">' +
                '<span style="font-size:11px;">← <a href="#" style="color:#0000ff;">Prev</a></span>' +
                ' | <b>🌐 Bhilai WebRing</b> | ' +
                '<span style="font-size:11px;"><a href="#" onclick="alert(\'Random page: Error 404\');return false;" style="color:#0000ff;">Random</a></span>' +
                ' | <span style="font-size:11px;"><a href="#" style="color:#0000ff;">Next</a> →</span>' +
              '</div>' +
              '<div style="margin-top:16px;background:linear-gradient(90deg,#ff0,#f0f,#0ff,#ff0);padding:4px;text-align:center;font-size:12px;">' +
                '🚧 More content coming soon! (Since 1998) 🚧' +
              '</div>' +
            '</div>';

          // Increment counter
          var counterEl = document.getElementById('ie-visitor-counter');
          if (counterEl) {
            setInterval(function() {
              visitorCount++;
              if (counterEl) counterEl.textContent = String(visitorCount).padStart(6, '0');
            }, 3000);
          }
        }

        function renderResults(el) {
          var attempts = 0;
          el.innerHTML = '<div id="ie-results-area" style="text-align:center;padding:40px;"></div>';
          tryLoad();

          function tryLoad() {
            var area = document.getElementById('ie-results-area');
            if (!area) return;
            attempts++;
            if (attempts <= 3) {
              area.innerHTML =
                '<h2 style="color:#800000;">Board Examination Results 1999</h2>' +
                '<p style="margin:12px 0;">Loading results...</p>' +
                '<div style="margin:12px auto;width:200px;height:16px;border:1px solid #808080;">' +
                  '<div style="width:' + (attempts * 30) + '%;height:100%;background:#000080;"></div>' +
                '</div>' +
                '<p style="color:#f00;font-weight:bold;margin-top:12px;">❌ Server busy. ' + (3 - attempts) + ' attempt(s) remaining.</p>' +
                '<button onclick="ieRetryResults()">Retry</button>';
            } else {
              // Success!
              if (typeof Egg !== 'undefined') Egg.unlock(27, 'IE: Board results — PASS (grace marks applied)');
              area.innerHTML =
                '<h2 style="color:#008000;">Board Examination Results 1999</h2>' +
                '<div style="border:2px solid #000;padding:16px;max-width:400px;margin:12px auto;text-align:left;background:#ffffee;">' +
                  '<p><b>Student:</b> Rahul Sharma</p>' +
                  '<p><b>Roll No:</b> 23</p>' +
                  '<p><b>School:</b> Bhilai Vidyalaya</p>' +
                  '<hr style="margin:8px 0;">' +
                  '<p>Hindi: 67</p>' +
                  '<p>English: 54</p>' +
                  '<p>Mathematics: 41 <span style="color:#f00;">(grace marks applied)</span></p>' +
                  '<p>Science: 58</p>' +
                  '<p>Social Studies: 72</p>' +
                  '<hr style="margin:8px 0;">' +
                  '<p style="font-size:16px;color:#008000;font-weight:bold;">Result: PASS ✅</p>' +
                  '<p style="font-size:10px;color:#888;">(grace marks applied in Mathematics)</p>' +
                '</div>';
            }
          }

          // Expose retry function
          window.ieRetryResults = tryLoad;
        }

        // Navigation helpers
        window.ieNavigate = function(page) { navigateTo(page); };
        window.ieShowResults = function() {
          var searchInput = document.getElementById('ie-search-input');
          var query = searchInput ? searchInput.value : '';
          content.innerHTML = '';
          content.style.padding = '16px';
          content.innerHTML =
            '<h3 style="margin-bottom:8px;">Search results for: "' + query + '"</h3>' +
            '<div style="font-size:11px;">' +
              '<p style="margin:8px 0;"><a href="#" onclick="ieNavigate(\'geocities\');return false;" style="color:#0000ff;font-size:13px;">' + query + ' — Sharma-ji\'s Page</a><br><span style="color:#008000;">www.geocities.com/sharmaji_bhilai</span><br>Sharma-ji from Bhilai has written extensively about ' + query + '. Page under construction since 1998.</p>' +
              '<p style="margin:8px 0;"><a href="#" style="color:#0000ff;font-size:13px;">' + query + ' — Ask Gupta</a><br><span style="color:#008000;">www.guptaknows.tripod.com</span><br>Gupta claims to know everything about ' + query + '. He doesn\'t.</p>' +
              '<p style="margin:8px 0;"><a href="#" style="color:#0000ff;font-size:13px;">Download ' + query + ' FREE!!!!</a><br><span style="color:#008000;">www.totallylegit-downloads.com</span><br>FREE download of ' + query + '! No virus! (Probably virus.)</p>' +
              '<p style="margin:8px 0;"><a href="#" onclick="ieNavigate(\'results\');return false;" style="color:#0000ff;font-size:13px;">Board Results 1999 — ' + query + '</a><br><span style="color:#008000;">www.examresults1999.nic.in</span><br>Check your board examination results online. Server usually busy.</p>' +
            '</div>';
        };

        // Initial page
        navigateTo('search');
      }
    });
  }
})();
