// ==UserScript==
// @name          TagPro Chat Macros Userscript
// @namespace     http://www.reddit.com/user/contact_lens_linux/
// @description   Help your team with quick chat macros.
// @include       http://tagpro-*.koalabeast.com:*
// @include       http://tangent.jukejuice.com:* 
// @include       http://maptest.newcompte.fr:* 
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @author        steppin, Watball
// @version       0.4
// ==/UserScript==

(function() {
        function contentEval(source) {
                // Check for function input.
                if ('function' == typeof source) {
                        // Execute this function with no arguments, by adding parentheses.
                        // One set around the function, required for valid syntax, and a
                        // second empty set calls the surrounded function.
                        source = '(' + source + ')();'
                }

                // Create a script node holding this  source code.
                var script = document.createElement('script');
                script.setAttribute("type", "application/javascript");
                script.textContent = source;

                // Insert the script node into the page, so it will run, and immediately
                // remove it to clean up.
                document.body.appendChild(script);
                document.body.removeChild(script);
        }

        function actualScript() {
                var macros = {};
                //number pad
                macros[103] = {"message": "Enemy flag carrier is top left ↖↖↖", "toAll": false}; // numpad 7
                macros[104] = {"message": "Enemy flag carrier is at the top ↑↑↑", "toAll": false}; // numpad 8
                macros[105] = {"message": "Enemy flag carrier is top right ↗↗↗", "toAll": false}; // numpad 9
                macros[100] = {"message": "Enemy flag carrier is to the left ← ← ←", "toAll": false}; // numpad 4
                macros[101] = {"message": "Enemy flag carrier is in the middle", "toAll": false}; // numpad 5
                macros[97] = {"message": "Enemy flag carrier is bottom left ↙↙↙", "toAll": false}; // numpad 1
                macros[102] = {"message": "Enemy flag carrier is to the right → → →", "toAll": false}; // numpad 6
                macros[98] = {"message": "Enemy flag carrier is at the bottom ↓↓↓", "toAll": false}; // numpad 2
                macros[99] = {"message": "Enemy flag carrier is bottom right ↘↘↘", "toAll": false}; // numpad 3
                macros[110] = {"message": "Rolling bomb is coming into our base", "toAll": false}; // decimal point
                macros[96] = {"message": "Powerups are respawning soon", "toAll": false}; // numpad 0
                macros[46] = {"message": "Please get the button in base", "toAll": false}; // divide
                macros[192] = {"message": " ▄︻̷̿┻̿═━一 YOU JUST GOT SNIPED 一━═̿┻̷̿︻▄", "toAll": true}; // `

                //1-6
                macros[49] = {"message": "Base is clear!", "toAll": false}; // 1
                macros[50] = {"message": "Base is *NOT* clear!", "toAll": false}; // 2
                macros[51] = {"message": "Base is *NOT* clear, but we have your blocks!", "toAll": false}; // 3
                macros[52] = {"message": "I'm coming into base, is it clear?", "toAll": false}; // 4
                macros[53] = {"message": "Our FC is coming into base, please block!", "toAll": false}; // 5
                macros[54] = {"message": "I'm at the flag and ready to score!", "toAll": false}; // 6

                //Q,W,E
                macros[81] = {"message": "If our flag carrier dies, the other team could score!", "toAll": false}; // Q
                macros[87] = {"message": "There is a tagpro in our base!", "toAll": false}; // W
                macros[69] = {"message": "The flag carrier has a rolling bomb!", "toAll": false}; // E


                // Game bindings overriding adapted from JohnnyPopcorn's NeoMacro https://gist.github.com/JohnnyPopcorn/8150909
                var handlerbtn = $('#macrohandlerbutton');
                handlerbtn.keydown(keydownHandler)
                        .keyup(keyupHandler);
                handlerbtn.focus();

                $(document).keydown(documentKeydown);
                function documentKeydown(event) {
                        if (!tagpro.disableControls) {
                                handlerbtn.focus(); // The handler button should be always focused
                        }
                }

                function keydownHandler(event) {
                        var code = event.keyCode || event.which;
                        if (code in macros && !tagpro.disableControls) {
                                chat(macros[code]);
                                event.preventDefault();
                                event.stopPropagation();
                                //console.log(macros[code]);
                        }
                }

                function keyupHandler(event) {
                        if (event.keyCode in macros && !tagpro.disableControls) {
                                event.preventDefault();
                                event.stopPropagation();
                        }
                }

                var lastMessage = 0;
                var active = false;
                function chat(chatMessage) {
                        var limit = 500 + 10;
                        var now = new Date();
                        var timeDiff = now - lastMessage;
                        if (timeDiff > limit) {
                                tagpro.socket.emit("chat", chatMessage);
                                lastMessage = new Date();
                        } else if (timeDiff >= 0 && !active) {
                                active = true;
                                setTimeout(function(chatMessage) { chat(chatMessage); active = false }, limit - timeDiff, chatMessage);
                        }
                }
        }

        // This dummy input will handle macro keypresses
        var btn = document.createElement("input");
        btn.style.opacity = 0;
        btn.style.position = "absolute";
        btn.style.top = "-100px";
        btn.style.left = "-100px";
        btn.id = "macrohandlerbutton";
        document.body.appendChild(btn);

        contentEval(actualScript);
})();
