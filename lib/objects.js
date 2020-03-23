/**
 * Work with objects (read from files, parsing and etc.).
 * @module objects
 * @author deverte
 */

// built-in packages
let fs = require('fs')
// npm packages
let jsonminify = require('jsonminify') // Do not delete!
let R = require('ramda')
// project modules
let opt = require('./options')

/**
 * Parses JSON-file and returns an object.
 * @param {string} objPath - Path to the JSON-file with an object.
 * @returns {object | undefined} Desired object or `undefined`
 *                               if JSON-file does not exist.
 * @example <caption>Example usage.</caption>
 * parseObject('diagram.json')
 * // -> object // if 'diagram.json' exists
 * // -> undefined // if can't read JSON from 'diagram.json'
 */
let parseObject = (objPath) => R.tryCatch(
    R.pipe(
        R.curry(fs.readFileSync)(R.__, 'utf8'),
        JSON.minify,
        JSON.parse
    ),
    R.pipe(
        (err) => console.log(`${err.name}: ${err.message}. <File: '${objPath}'>`),
        R.always(undefined)
    )
)(objPath)

/**
 * Get default object from specified default file path.
 * @param {string} defaultValue - Default file path.
 * @returns {object | undefined} Desired object or `undefined`
 *                               if JSON-file does not exist.
 */
let getDefaultObject = R.ifElse(
    fs.existsSync,
    parseObject,
    R.always(undefined)
)

/**
 * Get object from specified or default file if exist.
 * @param {string} defaultValue - Default file used if specified file does not exist.
 * @param {string[]} keys - Keys of described option.
 * @param {string[]} args - Arguments string to find option.
 *                          Usually - `process.argv`.
 * @returns {object | undefined} Desired object or `undefined`
 *                               if JSON-file does not exist.
 * @example <caption>Example usage.</caption>
 * // node main.js -c mjc.json
 * getObjectOverDefault('mathjax_config.json', ['-c', '--config'], process.argv)
 * // -> object // object from 'mjc.json' if this file exists and without syntax errors.
 * // -> object // object from 'mathjax_config.json' if 'mjc.json' does not exist or with syntax
 *              // errors and if 'mathjax_config.json' exists and without syntax errors.
 * // -> undefined // if can't read JSON from 'mathjax_config.json'.
 */
let getObjectOverDefault = (defaultValue, keys, args) => R.pipe(
    R.partial(opt.parseOption, [keys, args]),
    R.ifElse(
        R.complement(R.isNil),
        R.pipe(
            parseObject,
            R.when(
                R.isNil,
                R.partial(getDefaultObject, [defaultValue])
            ),
        ),
        R.partial(getDefaultObject, [defaultValue])
    )
)(defaultValue, keys, args)

/**
 * Get object from specified file if exist.
 * @param {string[]} keys - Keys of described option.
 * @param {string[]} args - Arguments string to find option.
 *                          Usually - `process.argv`.
 * @returns {object | undefined} Desired object or `undefined`
 *                               if JSON-file does not exist.
 * @example <caption>Example usage.</caption>
 * // node main.js -d diagram.json
 * getObject(['-d', '--diagram'], process.argv)
 * // -> object // object from 'mjc.json' if this file exists and without syntax errors.
 * // -> object // object from 'mathjax_config.json' if 'mjc.json' does not exist or with syntax
 *              // errors and if 'mathjax_config.json' exists and without syntax errors.
 * // -> undefined // if can't read JSON from 'mathjax_config.json'.
 */
let getObject = (keys, args) => R.pipe(
    R.partial(opt.parseOption, [keys, args]),
    parseObject
)(keys, args)

/**
 * Parses JSON-files, and returns a merged object from all files.
 * Priority comes with order of definition (order in array starting from left).
 * @param {string[]} objPaths - Paths to the JSON-files with an objects.
 * @returns {object | undefined} Desired merged object or `undefined`
 *                               if JSON-file does not exist.
 * 
 * @example <caption>Example usage.</caption>
 * // 'st1.json' { "a": "1", "c": "d1" }
 * // 'st2.json' { "b": "2", "c": "d2" }
 * parseObjects(['st1.json', 'st2.json'])
 * // -> { "a": "1", "c": "d1", "b": "2" }
 * 
 * // 'st1.json' does not exist or with syntax error
 * // 'st2.json' { "b": "2", "c": "d2" }
 * parseObjects(['st1.json', 'st2.json'])
 * // -> { "b": "2", "c": "d2" }
 * 
 * // 'st1.json' does not exist or with syntax error
 * // 'st2.json' does not exist or with syntax error
 * parseObjects(['st1.json', 'st2.json'])
 * // -> undefined
 */
let parseObjects = R.ifElse(
    R.complement(R.isEmpty),
    R.reduce(
        (obj, objPath) => R.tryCatch(
            R.pipe(
                R.always(objPath),
                R.curry(fs.readFileSync)(R.__, 'utf8'),
                JSON.minify,
                JSON.parse,
                R.mergeDeepLeft(obj)
            ),
            R.pipe(
                (err) => console.log(`${err.name}: ${err.message}. <File: '${objPath}'>`),
                R.always(obj)
            )
        )(obj, objPath),
        undefined
    ),
    R.always(undefined)
)

/**
 * Get default objects from specified default files paths.
 * @param {string} defaultValues - Default files paths.
 * @returns {object | undefined} Desired object or `undefined`
 *                               if all JSON-files does not exist.
 */
let getDefaultObjects = R.pipe(
    R.filter(fs.existsSync),
    parseObjects,
)

/**
 * Get object from specified or default files if exist.
 * @param {string[]} defaultValues - Default files used if specified file does not exist.
 * @param {string[]} keys - Keys of described options.
 * @param {string[]} args - Arguments string to find options.
 *                          Usually - `process.argv`.
 * @returns {object | undefined} Desired object or `undefined`
 *                               if JSON-file does not exist.
 * 
 * @example <caption>Example usage.</caption>
 * // node main.js -s st1.json --style st2.json
 * // 'st1.json' { "a": "1", "c": "d1" }
 * // 'st2.json' { "b": "2", "c": "d2" }
 * // 'st3.json' { "e": "3", "c": "d3" }
 * getObjects(['st3.json'], ['-s', '--style'], process.argv)
 * // -> { "a": "1", "c": "d1", "b": "2", "e": "3" }
 * 
 * // node main.js -s st1.json --style st2.json
 * // 'st1.json' does not exist or with syntax error
 * // 'st2.json' does not exist or with syntax error
 * // 'st3.json' does not exist or with syntax error
 * getObjects(['st3.json'], ['-s', '--style'], process.argv)
 * // -> undefined
 */
let getObjects = (defaultValues, keys, args) => R.pipe(
    R.partial(opt.parseOptionsMultiple, [keys, args]),
    parseObjects,
    R.ifElse(
        R.complement(R.isNil),
        (parsedObjects) => R.pipe(
            R.partial(getDefaultObjects, [defaultValues]),
            R.ifElse(
                R.complement(R.isNil),
                R.mergeDeepLeft(parsedObjects),
                R.always(parsedObjects)
            )
        )(parsedObjects),
        R.partial(getDefaultObjects, [defaultValues])
    )
)(defaultValues, keys, args)

module.exports.getObjectOverDefault = getObjectOverDefault
module.exports.getObject = getObject
module.exports.getObjects = getObjects