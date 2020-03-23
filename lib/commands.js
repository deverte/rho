/**
 * Program commands processing.
 * @module commands
 * @author deverte
 */

// built-in packages
let fs = require('fs')
let path = require('path')
// npm packages
let R = require('ramda')
let { Diagram } = require('psi')
// project modules
let opt = require('./options')
let obj = require('./objects')

/**
 * Prints help information.
 */
let help = () => {
    // console.log(_.repeat(' ', 88)) // length - 88 symbols
    console.log('Usage: rho -d [ diagram.json ] [options]')
    console.log('Usage: rho -d [ diagram.json ] -o [ output.svg ] [options]\n')
    console.log('Options:')
    console.log('  -c, --config\t [ mathjax_config.json ]\t Path to the mathjax configuration file.')
    console.log('  \t\t\t\t\t\t Only the last element is valid.')
    console.log('  -d, --diagram\t [ diagram.json ]\t\t Path to the diagram json file.')
    console.log('  \t\t\t\t\t\t Required option.')
    console.log('  \t\t\t\t\t\t Only the last element is valid.')
    console.log('  -h, --help\t\t\t\t\t Call help.')
    console.log('  -o, --output\t [ output.svg ]\t\t\t Path to the output diagram svg file.')
    console.log('  \t\t\t\t\t\t Only the last element is valid.')
    console.log('  \t\t\t\t\t\t If not defined, nothing will happen.')
    console.log('  -s, --style\t [ style.json ]\t\t\t Path to the style files.')
    console.log('  \t\t\t\t\t\t You can define multiple style files.')
    console.log('  \t\t\t\t\t\t The priority of properties is given in')
    console.log('  \t\t\t\t\t\t the order of the ad, starting from the')
    console.log('  \t\t\t\t\t\t first file.')
    console.log('  -t, --typeset\t [ mathjax_typeset.json ]\t Path to the mathjax typeset file.')
    console.log('  \t\t\t\t\t\t Only the last element is valid.')
    console.log('  -v, --version\t\t\t\t\t Print "Rho" version.')
    console.log('  -w, --write\t\t\t\t\t Print result svg to the console.')
}

/**
 * Prints program version.
 */
let version = () => {
    console.log('"Rho" version: 0.0.1')
}

/**
 * The specified file pretends to be in program executable directory.
 * @param {string} fileName - Name of file to pretend.
 * @returns {string} Final path of file if it in program executable directory.
 * @example <caption>Example usage.</caption>
 * pretendInsideExecDir('mathjax_config.json')
 * // -> '%EXEC_PATH%/mathjax_config.json'
 */
let pretendInsideExecDir = (fileName) => path.join(path.dirname(process.execPath), fileName)

/**
 * Checks existance of specified file.
 * @param {string} filePath - Path of file to be checked.
 * @returns {string | undefined} Final path of file in program executable directory.
 *                               Or `undefined` if this file does not exist.
 */
let checkIfExists = R.ifElse(
    fs.existsSync,
    R.identity,
    R.always(undefined)
)

/**
 * Sets path of file to be default.
 * @param {string} fileName - Path of file to be seted.
 * @returns {string | undefined} Final path of file in program executable directory.
 *                               Or `undefined` if this file does not exist.
 */
let setDefault = R.pipe(
    pretendInsideExecDir,
    checkIfExists
)

/**
 * Creates `Diagram` object.
 * @param {string[]} args - Arguments string with options.
 *                          Usually - `process.argv`.
 * @returns {Diagram | undefined} Diagram object or `undefined`
 */
let createDiagram = (args) => R.pipe(
    R.partial(obj.getObject, [['-d', '--diagram'], args]),
    R.when(
        R.complement(R.isNil),
        R.tryCatch(
            (diagramObject) => new Diagram(
                diagramObject,
                {
                    style: obj.getObjects(
                        [setDefault('style.json')],
                        ['-s', '--style'],
                        args
                    ),
                    mjConfig: obj.getObjectOverDefault(
                        setDefault('mathjax_config.json'),
                        ['-c', '--config'],
                        args,
                    ),
                    mjTypeset: obj.getObjectOverDefault(
                        setDefault('mathjax_typeset.json'),
                        ['-t', '--typeset'],
                        args,
                    )
                }
            ),
            R.pipe(
                (err) => console.log(`${err.name}: ${err.message}. Diagram was not created.`),
                R.always(undefined)
            )
        )
    )
)(args)

/**
 * Creates SVG file with diagram.
 * @param {string[]} args - Arguments string array.
 *                          Usually - `process.argv`.
 * @param {Diagram} diagram - Diagram that used to create SVG-file.
 */
let output = (args, diagram) => R.tryCatch(
    () => {
        fs.writeFileSync(
            opt.parseOption(['-o', '--output'], args),
            diagram.svg.svg()
        )
    },
    R.pipe(
        (err) => console.log(
            `${err.name}: ${err.message}. Diagram was not generated.`
        ),
        R.always(undefined)
    )
)(args, diagram)

/**
 * Try to create and output diagram.
 * @param {string[]} args - Arguments string array.
 *                          Usually - `process.argv`.
 */
let diagram = (args) => R.pipe(
    createDiagram,
    R.when(
        R.is(Diagram),
        R.pipe(
            (diagram) => diagram.generate(),
            (generate) => generate.then(
                (diagram) => R.cond(
                    [
                        [
                            () => opt.isOption(['-o', '--output'], args),
                            () => output(args, diagram)
                        ],
                        [
                            () => opt.isOption(['-w', '--write'], args),
                            () => console.log(diagram.svg.svg())
                        ]
                    ]
                )(diagram)
            )
        )
    ),
)(args)

/**
 * Applies commands.
 * @param {string[]} args - Arguments string array.
 *                          Usually - `process.argv`.
 */
let applyCommands = R.cond(
    [
        [
            opt.isOption(['-h', '--help']),
            help
        ],
        [
            opt.isOption(['-v', '--version']),
            version
        ],
        [
            opt.isOption(['-d', '--diagram']),
            diagram
        ],
        [
            R.T,
            help
        ]
    ]
)

module.exports.applyCommands = applyCommands