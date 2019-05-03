/**
 * @module og/input/KeyboardHandler
 */

'use strict';

const KeyboardHandler = function () {
    var _currentlyPressedKeys = {};
    var _pressedKeysCallbacks = {};
    var _unpressedKeysCallbacks = {};
    var _charkeysCallbacks = {};
    var _that = this;
    var _anykeyCallback = null;
    var _event = null;

    if (KeyboardHandler.prototype._instance) {
        return KeyboardHandler.prototype._instance;
    } else {
        KeyboardHandler.prototype._instance = this;

        document.onkeydown = function (event) { _event = event; _that.handleKeyDown.call(_that) };
        document.onkeyup = function (event) { _event = event; _that.handleKeyUp.call(_that) };
    }

    var _sortByPriority = function (a, b) {
        return a.priority < b.priority;
    };

    this.removeEvent = function (events, callback) {
        //
        //TODO:...
        //
    };

    this.addEvent = function (event, sender, callback, keyCode, priority) {
        if (priority === undefined) {
            priority = 1600;
        }
        switch (event) {
            case "keyfree": {
                if (!_unpressedKeysCallbacks[keyCode]) {
                    _unpressedKeysCallbacks[keyCode] = [];
                }
                _unpressedKeysCallbacks[keyCode].push({ callback: callback, sender: sender, priority: priority });
                _unpressedKeysCallbacks[keyCode].sort(_sortByPriority);
            } break;

            case "keypress": {
                if (keyCode == null) {
                    _anykeyCallback = { "callback": callback, "sender": sender || _that };
                } else {
                    if (!_pressedKeysCallbacks[keyCode]) {
                        _pressedKeysCallbacks[keyCode] = [];
                    }
                    _pressedKeysCallbacks[keyCode].push({ callback: callback, sender: sender, priority: priority });
                    _pressedKeysCallbacks[keyCode].sort(_sortByPriority);
                }
            } break;

            case "charkeypress": {
                if (!_charkeysCallbacks[keyCode]) {
                    _charkeysCallbacks[keyCode] = [];
                }
                _charkeysCallbacks[keyCode].push({ callback: callback, sender: sender, priority: priority });
                _charkeysCallbacks[keyCode].sort(_sortByPriority);
            } break;
        }
    };

    this.isKeyPressed = function (keyCode) {
        return _currentlyPressedKeys[keyCode];
    };

    this.handleKeyDown = function () {
        _anykeyCallback && _anykeyCallback.callback.call(_anykeyCallback.sender, _event);
        _currentlyPressedKeys[_event.keyCode] = true;
        for (var ch in _charkeysCallbacks) {
            if (String.fromCharCode(_event.keyCode) == String.fromCharCode(ch)) {
                var ccl = _charkeysCallbacks[ch];
                for (var i = 0; i < ccl.length; i++) {
                    ccl[i].callback.call(ccl[i].sender, _event);
                }
            }
        }
    };

    this.handleKeyUp = function () {
        if (_currentlyPressedKeys[_event.keyCode]) {
            for (var pk in _unpressedKeysCallbacks) {
                if (_currentlyPressedKeys[pk]) {
                    var cpk = _unpressedKeysCallbacks[pk];
                    for (var i = 0; i < cpk.length; i++) {
                        cpk[i].callback.call(cpk[i].sender, _event);
                    }
                }
            }
        }
        _currentlyPressedKeys[_event.keyCode] = false;
    };

    this.handleEvents = function () {
        for (var pk in _pressedKeysCallbacks) {
            if (_currentlyPressedKeys[pk]) {
                var cpk = _pressedKeysCallbacks[pk];
                for (var i = 0; i < cpk.length; i++) {
                    cpk[i].callback.call(cpk[i].sender, _event);
                }
            }
        }
    };
};

export { KeyboardHandler };