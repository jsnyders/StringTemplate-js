/*
 [The "BSD licence"]
 Copyright (c) 2015, John Snyders
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 1. Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * A group Dictionary. A map with optional default value and special value to return the key.
 */
"use strict";

/**
 * A dictionary.
 * @param map an object. Its properties are the dictionary keys.
 * @param defaultValue value to return when the key is not found in 
 * @constructor
 */
function Dictionary(map, defaultValue) {
    this.map = map;
    if (defaultValue !== undefined) {
        this.defaultValue = defaultValue;
    }
}

Dictionary.DICT_KEY_VALUE = {};

Dictionary.prototype.get = function(key) {
    var value;
    if (this.map.hasOwnProperty(key)) {
        value = this.map[key];
    } else if (this.defaultValue !== undefined) {
        value = this.defaultValue;
    }
    if (value === Dictionary.DICT_KEY_VALUE) {
        value = key;
    }
    return value;
};

module.exports = Dictionary;
