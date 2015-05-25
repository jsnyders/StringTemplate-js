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
 * Commandline program that takes a group of StringTemplate source files
 * and writes a JavaScript module that implements the template at runtime.
 * Also exports callable functions to do the same from another program.
 */
"use strict";

var fs = require("fs"),
    path = require("path"),
    parser = require("./stGrammar.js"),
    makeGroup = require("./group.js").makeGroup,
    stGroup = require("../lib/stGroup.js");

var VERSION = "0.1.0";

var gVerbose = false,
    gOutputAST = false;

/**
 * xxx
 * @param v
 */
function setVerbose(v) {
    gVerbose = v;
}

/**
 * xxx
 * @returns {boolean}
 */
function getVerbose() {
    return gVerbose;
}

/**
 * xxx
 * @param o
 */
function setOutputAST(o) {
    gOutputAST = o;
}

/**
 * xxx
 * @returns {boolean}
 */
function getOutputAST() {
    return gOutputAST;
}

function fatalIOError(ex, file) {
    if (ex.code === "ENOENT") {
        console.log("Error: No such file or directory '" + file + "'.");
    } else if (ex.code === "EACCES") {
        console.log("Error: Permission denied to access '" + file + "'.");
    } else {
        console.log(ex.message);
    }
    process.exit(1);
}

function logParserError(file, ex) {
    if (ex.name === "SyntaxError") {
        console.log("Error: " + file + "(" + ex.line + "," + ex.column + "): " + ex.message);
    } else {
        console.log(" Error: " + file + ": " + ex);
    }
}

function startRule(ext, raw) {
    if (ext === stGroup.GROUP_FILE_EXTENSION) {
        return "groupFile";
    } else if (raw) {
        return "templateFileRaw";
    }// else
    return "templateFile";
}

function getFileReader(baseDir, encoding) {
    return function(file) {
        var text;

        // files, if not absolute, are relative to the given base dir
        // todo need newer version of node for this: path.isAbsolute(baseDir)
        if (file.substring(0,1) !== "/") {
            file = path.join(baseDir, file);
        }
        try {
            text = fs.readFileSync(file, {encoding: encoding});
        } catch (ex) {
            fatalIOError(ex, file);
        }
        return text;
    };
}

function parseFile(file, baseDir, options) {
    var group = options.group,
        text = options.readFile(file);

    try {
        parser.parse(text, options);
    } catch (ex) {
        logParserError(file, ex);
        return;
    }
    generate(group, baseDir);
}

function compileGroupFile(file, encoding, delimiterStartChar, delimiterStopChar) {
    var baseDir = path.dirname(file),
        ext = path.extname(file);

    encoding = encoding || "utf8";

    // todo need newer version of node for this: path.isAbsolute(baseDir)
    if (baseDir.substring(0,1) !== "/") {
        baseDir = path.join(process.cwd(), baseDir);
        file = path.join(process.cwd(), file);
    }
    parseFile(file, baseDir, {
        startRule: startRule(ext, false),
        readFile: getFileReader(baseDir, encoding), // xxx perhaps reader goes in group?
        group: makeGroup("", path.basename(file, ext)),
        verbose: gVerbose,
        delimiterStartChar: delimiterStartChar,
        delimiterStopChar: delimiterStopChar
    });
}

function parseDir(rootDir, options) {
    var group,
        errorCount = 0;

    function processDir(relDir, dir) {
        var i, files, file, ext, stat, relFile, filePath, text;

        files = fs.readdirSync(dir);
        for (i = 0; i < files.length; i++) {
            file = files[i];
            ext = path.extname(file);

            relFile = path.join(relDir, file);
            filePath = path.join(dir, file);
            try {
                stat = fs.statSync(filePath);
            } catch (ex) {
                fatalIOError(ex, filePath);
            }
            if (stat.isDirectory()) {
                if (gVerbose) {
                    console.log("Processing group sub folder '" + relFile + "'...");
                }
                processDir(relFile, filePath);
            } else if (ext === stGroup.TEMPLATE_FILE_EXTENSION || ext === stGroup.GROUP_FILE_EXTENSION) {
                if (gVerbose) {
                    console.log("Processing file '" + relFile + "'...");
                }

                text = options.readFile(relFile);
                group.groupFolder = relDir;
                group.fileName = path.basename(file, ext);
                options.startRule = startRule(ext, group.raw);
                try {
                    parser.parse(text, options);
                } catch (ex) {
                    logParserError(relFile, ex);
                    errorCount += 1;
                }
                // xxx when, where to process imports
            }
        }
    }

    if (gVerbose) {
        console.log("Processing group folder '" + rootDir + "'...");
    }
    group = options.group;
    processDir("", rootDir);
    if (errorCount === 0) {
        generate(group, "xxx base dir");
    }
}

/**
 * xxx
 * @param dir
 * @param encoding
 * @param delimiterStartChar
 * @param delimiterStopChar
 */
function compileGroupDir(dir, encoding, delimiterStartChar, delimiterStopChar) {
    var group, parseOptions;

    encoding = encoding || "utf8";

    group = makeGroup("", "", false);
    parseOptions = {
        readFile: getFileReader(dir, encoding), // xxx perhaps reader goes in group?
        group: group,
        verbose: gVerbose,
        delimiterStartChar: delimiterStartChar,
        delimiterStopChar: delimiterStopChar
    };
    parseDir(dir, parseOptions);
}

/**
 * xxx
 * @param dir
 * @param encoding
 * @param delimiterStartChar
 * @param delimiterStopChar
 */
function compileRawGroupDir(dir, encoding, delimiterStartChar, delimiterStopChar) {
    var group, parseOptions;

    encoding = encoding || "utf8";

    group = makeGroup("", "", true);
    parseOptions = {
        readFile: getFileReader(dir, encoding), // xxx perhaps reader goes in group?
        group: group,
        verbose: gVerbose,
        delimiterStartChar: delimiterStartChar,
        delimiterStopChar: delimiterStopChar
    };
    parseDir(dir, parseOptions);
}

// xxx
function writeFile(filePath, text) {
    fs.writeFileSync(filePath, text, {
        mode: 420 // 0x644
    });
}

function generate(groupAST, baseDir) {
    var astFilename, filename;

    // xxx any pre processing of parsing output needed?
    groupAST.date = (new Date()).toString();
    groupAST = {g:groupAST};

    if (gOutputAST) {
        astFilename = path.join(baseDir, groupAST.g.fileName + ".stg.ast");
        writeFile(astFilename, JSON.stringify(groupAST, null, 4));
    }

    // xxx generate

    filename = path.join(baseDir, groupAST.g.fileName + "_stg.js"); // xxx _stg vs _st?

    // use Java STST as a separate process to generate compiled template
    var spawn = require('child_process').spawn;

    var stst = spawn("stst", ["-f", "javascript", "-o", filename, "groupGen.compiledGroup"], {
        cwd: path.dirname(module.filename),
        stdio: ["pipe", 1, 2]
    });

    stst.stdin.write(JSON.stringify(groupAST));
    stst.stdin.end();

    stst.on("close", function() {
        console.log("xxx done");
    });

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
        .check(function(args) {
            if (args.delimiters.length !== 2) {
                throw "Error: delimiters option must be exactly two characters.";
            }
            return true;
        })
        .argv;

    // xxx output file options -o file.js default stdout
    // option to output ast (what is dumped currently) use output file with .json extension

    var ext, stat,
        inputPath = argv._[0];

    setVerbose(argv.verbose);
    setOutputAST(true); // todo take this from an option

    if (argv.verbose) {
        console.log("StringTemplate compiler version " + VERSION);
    }

    try {
        stat = fs.statSync(inputPath);
    } catch (ex) {
        fatalIOError(ex, inputPath);
    }

    if (stat.isDirectory()) {
        if (argv.raw) {
            compileRawGroupDir(inputPath, argv.encoding, argv.delimiters.charAt(0), argv.delimiters.charAt(1));
        } else {
            compileGroupDir(inputPath, argv.encoding, argv.delimiters.charAt(0), argv.delimiters.charAt(1));
        }
    } else {
        if (argv.raw) {
            console.log("Warning: raw option ignored when compiling a single file."); // xxx why would that be?
        }
        ext = path.extname(inputPath);
        if (ext === stGroup.GROUP_FILE_EXTENSION) {
            compileGroupFile(inputPath, argv.encoding, argv.delimiters.charAt(0), argv.delimiters.charAt(1));
        } else if (ext === stGroup.TEMPLATE_FILE_EXTENSION) {
            compileGroupFile(inputPath, argv.encoding, argv.delimiters.charAt(0), argv.delimiters.charAt(1));
        }
    }
}

module.exports = {
    compileGroupFile: compileGroupFile,
    compileGroupDir: compileGroupDir,
    compileRawGroupDir: compileRawGroupDir,
    setVerbose: setVerbose,
    getVerbose: getVerbose,
    setOutputAST: setOutputAST,
    getOutputAST: getOutputAST
};

if (require.main === module) {
    main();
}
