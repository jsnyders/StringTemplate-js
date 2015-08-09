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
    group = require("./group.js"),
    makeGroup = group.makeGroup,
    util = require("../lib/util.js"),
    stErrors = require("../lib/errors").st,
    st = require("../lib/stRuntime"),
    aiw = require("../lib/autoIndentWriter"),
    groupGenSTG = require("./groupGen_stg"),
    jsAttrRenderer = require("../lib/javaScriptAttributeRenderer");

var VERSION = "0.1.1";

var defaultOptions = {
    verbose: false,
    encoding: "utf8",
    outputAST: false,
    minify: false,
    delimiterStartChar: group.DEFAULT_START_DELIMITER,
    delimiterStopChar: group.DEFAULT_STOP_DELIMITER
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
    if (ext === group.GROUP_FILE_EXTENSION) {
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
 *   delimiterStartChar: {string} single character string. Default is group.DEFAULT_START_DELIMITER.
 *   delimiterStopChar: {string} single character string. Default is group.DEFAULT_STOP_DELIMITER.
 *   encoding: {string} encoding for input and output files. Default is "utf8".
 *   verbose: {boolean} if true write additional information to stdout. Default is false.
 *   outputAST: {boolean} if true output the AST that results from parsing the group file
 *   minify: {boolean} if true minify the compiled JavaScript, Default is false.
 *   output: {string} if this is the path of an existing folder then the output JavaScript file(s)
 *       and AST file (if any) will be written to that folder. If the path includes a file name and the
 *       folder exists then the output JavaScript file(s) and AST file (if any) will be written to
 *       that folder and with the file name as the basename. Otherwise or if output is just a filename
 *       then it will be the basename of the output JavaScript file(s) and AST file if any which will
 *       be written to the same folder as the input file.
 * @param callback function to call when complete. function(err) if err is null then compilation is successful
 * Reason for failure written to stdout. xxx is this a good idea? Perhaps only if verbose
 */
function compileGroupFile(file, options, callback) {
    var parseOptions, text,
        baseDir = path.dirname(file),
        ext = path.extname(file);

    if (!path.isAbsolute(baseDir)) {
        baseDir = path.join(process.cwd(), baseDir);
        file = path.join(process.cwd(), file);
    }
    parseOptions = util.copyProperties(options, util.copyProperties(defaultOptions, {}));
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
    var curGroup,
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
            } else if (ext === group.TEMPLATE_FILE_EXTENSION || ext === group.GROUP_FILE_EXTENSION) {
                if (options.verbose) {
                    console.log("Processing file '" + relFile + "'...");
                }

                try {
                    text = options.readFile(relFile);
                    curGroup.groupFolder = relDir;
                    curGroup.fileName = path.basename(file, ext);
                    options.startRule = startRule(ext, curGroup.raw);
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
    curGroup = options.group;
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

    parseOptions = util.copyProperties(options, util.copyProperties(defaultOptions, {}));
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
 *   delimiterStartChar: {string} single character string. Default is group.DEFAULT_START_DELIMITER.
 *   delimiterStopChar: {string} single character string. Default is group.DEFAULT_STOP_DELIMITER.
 *   encoding: {string} encoding for input and output files. Default is "utf8".
 *   verbose: {boolean} if true write additional information to stdout. Default is false.
 *   outputAST: {boolean} if true output the AST that results from parsing the group file
 *   minify: {boolean} if true minify the compiled JavaScript, Default is false.
 *   output: {string} if this is the path of an existing folder then the output JavaScript file(s)
 *       and AST file (if any) will be written to that folder. If the path includes a file name and the
 *       folder exists then the output JavaScript file(s) and AST file (if any) will be written to
 *       that folder and with the file name as the basename. Otherwise or if output is just a filename
 *       then it will be the basename of the output JavaScript file(s) and AST file if any which will
 *       be written to the same folder as the input file.
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
 *   delimiterStartChar: {string} single character string. Default is group.DEFAULT_START_DELIMITER.
 *   delimiterStopChar: {string} single character string. Default is group.DEFAULT_STOP_DELIMITER.
 *   encoding: {string} encoding for input and output files. Default is "utf8".
 *   verbose: {boolean} if true write additional information to stdout. Default is false.
 *   outputAST: {boolean} if true output the AST that results from parsing the group file
 *   minify: {boolean} if true minify the compiled JavaScript, Default is false.
 *   output: {string} if this is the path of an existing folder then the output JavaScript file(s)
 *       and AST file (if any) will be written to that folder. If the path includes a file name and the
 *       folder exists then the output JavaScript file(s) and AST file (if any) will be written to 
 *       that folder and with the file name as the basename. Otherwise or if output is just a filename
 *       then it will be the basename of the output JavaScript file(s) and AST file if any which will
 *       be written to the same folder as the input file. 
 * @param callback function to call when complete. function(err) if err is null then compilation is successful
 * Reason for failure written to stdout.
 */
function compileRawGroupDir(dir, options, callback) {
    compileDir(dir, options, callback, true);
}

function writeFile(filePath, text) {
    fs.writeFileSync(filePath, text, {
        mode: 420 // 0x644
    });
}

function isDir(p) {
    try {
        return fs.statSync(p).isDirectory();
    } catch (ex) {
        // really don't care
    }
    return false;
}

function getFilePath(baseDir, srcFile, outputPath, suffix) {
    var filePath, dir, name;
    if (outputPath) {
        if (isDir(outputPath)) {
            filePath = path.join(outputPath, srcFile);
        } else {
            if (outputPath.indexOf(path.sep) >= 0) {
                dir = path.dirname(outputPath);
                if (!isDir(dir)) {
                    dir = baseDir;
                }
            } else {
                dir = baseDir;
            }
            name = path.basename(outputPath, path.extname(outputPath));
            filePath = path.join(dir, name);
        }
    } else {
        filePath = path.join(baseDir, srcFile);
    }
    filePath += suffix;
    return filePath;
}

function minify(jsCodeIn, filename, options) {
    var UglifyJS, result;

    try {
        UglifyJS = require("uglify-js");
    } catch (ex) {
        if (options.verbose) {
            console.log("Warning uglify-js module not installed. Not able to minify.");
        }
        return;
    }

    result = UglifyJS.minify(jsCodeIn, {fromString: true});
    writeFile(filename, result.code);
}

function generate(baseDir, options, callback) {
    var astFilename, filename, g, writer, t, code,
        groupAST = options.group;

    // xxx any pre processing of parsing output needed?
    groupAST.date = (new Date()).toString();

    if (options.outputAST) {
        astFilename = getFilePath(baseDir, groupAST.fileName, options.output, "_stg_ast.json");
        writeFile(astFilename, JSON.stringify({g: groupAST}, null, 4));
    }

    g = st.loadGroup(groupGenSTG);
    g.registerAttributeRenderer("string", jsAttrRenderer);
    g.setErrorListener(function(err) {
        var loc, locationInfo;
        if (err.type === stErrors.PROPERTY_NOT_FOUND) {
            return; // there are many optional properties in the AST so ignore this error
        } // else
        if (options.verbose) {
            locationInfo = "";
            if (err.file) {
                locationInfo += err.file;
            }
            if (err.line) {
                locationInfo += "," + err.line;
                if (err.column) {
                    locationInfo += "," + err.column;
                }
            }
            console.log("Internal error during code generation (at " + locationInfo + "): " + err.message);
            // xxx factor out common code
            if (err.arg1 && err.arg1.loc) {
                loc = err.arg1.loc;
                locationInfo = "";
                if (loc.file) {
                    locationInfo += loc.file;
                }
                if (loc.line) {
                    if (locationInfo) {
                        locationInfo += ",";
                    }
                    locationInfo += loc.line;
                    if (loc.column) {
                        locationInfo += "," + loc.column;
                    }
                }
                console.log("  At source location: " + locationInfo);
            }
        } else {
            console.log("Internal error: " + err.message);
        }
    });
    writer = aiw.makeWriter();

    t = g.getTemplate("/compiledGroup");
    t.setArgs({g: groupAST});
    t.write(writer);
    filename = getFilePath(baseDir, groupAST.fileName, options.output, "_stg.js");

    code = writer.toString();
    writeFile(filename, code);
    if (options.minify) {
        filename = getFilePath(baseDir, groupAST.fileName, options.output, "_stg.min.js");
        minify(code, filename, options);
    }

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

    filename = path.join(baseDir, groupAST.g.fileName + "_stg.js");

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
