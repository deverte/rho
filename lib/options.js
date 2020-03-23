/**
 * Arguments (keys, options) processing (parsing).
 * @module objects
 * @author deverte
 */

// built-in packages
// ...
// npm packages
let _ = require('lodash')
let R = require('ramda')
// project modules
// ...

/**
 * Check if key inside args string.
 * @param {string[]} keys - Keys of desired options.
 * @param {string[]} args - Arguments string array to find options.
 *                          Usually - `process.argv`.
 * @returns {boolean} `true` if at least one of specified keys
 *                    inside args array.
 * 
 * @example <caption>Example usage.</caption>
 * // node main.js -s st1.json --style st2.json -s st3.json
 * isOption(['-s', '--styles'], process.argv)
 * // -> true
 */
let isOption = R.curry(
    R.pipe(
        R.intersection,
        R.isEmpty,
        R.not
    )
)

/**
 * Parses arguments string and returns the last option with specified keys.
 * @param {string[]} keys - Keys of desired option.
 * @param {string[]} args - Arguments string array to find option.
 *                          Usually - `process.argv`.
 * @returns {string | undefined} Desired option if keys exists in
 *                               program arguments string else `undefined`.
 * 
 * @example <caption>Example usage.</caption>
 * // node main.js -d d1.json --diagram d2.json -d d3.json
 * parseOption(['-d', '--diagram'], process.argv)
 * // -> d3.json
 * 
 * // node main.js -d d1.json --diagram d2.json -d
 * parseOption(['-d', '--diagram'], process.argv)
 * // -> undefined
 * 
 * // node main.js
 * parseOption(['-d', '--diagram'], process.argv)
 * // -> undefined
 */
let parseOption = (keys, args) => R.ifElse(
    isOption, // Condition
    R.pipe( // If intersection is not empty
        R.map( // Find last indices and add 1
            (key) => R.pipe(
                R.lastIndexOf,
                R.inc
            )(key, args)
        ),
        _.max,
        R.nth(R.__, args)
    ),
    R.always(undefined), // If intersection is empty
)(keys, args)

/**
 * Find all indices of specified key.
 * @param {string} key - Desired key.
 * @param {string[]} args - Arguments string array to find key's indices.
 *                          Usually - `process.argv`.
 * @returns {number[]} Desired keys indices array (can be empty).
 * @example <caption>Example usage.</caption>
 * // node main.js -s st1.json --style st2.json -s st3.json
 * allIndicesOf('-s', process.argv)
 * // -> [ 2, 6 ]
 * 
 * // node main.js a b c
 * allIndicesOf('-s', process.argv)
 * // -> []
 */
let allIndicesOf = (key, args) => R.pipe(
    R.always(args), // R.nthArg(1),
    R.pickBy(R.equals(key)),
    R.keys,
    R.map(Number)
)(key, args)

/**
 * Parses arguments string and returns all options with specified keys.
 * @param {string[]} keys - Keys of desired options.
 * @param {string[]} args - Arguments string array to find options.
 *                          Usually - `process.argv`.
 * @returns {string[]} Desired options array (can be empty).
 * 
 * @example <caption>Example usage.</caption>
 * // node main.js -s st1.json --style st2.json -s st3.json
 * parseOptionsMultiple(['-s', '--styles'], process.argv)
 * // -> [ 'st1.json', 'st2.json', 'st3.json' ]
 * 
 * // node main.js a b c
 * parseOptionsMultiple(['-s', '--styles'], process.argv)
 * // -> []
 */
let parseOptionsMultiple = (keys, args) => R.pipe(
    R.map((key) => allIndicesOf(key, args)),
    R.flatten,
    R.map((idx) => R.nth(R.inc(idx), args)),
    _.compact
)(keys, args)

module.exports.isOption = isOption
module.exports.parseOption = parseOption
module.exports.parseOptionsMultiple = parseOptionsMultiple