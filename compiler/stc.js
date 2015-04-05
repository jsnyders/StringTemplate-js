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
 * stc.js - StringTemplate Compiler
 * xxx
 */
var fs = require("fs"),
    path = require("path"),
    parser = require("./stGrammar.js"),
    makeGroup = require("./group.js").makeGroup,
    stGroup = require("../lib/stGroup.js");

var VERSION = "0.1";

var gVerbose = false;

function setVerbose(v) {
    gVerbose = v;
}

function getFileReader(baseDir, encoding) {

    var readFile = function(file) {
        var text;

        // files, if not absolute, are relative to the give base dir
        // xxx
        if (file.substring(0,1) !== "/") {
            file = path.join(baseDir, file);
        }
        text = fs.readFileSync(file, {encoding: encoding});
        return text;
    };
    return readFile;
}

function parseFile(file, options) {
    var text = options.readFile(file);
    try {
        var result = parser.parse(text, options);
        console.log(JSON.stringify(result, null, 4));
    } catch (ex) {
        console.log("Error ", ex);
    }
}

function compileGroupFile(file, encoding, delimiterStartChar, delimiterStopChar) {
    var baseDir = path.dirname(file),
        ext = path.extname(file);

    encoding = encoding || "utf8";

    // xxx need newer version of node for this: path.isAbsolute(baseDir)
    if (baseDir.substring(0,1) !== "/") {
        baseDir = path.join(process.cwd(), baseDir);
        file = path.join(process.cwd(), file);
    }
    console.log("xxx base dir " + baseDir);
    parseFile(file, {
        startRule: "group",
        readFile: getFileReader(baseDir, encoding), // xxx perhaps reader goes in group?
        group: makeGroup("", path.basename(file, ext)),
        verbose: gVerbose,
        delimiterStartChar: delimiterStartChar,
        delimiterStopChar: delimiterStopChar
    });
}

function parseDir(rootDir, options) {
    var group, folder;

    function processDir(dir) {
        var i, files, file, ext, folder, text;

        files = fs.readdirSync(dir);
        for (i = 0; i < files.length; i++) {
            file = files[i];
            ext = path.extname(file);
            if (ext === stGroup.TEMPLATE_FILE_EXTENSION) {
                console.log("xxx file: " + files[i]);

                text = options.readFile(path.join(dir, file));
                group.fileName = file;
                // xxx group folder too
                try {
                    parser.parse(text, options);
                    console.log(JSON.stringify(result, null, 4));
                } catch (ex) {
                    console.log("Error ", ex);
                }

            }
        }
    }

    group = options.group;
    processDir(rootDir);

    return group;
}

function compileGroupDir(dir, encoding, delimiterStartChar, delimiterStopChar) {
    var group, parseOptions;

    encoding = encoding || "utf8";

    group = makeGroup("", "", false);
    parseOptions = {
        startRule: "templateDef",
        readFile: getFileReader(dir, encoding), // xxx perhaps reader goes in group?
        group: group,
        verbose: gVerbose,
        delimiterStartChar: delimiterStartChar,
        delimiterStopChar: delimiterStopChar
    };
    parseDir(dir, parseOptions);
}

function compileRawGroupDir(dir, encoding, delimiterStartChar, delimiterStopChar) {
    var group, parseOptions;

    encoding = encoding || "utf8";

    group = makeGroup("", "", true);
    parseOptions = {
        startRule: "templateRaw",
        readFile: getFileReader(dir, encoding), // xxx perhaps reader goes in group?
        group: group,
        verbose: gVerbose,
        delimiterStartChar: delimiterStartChar,
        delimiterStopChar: delimiterStopChar
    };
    parseDir(dir, parseOptions);
}

function main() {

    //
    // Command line parsing
    //
    var argv = require('yargs')
        .require(1, "Missing required input-path argument")
        .option("encoding", {
            alias: "e",
            default: "utf8",
            type: "string",
            describe: "File encoding."
        })
        .option("delimiters", {
            alias: "s",
            default: "$$",
            type: "string",
            describe: "Start and stop characters that delimit template expressions."
        })
        .option("raw", {
            alias: "r",
            default: false,
            type: "boolean",
            describe: "Template files with no declarations (raw)."
        })
        .option("v", {
            alias: "verbose",
            default: false,
            type: "boolean",
            describe: "Log output about what the compiler is doing"
        })
        .usage("Usage: $0 [options] input-path")
        .wrap(78)
        .version(VERSION, "version")
        .strict()
        .help("help", "Display usage")
        .alias("help", "h")
        .argv;

    var ext, stat,
        inputPath = argv._[0];

    try {
        stat = fs.statSync(inputPath);
    } catch (ex) {
        console.log(ex.message);
        process.exit(1);
    }

    setVerbose(argv.verbose);

    if (stat.isDirectory()) {
        if (argv.raw) {
            compileRawGroupDir(inputPath, argv.encoding, argv.delimiters.charAt(0), argv.delimiters.charAt(1));
        } else {
            compileGroupDir(inputPath, argv.encoding, argv.delimiters.charAt(0), argv.delimiters.charAt(1));
        }
    } else {
        ext = path.extname(inputPath);
        if (ext === stGroup.GROUP_FILE_EXTENSION) {
            compileGroupFile(inputPath, argv.encoding, argv.delimiters.charAt(0), argv.delimiters.charAt(1));
        } else if (ext === stGroup.TEMPLATE_FILE_EXTENSION) {
            // xxx create a group from a single template file? How to handle raw flag?
            compileGroupFile(inputPath, argv.encoding, argv.delimiters.charAt(0), argv.delimiters.charAt(1));
        }
    }
}

module.exports = {
    compileGroupFile: compileGroupFile,
    compileGroupDir: compileGroupDir,
    compileRawGroupDir: compileRawGroupDir,
    setVerbose: setVerbose
};

if (require.main === module) {
    main();
}
