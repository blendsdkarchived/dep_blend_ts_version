var readline = require('readline-sync');
var fs = require('fs');
var mkdirp = require('mkdirp');
var swig = require('swig');

var rootFolder = fs.realpathSync(__dirname + '/../');
var srcFolder = rootFolder + '/src';
var themesFolder = rootFolder + '/themes';
var themesLibFolder = themesFolder + '/etc/lib';
var templatesFolder = rootFolder + '/etc/templates';

/**
 * Prepare rendering information based on a given class name
 */
function getClassInfo(name) {
    var parts = name.split('.');
    var className = parts[parts.length - 1];
    var folder = srcFolder + '/' + (name.replace('Blend.', '').replace('.' + className, '').replace(/\./g, '/')).toLowerCase();
    console.log(folder);
    var scssMixinName = name.toLowerCase().replace('Blend.', '').replace(/\./g, '-');
    var interfaceName = className + 'ConfigInterface';
    parts.pop();

    var refRoot = '../'.repeat(parts.length - 1)

    return {
        className: className,
        fullName: name,
        namespaceName: parts.join('.'),
        interfaceName: interfaceName,
        folder: folder,
        scssMixinName: scssMixinName,
        parentClass: 'Blend.ui.View',
        interfaceFileLocation: refRoot + 'interface/' + interfaceName,
        refRoot: refRoot
    }
}

/**
 * Create a folder recursively
 */
function createFolder(name) {
    if (!fs.existsSync(cinfo.folder)) {
        mkdirp.sync(cinfo.folder);
        return true;
    } else {
        return false;
    }
}

/**
 * Render a template to a file
 */
function renderToFile(templateName, fileName, data) {

    var tmpl = swig.compileFile(templatesFolder + '/' + templateName);
    if (!fs.existsSync(fileName)) {
        console.log('Generating ' + fileName);
        fs.writeFileSync(fileName, tmpl(data));
        return true;
    } else {
        console.log('Skipping ' + fileName);
        return false;
    }
}

/**
 * Add @import "..." line to the _lib.scss 
 */
function addScssLibImport(fileName) {
    var imp = '@import "' + fileName + '";'
    var libFile = themesLibFolder + '/_lib.scss';
    var contents = fs.readFileSync(libFile).toString().trim();
    var result = [];
    contents.replace(imp, '');
    contents = contents.split("\n");
    contents.forEach(function (line) {
        if (line.trim() != imp.trim()) {
            result.push(line);
        }
    });
    result.push(imp);
    fs.writeFileSync(libFile, result.join("\n"));
    console.log('Updated ' + libFile);
}

var className = readline.question('Please enter a full class name:') || null;

if (className && className.trim() !== '') {

    var cinfo = getClassInfo(className);

    cinfo.interfaceName = readline.question('Please enter an interface name : (' + cinfo.interfaceName + '):') || cinfo.interfaceName;
    cinfo.parentClass = readline.question('Please enter an parent class name : (' + cinfo.parentClass + '):') || cinfo.parentClass;

    console.log(JSON.stringify(cinfo, null, 2));
    var generate = readline.question('Is this information correct (y/n)') === 'y' ? true : false;

    if (generate) {
        // create folder 
        createFolder(cinfo.folder);
        renderToFile('ui-class.ts', cinfo.folder + '/' + cinfo.className + '.ts', cinfo);
        renderToFile('ui-interface.ts', srcFolder + '/interface/' + cinfo.interfaceName + '.ts', cinfo);
        renderToFile('ui-lib-mixin.scss', themesLibFolder + '/_' + cinfo.scssMixinName + '.scss', cinfo);

        addScssLibImport(cinfo.scssMixinName);
    }
}
console.log('Done.');
