/* datepicker.js — Swaraj Date Picker (Part 3) */
(function() {
  'use strict';
  if (typeof Apps === 'undefined') return;

  Apps.register('datepicker', {
    title: 'Date/Time Properties',
    icon: '📅',
    open: function() {
      var winId = 'datepicker_' + Date.now();
      var currentDate = (typeof Clock !== 'undefined') ? Clock.get() : new Date(1999, 11, 31, 23, 57);
      var selectedYear = currentDate.getFullYear();
      var selectedMonth = currentDate.getMonth();
      var selectedDay = currentDate.getDate();
      var selectedHour = currentDate.getHours();
      var selectedMinute = currentDate.getMinutes();
      var startTime = Date.now();

      WM.open({
        id: winId,
        title: 'Date/Time Properties — Swaraj Edition',
        icon: '📅',
        width: 400,
        height: 420,
        render: function(body) {
          body.style.cssText = 'padding:12px;height:calc(100% - 22px);overflow:auto;';

          var title = document.createElement('div');
          title.innerHTML = '<b>📅 Date/Time Properties</b><br><span style="font-size:10px;color:#888;">Swaraj Calendar System™</span>';
          title.style.marginBottom = '12px';
          body.appendChild(title);

          // Year slider (1857 to 2100)
          var yearRow = document.createElement('div');
          yearRow.style.cssText = 'margin-bottom:10px;';
          yearRow.innerHTML = '<label style="font-size:11px;">Year (1857-2100): </label>';
          var yearSlider = document.createElement('input');
          yearSlider.type = 'range';
          yearSlider.min = '1857';
          yearSlider.max = '2100';
          yearSlider.value = selectedYear;
          yearSlider.style.cssText = 'width:180px;';
          var yearDisplay = document.createElement('span');
          yearDisplay.style.cssText = 'font-weight:bold;margin-left:8px;font-family:monospace;';
          yearDisplay.textContent = selectedYear;
          yearSlider.oninput = function() {
            selectedYear = parseInt(yearSlider.value);
            yearDisplay.textContent = selectedYear;
            checkSpecialDate();
          };
          yearRow.appendChild(yearSlider);
          yearRow.appendChild(yearDisplay);

          // Arrow keys for fine-tuning
          var arrowNote = document.createElement('div');
          arrowNote.style.cssText = 'font-size:9px;color:#888;margin-top:2px;';
          arrowNote.textContent = '(Arrow keys for fine-tuning. Good luck finding 1947.)';
          yearRow.appendChild(arrowNote);
          body.appendChild(yearRow);

          // Month spinner
          var monthRow = document.createElement('div');
          monthRow.style.cssText = 'margin-bottom:10px;display:flex;align-items:center;gap:8px;';
          monthRow.innerHTML = '<label style="font-size:11px;">Month: </label>';
          var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
          var monthDown = document.createElement('button');
          monthDown.textContent = '◄';
          monthDown.style.cssText = 'width:24px;height:24px;font-size:10px;';
          var monthDisplay = document.createElement('span');
          monthDisplay.style.cssText = 'min-width:80px;text-align:center;font-weight:bold;display:inline-block;';
          monthDisplay.textContent = monthNames[selectedMonth];
          var monthUp = document.createElement('button');
          monthUp.textContent = '►';
          monthUp.style.cssText = 'width:24px;height:24px;font-size:10px;';
          monthDown.onclick = function() { selectedMonth = (selectedMonth + 11) % 12; monthDisplay.textContent = monthNames[selectedMonth]; checkSpecialDate(); };
          monthUp.onclick = function() { selectedMonth = (selectedMonth + 1) % 12; monthDisplay.textContent = monthNames[selectedMonth]; checkSpecialDate(); };
          monthRow.appendChild(monthDown);
          monthRow.appendChild(monthDisplay);
          monthRow.appendChild(monthUp);
          body.appendChild(monthRow);

          // Day (Dandi March button — one day per click)
          var dayRow = document.createElement('div');
          dayRow.style.cssText = 'margin-bottom:10px;display:flex;align-items:center;gap:8px;';
          dayRow.innerHTML = '<label style="font-size:11px;">Day: </label>';
          var dayDisplay = document.createElement('span');
          dayDisplay.style.cssText = 'font-weight:bold;font-size:16px;min-width:30px;text-align:center;display:inline-block;font-family:monospace;';
          dayDisplay.textContent = selectedDay;
          var dayBtn = document.createElement('button');
          dayBtn.textContent = '🚶 Dandi March (+1 day)';
          dayBtn.style.fontSize = '10px';
          dayBtn.onclick = function() {
            selectedDay++;
            if (selectedDay > 31) selectedDay = 1;
            dayDisplay.textContent = selectedDay;
            checkSpecialDate();
          };
          dayRow.appendChild(dayDisplay);
          dayRow.appendChild(dayBtn);
          body.appendChild(dayRow);

          // Time
          var timeRow = document.createElement('div');
          timeRow.style.cssText = 'margin-bottom:10px;display:flex;align-items:center;gap:8px;';
          timeRow.innerHTML = '<label style="font-size:11px;">Time: </label>';
          var hourInput = document.createElement('input');
          hourInput.type = 'number';
          hourInput.min = '0'; hourInput.max = '23';
          hourInput.value = selectedHour;
          hourInput.style.width = '50px';
          hourInput.onchange = function() { selectedHour = parseInt(hourInput.value) || 0; };
          var minuteInput = document.createElement('input');
          minuteInput.type = 'number';
          minuteInput.min = '0'; minuteInput.max = '59';
          minuteInput.value = selectedMinute;
          minuteInput.style.width = '50px';
          minuteInput.onchange = function() { selectedMinute = parseInt(minuteInput.value) || 0; };
          timeRow.appendChild(hourInput);
          timeRow.appendChild(document.createTextNode(' : '));
          timeRow.appendChild(minuteInput);
          body.appendChild(timeRow);

          // Special date message
          var specialMsg = document.createElement('div');
          specialMsg.style.cssText = 'padding:6px;background:#ffffcc;border:1px solid #ccc;margin-bottom:10px;font-size:11px;min-height:24px;';
          specialMsg.textContent = '';
          body.appendChild(specialMsg);

          // Bapu takes pity shortcut (after 90 seconds)
          var bapuBtn = document.createElement('button');
          bapuBtn.textContent = '🙏 Bapu Takes Pity';
          bapuBtn.style.cssText = 'display:none;margin-bottom:10px;font-size:11px;padding:4px 12px;';
          bapuBtn.onclick = function() {
            selectedYear = 1947; selectedMonth = 7; selectedDay = 15;
            selectedHour = 0; selectedMinute = 0;
            yearSlider.value = 1947; yearDisplay.textContent = 1947;
            monthDisplay.textContent = monthNames[7];
            dayDisplay.textContent = 15;
            hourInput.value = 0; minuteInput.value = 0;
            checkSpecialDate();
          };
          body.appendChild(bapuBtn);
          setTimeout(function() {
            if (WM.isOpen(winId)) bapuBtn.style.display = 'inline-block';
          }, 90000);

          // Buttons
          var btnRow = document.createElement('div');
          btnRow.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;margin-top:8px;';
          var applyBtn = document.createElement('button');
          applyBtn.textContent = 'Apply';
          applyBtn.onclick = function() {
            if (typeof Clock !== 'undefined') {
              Clock.set(selectedYear, selectedMonth + 1, selectedDay, selectedHour, selectedMinute);
            }
            if (typeof Popup !== 'undefined' && Popup.info) {
              Popup.info({ title: 'Date/Time', msg: 'Date set to ' + selectedDay + ' ' + monthNames[selectedMonth] + ' ' + selectedYear + '<br>' + selectedHour + ':' + String(selectedMinute).padStart(2,'0') });
            }
          };
          var okBtn = document.createElement('button');
          okBtn.textContent = 'OK';
          okBtn.onclick = function() {
            applyBtn.onclick();
            WM.close(winId);
          };
          var cancelBtn = document.createElement('button');
          cancelBtn.textContent = 'Cancel';
          cancelBtn.onclick = function() { WM.close(winId); };
          btnRow.appendChild(okBtn);
          btnRow.appendChild(cancelBtn);
          btnRow.appendChild(applyBtn);
          body.appendChild(btnRow);

          function checkSpecialDate() {
            var key = selectedDay + '/' + (selectedMonth + 1) + '/' + selectedYear;
            var dayMonth = selectedDay + '/' + (selectedMonth + 1);

            if (selectedYear === 1947 && selectedMonth === 7 && selectedDay === 15) {
              specialMsg.textContent = '🇮🇳 Tryst with destiny™ confirmed. Freedom at midnight!';
              specialMsg.style.background = '#e8ffe8';
            } else if (selectedMonth === 0 && selectedDay === 26) {
              specialMsg.textContent = '📜 The Constitution accepted your request. Happy Republic Day!';
              specialMsg.style.background = '#e8ffe8';
            } else if (selectedYear === 1930 && selectedMonth === 3 && selectedDay === 6) {
              specialMsg.textContent = '🧂 Salt law broken. Tax waived. Dandi March complete!';
              specialMsg.style.background = '#ffffcc';
            } else if (selectedMonth === 9 && selectedDay === 2) {
              specialMsg.textContent = '🚫 Dry day. No exceptions. Not even cyber cafés.';
              specialMsg.style.background = '#ffe8e8';
            } else if (selectedMonth === 0 && selectedDay === 30) {
              // Respectful — no jokes
              specialMsg.textContent = "Martyrs' Day.";
              specialMsg.style.background = '#f0f0f0';
            } else if (selectedMonth === 3 && selectedDay === 31) {
              specialMsg.textContent = '🤔 Even the Raj couldn\'t invent this day. April only has 30 days.';
              specialMsg.style.background = '#ffe8e8';
            } else {
              specialMsg.textContent = '';
              specialMsg.style.background = '#ffffcc';
            }
          }

          if (typeof Egg !== 'undefined') Egg.unlock(8, 'Taskbar clock — Date/Time opens Swaraj date picker');
          checkSpecialDate();
        }
      });
    }
  });
})();
