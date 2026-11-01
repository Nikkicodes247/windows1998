/* outlook.js — Outlook Express (Part 3) */
(function() {
  'use strict';
  if (typeof Apps === 'undefined') return;

  var emails = {
    inbox: [
      {
        from: 'Gupta <gupta_rocks@rediffmail.com>',
        subject: 'FW: FW: FW: Y2K SURVIVAL TIPS',
        date: '28 Dec 1999',
        body: '---------- Forwarded 47 times ----------\n\n' +
              'URGENT!!! READ BEFORE 31 DECEMBER!!!\n\n' +
              'Y2K SURVIVAL TIPS:\n' +
              '1. All computers will EXPLODE at midnight\n' +
              '2. ATMs will give out FREE MONEY (or catch fire)\n' +
              '3. Planes will fall from the sky\n' +
              '4. Your microwave will become SENTIENT\n\n' +
              'FORWARD THIS TO 50 PEOPLE OR YOUR COMPUTER WILL CRASH!!!\n\n' +
              '(It will crash anyway because it\'s Windows 98)\n\n' +
              '--- Original message from Uncle who knows a guy who works in IT ---'
      },
      {
        from: 'Nokia Prizes <winner@nokia-prize.com>',
        subject: 'You have won a Nokia 3310!!!',
        date: '25 Dec 1999',
        body: 'CONGRATULATIONS!!!\n\n' +
              'You have been selected as the LUCKY WINNER of a\n' +
              'BRAND NEW NOKIA 3310!!!\n\n' +
              'To claim your prize, please send:\n' +
              '- Your full name\n' +
              '- Your address\n' +
              '- Your bank account number\n' +
              '- Your mother\'s maiden name\n' +
              '- Your ATM PIN\n' +
              '- Your first pet\'s name\n' +
              '- Your blood type (just in case)\n\n' +
              'Reply within 24 hours or the Nokia goes to Gupta!\n\n' +
              '(This is definitely not a scam. We promise. -Management)'
      },
      {
        from: 'Verma <verma_cool@yahoo.com>',
        subject: 'FW: Send to 10 people or 7 years bad luck',
        date: '22 Dec 1999',
        body: '⚠️ THIS IS NOT A JOKE ⚠️\n\n' +
              'A man in Indore did not forward this email.\n' +
              'Three days later, his printer stopped working.\n\n' +
              'A woman in Pune forwarded this email to 10 people.\n' +
              'The next day, she found ₹10 on the road.\n\n' +
              'FORWARD TO 10 PEOPLE IN 10 MINUTES OR:\n' +
              '- Your mouse ball will disappear\n' +
              '- Your screensaver will judge you\n' +
              '- Mummy will check your browser history\n\n' +
              'Don\'t break the chain!!!'
      },
      {
        from: 'Cyber Café Billing <billing@desinet.co.in>',
        subject: 'Your cyber café bill: ₹3,000',
        date: '20 Dec 1999',
        body: 'Dear Sharma-ji,\n\n' +
              'Your monthly cyber café bill is: ₹3,000\n\n' +
              'Breakdown:\n' +
              '- Email checking: ₹200 (12 minutes)\n' +
              '- "Research": ₹800 (3 hours)\n' +
              '- Downloading cricket_sharjah_1998.avi: ₹1,500 (47 hours)\n' +
              '- Printing 3 pages: ₹100\n' +
              '- Asking Bunty how to attach a file: ₹400 (2 hours)\n\n' +
              'Payment due: Immediately\n' +
              'Payment method: Cash only (Mummy has the card)\n\n' +
              'Note: The cricket video is still only 40% downloaded.\n\n' +
              'Best regards,\n' +
              'Bunty\'s Cyber Café, Sector 6, Bhilai'
      },
      {
        from: 'MAILER-DAEMON',
        subject: 'Delivery failure: mailbox full',
        date: '30 Dec 1999',
        body: 'Your message could not be delivered.\n\n' +
              'Recipient: papa_sharma@bsp.co.in\n' +
              'Reason: Mailbox full (Papa\'s forwards)\n\n' +
              'Papa has forwarded 2,847 emails this month.\n' +
              'His mailbox has exceeded the 5 MB limit.\n' +
              '(4.9 MB are "FW: FW: FW:" emails)\n\n' +
              'Recommendation: Ask Papa to delete some forwards.\n' +
              'Probability of Papa deleting forwards: 0%',
        isEgg: true
      }
    ],
    drafts: [
      {
        from: 'Me (Rahul)',
        subject: 'To Anjali — DRAFT (do not send)',
        date: '31 Dec 1999',
        body: 'Dear Anjali,\n\n' +
              'I have written this email 4 times.\n' +
              'Each time I press Send, the internet disconnects.\n' +
              'Maybe it\'s a sign. Maybe it\'s Mummy picking up the phone.\n\n' +
              'I wanted to say that I think you\'re really nice.\n' +
              'That\'s it. That\'s the whole email.\n' +
              'I\'ve been working on this sentence for 3 hours.\n\n' +
              'Gupta says I should add a joke. Here goes:\n' +
              'Why did the computer go to the doctor?\n' +
              'Because it had a virus.\n\n' +
              'Gupta\'s jokes are terrible. But so is my courage.\n\n' +
              'STATUS: NOT SENT (and probably never will be)\n\n' +
              '— Rahul\n\n' +
              'P.S. If you somehow read this, pretend you didn\'t.'
      }
    ],
    sent: []
  };

  Apps.register('outlook', {
    title: 'Outlook Express',
    icon: '📧',
    open: function() {
      var winId = 'outlook_' + Date.now();
      var currentFolder = 'inbox';
      var currentEmail = null;

      WM.open({
        id: winId,
        title: 'Outlook Express',
        icon: '📧',
        width: 580,
        height: 420,
        render: function(body) {
          body.style.cssText = 'display:flex;height:calc(100% - 22px);';

          // Folder list
          var folderPanel = document.createElement('div');
          folderPanel.style.cssText = 'width:120px;background:#c0c0c0;border-right:1px solid #808080;padding:4px;flex-shrink:0;';
          folderPanel.innerHTML =
            '<div style="font-weight:bold;font-size:11px;margin-bottom:4px;">📧 Outlook Express</div>';

          var folders = [
            { name: 'inbox', label: '📥 Inbox (' + emails.inbox.length + ')', count: emails.inbox.length },
            { name: 'drafts', label: '📝 Drafts (' + emails.drafts.length + ')', count: emails.drafts.length },
            { name: 'sent', label: '📤 Sent Items', count: 0 }
          ];

          folders.forEach(function(f) {
            var fEl = document.createElement('div');
            fEl.style.cssText = 'padding:3px 6px;cursor:pointer;font-size:11px;margin:1px 0;';
            fEl.textContent = f.label;
            fEl.onclick = function() {
              currentFolder = f.name;
              currentEmail = null;
              renderFolder();
            };
            fEl.onmouseenter = function() { fEl.style.background = '#000080'; fEl.style.color = '#fff'; };
            fEl.onmouseleave = function() { fEl.style.background = ''; fEl.style.color = ''; };
            folderPanel.appendChild(fEl);
          });

          body.appendChild(folderPanel);

          // Main area
          var mainArea = document.createElement('div');
          mainArea.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden;';
          body.appendChild(mainArea);

          // Email list
          var listArea = document.createElement('div');
          listArea.style.cssText = 'height:45%;overflow:auto;border-bottom:2px solid #808080;';
          mainArea.appendChild(listArea);

          // Preview pane
          var previewArea = document.createElement('div');
          previewArea.style.cssText = 'flex:1;overflow:auto;padding:8px;background:#fff;font-size:11px;';
          previewArea.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">Select an email to preview</p>';
          mainArea.appendChild(previewArea);

          function renderFolder() {
            listArea.innerHTML = '';
            var emailList = emails[currentFolder] || [];

            if (emailList.length === 0) {
              listArea.innerHTML = '<p style="color:#888;text-align:center;padding:20px;">No messages in this folder.</p>';
              return;
            }

            // Header row
            var headerRow = document.createElement('div');
            headerRow.style.cssText = 'display:flex;background:#c0c0c0;border-bottom:1px solid #808080;padding:2px 4px;font-size:10px;font-weight:bold;';
            headerRow.innerHTML = '<span style="width:40%;">From</span><span style="width:40%;">Subject</span><span style="width:20%;">Date</span>';
            listArea.appendChild(headerRow);

            emailList.forEach(function(email, idx) {
              var row = document.createElement('div');
              row.style.cssText = 'display:flex;padding:3px 4px;font-size:11px;cursor:pointer;border-bottom:1px solid #ddd;';
              row.innerHTML =
                '<span style="width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + email.from + '</span>' +
                '<span style="width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:bold;">' + email.subject + '</span>' +
                '<span style="width:20%;font-size:10px;color:#888;">' + email.date + '</span>';

              row.onclick = function() {
                currentEmail = email;
                // Highlight
                listArea.querySelectorAll('div').forEach(function(r) { r.style.background = ''; r.style.color = ''; });
                row.style.background = '#000080';
                row.style.color = '#fff';
                showEmail(email);
              };
              row.onmouseenter = function() { if (currentEmail !== email) { row.style.background = '#e0e0e0'; } };
              row.onmouseleave = function() { if (currentEmail !== email) { row.style.background = ''; row.style.color = ''; } };

              listArea.appendChild(row);
            });
          }

          function showEmail(email) {
            previewArea.innerHTML =
              '<div style="border-bottom:1px solid #ccc;padding-bottom:6px;margin-bottom:8px;">' +
                '<p><b>From:</b> ' + email.from + '</p>' +
                '<p><b>Subject:</b> ' + email.subject + '</p>' +
                '<p><b>Date:</b> ' + email.date + '</p>' +
              '</div>' +
              '<pre style="white-space:pre-wrap;font-family:\'Courier New\',monospace;font-size:11px;">' + email.body + '</pre>';

            // Easter egg for delivery failure
            if (email.isEgg && typeof Egg !== 'undefined') {
              Egg.unlock(30, "Outlook: Mailbox full — Papa's forwards");
            }
          }

          renderFolder();
        }
      });
    }
  });
})();
