/**
 * A charting program based on the `psi` package for `node.js`.
 * The main task is to build diagrams of quantum mechanical models
 * CTC - D-CTC, P-CTC, T-CTC, but it can also be used to build
 * quantum circuits, and etc.
 * @module main
 * @see {@link https://github.com/deverte/psi} `psi` `node.js` package.
 * @see {@link https://github.com/deverte/psi/wiki} `psi` wiki.
 * @author deverte
 */

// built-in packages
// ...
// npm packages
// ...
// project modules
let cmd = require('./lib/commands')

let main = () => {
    cmd.applyCommands(process.argv)
}

if (require.main === module) {
    main()
}