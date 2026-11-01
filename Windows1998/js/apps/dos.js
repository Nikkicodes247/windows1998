/* dos.js — MS-DOS Prompt (Part 2) */
(function() {
  'use strict';
  if (typeof Apps === 'undefined') return;

  Apps.register('dos', {
    title: 'MS-DOS Prompt',
    icon: '⬛',
    open: function() {
      var winId = 'dos_' + Date.now();
      var currentDir = 'C:\\';
      var history = [];
      var histIdx = -1;

      WM.open({
        id: winId,
        title: 'MS-DOS Prompt',
        icon: '⬛',
        width: 520,
        height: 360,
        render: function(body) {
          body.style.cssText = 'background:#000;color:#c0c0c0;font-family:"Courier New",monospace;font-size:13px;padding:8px;overflow:auto;height:calc(100% - 22px);display:flex;flex-direction:column;';

          var output = document.createElement('div');
          output.style.cssText = 'flex:1;overflow:auto;white-space:pre-wrap;word-wrap:break-word;';
          body.appendChild(output);

          var inputLine = document.createElement('div');
          inputLine.style.cssText = 'display:flex;align-items:center;flex-shrink:0;';
          var prompt = document.createElement('span');
          prompt.textContent = currentDir + '>';
          prompt.style.color = '#c0c0c0';
          var input = document.createElement('input');
          input.type = 'text';
          input.style.cssText = 'flex:1;background:#000;color:#c0c0c0;border:none;outline:none;font-family:"Courier New",monospace;font-size:13px;padding:0 4px;';
          inputLine.appendChild(prompt);
          inputLine.appendChild(input);
          body.appendChild(inputLine);

          function print(text, color) {
            var span = document.createElement('span');
            span.style.color = color || '#c0c0c0';
            span.textContent = text + '\n';
            output.appendChild(span);
            output.scrollTop = output.scrollHeight;
          }

          function printHTML(html) {
            var div = document.createElement('div');
            div.innerHTML = html;
            output.appendChild(div);
            output.scrollTop = output.scrollHeight;
          }

          print('Microsoft(R) Windows 98');
          print('   (C) Sharma-ji Edition');
          print('');

          function execCmd(cmd) {
            var parts = cmd.trim().split(/\s+/);
            var command = parts[0].toLowerCase();
            var args = parts.slice(1).join(' ');

            print(currentDir + '>' + cmd);
            history.push(cmd);
            histIdx = history.length;

            switch(command) {
              case 'dir':
                print(' Volume in drive C is SHARMA_PC');
                print(' Directory of ' + currentDir);
                print('');
                if (typeof FS !== 'undefined') {
                  var items = FS.list(currentDir);
                  items.forEach(function(item) {
                    if (!item.hidden) {
                      var type = item.type === 'folder' ? '<DIR>' : '     ';
                      print('  ' + item.name.padEnd(30) + type);
                    }
                  });
                }
                print('');
                break;

              case 'cd':
                if (!args || args === '\\') { currentDir = 'C:\\'; }
                else if (args === '..') {
                  var p = currentDir.replace(/\\$/, '').split('\\');
                  p.pop();
                  currentDir = p.join('\\') || 'C:\\';
                } else {
                  var newPath = currentDir === 'C:\\' ? 'C:\\' + args : currentDir + '\\' + args;
                  if (typeof FS !== 'undefined' && FS.get(newPath)) {
                    currentDir = newPath;
                  } else {
                    print('The system cannot find the path specified.');
                  }
                }
                prompt.textContent = currentDir + '>';
                break;

              case 'type':
                if (typeof FS !== 'undefined' && args) {
                  var filePath = currentDir === 'C:\\' ? 'C:\\' + args : currentDir + '\\' + args;
                  var file = FS.get(filePath);
                  if (file && file.content) print(file.content);
                  else print('The system cannot find the file specified.');
                }
                break;

              case 'ver':
                print('');
                print('Windows 98 [Sharma-ji Edition]');
                print('Version 4.10.2222 A');
                print('Assembled in Bhilai with love and frustration');
                print('');
                break;

              case 'date':
                if (typeof Egg !== 'undefined') Egg.unlock(23, 'DOS: date — Referred to the Committee');
                print('');
                print('Invalid date. Referred to the Committee.');
                print('Next meeting in 17 meetings.');
                print('');
                break;

              case 'format':
                if (args.toLowerCase().indexOf('c:') !== -1) {
                  if (typeof Egg !== 'undefined') Egg.unlock(24, 'DOS: format c: — Just kidding');
                  print('');
                  print('WARNING: ALL DATA ON NON-REMOVABLE DISK');
                  print('DRIVE C: WILL BE LOST!');
                  print('Proceed with Format (Y/N)? Y');
                  print('');
                  print('Formatting... 10%');
                  setTimeout(function() {
                    print('Formatting... 50%');
                    setTimeout(function() {
                      print('Formatting... 100%');
                      print('');
                      print('Just kidding. Papa will find out.', '#ff0');
                      print('');
                    }, 800);
                  }, 800);
                } else {
                  print('Required parameter missing.');
                }
                break;

              case 'gandhi':
                print('');
                print('       ___________');
                print('      /           \\');
                print('     |  O       O  |');
                print('     |  \\_______/  |');
                print('     |    (   )    |');
                print('      \\___________/');
                print('       | |     | |');
                print('       |-|     |-|');
                print('     (round spectacles)');
                print('');
                break;

              case 'salt':
                print('');
                print('Tax: 2 rupees', '#ff0');
                print('Status: Abolished (since 1946)');
                print('');
                break;

              case 'win':
                print('');
                print('You are already in Windows.');
                print('Did you mean: sleep?');
                print('');
                break;

              case 'help':
                print('');
                print('Available commands:');
                print('  dir      - List directory contents');
                print('  cd       - Change directory');
                print('  type     - Display file contents');
                print('  ver      - Show version');
                print('  date     - Show date (good luck)');
                print('  format   - Format disk (don\'t)');
                print('  gandhi   - ASCII art');
                print('  salt     - Check salt tax');
                print('  win      - Launch Windows (you\'re in it)');
                print('  help     - This screen');
                print('  exit     - Close this window');
                print('  cls      - Clear screen');
                print('');
                break;

              case 'exit':
                WM.close(winId);
                return;

              case 'cls':
                output.innerHTML = '';
                break;

              case '':
                break;

              default:
                print("'" + command + "' is not recognized as an internal or");
                print("external command, operable program or batch file.");
                print('');
            }
          }

          input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
              execCmd(input.value);
              input.value = '';
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (histIdx > 0) { histIdx--; input.value = history[histIdx] || ''; }
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx] || ''; }
              else { histIdx = history.length; input.value = ''; }
            }
          });

          input.focus();
          body.addEventListener('click', function() { input.focus(); });
        }
      });
    }
  });
})();
