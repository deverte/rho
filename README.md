# Rho

<div width="30%" align="center">
    <img src="https://raw.githubusercontent.com/deverte/rho/master/img/icon.svg?sanitize=true" />
</div>

A charting CLI program based on the [psi](https://github.com/deverte/psi) package for `node.js`. The main mission of this program is to build diagrams of quantum mechanical models CTC - D-CTC, P-CTC, T-CTC, but it can also be used to build quantum circuits, and etc.

Besides building SVG files, you can use it's API (see ["--write" command](#Commands)) to integrate it with other projects.

**Example:**
<div align="center">
    <img src="https://raw.githubusercontent.com/wiki/deverte/psi/images/bell.svg?sanitize=true" />
</div>

*Now it is available only `Windows` version. But if there are any requests, I will add the `GNU/Linux` version.*


---

1. [Installation](#Installation)
2. [How to build diagrams](#How-to-build-diagrams)
3. [Commands](#Commands)
4. [Used packages](#Used-packages)
5. [License](#License)

---


## Installation
Note: Scoop is fully **portable**.

### Scoop
The most comfortable usage is to download this program using [Scoop](https://scoop.sh/) package manager.
To do this, you can add this repo and install this program.
```sh
scoop bucket add shell https://github.com/deverte/scoop-shell
```
```sh
scoop install rho
```

### Download
Also you can download a single executable file (`rho.exe`) or full package (`rho_full_*.zip`) and use it like portable program.  
It's recommended to set alias for Rho or add it's path to the PATH environment variable.

[Download](https://github.com/deverte/rho/releases)


## How to build diagrams
To build diagram, you need to create JSON-file to describe how it should look like. Describing rules you can find at [psi wiki - objects](https://github.com/deverte/psi/wiki#objects).

Also (but not obligatory) you can create style files and set unique style to the diagram. Style describing rules you can find at [psi wiki - styles](https://github.com/deverte/psi/wiki#styles).

After all, you can build diagram by passing diagram input and output arguments to the program.

**Simpliest usage** is to pass only diagram input and output files.
```sh
rho -d diagram.json -o diagram.svg
```
After that, `rho` will create `diagram.svg` file (if `diagram.json` does not contains syntax and other errors).

Also you can add one or more **styles**.
```sh
rho -d diagram.json -o diagram.svg -s st1.json -s st2.json
```
In this example, to the diagram will be added combined style from `st1.json`, `st2.json` files and from default style.

More options you can find at [Commands](#Commands) section.


## Commands
**-c, --config [ mathjax_config.json ]**  
Path to the mathjax configuration file. Only the last element is valid. See [MathJax configuration](https://github.com/deverte/psi/wiki/reference-diagram#MathJax-configuration).

**-d, --diagram [ diagram.json ]**  
Path to the diagram json file. *Required option*. Only the last element is valid. See [objects](https://github.com/deverte/psi/wiki#objects).

**-h, --help**  
Call help.

**-o, --output [ output.svg ]**  
Path to the output diagram svg file. Only the last element is valid.

**-s, --style [ style.json ]**  
Path to the style files. You can define multiple style files. The priority of properties is given in the order of the ad, starting from the first file. See [styles](https://github.com/deverte/psi/wiki#styles).

**-t, --typeset [ mathjax_typeset.json ]**  
Path to the mathjax typeset file. Only the last element is valid. See [MathJax typeset](https://github.com/deverte/psi/wiki/reference-diagram#mathjax-typeset)

**-v, --version**  
Print "Rho" version.

**-w, --write**  
Print result svg text to the console. You can use it as API.


## Used packages
[psi](https://github.com/deverte/psi)  
[ramda](https://ramdajs.com/)  
[lodash](https://lodash.com/)  
[jsonminify](https://www.npmjs.com/package/jsonminify)  
[pkg](https://github.com/zeit/pkg)


## License
MIT