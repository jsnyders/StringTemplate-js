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
 * Functions that take one or more StringTemplate source files
 * and write a JavaScript module that implements the template at runtime.
 */
"use strict";

var fs = require("fs"),
    path = require("path"),
    parser = require("./stGrammar.js"),
    makeGroup = require("./group.js").makeGroup,
    stGroup = require("../lib/stGroup.js"),
    util = require("../lib/util.js"),
    st = require("../lib/stRuntime"),
    aiw = require("../lib/autoIndentWriter"),
    groupGenSTG = require("./groupGen_stg");

var VERSION = "0.1.0";

var defaultOptions = {
    verbose: false,
    encoding: "utf8",
    outputAST: false,
    minify: false,
    delimiterStartChar: stGroup.DEFAULT_START_DELIMITER,
    delimiterStopChar: stGroup.DEFAULT_STOP_DELIMITER
};

function logError(file, ex) {
    if (ex.name === "SyntaxError") {
        console.log("Error: " + file + "(" + ex.line + "," + ex.column + "): " + ex.message);
    } else if (ex.code === "ENOENT") {
        console.log("Error: No such file or directory '" + file + "'.");
    } else if (ex.code === "EACCES") {
        console.log("Error: Permission denied to access '" + file + "'.");
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
        // files, if not absolute, are relative to the given base dir
        if (!path.isAbsolute(file)) {
            file = path.join(baseDir, file);
        }
        return fs.readFileSync(file, {encoding: encoding});
    };
}

/**
 * Compile a single group file. 
 * 
 * @param file {string} group file to compile
 * @param options object to control compilation with these optional properties;
 *   delimiterStartChar: {string} single character string. Default is stGroup.DEFAULT_START_DELIMITER.
 *   delimiterStopChar: {string} single character string. Default is stGroup.DEFAULT_STOP_DELIMITER.
 *   encoding: {string} encoding for input and output files. Default is "utf8".
 *   verbose: {boolean} if true write additional information to stdout. Default is false.
 *   outputAST: {boolean} if true output the AST that results from parsing the group file
 *   minify: {boolean} if true minify the compiled JavaScript, Default is false.
 *   outputFile: {string} xxx
 * @param callback function to call when complete. function(err) if err is null then compilation is successful
 * Reason for failure written to stdout.
 */
function compileGroupFile(file, options, callback) {
    var parseOptions, text,
        baseDir = path.dirname(file),
        ext = path.extname(file);

    if (!path.isAbsolute(baseDir)) {
        baseDir = path.join(process.cwd(), baseDir);
        file = path.join(process.cwd(), file);
    }
    parseOptions = util.copyProperties(options, defaultOptions);
    parseOptions.startRule = startRule(ext, false);
    parseOptions.readFile = getFileReader(baseDir, parseOptions.encoding);
    parseOptions.group = makeGroup("", path.basename(file, ext));

    try {
        text = parseOptions.readFile(file);
        parser.parse(text, parseOptions);
    } catch (ex) {
        logError(file, ex);
        callback(Error("Failed to compile '" + file + "'"));
    }
    // xxx
    //generateBootstrap(baseDir, parseOptions, callback);
    generate(baseDir, parseOptions, callback);
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
                logError(filePath, ex);
                errorCount += 1;
                continue;
            }
            if (stat.isDirectory()) {
                if (options.verbose) {
                    console.log("Processing group sub folder '" + relFile + "'...");
                }
                processDir(relFile, filePath);
            } else if (ext === stGroup.TEMPLATE_FILE_EXTENSION || ext === stGroup.GROUP_FILE_EXTENSION) {
                if (options.verbose) {
                    console.log("Processing file '" + relFile + "'...");
                }

                try {
                    text = options.readFile(relFile);
                    group.groupFolder = relDir;
                    group.fileName = path.basename(file, ext);
                    options.startRule = startRule(ext, group.raw);
                    parser.parse(text, options);
                } catch (ex) {
                    logError(relFile, ex);
                    errorCount += 1;
                }
            }
        }
    }

    if (options.verbose) {
        console.log("Processing group folder '" + rootDir + "'...");
    }
    group = options.group;
    processDir("", rootDir);
    return errorCount;
}

function compileDir(dir, options, callback, raw) {
    var parseOptions,
        baseDir = path.dirname(dir);

    if (!path.isAbsolute(baseDir)) {
        baseDir = path.join(process.cwd(), baseDir);
        dir = path.join(process.cwd(), dir);
    }

    parseOptions = util.copyProperties(options, defaultOptions);
    // start rule needs to be set per file
    parseOptions.readFile = getFileReader(dir, parseOptions.encoding);
    parseOptions.group = makeGroup("", "", raw);

    if (parseDir(dir, parseOptions) === 0) {
        generate(baseDir, parseOptions, callback);
    } else {
        callback(Error("Failed to compile '" + dir + "'"));
    }
}


/**
 * Compile a group directory.
 *
 * @param dir {string} directory full of template or group files to compile to a single group
 * @param options object to control compilation with these optional properties;
 *   delimiterStartChar: {string} single character string. Default is stGroup.DEFAULT_START_DELIMITER.
 *   delimiterStopChar: {string} single character string. Default is stGroup.DEFAULT_STOP_DELIMITER.
 *   encoding: {string} encoding for input and output files. Default is "utf8".
 *   verbose: {boolean} if true write additional information to stdout. Default is false.
 *   outputAST: {boolean} if true output the AST that results from parsing the group file
 *   minify: {boolean} if true minify the compiled JavaScript, Default is false.
 *   outputFile: {string} xxx
 * @param callback function to call when complete. function(err) if err is null then compilation is successful
 * Reason for failure written to stdout.
 */
function compileGroupDir(dir, options, callback) {
    compileDir(dir, options, callback, false);
}

/**
 * Compile a group directory of raw template files.
 *
 * @param dir {string} directory full of template or group files to compile to a single group
 * @param options object to control compilation with these optional properties;
 *   delimiterStartChar: {string} single character string. Default is stGroup.DEFAULT_START_DELIMITER.
 *   delimiterStopChar: {string} single character string. Default is stGroup.DEFAULT_STOP_DELIMITER.
 *   encoding: {string} encoding for input and output files. Default is "utf8".
 *   verbose: {boolean} if true write additional information to stdout. Default is false.
 *   outputAST: {boolean} if true output the AST that results from parsing the group file
 *   minify: {boolean} if true minify the compiled JavaScript, Default is false.
 *   outputFile: {string} xxx
 * @param callback function to call when complete. function(err) if err is null then compilation is successful
 * Reason for failure written to stdout.
 */
function compileRawGroupDir(dir, options, callback) {
    compileDir(dir, options, callback, true);
}

// xxx
function writeFile(filePath, text) {
    fs.writeFileSync(filePath, text, {
        mode: 420 // 0x644
    });
}

function generate(baseDir, options, callback) {
    var astFilename, filename, group, writer, t,
        groupAST = options.group;

    // xxx any pre processing of parsing output needed?
    groupAST.date = (new Date()).toString();

    if (options.outputAST) {
        astFilename = path.join(baseDir, groupAST.fileName + "_stg_ast.json");
        writeFile(astFilename, JSON.stringify({g: groupAST}, null, 4));
    }

    // xxx generate
    group = st.loadGroup(groupGenSTG);
    writer = aiw.makeWriter();

    t = group.getTemplate("/compiledGroup");
    t.setArgs({g: groupAST});
    t.write(writer);
    filename = path.join(baseDir, groupAST.fileName + "_stg.js"); // xxx _stg vs _st?
    writeFile(filename, writer.toString());
    // xxx minify option
    callback(null);
}

function generateBootstrap(baseDir, options, callback) {
    var astFilename, filename,
        groupAST = options.group;

    // xxx any pre processing of parsing output needed?
    groupAST.date = (new Date()).toString();
    groupAST = {g:groupAST};

    if (options.outputAST) {
        astFilename = path.join(baseDir, groupAST.g.fileName + "_stg_ast.json");
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
        callback(null);
    });

}

module.exports = {
    version: VERSION,
    compileGroupFile: compileGroupFile,
    compileGroupDir: compileGroupDir,
    compileRawGroupDir: compileRawGroupDir
};
