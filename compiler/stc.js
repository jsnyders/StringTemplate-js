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

var fs = require("fs");
var parser = require("./stGrammar.js");
var version = "0.1";

function compileGroupFile(file, encoding, delimiterStartChar, delimiterStopChar) {
    encoding = encoding || "utf8";

    var text = fs.readFileSync(file, {encoding: encoding});

    try {
        var result = parser.parse(text, {
            startRule: "group",
            verbose: true,
            delimiterStartChar: delimiterStartChar,
            delimiterStopChar: delimiterStopChar
        });
        console.log(JSON.stringify(result, null, 4));
    } catch (ex) {
        console.log("Error ", ex);
    }

}

function compileGroupDir(dir, encoding, delimiterStartChar, delimiterStopChar) {

}

function compileRawGroupDir(dir, encoding, delimiterStartChar, delimiterStopChar) {

}

function main() {

    //
    // Command line parsing
    //
    var argv = require('yargs')
        .require(1, "input-path")
        .alias("encoding", "e")
        .default("encoding", "utf8")
        .describe("encoding", "File encoding.")
        .alias("delimiters", "s")
        .default("delimiters", "$$")
        .describe("delimiters", "Start and stop characters that delimit template expressions.")
        .alias("raw", "r")
        .default("raw", false)
        .boolean("r")
        .describe("raw", "Template files with no declarations (raw).")
        .option("v", {
            alias: "verbose",
            default: false,
            type: "boolean",
            describe: "Log output about what the compiler is doing"
        })
        .usage("Usage: $0 [options] input-path")
        .wrap(78)
        .version(version, "version")
        .strict()
        .help("help", "Display usage")
        .alias("help", "h")
        .argv;

    compileGroupFile(argv._[0], argv.encoding, argv.delimiters.charAt(0), argv.delimiters.charAt(1));
}

module.exports = {
    compileGroupFile: compileGroupFile,
    compileGroupDir: compileGroupDir,
    compileRawGroupDir: compileRawGroupDir
};

if (require.main === module) {
    main();
}
