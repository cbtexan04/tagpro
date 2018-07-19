// ==UserScript==
// @name          TagPro Powerup Timers
// @namespace     http://www.reddit.com/user/cbtexan04/
// @description   Provides you with estimated time until powerup is available on the map
// @include       http://tagpro-*.koalabeast.com:*
// @include	  http://tangent.jukejuice.com:*
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @author        cbtexan04
// @version       0.1
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

        function actualScript(powerupItem, powerupTimes) {

                //1:        wall
                //2:        floor
                //3,4:      flag present
                //3.1, 4.1: flag taken
                //6		  powerup taken
                //6.X		  powerup present
                //10        bomb present (?)
                //10.1      bomb absent (?)      

                //6.3 tagpro on map
                //6.2 rolling bomb
                //6.1 juke juice (?)
                var rowCount = 0;
                var newArray = [];
                var newTimes = [];
                var arrayCount = 0;

                for(var row in tagpro.map) {
                        for(var num in tagpro.map[rowCount]) {
                                var record = tagpro.map[rowCount][num];

                                if (record >= 6.0 && record < 6.4) {

                                        var s = "Unknown";
                                        var t = 0;
                                        if(record == 6.1) {
                                                s = "Juke Juice";
                                        } else if (record == 6.2) {
                                                s = "Rolling Bomb";
                                        } else if (record == 6.3) {
                                                s = "Tagpro";
                                        } else {
                                                t = 59;
                                                s = "Unknown";
                                        }
                                        newArray.push(s);

                                        //if we have already initialized the powerups
                                        if(powerupTimes.length > 0) {
                                                if(t > 0) { //unknown state
                                                        var time = powerupTimes[arrayCount];
                                                        if(time > 0) { //slot has number in it
                                                                powerupTimes[arrayCount] = time - 1;
                                                        } else {
                                                                //means that the previous state, it was out of map view
                                                                if(powerupItem[arrayCount] == "Unknown") {
                                                                        console.log('out');
                                                                        //do nothing?
                                                                } else {
                                                                        //it was in map view, but someone just took it
                                                                        powerupTimes[arrayCount] = 59;
                                                                }
                                                        }
                                                } else {
                                                        powerupTimes[arrayCount] = 0;   
                                                }
                                                arrayCount++;
                                        } else {
                                                //push to newTimes so we can copy it
                                                newTimes.push(0);
                                        }
                                }
                        }
                        rowCount++;
                }

                console.log(newArray);
                console.log(powerupTimes.length);
                console.log(powerupTimes);


                //if joining late to a match, update any unknown powerup types
                //also, update the times for that powerup
                if(powerupItem.length == 0) {
                        console.log('the length one');
                        powerupItem = newArray.slice();
                        powerupTimes = newTimes.slice();

                        //add new divs for each powerup
                        var yPixels = 25;
                        for(var i = 0; i < powerupItem.length; i++) {
                                var id = "powerup" + i;
                                $('body').append('<div id="powerup'+i+'" style="position: absolute; z-index: 100; color: red; font-weight: bold; font-size: 10px; left:' + (parseInt($('#viewport').offset().left) + 20) + 'px; top: ' + (parseInt($('#viewport').offset().top) + yPixels) + 'px;">'+ powerupItem[i] +'</div>');   
                                yPixels += 15;
                        }
                } else {
                        for(var i = 0; i < powerupItem.length; i++) {
                                powerupItem[i] = newArray[i];

                                var id = "#powerup" + i;
                                var time = powerupTimes[i];

                                if(time > 0) {
                                        if(time < 10) {
                                                $(id).css('color', 'yellow');
                                        } else {
                                                $(id).css('color', 'red');
                                        }
                                        $(id).text("Spawning within: " + powerupTimes[i]);
                                } else {
                                        $(id).css('color', 'green');
                                        $(id).text(powerupItem[i] + ": AVAILABLE");
                                }
                        }
                }

                var millisecondsToWait = 1000;
                setTimeout(function() {
                        actualScript(powerupItem, powerupTimes);
                }, millisecondsToWait);
        }

        var p1 = [];
        var p2 = [];
        contentEval(actualScript(p1, p2));
})();
