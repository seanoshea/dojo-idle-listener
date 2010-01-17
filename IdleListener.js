/*
 * dojo idle listener
 * version 0.1
 * by Sean O' Shea. 
 * http://github.com/seanoshea/dojo-idle-listener
 * MIT license
 
 * adapted from:
 * 1. YUI idle timer by nzakas: http://github.com/nzakas/yui-misc/
 * 2. jQuery idle timer by Paul Irish: http://paulirish.com/2009/jquery-idletimer-plugin/
 
 * Copyright (c) 2009 Nicholas C. Zakas
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
dojo.declare("IdleListener", [], {
	
	_handles: [],
	_timeout: 30000,
 
	isRunning: function() {
		return this._enabled;
    },

    isIdle: function() {
    	return this._idle;
    },

    start: function(newTimeout) {
    	this._enabled = true;
        this._idle = false;
        if(typeof newTimeout == "number") {
        	this._timeout = newTimeout;
        }
        dojo.forEach(["onmousemove", "onkeydown", "onmousewheel", "DOMMouseScroll"], dojo.hitch(this, function(item, index, array) {
        	this._handles.push(dojo.connect(dojo.doc, item, this, "_handleUserEvent"));
        }))
        // set a timeout to toggle state
        this._idleTimeout = setTimeout(dojo.hitch(this, "_toggleIdleState"), this._timeout);
    },

    stop: function() {
    	this._enabled = false;
        // clear any pending timeouts
    	clearTimeout(this._idleTimeout);
        // detach the event handlers
    	dojo.forEach([this._handles], dojo.disconnect);
    },
    
    _handleUserEvent: function() {
    	// clear any existing timeout
    	clearTimeout(this._idleTimeout);
    	if(this._enabled) {
    		// if the user is just waking us up again, toggle the idle state.
    		// otherwise, reset the timeout with a new timeout
    		this._idle ? this._toggleIdleState() : this._idleTimeout = setTimeout(dojo.hitch(this, "_toggleIdleState"), this._timeout);
    	}
    },
 
    _toggleIdleState: function() {
    	this._idle = !this._idle;
    	this._idle ? dojo.publish("idle", []) : dojo.publish("active", []); 
    }
});