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

/**
 * A group Dictionary. A map with optional default value and special value to return the key.
 * @module lib/Dictionary
 */
"use strict";

/**
 * A dictionary. Allows looking up values by name. The name is called the key.
 * The dictionary stores zero or more key value pairs. A dictionary can also have an optional 
 * default value. The default value is used if the key is not found.
 * 
 * This is the runtime interface to the StringTemplate group file dictionary construct.
 * You don't usually need to construct Dictionaries because they are created when a compiled group is loaded. 
 * 
 * @param {object} map An object. Its properties are the dictionary keys and values.
 * @param {*} [defaultValue] Value to return when the key is not found in 
 * @constructor
 * @alias module:lib/Dictionary
 */
function Dictionary(map, defaultValue) {
    this.map = map;
    if (defaultValue !== undefined) {
        this.defaultValue = defaultValue;
    }
}

/**
 * Special dictionary value that causes the key to be returned rather than the value.
 * 
 * This corresponds to the StringTemplate group file key keyword.
 * 
 * @const {{}}
 */
Dictionary.DICT_KEY_VALUE = {};

/**
 * Return the dictionary value for the given key.
 * 
 * If the dictionary does not contain the given key and a default value is defined
 * then the default value is returned.
 * 
 * If the value to return is the special value Dictionary.DICT_KEY_VALUE then
 * the key is returned.
 * 
 * @param {string} key Name of the value to lookup in the dictionary.
 * @returns {*} Value associated with key or default.
 */
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
