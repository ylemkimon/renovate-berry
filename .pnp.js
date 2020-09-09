#!/usr/bin/env node
/* eslint-disable */

try {
  Object.freeze({}).detectStrictMode = true;
} catch (error) {
  throw new Error(`The whole PnP file got strict-mode-ified, which is known to break (Emscripten libraries aren't strict mode). This usually happens when the file goes through Babel.`);
}

var __non_webpack_module__ = module;

function $$SETUP_STATE(hydrateRuntimeState, basePath) {
  var path = require('path');
  var dataLocation = path.resolve(__dirname, "pnp-data.json");
  return hydrateRuntimeState(require(dataLocation), {basePath: basePath || path.dirname(dataLocation)});
  }

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["pnpHook"] = factory();
	else
		root["pnpHook"] = factory();
})(global, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 398:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "uY": () => /* binding */ FakeFS,
  "fS": () => /* binding */ BasePortableFakeFS
});

// UNUSED EXPORTS: normalizeLineEndings

// EXTERNAL MODULE: external "os"
var external_os_ = __webpack_require__(87);

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(747);
var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_);

// EXTERNAL MODULE: ../yarnpkg-fslib/sources/path.ts
var path = __webpack_require__(9);

// CONCATENATED MODULE: ../yarnpkg-fslib/sources/algorithms/copyPromise.ts

 // 1980-01-01, like Fedora

const defaultTime = 315532800;
async function copyPromise(destinationFs, destination, sourceFs, source, opts) {
  const normalizedDestination = destinationFs.pathUtils.normalize(destination);
  const normalizedSource = sourceFs.pathUtils.normalize(source);
  const prelayout = [];
  const postlayout = [];
  await destinationFs.mkdirPromise(destinationFs.pathUtils.dirname(destination), {
    recursive: true
  });
  const updateTime = typeof destinationFs.lutimesPromise === `function` ? destinationFs.lutimesPromise.bind(destinationFs) : destinationFs.utimesPromise.bind(destinationFs);
  await copyImpl(prelayout, postlayout, updateTime, destinationFs, normalizedDestination, sourceFs, normalizedSource, opts);

  for (const operation of prelayout) await operation();

  await Promise.all(postlayout.map(operation => {
    return operation();
  }));
}

async function copyImpl(prelayout, postlayout, updateTime, destinationFs, destination, sourceFs, source, opts) {
  const destinationStat = await maybeLStat(destinationFs, destination);
  const sourceStat = await sourceFs.lstatPromise(source);
  if (opts.stableTime) postlayout.push(() => updateTime(destination, defaultTime, defaultTime));else postlayout.push(() => updateTime(destination, sourceStat.atime, sourceStat.mtime));

  switch (true) {
    case sourceStat.isDirectory():
      {
        await copyFolder(prelayout, postlayout, updateTime, destinationFs, destination, destinationStat, sourceFs, source, sourceStat, opts);
      }
      break;

    case sourceStat.isFile():
      {
        await copyFile(prelayout, postlayout, updateTime, destinationFs, destination, destinationStat, sourceFs, source, sourceStat, opts);
      }
      break;

    case sourceStat.isSymbolicLink():
      {
        await copySymlink(prelayout, postlayout, updateTime, destinationFs, destination, destinationStat, sourceFs, source, sourceStat, opts);
      }
      break;

    default:
      {
        throw new Error(`Unsupported file type (${sourceStat.mode})`);
      }
      break;
  }

  postlayout.push(() => {
    return destinationFs.chmodPromise(destination, sourceStat.mode & 0o777);
  });
}

async function maybeLStat(baseFs, p) {
  try {
    return await baseFs.lstatPromise(p);
  } catch (e) {
    return null;
  }
}

async function copyFolder(prelayout, postlayout, updateTime, destinationFs, destination, destinationStat, sourceFs, source, sourceStat, opts) {
  if (destinationStat !== null && !destinationStat.isDirectory()) {
    if (opts.overwrite) {
      prelayout.push(async () => destinationFs.removePromise(destination));
      destinationStat = null;
    } else {
      return;
    }
  }

  if (destinationStat === null) prelayout.push(async () => destinationFs.mkdirPromise(destination, {
    mode: sourceStat.mode
  }));
  const entries = await sourceFs.readdirPromise(source);

  if (opts.stableSort) {
    for (const entry of entries.sort()) {
      await copyImpl(prelayout, postlayout, updateTime, destinationFs, destinationFs.pathUtils.join(destination, entry), sourceFs, sourceFs.pathUtils.join(source, entry), opts);
    }
  } else {
    await Promise.all(entries.map(async entry => {
      await copyImpl(prelayout, postlayout, updateTime, destinationFs, destinationFs.pathUtils.join(destination, entry), sourceFs, sourceFs.pathUtils.join(source, entry), opts);
    }));
  }
}

async function copyFile(prelayout, postlayout, updateTime, destinationFs, destination, destinationStat, sourceFs, source, sourceStat, opts) {
  if (destinationStat !== null) {
    if (opts.overwrite) {
      prelayout.push(async () => destinationFs.removePromise(destination));
      destinationStat = null;
    } else {
      return;
    }
  }

  if (destinationFs === sourceFs) {
    prelayout.push(async () => destinationFs.copyFilePromise(source, destination, (external_fs_default()).constants.COPYFILE_FICLONE));
  } else {
    prelayout.push(async () => destinationFs.writeFilePromise(destination, await sourceFs.readFilePromise(source)));
  }
}

async function copySymlink(prelayout, postlayout, updateTime, destinationFs, destination, destinationStat, sourceFs, source, sourceStat, opts) {
  if (destinationStat !== null) {
    if (opts.overwrite) {
      prelayout.push(async () => destinationFs.removePromise(destination));
      destinationStat = null;
    } else {
      return;
    }
  }

  const target = await sourceFs.readlinkPromise(source);
  prelayout.push(async () => destinationFs.symlinkPromise((0,path/* convertPath */.CI)(destinationFs.pathUtils, target), destination));
}
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/FakeFS.ts



class FakeFS {
  constructor(pathUtils) {
    this.pathUtils = pathUtils;
  }

  async *genTraversePromise(init, {
    stableSort = false
  } = {}) {
    const stack = [init];

    while (stack.length > 0) {
      const p = stack.shift();
      const entry = await this.lstatPromise(p);

      if (entry.isDirectory()) {
        const entries = await this.readdirPromise(p);

        if (stableSort) {
          for (const entry of entries.sort()) {
            stack.push(this.pathUtils.join(p, entry));
          }
        } else {
          throw new Error(`Not supported`);
        }
      } else {
        yield p;
      }
    }
  }

  async removePromise(p, {
    recursive = true,
    maxRetries = 5
  } = {}) {
    let stat;

    try {
      stat = await this.lstatPromise(p);
    } catch (error) {
      if (error.code === `ENOENT`) {
        return;
      } else {
        throw error;
      }
    }

    if (stat.isDirectory()) {
      if (recursive) for (const entry of await this.readdirPromise(p)) await this.removePromise(this.pathUtils.resolve(p, entry)); // 5 gives 1s worth of retries at worst

      let t = 0;

      do {
        try {
          await this.rmdirPromise(p);
          break;
        } catch (error) {
          if (error.code === `EBUSY` || error.code === `ENOTEMPTY`) {
            if (maxRetries === 0) {
              break;
            } else {
              await new Promise(resolve => setTimeout(resolve, t * 100));
              continue;
            }
          } else {
            throw error;
          }
        }
      } while (t++ < maxRetries);
    } else {
      await this.unlinkPromise(p);
    }
  }

  removeSync(p, {
    recursive = true
  } = {}) {
    let stat;

    try {
      stat = this.lstatSync(p);
    } catch (error) {
      if (error.code === `ENOENT`) {
        return;
      } else {
        throw error;
      }
    }

    if (stat.isDirectory()) {
      if (recursive) for (const entry of this.readdirSync(p)) this.removeSync(this.pathUtils.resolve(p, entry));
      this.rmdirSync(p);
    } else {
      this.unlinkSync(p);
    }
  }

  async mkdirpPromise(p, {
    chmod,
    utimes
  } = {}) {
    p = this.resolve(p);
    if (p === this.pathUtils.dirname(p)) return;
    const parts = p.split(this.pathUtils.sep);

    for (let u = 2; u <= parts.length; ++u) {
      const subPath = parts.slice(0, u).join(this.pathUtils.sep);

      if (!this.existsSync(subPath)) {
        try {
          await this.mkdirPromise(subPath);
        } catch (error) {
          if (error.code === `EEXIST`) {
            continue;
          } else {
            throw error;
          }
        }

        if (chmod != null) await this.chmodPromise(subPath, chmod);

        if (utimes != null) {
          await this.utimesPromise(subPath, utimes[0], utimes[1]);
        } else {
          const parentStat = await this.statPromise(this.pathUtils.dirname(subPath));
          await this.utimesPromise(subPath, parentStat.atime, parentStat.mtime);
        }
      }
    }
  }

  mkdirpSync(p, {
    chmod,
    utimes
  } = {}) {
    p = this.resolve(p);
    if (p === this.pathUtils.dirname(p)) return;
    const parts = p.split(this.pathUtils.sep);

    for (let u = 2; u <= parts.length; ++u) {
      const subPath = parts.slice(0, u).join(this.pathUtils.sep);

      if (!this.existsSync(subPath)) {
        try {
          this.mkdirSync(subPath);
        } catch (error) {
          if (error.code === `EEXIST`) {
            continue;
          } else {
            throw error;
          }
        }

        if (chmod != null) this.chmodSync(subPath, chmod);

        if (utimes != null) {
          this.utimesSync(subPath, utimes[0], utimes[1]);
        } else {
          const parentStat = this.statSync(this.pathUtils.dirname(subPath));
          this.utimesSync(subPath, parentStat.atime, parentStat.mtime);
        }
      }
    }
  }

  async copyPromise(destination, source, {
    baseFs = this,
    overwrite = true,
    stableSort = false,
    stableTime = false
  } = {}) {
    return await copyPromise(this, destination, baseFs, source, {
      overwrite,
      stableSort,
      stableTime
    });
  }

  copySync(destination, source, {
    baseFs = this,
    overwrite = true
  } = {}) {
    const stat = baseFs.lstatSync(source);
    const exists = this.existsSync(destination);

    if (stat.isDirectory()) {
      this.mkdirpSync(destination);
      const directoryListing = baseFs.readdirSync(source);

      for (const entry of directoryListing) {
        this.copySync(this.pathUtils.join(destination, entry), baseFs.pathUtils.join(source, entry), {
          baseFs,
          overwrite
        });
      }
    } else if (stat.isFile()) {
      if (!exists || overwrite) {
        if (exists) this.removeSync(destination);
        const content = baseFs.readFileSync(source);
        this.writeFileSync(destination, content);
      }
    } else if (stat.isSymbolicLink()) {
      if (!exists || overwrite) {
        if (exists) this.removeSync(destination);
        const target = baseFs.readlinkSync(source);
        this.symlinkSync((0,path/* convertPath */.CI)(this.pathUtils, target), destination);
      }
    } else {
      throw new Error(`Unsupported file type (file: ${source}, mode: 0o${stat.mode.toString(8).padStart(6, `0`)})`);
    }

    const mode = stat.mode & 0o777;
    this.chmodSync(destination, mode);
  }

  async changeFilePromise(p, content, {
    automaticNewlines
  } = {}) {
    let current = ``;

    try {
      current = await this.readFilePromise(p, `utf8`);
    } catch (error) {// ignore errors, no big deal
    }

    const normalizedContent = automaticNewlines ? normalizeLineEndings(current, content) : content;
    if (current === normalizedContent) return;
    await this.writeFilePromise(p, normalizedContent);
  }

  changeFileSync(p, content, {
    automaticNewlines = false
  } = {}) {
    let current = ``;

    try {
      current = this.readFileSync(p, `utf8`);
    } catch (error) {// ignore errors, no big deal
    }

    const normalizedContent = automaticNewlines ? normalizeLineEndings(current, content) : content;
    if (current === normalizedContent) return;
    this.writeFileSync(p, normalizedContent);
  }

  async movePromise(fromP, toP) {
    try {
      await this.renamePromise(fromP, toP);
    } catch (error) {
      if (error.code === `EXDEV`) {
        await this.copyPromise(toP, fromP);
        await this.removePromise(fromP);
      } else {
        throw error;
      }
    }
  }

  moveSync(fromP, toP) {
    try {
      this.renameSync(fromP, toP);
    } catch (error) {
      if (error.code === `EXDEV`) {
        this.copySync(toP, fromP);
        this.removeSync(fromP);
      } else {
        throw error;
      }
    }
  }

  async lockPromise(affectedPath, callback) {
    const lockPath = `${affectedPath}.flock`;
    const interval = 1000 / 60;
    const startTime = Date.now();
    let fd = null; // Even when we detect that a lock file exists, we still look inside to see
    // whether the pid that created it is still alive. It's not foolproof
    // (there are false positive), but there are no false negative and that's
    // all that matters in 99% of the cases.

    const isAlive = async () => {
      let pid;

      try {
        [pid] = await this.readJsonPromise(lockPath);
      } catch (error) {
        // If we can't read the file repeatedly, we assume the process was
        // aborted before even writing finishing writing the payload.
        return Date.now() - startTime < 500;
      }

      try {
        // "As a special case, a signal of 0 can be used to test for the
        // existence of a process" - so we check whether it's alive.
        process.kill(pid, 0);
        return true;
      } catch (error) {
        return false;
      }
    };

    while (fd === null) {
      try {
        fd = await this.openPromise(lockPath, `wx`);
      } catch (error) {
        if (error.code === `EEXIST`) {
          if (!(await isAlive())) {
            try {
              await this.unlinkPromise(lockPath);
              continue;
            } catch (error) {// No big deal if we can't remove it. Just fallback to wait for
              // it to be eventually released by its owner.
            }
          }

          if (Date.now() - startTime < 60 * 1000) {
            await new Promise(resolve => setTimeout(resolve, interval));
          } else {
            throw new Error(`Couldn't acquire a lock in a reasonable time (via ${lockPath})`);
          }
        } else {
          throw error;
        }
      }
    }

    await this.writePromise(fd, JSON.stringify([process.pid]));

    try {
      return await callback();
    } finally {
      try {
        // closePromise needs to come before unlinkPromise otherwise another process can attempt
        // to get the file handle after the unlink but before close resuling in
        // EPERM: operation not permitted, open
        await this.closePromise(fd);
        await this.unlinkPromise(lockPath);
      } catch (error) {// noop
      }
    }
  }

  async readJsonPromise(p) {
    const content = await this.readFilePromise(p, `utf8`);

    try {
      return JSON.parse(content);
    } catch (error) {
      error.message += ` (in ${p})`;
      throw error;
    }
  }

  readJsonSync(p) {
    const content = this.readFileSync(p, `utf8`);

    try {
      return JSON.parse(content);
    } catch (error) {
      error.message += ` (in ${p})`;
      throw error;
    }
  }

  async writeJsonPromise(p, data) {
    return await this.writeFilePromise(p, `${JSON.stringify(data, null, 2)}\n`);
  }

  writeJsonSync(p, data) {
    return this.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`);
  }

  async preserveTimePromise(p, cb) {
    const stat = await this.lstatPromise(p);
    const result = await cb();
    if (typeof result !== `undefined`) p = result;

    if (this.lutimesPromise) {
      await this.lutimesPromise(p, stat.atime, stat.mtime);
    } else if (!stat.isSymbolicLink()) {
      await this.utimesPromise(p, stat.atime, stat.mtime);
    }
  }

  async preserveTimeSync(p, cb) {
    const stat = this.lstatSync(p);
    const result = cb();
    if (typeof result !== `undefined`) p = result;

    if (this.lutimesSync) {
      this.lutimesSync(p, stat.atime, stat.mtime);
    } else if (!stat.isSymbolicLink()) {
      this.utimesSync(p, stat.atime, stat.mtime);
    }
  }

}
FakeFS.DEFAULT_TIME = 315532800;
class BasePortableFakeFS extends FakeFS {
  constructor() {
    super(path/* ppath */.y1);
  }

}

function getEndOfLine(content) {
  const matches = content.match(/\r?\n/g);
  if (matches === null) return external_os_.EOL;
  const crlf = matches.filter(nl => nl === `\r\n`).length;
  const lf = matches.length - crlf;
  return crlf > lf ? `\r\n` : `\n`;
}

function normalizeLineEndings(originalContent, newContent) {
  return newContent.replace(/\r?\n/g, getEndOfLine(originalContent));
}

/***/ }),

/***/ 9:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LZ": () => /* binding */ PortablePath,
/* harmony export */   "cS": () => /* binding */ npath,
/* harmony export */   "y1": () => /* binding */ ppath,
/* harmony export */   "CI": () => /* binding */ convertPath
/* harmony export */ });
/* unused harmony exports Filename, toFilename */
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(622);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);

var PathType;

(function (PathType) {
  PathType[PathType["File"] = 0] = "File";
  PathType[PathType["Portable"] = 1] = "Portable";
  PathType[PathType["Native"] = 2] = "Native";
})(PathType || (PathType = {}));

const PortablePath = {
  root: `/`,
  dot: `.`
};
const Filename = {
  nodeModules: `node_modules`,
  manifest: `package.json`,
  lockfile: `yarn.lock`,
  pnpJs: `.pnp.js`,
  rc: `.yarnrc.yml`
};
const npath = Object.create((path__WEBPACK_IMPORTED_MODULE_0___default()));
const ppath = Object.create((path__WEBPACK_IMPORTED_MODULE_0___default().posix));

npath.cwd = () => process.cwd();

ppath.cwd = () => toPortablePath(process.cwd());

ppath.resolve = (...segments) => {
  if (segments.length > 0 && ppath.isAbsolute(segments[0])) {
    return path__WEBPACK_IMPORTED_MODULE_0___default().posix.resolve(...segments);
  } else {
    return path__WEBPACK_IMPORTED_MODULE_0___default().posix.resolve(ppath.cwd(), ...segments);
  }
};

const contains = function (pathUtils, from, to) {
  from = pathUtils.normalize(from);
  to = pathUtils.normalize(to);
  if (from === to) return `.`;
  if (!from.endsWith(pathUtils.sep)) from = from + pathUtils.sep;

  if (to.startsWith(from)) {
    return to.slice(from.length);
  } else {
    return null;
  }
};

npath.fromPortablePath = fromPortablePath;
npath.toPortablePath = toPortablePath;

npath.contains = (from, to) => contains(npath, from, to);

ppath.contains = (from, to) => contains(ppath, from, to);

const WINDOWS_PATH_REGEXP = /^([a-zA-Z]:.*)$/;
const UNC_WINDOWS_PATH_REGEXP = /^\\\\(\.\\)?(.*)$/;
const PORTABLE_PATH_REGEXP = /^\/([a-zA-Z]:.*)$/;
const UNC_PORTABLE_PATH_REGEXP = /^\/unc\/(\.dot\/)?(.*)$/; // Path should look like "/N:/berry/scripts/plugin-pack.js"
// And transform to "N:\berry\scripts\plugin-pack.js"

function fromPortablePath(p) {
  if (process.platform !== `win32`) return p;
  if (p.match(PORTABLE_PATH_REGEXP)) p = p.replace(PORTABLE_PATH_REGEXP, `$1`);else if (p.match(UNC_PORTABLE_PATH_REGEXP)) p = p.replace(UNC_PORTABLE_PATH_REGEXP, (match, p1, p2) => `\\\\${p1 ? `.\\` : ``}${p2}`);else return p;
  return p.replace(/\//g, `\\`);
} // Path should look like "N:/berry/scripts/plugin-pack.js"
// And transform to "/N:/berry/scripts/plugin-pack.js"


function toPortablePath(p) {
  if (process.platform !== `win32`) return p;
  if (p.match(WINDOWS_PATH_REGEXP)) p = p.replace(WINDOWS_PATH_REGEXP, `/$1`);else if (p.match(UNC_WINDOWS_PATH_REGEXP)) p = p.replace(UNC_WINDOWS_PATH_REGEXP, (match, p1, p2) => `/unc/${p1 ? `.dot/` : ``}${p2}`);
  return p.replace(/\\/g, `/`);
}

function convertPath(targetPathUtils, sourcePath) {
  return targetPathUtils === npath ? fromPortablePath(sourcePath) : toPortablePath(sourcePath);
}
function toFilename(filename) {
  if (npath.parse(filename).dir !== `` || ppath.parse(filename).dir !== ``) throw new Error(`Invalid filename: "${filename}"`);
  return filename;
}

/***/ }),

/***/ 170:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => /* default */ _entryPoint
});

// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(747);
var external_fs_default = /*#__PURE__*/__webpack_require__.n(external_fs_);

// EXTERNAL MODULE: ../yarnpkg-fslib/sources/FakeFS.ts + 1 modules
var FakeFS = __webpack_require__(398);

// CONCATENATED MODULE: ../yarnpkg-fslib/sources/errors.ts
function makeError(code, message) {
  return Object.assign(new Error(`${code}: ${message}`), {
    code
  });
}

function EBUSY(message) {
  return makeError(`EBUSY`, message);
}
function ENOSYS(message, reason) {
  return makeError(`ENOSYS`, `${message}, ${reason}`);
}
function EINVAL(reason) {
  return makeError(`EINVAL`, `invalid argument, ${reason}`);
}
function EBADF(reason) {
  return makeError(`EBADF`, `bad file descriptor, ${reason}`);
}
function ENOENT(reason) {
  return makeError(`ENOENT`, `no such file or directory, ${reason}`);
}
function ENOTDIR(reason) {
  return makeError(`ENOTDIR`, `not a directory, ${reason}`);
}
function EISDIR(reason) {
  return makeError(`EISDIR`, `illegal operation on a directory, ${reason}`);
}
function EEXIST(reason) {
  return makeError(`EEXIST`, `file already exists, ${reason}`);
}
function EROFS(reason) {
  return makeError(`EROFS`, `read-only filesystem, ${reason}`);
}
function ENOTEMPTY(reason) {
  return makeError(`ENOTEMPTY`, `directory not empty, ${reason}`);
}
function EOPNOTSUPP(reason) {
  return makeError(`EOPNOTSUPP`, `operation not supported, ${reason}`);
}
class LibzipError extends Error {
  constructor(message, code) {
    super(message);
    this.name = `Libzip Error`;
    this.code = code;
  }

}
// EXTERNAL MODULE: ../yarnpkg-fslib/sources/path.ts
var sources_path = __webpack_require__(9);

// CONCATENATED MODULE: ../yarnpkg-fslib/sources/NodeFS.ts




class NodeFS extends FakeFS/* BasePortableFakeFS */.fS {
  constructor(realFs = (external_fs_default())) {
    super();
    this.realFs = realFs; // @ts-expect-error

    if (typeof this.realFs.lutimes !== `undefined`) {
      this.lutimesPromise = this.lutimesPromiseImpl;
      this.lutimesSync = this.lutimesSyncImpl;
    }
  }

  getExtractHint() {
    return false;
  }

  getRealPath() {
    return sources_path/* PortablePath.root */.LZ.root;
  }

  resolve(p) {
    return sources_path/* ppath.resolve */.y1.resolve(p);
  }

  async openPromise(p, flags, mode) {
    return await new Promise((resolve, reject) => {
      this.realFs.open(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), flags, mode, this.makeCallback(resolve, reject));
    });
  }

  openSync(p, flags, mode) {
    return this.realFs.openSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), flags, mode);
  }

  async readPromise(fd, buffer, offset = 0, length = 0, position = -1) {
    return await new Promise((resolve, reject) => {
      this.realFs.read(fd, buffer, offset, length, position, (error, bytesRead) => {
        if (error) {
          reject(error);
        } else {
          resolve(bytesRead);
        }
      });
    });
  }

  readSync(fd, buffer, offset, length, position) {
    return this.realFs.readSync(fd, buffer, offset, length, position);
  }

  async writePromise(fd, buffer, offset, length, position) {
    return await new Promise((resolve, reject) => {
      if (typeof buffer === `string`) {
        return this.realFs.write(fd, buffer, offset, this.makeCallback(resolve, reject));
      } else {
        return this.realFs.write(fd, buffer, offset, length, position, this.makeCallback(resolve, reject));
      }
    });
  }

  writeSync(fd, buffer, offset, length, position) {
    if (typeof buffer === `string`) {
      return this.realFs.writeSync(fd, buffer, offset);
    } else {
      return this.realFs.writeSync(fd, buffer, offset, length, position);
    }
  }

  async closePromise(fd) {
    await new Promise((resolve, reject) => {
      this.realFs.close(fd, this.makeCallback(resolve, reject));
    });
  }

  closeSync(fd) {
    this.realFs.closeSync(fd);
  }

  createReadStream(p, opts) {
    const realPath = p !== null ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;
    return this.realFs.createReadStream(realPath, opts);
  }

  createWriteStream(p, opts) {
    const realPath = p !== null ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;
    return this.realFs.createWriteStream(realPath, opts);
  }

  async realpathPromise(p) {
    return await new Promise((resolve, reject) => {
      this.realFs.realpath(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), {}, this.makeCallback(resolve, reject));
    }).then(path => {
      return sources_path/* npath.toPortablePath */.cS.toPortablePath(path);
    });
  }

  realpathSync(p) {
    return sources_path/* npath.toPortablePath */.cS.toPortablePath(this.realFs.realpathSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), {}));
  }

  async existsPromise(p) {
    return await new Promise(resolve => {
      this.realFs.exists(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), resolve);
    });
  }

  accessSync(p, mode) {
    return this.realFs.accessSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), mode);
  }

  async accessPromise(p, mode) {
    return await new Promise((resolve, reject) => {
      this.realFs.access(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), mode, this.makeCallback(resolve, reject));
    });
  }

  existsSync(p) {
    return this.realFs.existsSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p));
  }

  async statPromise(p) {
    return await new Promise((resolve, reject) => {
      this.realFs.stat(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), this.makeCallback(resolve, reject));
    });
  }

  statSync(p) {
    return this.realFs.statSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p));
  }

  async lstatPromise(p) {
    return await new Promise((resolve, reject) => {
      this.realFs.lstat(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), this.makeCallback(resolve, reject));
    });
  }

  lstatSync(p) {
    return this.realFs.lstatSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p));
  }

  async chmodPromise(p, mask) {
    return await new Promise((resolve, reject) => {
      this.realFs.chmod(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), mask, this.makeCallback(resolve, reject));
    });
  }

  chmodSync(p, mask) {
    return this.realFs.chmodSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), mask);
  }

  async chownPromise(p, uid, gid) {
    return await new Promise((resolve, reject) => {
      this.realFs.chown(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), uid, gid, this.makeCallback(resolve, reject));
    });
  }

  chownSync(p, uid, gid) {
    return this.realFs.chownSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), uid, gid);
  }

  async renamePromise(oldP, newP) {
    return await new Promise((resolve, reject) => {
      this.realFs.rename(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(oldP), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(newP), this.makeCallback(resolve, reject));
    });
  }

  renameSync(oldP, newP) {
    return this.realFs.renameSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(oldP), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(newP));
  }

  async copyFilePromise(sourceP, destP, flags = 0) {
    return await new Promise((resolve, reject) => {
      this.realFs.copyFile(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(sourceP), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(destP), flags, this.makeCallback(resolve, reject));
    });
  }

  copyFileSync(sourceP, destP, flags = 0) {
    return this.realFs.copyFileSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(sourceP), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(destP), flags);
  }

  async appendFilePromise(p, content, opts) {
    return await new Promise((resolve, reject) => {
      const fsNativePath = typeof p === `string` ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;

      if (opts) {
        this.realFs.appendFile(fsNativePath, content, opts, this.makeCallback(resolve, reject));
      } else {
        this.realFs.appendFile(fsNativePath, content, this.makeCallback(resolve, reject));
      }
    });
  }

  appendFileSync(p, content, opts) {
    const fsNativePath = typeof p === `string` ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;

    if (opts) {
      this.realFs.appendFileSync(fsNativePath, content, opts);
    } else {
      this.realFs.appendFileSync(fsNativePath, content);
    }
  }

  async writeFilePromise(p, content, opts) {
    return await new Promise((resolve, reject) => {
      const fsNativePath = typeof p === `string` ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;

      if (opts) {
        this.realFs.writeFile(fsNativePath, content, opts, this.makeCallback(resolve, reject));
      } else {
        this.realFs.writeFile(fsNativePath, content, this.makeCallback(resolve, reject));
      }
    });
  }

  writeFileSync(p, content, opts) {
    const fsNativePath = typeof p === `string` ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;

    if (opts) {
      this.realFs.writeFileSync(fsNativePath, content, opts);
    } else {
      this.realFs.writeFileSync(fsNativePath, content);
    }
  }

  async unlinkPromise(p) {
    return await new Promise((resolve, reject) => {
      this.realFs.unlink(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), this.makeCallback(resolve, reject));
    });
  }

  unlinkSync(p) {
    return this.realFs.unlinkSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p));
  }

  async utimesPromise(p, atime, mtime) {
    return await new Promise((resolve, reject) => {
      this.realFs.utimes(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), atime, mtime, this.makeCallback(resolve, reject));
    });
  }

  utimesSync(p, atime, mtime) {
    this.realFs.utimesSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), atime, mtime);
  }

  async lutimesPromiseImpl(p, atime, mtime) {
    // @ts-expect-error: Not yet in DefinitelyTyped
    const lutimes = this.realFs.lutimes;
    if (typeof lutimes === `undefined`) throw ENOSYS(`unavailable Node binding`, `lutimes '${p}'`);
    return await new Promise((resolve, reject) => {
      lutimes.call(this.realFs, sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), atime, mtime, this.makeCallback(resolve, reject));
    });
  }

  lutimesSyncImpl(p, atime, mtime) {
    // @ts-expect-error: Not yet in DefinitelyTyped
    const lutimesSync = this.realFs.lutimesSync;
    if (typeof lutimesSync === `undefined`) throw ENOSYS(`unavailable Node binding`, `lutimes '${p}'`);
    lutimesSync.call(this.realFs, sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), atime, mtime);
  }

  async mkdirPromise(p, opts) {
    return await new Promise((resolve, reject) => {
      this.realFs.mkdir(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), opts, this.makeCallback(resolve, reject));
    });
  }

  mkdirSync(p, opts) {
    return this.realFs.mkdirSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), opts);
  }

  async rmdirPromise(p) {
    return await new Promise((resolve, reject) => {
      this.realFs.rmdir(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), this.makeCallback(resolve, reject));
    });
  }

  rmdirSync(p) {
    return this.realFs.rmdirSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p));
  }

  async linkPromise(existingP, newP) {
    return await new Promise((resolve, reject) => {
      this.realFs.link(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(existingP), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(newP), this.makeCallback(resolve, reject));
    });
  }

  linkSync(existingP, newP) {
    return this.realFs.linkSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(existingP), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(newP));
  }

  async symlinkPromise(target, p, type) {
    const symlinkType = type || (target.endsWith(`/`) ? `dir` : `file`);
    return await new Promise((resolve, reject) => {
      this.realFs.symlink(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(target.replace(/\/+$/, ``)), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), symlinkType, this.makeCallback(resolve, reject));
    });
  }

  symlinkSync(target, p, type) {
    const symlinkType = type || (target.endsWith(`/`) ? `dir` : `file`);
    return this.realFs.symlinkSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(target.replace(/\/+$/, ``)), sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), symlinkType);
  }

  async readFilePromise(p, encoding) {
    return await new Promise((resolve, reject) => {
      const fsNativePath = typeof p === `string` ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;
      this.realFs.readFile(fsNativePath, encoding, this.makeCallback(resolve, reject));
    });
  }

  readFileSync(p, encoding) {
    const fsNativePath = typeof p === `string` ? sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p) : p;
    return this.realFs.readFileSync(fsNativePath, encoding);
  }

  async readdirPromise(p, {
    withFileTypes
  } = {}) {
    return await new Promise((resolve, reject) => {
      if (withFileTypes) {
        this.realFs.readdir(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), {
          withFileTypes: true
        }, this.makeCallback(resolve, reject));
      } else {
        this.realFs.readdir(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), this.makeCallback(value => resolve(value), reject));
      }
    });
  }

  readdirSync(p, {
    withFileTypes
  } = {}) {
    if (withFileTypes) {
      return this.realFs.readdirSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), {
        withFileTypes: true
      });
    } else {
      return this.realFs.readdirSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p));
    }
  }

  async readlinkPromise(p) {
    return await new Promise((resolve, reject) => {
      this.realFs.readlink(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), this.makeCallback(resolve, reject));
    }).then(path => {
      return sources_path/* npath.toPortablePath */.cS.toPortablePath(path);
    });
  }

  readlinkSync(p) {
    return sources_path/* npath.toPortablePath */.cS.toPortablePath(this.realFs.readlinkSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p)));
  }

  async truncatePromise(p, len) {
    return await new Promise((resolve, reject) => {
      this.realFs.truncate(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), len, this.makeCallback(resolve, reject));
    });
  }

  truncateSync(p, len) {
    return this.realFs.truncateSync(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), len);
  }

  watch(p, a, b) {
    return this.realFs.watch(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), // @ts-expect-error
    a, b);
  }

  watchFile(p, a, b) {
    return this.realFs.watchFile(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), // @ts-expect-error
    a, b);
  }

  unwatchFile(p, cb) {
    return this.realFs.unwatchFile(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p), cb);
  }

  makeCallback(resolve, reject) {
    return (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    };
  }

}
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/ProxiedFS.ts

class ProxiedFS extends FakeFS/* FakeFS */.uY {
  getExtractHint(hints) {
    return this.baseFs.getExtractHint(hints);
  }

  resolve(path) {
    return this.mapFromBase(this.baseFs.resolve(this.mapToBase(path)));
  }

  getRealPath() {
    return this.mapFromBase(this.baseFs.getRealPath());
  }

  openPromise(p, flags, mode) {
    return this.baseFs.openPromise(this.mapToBase(p), flags, mode);
  }

  openSync(p, flags, mode) {
    return this.baseFs.openSync(this.mapToBase(p), flags, mode);
  }

  async readPromise(fd, buffer, offset, length, position) {
    return await this.baseFs.readPromise(fd, buffer, offset, length, position);
  }

  readSync(fd, buffer, offset, length, position) {
    return this.baseFs.readSync(fd, buffer, offset, length, position);
  }

  async writePromise(fd, buffer, offset, length, position) {
    if (typeof buffer === `string`) {
      return await this.baseFs.writePromise(fd, buffer, offset);
    } else {
      return await this.baseFs.writePromise(fd, buffer, offset, length, position);
    }
  }

  writeSync(fd, buffer, offset, length, position) {
    if (typeof buffer === `string`) {
      return this.baseFs.writeSync(fd, buffer, offset);
    } else {
      return this.baseFs.writeSync(fd, buffer, offset, length, position);
    }
  }

  closePromise(fd) {
    return this.baseFs.closePromise(fd);
  }

  closeSync(fd) {
    this.baseFs.closeSync(fd);
  }

  createReadStream(p, opts) {
    return this.baseFs.createReadStream(p !== null ? this.mapToBase(p) : p, opts);
  }

  createWriteStream(p, opts) {
    return this.baseFs.createWriteStream(p !== null ? this.mapToBase(p) : p, opts);
  }

  async realpathPromise(p) {
    return this.mapFromBase(await this.baseFs.realpathPromise(this.mapToBase(p)));
  }

  realpathSync(p) {
    return this.mapFromBase(this.baseFs.realpathSync(this.mapToBase(p)));
  }

  existsPromise(p) {
    return this.baseFs.existsPromise(this.mapToBase(p));
  }

  existsSync(p) {
    return this.baseFs.existsSync(this.mapToBase(p));
  }

  accessSync(p, mode) {
    return this.baseFs.accessSync(this.mapToBase(p), mode);
  }

  accessPromise(p, mode) {
    return this.baseFs.accessPromise(this.mapToBase(p), mode);
  }

  statPromise(p) {
    return this.baseFs.statPromise(this.mapToBase(p));
  }

  statSync(p) {
    return this.baseFs.statSync(this.mapToBase(p));
  }

  lstatPromise(p) {
    return this.baseFs.lstatPromise(this.mapToBase(p));
  }

  lstatSync(p) {
    return this.baseFs.lstatSync(this.mapToBase(p));
  }

  chmodPromise(p, mask) {
    return this.baseFs.chmodPromise(this.mapToBase(p), mask);
  }

  chmodSync(p, mask) {
    return this.baseFs.chmodSync(this.mapToBase(p), mask);
  }

  chownPromise(p, uid, gid) {
    return this.baseFs.chownPromise(this.mapToBase(p), uid, gid);
  }

  chownSync(p, uid, gid) {
    return this.baseFs.chownSync(this.mapToBase(p), uid, gid);
  }

  renamePromise(oldP, newP) {
    return this.baseFs.renamePromise(this.mapToBase(oldP), this.mapToBase(newP));
  }

  renameSync(oldP, newP) {
    return this.baseFs.renameSync(this.mapToBase(oldP), this.mapToBase(newP));
  }

  copyFilePromise(sourceP, destP, flags = 0) {
    return this.baseFs.copyFilePromise(this.mapToBase(sourceP), this.mapToBase(destP), flags);
  }

  copyFileSync(sourceP, destP, flags = 0) {
    return this.baseFs.copyFileSync(this.mapToBase(sourceP), this.mapToBase(destP), flags);
  }

  appendFilePromise(p, content, opts) {
    return this.baseFs.appendFilePromise(this.fsMapToBase(p), content, opts);
  }

  appendFileSync(p, content, opts) {
    return this.baseFs.appendFileSync(this.fsMapToBase(p), content, opts);
  }

  writeFilePromise(p, content, opts) {
    return this.baseFs.writeFilePromise(this.fsMapToBase(p), content, opts);
  }

  writeFileSync(p, content, opts) {
    return this.baseFs.writeFileSync(this.fsMapToBase(p), content, opts);
  }

  unlinkPromise(p) {
    return this.baseFs.unlinkPromise(this.mapToBase(p));
  }

  unlinkSync(p) {
    return this.baseFs.unlinkSync(this.mapToBase(p));
  }

  utimesPromise(p, atime, mtime) {
    return this.baseFs.utimesPromise(this.mapToBase(p), atime, mtime);
  }

  utimesSync(p, atime, mtime) {
    return this.baseFs.utimesSync(this.mapToBase(p), atime, mtime);
  }

  mkdirPromise(p, opts) {
    return this.baseFs.mkdirPromise(this.mapToBase(p), opts);
  }

  mkdirSync(p, opts) {
    return this.baseFs.mkdirSync(this.mapToBase(p), opts);
  }

  rmdirPromise(p) {
    return this.baseFs.rmdirPromise(this.mapToBase(p));
  }

  rmdirSync(p) {
    return this.baseFs.rmdirSync(this.mapToBase(p));
  }

  linkPromise(existingP, newP) {
    return this.baseFs.linkPromise(this.mapToBase(existingP), this.mapToBase(newP));
  }

  linkSync(existingP, newP) {
    return this.baseFs.linkSync(this.mapToBase(existingP), this.mapToBase(newP));
  }

  symlinkPromise(target, p, type) {
    return this.baseFs.symlinkPromise(this.mapToBase(target), this.mapToBase(p), type);
  }

  symlinkSync(target, p, type) {
    return this.baseFs.symlinkSync(this.mapToBase(target), this.mapToBase(p), type);
  }

  readFilePromise(p, encoding) {
    // This weird condition is required to tell TypeScript that the signatures are proper (otherwise it thinks that only the generic one is covered)
    if (encoding === `utf8`) {
      return this.baseFs.readFilePromise(this.fsMapToBase(p), encoding);
    } else {
      return this.baseFs.readFilePromise(this.fsMapToBase(p), encoding);
    }
  }

  readFileSync(p, encoding) {
    // This weird condition is required to tell TypeScript that the signatures are proper (otherwise it thinks that only the generic one is covered)
    if (encoding === `utf8`) {
      return this.baseFs.readFileSync(this.fsMapToBase(p), encoding);
    } else {
      return this.baseFs.readFileSync(this.fsMapToBase(p), encoding);
    }
  }

  async readdirPromise(p, {
    withFileTypes
  } = {}) {
    return this.baseFs.readdirPromise(this.mapToBase(p), {
      withFileTypes: withFileTypes
    });
  }

  readdirSync(p, {
    withFileTypes
  } = {}) {
    return this.baseFs.readdirSync(this.mapToBase(p), {
      withFileTypes: withFileTypes
    });
  }

  async readlinkPromise(p) {
    return this.mapFromBase(await this.baseFs.readlinkPromise(this.mapToBase(p)));
  }

  readlinkSync(p) {
    return this.mapFromBase(this.baseFs.readlinkSync(this.mapToBase(p)));
  }

  async truncatePromise(p, len) {
    return this.baseFs.truncatePromise(this.mapToBase(p), len);
  }

  truncateSync(p, len) {
    return this.baseFs.truncateSync(this.mapToBase(p), len);
  }

  watch(p, a, b) {
    return this.baseFs.watch(this.mapToBase(p), // @ts-expect-error
    a, b);
  }

  watchFile(p, a, b) {
    return this.baseFs.watchFile(this.mapToBase(p), // @ts-expect-error
    a, b);
  }

  unwatchFile(p, cb) {
    return this.baseFs.unwatchFile(this.mapToBase(p), cb);
  }

  fsMapToBase(p) {
    if (typeof p === `number`) {
      return p;
    } else {
      return this.mapToBase(p);
    }
  }

}
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/VirtualFS.ts



const NUMBER_REGEXP = /^[0-9]+$/; // $0: full path
// $1: virtual folder
// $2: virtual segment
// $3: hash
// $4: depth
// $5: subpath

const VIRTUAL_REGEXP = /^(\/(?:[^/]+\/)*?\$\$virtual)((?:\/((?:[^/]+-)?[a-f0-9]+)(?:\/([^/]+))?)?((?:\/.*)?))$/;
const VALID_COMPONENT = /^([^/]+-)?[a-f0-9]+$/;
class VirtualFS extends ProxiedFS {
  constructor({
    baseFs = new NodeFS()
  } = {}) {
    super(sources_path/* ppath */.y1);
    this.baseFs = baseFs;
  }

  static makeVirtualPath(base, component, to) {
    if (sources_path/* ppath.basename */.y1.basename(base) !== `$$virtual`) throw new Error(`Assertion failed: Virtual folders must be named "$$virtual"`);
    if (!sources_path/* ppath.basename */.y1.basename(component).match(VALID_COMPONENT)) throw new Error(`Assertion failed: Virtual components must be ended by an hexadecimal hash`); // Obtains the relative distance between the virtual path and its actual target

    const target = sources_path/* ppath.relative */.y1.relative(sources_path/* ppath.dirname */.y1.dirname(base), to);
    const segments = target.split(`/`); // Counts how many levels we need to go back to start applying the rest of the path

    let depth = 0;

    while (depth < segments.length && segments[depth] === `..`) depth += 1;

    const finalSegments = segments.slice(depth);
    const fullVirtualPath = sources_path/* ppath.join */.y1.join(base, component, String(depth), ...finalSegments);
    return fullVirtualPath;
  }

  static resolveVirtual(p) {
    const match = p.match(VIRTUAL_REGEXP);
    if (!match || !match[3] && match[5]) return p;
    const target = sources_path/* ppath.dirname */.y1.dirname(match[1]);
    if (!match[3] || !match[4]) return target;
    const isnum = NUMBER_REGEXP.test(match[4]);
    if (!isnum) return p;
    const depth = Number(match[4]);
    const backstep = `../`.repeat(depth);
    const subpath = match[5] || `.`;
    return VirtualFS.resolveVirtual(sources_path/* ppath.join */.y1.join(target, backstep, subpath));
  }

  getExtractHint(hints) {
    return this.baseFs.getExtractHint(hints);
  }

  getRealPath() {
    return this.baseFs.getRealPath();
  }

  realpathSync(p) {
    const match = p.match(VIRTUAL_REGEXP);
    if (!match) return this.baseFs.realpathSync(p);
    if (!match[5]) return p;
    const realpath = this.baseFs.realpathSync(this.mapToBase(p));
    return VirtualFS.makeVirtualPath(match[1], match[3], realpath);
  }

  async realpathPromise(p) {
    const match = p.match(VIRTUAL_REGEXP);
    if (!match) return await this.baseFs.realpathPromise(p);
    if (!match[5]) return p;
    const realpath = await this.baseFs.realpathPromise(this.mapToBase(p));
    return VirtualFS.makeVirtualPath(match[1], match[3], realpath);
  }

  mapToBase(p) {
    return VirtualFS.resolveVirtual(p);
  }

  mapFromBase(p) {
    return p;
  }

}
// EXTERNAL MODULE: external "stream"
var external_stream_ = __webpack_require__(413);

// EXTERNAL MODULE: external "util"
var external_util_ = __webpack_require__(669);

// EXTERNAL MODULE: external "zlib"
var external_zlib_ = __webpack_require__(761);
var external_zlib_default = /*#__PURE__*/__webpack_require__.n(external_zlib_);

// EXTERNAL MODULE: external "events"
var external_events_ = __webpack_require__(614);

// CONCATENATED MODULE: ../yarnpkg-fslib/sources/constants.ts
const S_IFMT = 0o170000;
const S_IFDIR = 0o040000;
const S_IFREG = 0o100000;
const S_IFLNK = 0o120000;
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/statUtils.ts

class DirEntry {
  constructor() {
    this.name = ``;
    this.mode = 0;
  }

  isBlockDevice() {
    return false;
  }

  isCharacterDevice() {
    return false;
  }

  isDirectory() {
    return (this.mode & S_IFMT) === S_IFDIR;
  }

  isFIFO() {
    return false;
  }

  isFile() {
    return (this.mode & S_IFMT) === S_IFREG;
  }

  isSocket() {
    return false;
  }

  isSymbolicLink() {
    return (this.mode & S_IFMT) === S_IFLNK;
  }

}
class StatEntry {
  constructor() {
    this.dev = 0;
    this.ino = 0;
    this.mode = 0;
    this.nlink = 1;
    this.rdev = 0;
    this.blocks = 1;
  }

  isBlockDevice() {
    return false;
  }

  isCharacterDevice() {
    return false;
  }

  isDirectory() {
    return (this.mode & S_IFMT) === S_IFDIR;
  }

  isFIFO() {
    return false;
  }

  isFile() {
    return (this.mode & S_IFMT) === S_IFREG;
  }

  isSocket() {
    return false;
  }

  isSymbolicLink() {
    return (this.mode & S_IFMT) === S_IFLNK;
  }

}
function makeDefaultStats() {
  return Object.assign(new StatEntry(), {
    uid: 0,
    gid: 0,
    size: 0,
    blksize: 0,
    atimeMs: 0,
    mtimeMs: 0,
    ctimeMs: 0,
    birthtimeMs: 0,
    atime: new Date(0),
    mtime: new Date(0),
    ctime: new Date(0),
    birthtime: new Date(0),
    mode: S_IFREG | 0o644
  });
}
function makeEmptyStats() {
  return Object.assign(makeDefaultStats(), {
    nlink: 0,
    blocks: 0,
    mode: 0
  });
}
function areStatsEqual(a, b) {
  if (a.atimeMs !== b.atimeMs) return false;
  if (a.birthtimeMs !== b.birthtimeMs) return false;
  if (a.blksize !== b.blksize) return false;
  if (a.blocks !== b.blocks) return false;
  if (a.ctimeMs !== b.ctimeMs) return false;
  if (a.dev !== b.dev) return false;
  if (a.gid !== b.gid) return false;
  if (a.ino !== b.ino) return false;
  if (a.isBlockDevice() !== b.isBlockDevice()) return false;
  if (a.isCharacterDevice() !== b.isCharacterDevice()) return false;
  if (a.isDirectory() !== b.isDirectory()) return false;
  if (a.isFIFO() !== b.isFIFO()) return false;
  if (a.isFile() !== b.isFile()) return false;
  if (a.isSocket() !== b.isSocket()) return false;
  if (a.isSymbolicLink() !== b.isSymbolicLink()) return false;
  if (a.mode !== b.mode) return false;
  if (a.mtimeMs !== b.mtimeMs) return false;
  if (a.nlink !== b.nlink) return false;
  if (a.rdev !== b.rdev) return false;
  if (a.size !== b.size) return false;
  if (a.uid !== b.uid) return false;
  return true;
}
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/algorithms/watchFile/CustomStatWatcher.ts


var Event;

(function (Event) {
  Event["Change"] = "change";
  Event["Stop"] = "stop";
})(Event || (Event = {}));

var Status;

(function (Status) {
  Status["Ready"] = "ready";
  Status["Running"] = "running";
  Status["Stopped"] = "stopped";
})(Status || (Status = {}));

function assertStatus(current, expected) {
  if (current !== expected) {
    throw new Error(`Invalid StatWatcher status: expected '${expected}', got '${current}'`);
  }
}
class CustomStatWatcher extends external_events_.EventEmitter {
  constructor(fakeFs, path, {
    bigint = false
  } = {}) {
    super();
    this.status = Status.Ready;
    this.changeListeners = new Map();
    this.startTimeout = null;
    this.fakeFs = fakeFs;
    this.path = path;
    this.bigint = bigint;
    this.lastStats = this.stat();
  }

  static create(fakeFs, path, opts) {
    const statWatcher = new CustomStatWatcher(fakeFs, path, opts);
    statWatcher.start();
    return statWatcher;
  }

  start() {
    assertStatus(this.status, Status.Ready);
    this.status = Status.Running; // Node allows other listeners to be registered up to 3 milliseconds
    // after the watcher has been started, so that's what we're doing too

    this.startTimeout = setTimeout(() => {
      this.startTimeout = null; // Per the Node FS docs:
      // "When an fs.watchFile operation results in an ENOENT error,
      // it will invoke the listener once, with all the fields zeroed
      // (or, for dates, the Unix Epoch)."

      if (!this.fakeFs.existsSync(this.path)) {
        this.emit(Event.Change, this.lastStats, this.lastStats);
      }
    }, 3);
  }

  stop() {
    assertStatus(this.status, Status.Running);
    this.status = Status.Stopped;

    if (this.startTimeout !== null) {
      clearTimeout(this.startTimeout);
      this.startTimeout = null;
    }

    this.emit(Event.Stop);
  }

  stat() {
    try {
      return this.fakeFs.statSync(this.path);
    } catch (error) {
      if (error.code === `ENOENT`) {
        return makeEmptyStats();
      } else {
        throw error;
      }
    }
  }
  /**
   * Creates an interval whose callback compares the current stats with the previous stats and notifies all listeners in case of changes.
   *
   * @param opts.persistent Decides whether the interval should be immediately unref-ed.
   */


  makeInterval(opts) {
    const interval = setInterval(() => {
      const currentStats = this.stat();
      const previousStats = this.lastStats;
      if (areStatsEqual(currentStats, previousStats)) return;
      this.lastStats = currentStats;
      this.emit(Event.Change, currentStats, previousStats);
    }, opts.interval);
    return opts.persistent ? interval : interval.unref();
  }
  /**
   * Registers a listener and assigns it an interval.
   */


  registerChangeListener(listener, opts) {
    this.addListener(Event.Change, listener);
    this.changeListeners.set(listener, this.makeInterval(opts));
  }
  /**
   * Unregisters the listener and clears the assigned interval.
   */


  unregisterChangeListener(listener) {
    this.removeListener(Event.Change, listener);
    const interval = this.changeListeners.get(listener);
    if (typeof interval !== `undefined`) clearInterval(interval);
    this.changeListeners.delete(listener);
  }
  /**
   * Unregisters all listeners and clears all assigned intervals.
   */


  unregisterAllChangeListeners() {
    for (const listener of this.changeListeners.keys()) {
      this.unregisterChangeListener(listener);
    }
  }

  hasChangeListeners() {
    return this.changeListeners.size > 0;
  }
  /**
   * Refs all stored intervals.
   */


  ref() {
    for (const interval of this.changeListeners.values()) interval.ref();

    return this;
  }
  /**
   * Unrefs all stored intervals.
   */


  unref() {
    for (const interval of this.changeListeners.values()) interval.unref();

    return this;
  }

}
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/algorithms/watchFile.ts

const statWatchersByFakeFS = new WeakMap();
function watchFile(fakeFs, path, a, b) {
  let bigint;
  let persistent;
  let interval;
  let listener;

  switch (typeof a) {
    case `function`:
      {
        bigint = false;
        persistent = true;
        interval = 5007;
        listener = a;
      }
      break;

    default:
      {
        ({
          bigint = false,
          persistent = true,
          interval = 5007
        } = a);
        listener = b;
      }
      break;
  }

  let statWatchers = statWatchersByFakeFS.get(fakeFs);
  if (typeof statWatchers === `undefined`) statWatchersByFakeFS.set(fakeFs, statWatchers = new Map());
  let statWatcher = statWatchers.get(path);

  if (typeof statWatcher === `undefined`) {
    statWatcher = CustomStatWatcher.create(fakeFs, path, {
      bigint
    });
    statWatchers.set(path, statWatcher);
  }

  statWatcher.registerChangeListener(listener, {
    persistent,
    interval
  });
  return statWatcher;
}
function unwatchFile(fakeFs, path, cb) {
  const statWatchers = statWatchersByFakeFS.get(fakeFs);
  if (typeof statWatchers === `undefined`) return;
  const statWatcher = statWatchers.get(path);
  if (typeof statWatcher === `undefined`) return;
  if (typeof cb === `undefined`) statWatcher.unregisterAllChangeListeners();else statWatcher.unregisterChangeListener(cb);

  if (!statWatcher.hasChangeListeners()) {
    statWatcher.stop();
    statWatchers.delete(path);
  }
}
function unwatchAllFiles(fakeFs) {
  const statWatchers = statWatchersByFakeFS.get(fakeFs);
  if (typeof statWatchers === `undefined`) return;

  for (const path of statWatchers.keys()) {
    unwatchFile(fakeFs, path);
  }
}
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/ZipFS.ts











const DEFAULT_COMPRESSION_LEVEL = `mixed`;

function toUnixTimestamp(time) {
  if (typeof time === `string` && String(+time) === time) return +time;

  if (Number.isFinite(time)) {
    if (time < 0) {
      return Date.now() / 1000;
    } else {
      return time;
    }
  } // convert to 123.456 UNIX timestamp


  if ((0,external_util_.isDate)(time)) return time.getTime() / 1000;
  throw new Error(`Invalid time`);
}

class ZipFS extends FakeFS/* BasePortableFakeFS */.fS {
  constructor(source, opts) {
    super();
    this.lzSource = null;
    this.listings = new Map();
    this.entries = new Map();
    /**
     * A cache of indices mapped to file sources.
     * Populated by `setFileSource` calls.
     * Required for supporting read after write.
     */

    this.fileSources = new Map();
    this.fds = new Map();
    this.nextFd = 0;
    this.ready = false;
    this.readOnly = false;
    this.libzip = opts.libzip;
    const pathOptions = opts;
    this.level = typeof pathOptions.level !== `undefined` ? pathOptions.level : DEFAULT_COMPRESSION_LEVEL;

    if (source === null) {
      source = Buffer.from([0x50, 0x4B, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    }

    if (typeof source === `string`) {
      const {
        baseFs = new NodeFS()
      } = pathOptions;
      this.baseFs = baseFs;
      this.path = source;
    } else {
      this.path = null;
      this.baseFs = null;
    }

    if (opts.stats) {
      this.stats = opts.stats;
    } else {
      if (typeof source === `string`) {
        try {
          this.stats = this.baseFs.statSync(source);
        } catch (error) {
          if (error.code === `ENOENT` && pathOptions.create) {
            this.stats = makeDefaultStats();
          } else {
            throw error;
          }
        }
      } else {
        this.stats = makeDefaultStats();
      }
    }

    const errPtr = this.libzip.malloc(4);

    try {
      let flags = 0;
      if (typeof source === `string` && pathOptions.create) flags |= this.libzip.ZIP_CREATE | this.libzip.ZIP_TRUNCATE;

      if (opts.readOnly) {
        flags |= this.libzip.ZIP_RDONLY;
        this.readOnly = true;
      }

      if (typeof source === `string`) {
        this.zip = this.libzip.open(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(source), flags, errPtr);
      } else {
        const lzSource = this.allocateUnattachedSource(source);

        try {
          this.zip = this.libzip.openFromSource(lzSource, flags, errPtr);
          this.lzSource = lzSource;
        } catch (error) {
          this.libzip.source.free(lzSource);
          throw error;
        }
      }

      if (this.zip === 0) {
        const error = this.libzip.struct.errorS();
        this.libzip.error.initWithCode(error, this.libzip.getValue(errPtr, `i32`));
        throw this.makeLibzipError(error);
      }
    } finally {
      this.libzip.free(errPtr);
    }

    this.listings.set(sources_path/* PortablePath.root */.LZ.root, new Set());
    const entryCount = this.libzip.getNumEntries(this.zip, 0);

    for (let t = 0; t < entryCount; ++t) {
      const raw = this.libzip.getName(this.zip, t, 0);
      if (sources_path/* ppath.isAbsolute */.y1.isAbsolute(raw)) continue;
      const p = sources_path/* ppath.resolve */.y1.resolve(sources_path/* PortablePath.root */.LZ.root, raw);
      this.registerEntry(p, t); // If the raw path is a directory, register it
      // to prevent empty folder being skipped

      if (raw.endsWith(`/`)) {
        this.registerListing(p);
      }
    }

    this.symlinkCount = this.libzip.ext.countSymlinks(this.zip);
    if (this.symlinkCount === -1) throw this.makeLibzipError(this.libzip.getError(this.zip));
    this.ready = true;
  }

  makeLibzipError(error) {
    const errorCode = this.libzip.struct.errorCodeZip(error);
    const strerror = this.libzip.error.strerror(error);
    const libzipError = new LibzipError(strerror, this.libzip.errors[errorCode]); // This error should never come up because of the file source cache

    if (errorCode === this.libzip.errors.ZIP_ER_CHANGED) throw new Error(`Assertion failed: Unexpected libzip error: ${libzipError.message}`);
    return libzipError;
  }

  getExtractHint(hints) {
    for (const fileName of this.entries.keys()) {
      const ext = this.pathUtils.extname(fileName);

      if (hints.relevantExtensions.has(ext)) {
        return true;
      }
    }

    return false;
  }

  getAllFiles() {
    return Array.from(this.entries.keys());
  }

  getRealPath() {
    if (!this.path) throw new Error(`ZipFS don't have real paths when loaded from a buffer`);
    return this.path;
  }

  getBufferAndClose() {
    this.prepareClose();
    if (!this.lzSource) throw new Error(`ZipFS was not created from a Buffer`);

    try {
      // Prevent close from cleaning up the source
      this.libzip.source.keep(this.lzSource); // Close the zip archive

      if (this.libzip.close(this.zip) === -1) throw this.makeLibzipError(this.libzip.getError(this.zip)); // Open the source for reading

      if (this.libzip.source.open(this.lzSource) === -1) throw this.makeLibzipError(this.libzip.source.error(this.lzSource)); // Move to the end of source

      if (this.libzip.source.seek(this.lzSource, 0, 0, this.libzip.SEEK_END) === -1) throw this.makeLibzipError(this.libzip.source.error(this.lzSource)); // Get the size of source

      const size = this.libzip.source.tell(this.lzSource);
      if (size === -1) throw this.makeLibzipError(this.libzip.source.error(this.lzSource)); // Move to the start of source

      if (this.libzip.source.seek(this.lzSource, 0, 0, this.libzip.SEEK_SET) === -1) throw this.makeLibzipError(this.libzip.source.error(this.lzSource));
      const buffer = this.libzip.malloc(size);
      if (!buffer) throw new Error(`Couldn't allocate enough memory`);

      try {
        const rc = this.libzip.source.read(this.lzSource, buffer, size);
        if (rc === -1) throw this.makeLibzipError(this.libzip.source.error(this.lzSource));else if (rc < size) throw new Error(`Incomplete read`);else if (rc > size) throw new Error(`Overread`);
        const memory = this.libzip.HEAPU8.subarray(buffer, buffer + size);
        return Buffer.from(memory);
      } finally {
        this.libzip.free(buffer);
      }
    } finally {
      this.libzip.source.close(this.lzSource);
      this.libzip.source.free(this.lzSource);
      this.ready = false;
    }
  }

  prepareClose() {
    if (!this.ready) throw EBUSY(`archive closed, close`);
    unwatchAllFiles(this);
  }

  saveAndClose() {
    if (!this.path || !this.baseFs) throw new Error(`ZipFS cannot be saved and must be discarded when loaded from a buffer`);
    this.prepareClose();

    if (this.readOnly) {
      this.discardAndClose();
      return;
    }

    const previousMod = this.baseFs.existsSync(this.path) ? this.baseFs.statSync(this.path).mode & 0o777 : null;
    const rc = this.libzip.close(this.zip);
    if (rc === -1) throw this.makeLibzipError(this.libzip.getError(this.zip)); // this.libzip overrides the chmod when writing the archive, which is a weird
    // behavior I don't totally understand (plus the umask seems bogus in some
    // weird cases - maybe related to emscripten?)
    //
    // See also https://github.com/nih-at/libzip/issues/77

    if (previousMod === null) this.baseFs.chmodSync(this.path, this.stats.mode);else if (previousMod !== (this.baseFs.statSync(this.path).mode & 0o777)) this.baseFs.chmodSync(this.path, previousMod);
    this.ready = false;
  }

  discardAndClose() {
    this.prepareClose();
    this.libzip.discard(this.zip);
    this.ready = false;
  }

  resolve(p) {
    return sources_path/* ppath.resolve */.y1.resolve(sources_path/* PortablePath.root */.LZ.root, p);
  }

  async openPromise(p, flags, mode) {
    return this.openSync(p, flags, mode);
  }

  openSync(p, flags, mode) {
    const fd = this.nextFd++;
    this.fds.set(fd, {
      cursor: 0,
      p
    });
    return fd;
  }

  hasOpenFileHandles() {
    return !!this.fds.size;
  }

  async readPromise(fd, buffer, offset, length, position) {
    return this.readSync(fd, buffer, offset, length, position);
  }

  readSync(fd, buffer, offset = 0, length = 0, position = -1) {
    const entry = this.fds.get(fd);
    if (typeof entry === `undefined`) throw EBADF(`read`);
    let realPosition;
    if (position === -1 || position === null) realPosition = entry.cursor;else realPosition = position;
    const source = this.readFileSync(entry.p);
    source.copy(buffer, offset, realPosition, realPosition + length);
    const bytesRead = Math.max(0, Math.min(source.length - realPosition, length));
    if (position === -1 || position === null) entry.cursor += bytesRead;
    return bytesRead;
  }

  async writePromise(fd, buffer, offset, length, position) {
    if (typeof buffer === `string`) {
      return this.writeSync(fd, buffer, position);
    } else {
      return this.writeSync(fd, buffer, offset, length, position);
    }
  }

  writeSync(fd, buffer, offset, length, position) {
    const entry = this.fds.get(fd);
    if (typeof entry === `undefined`) throw EBADF(`read`);
    throw new Error(`Unimplemented`);
  }

  async closePromise(fd) {
    return this.closeSync(fd);
  }

  closeSync(fd) {
    const entry = this.fds.get(fd);
    if (typeof entry === `undefined`) throw EBADF(`read`);
    this.fds.delete(fd);
  }

  createReadStream(p, {
    encoding
  } = {}) {
    if (p === null) throw new Error(`Unimplemented`);
    let fd = this.openSync(p, `r`);

    const closeStream = () => {
      if (fd === -1) return;
      this.closeSync(fd);
      fd = -1;
    };

    const stream = Object.assign(new external_stream_.PassThrough(), {
      bytesRead: 0,
      path: p,
      close: () => {
        clearImmediate(immediate);
        closeStream();
      },
      _destroy: (error, callback) => {
        clearImmediate(immediate);
        closeStream();
        callback(error);
      }
    });
    const immediate = setImmediate(() => {
      try {
        const data = this.readFileSync(p, encoding);
        stream.bytesRead = data.length;
        stream.end(data);
        stream.destroy();
      } catch (error) {
        stream.emit(`error`, error);
        stream.end();
        stream.destroy();
      } finally {
        closeStream();
      }
    });
    return stream;
  }

  createWriteStream(p, {
    encoding
  } = {}) {
    if (this.readOnly) throw EROFS(`open '${p}'`);
    if (p === null) throw new Error(`Unimplemented`);
    const chunks = [];
    let fd = this.openSync(p, `w`);

    const closeStream = () => {
      if (fd === -1) return;

      try {
        this.writeFileSync(p, Buffer.concat(chunks), encoding);
      } finally {
        this.closeSync(fd);
        fd = -1;
      }
    };

    const stream = Object.assign(new external_stream_.PassThrough(), {
      bytesWritten: 0,
      path: p,
      close: () => {
        stream.end();
        closeStream();
      },
      _destroy: (error, callback) => {
        closeStream();
        callback(error);
      }
    });
    stream.on(`data`, chunk => {
      const chunkBuffer = Buffer.from(chunk);
      stream.bytesWritten += chunkBuffer.length;
      chunks.push(chunkBuffer);
    });
    stream.on(`end`, () => {
      closeStream();
    });
    return stream;
  }

  async realpathPromise(p) {
    return this.realpathSync(p);
  }

  realpathSync(p) {
    const resolvedP = this.resolveFilename(`lstat '${p}'`, p);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`lstat '${p}'`);
    return resolvedP;
  }

  async existsPromise(p) {
    return this.existsSync(p);
  }

  existsSync(p) {
    if (!this.ready) throw EBUSY(`archive closed, existsSync '${p}'`);

    if (this.symlinkCount === 0) {
      const resolvedP = sources_path/* ppath.resolve */.y1.resolve(sources_path/* PortablePath.root */.LZ.root, p);
      return this.entries.has(resolvedP) || this.listings.has(resolvedP);
    }

    let resolvedP;

    try {
      resolvedP = this.resolveFilename(`stat '${p}'`, p);
    } catch (error) {
      return false;
    }

    return this.entries.has(resolvedP) || this.listings.has(resolvedP);
  }

  async accessPromise(p, mode) {
    return this.accessSync(p, mode);
  }

  accessSync(p, mode = external_fs_.constants.F_OK) {
    const resolvedP = this.resolveFilename(`access '${p}'`, p);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`access '${p}'`);

    if (this.readOnly && mode & external_fs_.constants.W_OK) {
      throw EROFS(`access '${p}'`);
    }
  }

  async statPromise(p) {
    return this.statSync(p);
  }

  statSync(p) {
    const resolvedP = this.resolveFilename(`stat '${p}'`, p);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`stat '${p}'`);
    if (p[p.length - 1] === `/` && !this.listings.has(resolvedP)) throw ENOTDIR(`stat '${p}'`);
    return this.statImpl(`stat '${p}'`, resolvedP);
  }

  async lstatPromise(p) {
    return this.lstatSync(p);
  }

  lstatSync(p) {
    const resolvedP = this.resolveFilename(`lstat '${p}'`, p, false);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`lstat '${p}'`);
    if (p[p.length - 1] === `/` && !this.listings.has(resolvedP)) throw ENOTDIR(`lstat '${p}'`);
    return this.statImpl(`lstat '${p}'`, resolvedP);
  }

  statImpl(reason, p) {
    const entry = this.entries.get(p); // File, or explicit directory

    if (typeof entry !== `undefined`) {
      const stat = this.libzip.struct.statS();
      const rc = this.libzip.statIndex(this.zip, entry, 0, 0, stat);
      if (rc === -1) throw this.makeLibzipError(this.libzip.getError(this.zip));
      const uid = this.stats.uid;
      const gid = this.stats.gid;
      const size = this.libzip.struct.statSize(stat) >>> 0;
      const blksize = 512;
      const blocks = Math.ceil(size / blksize);
      const mtimeMs = (this.libzip.struct.statMtime(stat) >>> 0) * 1000;
      const atimeMs = mtimeMs;
      const birthtimeMs = mtimeMs;
      const ctimeMs = mtimeMs;
      const atime = new Date(atimeMs);
      const birthtime = new Date(birthtimeMs);
      const ctime = new Date(ctimeMs);
      const mtime = new Date(mtimeMs);
      const type = this.listings.has(p) ? S_IFDIR : this.isSymbolicLink(entry) ? S_IFLNK : S_IFREG;
      const defaultMode = type === S_IFDIR ? 0o755 : 0o644;
      const mode = type | this.getUnixMode(entry, defaultMode) & 0o777;
      return Object.assign(new StatEntry(), {
        uid,
        gid,
        size,
        blksize,
        blocks,
        atime,
        birthtime,
        ctime,
        mtime,
        atimeMs,
        birthtimeMs,
        ctimeMs,
        mtimeMs,
        mode
      });
    } // Implicit directory


    if (this.listings.has(p)) {
      const uid = this.stats.uid;
      const gid = this.stats.gid;
      const size = 0;
      const blksize = 512;
      const blocks = 0;
      const atimeMs = this.stats.mtimeMs;
      const birthtimeMs = this.stats.mtimeMs;
      const ctimeMs = this.stats.mtimeMs;
      const mtimeMs = this.stats.mtimeMs;
      const atime = new Date(atimeMs);
      const birthtime = new Date(birthtimeMs);
      const ctime = new Date(ctimeMs);
      const mtime = new Date(mtimeMs);
      const mode = S_IFDIR | 0o755;
      return Object.assign(new StatEntry(), {
        uid,
        gid,
        size,
        blksize,
        blocks,
        atime,
        birthtime,
        ctime,
        mtime,
        atimeMs,
        birthtimeMs,
        ctimeMs,
        mtimeMs,
        mode
      });
    }

    throw new Error(`Unreachable`);
  }

  getUnixMode(index, defaultMode) {
    const rc = this.libzip.file.getExternalAttributes(this.zip, index, 0, 0, this.libzip.uint08S, this.libzip.uint32S);
    if (rc === -1) throw this.makeLibzipError(this.libzip.getError(this.zip));
    const opsys = this.libzip.getValue(this.libzip.uint08S, `i8`) >>> 0;
    if (opsys !== this.libzip.ZIP_OPSYS_UNIX) return defaultMode;
    return this.libzip.getValue(this.libzip.uint32S, `i32`) >>> 16;
  }

  registerListing(p) {
    let listing = this.listings.get(p);
    if (listing) return listing;
    const parentListing = this.registerListing(sources_path/* ppath.dirname */.y1.dirname(p));
    listing = new Set();
    parentListing.add(sources_path/* ppath.basename */.y1.basename(p));
    this.listings.set(p, listing);
    return listing;
  }

  registerEntry(p, index) {
    const parentListing = this.registerListing(sources_path/* ppath.dirname */.y1.dirname(p));
    parentListing.add(sources_path/* ppath.basename */.y1.basename(p));
    this.entries.set(p, index);
  }

  unregisterListing(p) {
    this.listings.delete(p);
    const parentListing = this.listings.get(sources_path/* ppath.dirname */.y1.dirname(p));
    parentListing === null || parentListing === void 0 ? void 0 : parentListing.delete(sources_path/* ppath.basename */.y1.basename(p));
  }

  unregisterEntry(p) {
    this.unregisterListing(p);
    const entry = this.entries.get(p);
    this.entries.delete(p);
    if (typeof entry === `undefined`) return;
    this.fileSources.delete(entry);

    if (this.isSymbolicLink(entry)) {
      this.symlinkCount--;
    }
  }

  deleteEntry(p, index) {
    this.unregisterEntry(p);
    const rc = this.libzip.delete(this.zip, index);

    if (rc === -1) {
      throw this.makeLibzipError(this.libzip.getError(this.zip));
    }
  }

  resolveFilename(reason, p, resolveLastComponent = true) {
    if (!this.ready) throw EBUSY(`archive closed, ${reason}`);
    let resolvedP = sources_path/* ppath.resolve */.y1.resolve(sources_path/* PortablePath.root */.LZ.root, p);
    if (resolvedP === `/`) return sources_path/* PortablePath.root */.LZ.root;
    const fileIndex = this.entries.get(resolvedP);

    if (resolveLastComponent && fileIndex !== undefined) {
      if (this.symlinkCount !== 0 && this.isSymbolicLink(fileIndex)) {
        const target = this.getFileSource(fileIndex).toString();
        return this.resolveFilename(reason, sources_path/* ppath.resolve */.y1.resolve(sources_path/* ppath.dirname */.y1.dirname(resolvedP), target), true);
      } else {
        return resolvedP;
      }
    }

    while (true) {
      const parentP = this.resolveFilename(reason, sources_path/* ppath.dirname */.y1.dirname(resolvedP), true);
      const isDir = this.listings.has(parentP);
      const doesExist = this.entries.has(parentP);
      if (!isDir && !doesExist) throw ENOENT(reason);
      if (!isDir) throw ENOTDIR(reason);
      resolvedP = sources_path/* ppath.resolve */.y1.resolve(parentP, sources_path/* ppath.basename */.y1.basename(resolvedP));
      if (!resolveLastComponent || this.symlinkCount === 0) break;
      const index = this.libzip.name.locate(this.zip, resolvedP.slice(1));
      if (index === -1) break;

      if (this.isSymbolicLink(index)) {
        const target = this.getFileSource(index).toString();
        resolvedP = sources_path/* ppath.resolve */.y1.resolve(sources_path/* ppath.dirname */.y1.dirname(resolvedP), target);
      } else {
        break;
      }
    }

    return resolvedP;
  }

  allocateBuffer(content) {
    if (!Buffer.isBuffer(content)) content = Buffer.from(content);
    const buffer = this.libzip.malloc(content.byteLength);
    if (!buffer) throw new Error(`Couldn't allocate enough memory`); // Copy the file into the Emscripten heap

    const heap = new Uint8Array(this.libzip.HEAPU8.buffer, buffer, content.byteLength);
    heap.set(content);
    return {
      buffer,
      byteLength: content.byteLength
    };
  }

  allocateUnattachedSource(content) {
    const error = this.libzip.struct.errorS();
    const {
      buffer,
      byteLength
    } = this.allocateBuffer(content);
    const source = this.libzip.source.fromUnattachedBuffer(buffer, byteLength, 0, true, error);

    if (source === 0) {
      this.libzip.free(error);
      throw this.makeLibzipError(error);
    }

    return source;
  }

  allocateSource(content) {
    const {
      buffer,
      byteLength
    } = this.allocateBuffer(content);
    const source = this.libzip.source.fromBuffer(this.zip, buffer, byteLength, 0, true);

    if (source === 0) {
      this.libzip.free(buffer);
      throw this.makeLibzipError(this.libzip.getError(this.zip));
    }

    return source;
  }

  setFileSource(p, content) {
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
    const target = sources_path/* ppath.relative */.y1.relative(sources_path/* PortablePath.root */.LZ.root, p);
    const lzSource = this.allocateSource(content);

    try {
      const newIndex = this.libzip.file.add(this.zip, target, lzSource, this.libzip.ZIP_FL_OVERWRITE);
      if (newIndex === -1) throw this.makeLibzipError(this.libzip.getError(this.zip));

      if (this.level !== `mixed`) {
        // Use store for level 0, and deflate for 1..9
        let method;
        if (this.level === 0) method = this.libzip.ZIP_CM_STORE;else method = this.libzip.ZIP_CM_DEFLATE;
        const rc = this.libzip.file.setCompression(this.zip, newIndex, 0, method, this.level);

        if (rc === -1) {
          throw this.makeLibzipError(this.libzip.getError(this.zip));
        }
      }

      this.fileSources.set(newIndex, buffer);
      return newIndex;
    } catch (error) {
      this.libzip.source.free(lzSource);
      throw error;
    }
  }

  isSymbolicLink(index) {
    if (this.symlinkCount === 0) return false;
    const attrs = this.libzip.file.getExternalAttributes(this.zip, index, 0, 0, this.libzip.uint08S, this.libzip.uint32S);
    if (attrs === -1) throw this.makeLibzipError(this.libzip.getError(this.zip));
    const opsys = this.libzip.getValue(this.libzip.uint08S, `i8`) >>> 0;
    if (opsys !== this.libzip.ZIP_OPSYS_UNIX) return false;
    const attributes = this.libzip.getValue(this.libzip.uint32S, `i32`) >>> 16;
    return (attributes & S_IFMT) === S_IFLNK;
  }

  getFileSource(index, opts = {
    asyncDecompress: false
  }) {
    const cachedFileSource = this.fileSources.get(index);
    if (typeof cachedFileSource !== `undefined`) return cachedFileSource;
    const stat = this.libzip.struct.statS();
    const rc = this.libzip.statIndex(this.zip, index, 0, 0, stat);
    if (rc === -1) throw this.makeLibzipError(this.libzip.getError(this.zip));
    const size = this.libzip.struct.statCompSize(stat);
    const compressionMethod = this.libzip.struct.statCompMethod(stat);
    const buffer = this.libzip.malloc(size);

    try {
      const file = this.libzip.fopenIndex(this.zip, index, 0, this.libzip.ZIP_FL_COMPRESSED);
      if (file === 0) throw this.makeLibzipError(this.libzip.getError(this.zip));

      try {
        const rc = this.libzip.fread(file, buffer, size, 0);
        if (rc === -1) throw this.makeLibzipError(this.libzip.file.getError(file));else if (rc < size) throw new Error(`Incomplete read`);else if (rc > size) throw new Error(`Overread`);
        const memory = this.libzip.HEAPU8.subarray(buffer, buffer + size);
        const data = Buffer.from(memory);

        if (compressionMethod === 0) {
          this.fileSources.set(index, data);
          return data;
        } else if (opts.asyncDecompress) {
          return new Promise((resolve, reject) => {
            external_zlib_default().inflateRaw(data, (error, result) => {
              if (error) {
                reject(error);
              } else {
                this.fileSources.set(index, result);
                resolve(result);
              }
            });
          });
        } else {
          const decompressedData = external_zlib_default().inflateRawSync(data);
          this.fileSources.set(index, decompressedData);
          return decompressedData;
        }
      } finally {
        this.libzip.fclose(file);
      }
    } finally {
      this.libzip.free(buffer);
    }
  }

  async chmodPromise(p, mask) {
    return this.chmodSync(p, mask);
  }

  chmodSync(p, mask) {
    if (this.readOnly) throw EROFS(`chmod '${p}'`); // We don't allow to make the extracted entries group-writable

    mask &= 0o755;
    const resolvedP = this.resolveFilename(`chmod '${p}'`, p, false);
    const entry = this.entries.get(resolvedP);
    if (typeof entry === `undefined`) throw new Error(`Assertion failed: The entry should have been registered (${resolvedP})`);
    const oldMod = this.getUnixMode(entry, S_IFREG | 0o000);
    const newMod = oldMod & ~0o777 | mask;
    const rc = this.libzip.file.setExternalAttributes(this.zip, entry, 0, 0, this.libzip.ZIP_OPSYS_UNIX, newMod << 16);

    if (rc === -1) {
      throw this.makeLibzipError(this.libzip.getError(this.zip));
    }
  }

  async chownPromise(p, uid, gid) {
    return this.chownSync(p, uid, gid);
  }

  chownSync(p, uid, gid) {
    throw new Error(`Unimplemented`);
  }

  async renamePromise(oldP, newP) {
    return this.renameSync(oldP, newP);
  }

  renameSync(oldP, newP) {
    throw new Error(`Unimplemented`);
  }

  async copyFilePromise(sourceP, destP, flags) {
    const {
      indexSource,
      indexDest,
      resolvedDestP
    } = this.prepareCopyFile(sourceP, destP, flags);
    const source = await this.getFileSource(indexSource, {
      asyncDecompress: true
    });
    const newIndex = this.setFileSource(resolvedDestP, source);

    if (newIndex !== indexDest) {
      this.registerEntry(resolvedDestP, newIndex);
    }
  }

  copyFileSync(sourceP, destP, flags = 0) {
    const {
      indexSource,
      indexDest,
      resolvedDestP
    } = this.prepareCopyFile(sourceP, destP, flags);
    const source = this.getFileSource(indexSource);
    const newIndex = this.setFileSource(resolvedDestP, source);

    if (newIndex !== indexDest) {
      this.registerEntry(resolvedDestP, newIndex);
    }
  }

  prepareCopyFile(sourceP, destP, flags = 0) {
    if (this.readOnly) throw EROFS(`copyfile '${sourceP} -> '${destP}'`);
    if ((flags & external_fs_.constants.COPYFILE_FICLONE_FORCE) !== 0) throw ENOSYS(`unsupported clone operation`, `copyfile '${sourceP}' -> ${destP}'`);
    const resolvedSourceP = this.resolveFilename(`copyfile '${sourceP} -> ${destP}'`, sourceP);
    const indexSource = this.entries.get(resolvedSourceP);
    if (typeof indexSource === `undefined`) throw EINVAL(`copyfile '${sourceP}' -> '${destP}'`);
    const resolvedDestP = this.resolveFilename(`copyfile '${sourceP}' -> ${destP}'`, destP);
    const indexDest = this.entries.get(resolvedDestP);
    if ((flags & (external_fs_.constants.COPYFILE_EXCL | external_fs_.constants.COPYFILE_FICLONE_FORCE)) !== 0 && typeof indexDest !== `undefined`) throw EEXIST(`copyfile '${sourceP}' -> '${destP}'`);
    return {
      indexSource,
      resolvedDestP,
      indexDest
    };
  }

  async appendFilePromise(p, content, opts) {
    if (this.readOnly) throw EROFS(`open '${p}'`);
    if (typeof opts === `undefined`) opts = {
      flag: `a`
    };else if (typeof opts === `string`) opts = {
      flag: `a`,
      encoding: opts
    };else if (typeof opts.flag === `undefined`) opts = {
      flag: `a`,
      ...opts
    };
    return this.writeFilePromise(p, content, opts);
  }

  appendFileSync(p, content, opts = {}) {
    if (this.readOnly) throw EROFS(`open '${p}'`);
    if (typeof opts === `undefined`) opts = {
      flag: `a`
    };else if (typeof opts === `string`) opts = {
      flag: `a`,
      encoding: opts
    };else if (typeof opts.flag === `undefined`) opts = {
      flag: `a`,
      ...opts
    };
    return this.writeFileSync(p, content, opts);
  }

  async writeFilePromise(p, content, opts) {
    const {
      encoding,
      index,
      resolvedP
    } = this.prepareWriteFile(p, opts);
    if (index !== undefined && typeof opts === `object` && opts.flag && opts.flag.includes(`a`)) content = Buffer.concat([await this.getFileSource(index, {
      asyncDecompress: true
    }), Buffer.from(content)]);
    if (encoding !== null) content = content.toString(encoding);
    const newIndex = this.setFileSource(resolvedP, content);

    if (newIndex !== index) {
      this.registerEntry(resolvedP, newIndex);
    }
  }

  writeFileSync(p, content, opts) {
    const {
      encoding,
      index,
      resolvedP
    } = this.prepareWriteFile(p, opts);
    if (index !== undefined && typeof opts === `object` && opts.flag && opts.flag.includes(`a`)) content = Buffer.concat([this.getFileSource(index), Buffer.from(content)]);
    if (encoding !== null) content = content.toString(encoding);
    const newIndex = this.setFileSource(resolvedP, content);

    if (newIndex !== index) {
      this.registerEntry(resolvedP, newIndex);
    }
  }

  prepareWriteFile(p, opts) {
    if (typeof p !== `string`) throw EBADF(`read`);
    if (this.readOnly) throw EROFS(`open '${p}'`);
    const resolvedP = this.resolveFilename(`open '${p}'`, p);
    if (this.listings.has(resolvedP)) throw EISDIR(`open '${p}'`);
    let encoding = null;
    if (typeof opts === `string`) encoding = opts;else if (typeof opts === `object` && opts.encoding) encoding = opts.encoding;
    const index = this.entries.get(resolvedP);
    return {
      encoding,
      resolvedP,
      index
    };
  }

  async unlinkPromise(p) {
    return this.unlinkSync(p);
  }

  unlinkSync(p) {
    if (this.readOnly) throw EROFS(`unlink '${p}'`);
    const resolvedP = this.resolveFilename(`unlink '${p}'`, p);
    if (this.listings.has(resolvedP)) throw EISDIR(`unlink '${p}'`);
    const index = this.entries.get(resolvedP);
    if (typeof index === `undefined`) throw EINVAL(`unlink '${p}'`);
    this.deleteEntry(resolvedP, index);
  }

  async utimesPromise(p, atime, mtime) {
    return this.utimesSync(p, atime, mtime);
  }

  utimesSync(p, atime, mtime) {
    if (this.readOnly) throw EROFS(`utimes '${p}'`);
    const resolvedP = this.resolveFilename(`utimes '${p}'`, p);
    this.utimesImpl(resolvedP, mtime);
  }

  async lutimesPromise(p, atime, mtime) {
    return this.lutimesSync(p, atime, mtime);
  }

  lutimesSync(p, atime, mtime) {
    if (this.readOnly) throw EROFS(`lutimes '${p}'`);
    const resolvedP = this.resolveFilename(`utimes '${p}'`, p, false);
    this.utimesImpl(resolvedP, mtime);
  }

  utimesImpl(resolvedP, mtime) {
    if (this.listings.has(resolvedP)) if (!this.entries.has(resolvedP)) this.hydrateDirectory(resolvedP);
    const entry = this.entries.get(resolvedP);
    if (entry === undefined) throw new Error(`Unreachable`);
    const rc = this.libzip.file.setMtime(this.zip, entry, 0, toUnixTimestamp(mtime), 0);

    if (rc === -1) {
      throw this.makeLibzipError(this.libzip.getError(this.zip));
    }
  }

  async mkdirPromise(p, opts) {
    return this.mkdirSync(p, opts);
  }

  mkdirSync(p, {
    mode = 0o755,
    recursive = false
  } = {}) {
    if (recursive) {
      this.mkdirpSync(p, {
        chmod: mode
      });
      return;
    }

    if (this.readOnly) throw EROFS(`mkdir '${p}'`);
    const resolvedP = this.resolveFilename(`mkdir '${p}'`, p);
    if (this.entries.has(resolvedP) || this.listings.has(resolvedP)) throw EEXIST(`mkdir '${p}'`);
    this.hydrateDirectory(resolvedP);
    this.chmodSync(resolvedP, mode);
  }

  async rmdirPromise(p) {
    return this.rmdirSync(p);
  }

  rmdirSync(p) {
    if (this.readOnly) throw EROFS(`rmdir '${p}'`);
    const resolvedP = this.resolveFilename(`rmdir '${p}'`, p);
    const directoryListing = this.listings.get(resolvedP);
    if (!directoryListing) throw ENOTDIR(`rmdir '${p}'`);
    if (directoryListing.size > 0) throw ENOTEMPTY(`rmdir '${p}'`);
    const index = this.entries.get(resolvedP);
    if (typeof index === `undefined`) throw EINVAL(`rmdir '${p}'`);
    this.deleteEntry(p, index);
  }

  hydrateDirectory(resolvedP) {
    const index = this.libzip.dir.add(this.zip, sources_path/* ppath.relative */.y1.relative(sources_path/* PortablePath.root */.LZ.root, resolvedP));
    if (index === -1) throw this.makeLibzipError(this.libzip.getError(this.zip));
    this.registerListing(resolvedP);
    this.registerEntry(resolvedP, index);
    return index;
  }

  async linkPromise(existingP, newP) {
    return this.linkSync(existingP, newP);
  }

  linkSync(existingP, newP) {
    // Zip archives don't support hard links:
    // https://stackoverflow.com/questions/8859616/are-hard-links-possible-within-a-zip-archive
    throw EOPNOTSUPP(`link '${existingP}' -> '${newP}'`);
  }

  async symlinkPromise(target, p) {
    return this.symlinkSync(target, p);
  }

  symlinkSync(target, p) {
    if (this.readOnly) throw EROFS(`symlink '${target}' -> '${p}'`);
    const resolvedP = this.resolveFilename(`symlink '${target}' -> '${p}'`, p);
    if (this.listings.has(resolvedP)) throw EISDIR(`symlink '${target}' -> '${p}'`);
    if (this.entries.has(resolvedP)) throw EEXIST(`symlink '${target}' -> '${p}'`);
    const index = this.setFileSource(resolvedP, target);
    this.registerEntry(resolvedP, index);
    const rc = this.libzip.file.setExternalAttributes(this.zip, index, 0, 0, this.libzip.ZIP_OPSYS_UNIX, (S_IFLNK | 0o777) << 16);
    if (rc === -1) throw this.makeLibzipError(this.libzip.getError(this.zip));
    this.symlinkCount += 1;
  }

  async readFilePromise(p, encoding) {
    // This is messed up regarding the TS signatures
    if (typeof encoding === `object`) // @ts-expect-error
      encoding = encoding ? encoding.encoding : undefined;
    const data = await this.readFileBuffer(p, {
      asyncDecompress: true
    });
    return encoding ? data.toString(encoding) : data;
  }

  readFileSync(p, encoding) {
    // This is messed up regarding the TS signatures
    if (typeof encoding === `object`) // @ts-expect-error
      encoding = encoding ? encoding.encoding : undefined;
    const data = this.readFileBuffer(p);
    return encoding ? data.toString(encoding) : data;
  }

  readFileBuffer(p, opts = {
    asyncDecompress: false
  }) {
    if (typeof p !== `string`) throw EBADF(`read`);
    const resolvedP = this.resolveFilename(`open '${p}'`, p);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`open '${p}'`); // Ensures that the last component is a directory, if the user said so (even if it is we'll throw right after with EISDIR anyway)

    if (p[p.length - 1] === `/` && !this.listings.has(resolvedP)) throw ENOTDIR(`open '${p}'`);
    if (this.listings.has(resolvedP)) throw EISDIR(`read`);
    const entry = this.entries.get(resolvedP);
    if (entry === undefined) throw new Error(`Unreachable`);
    return this.getFileSource(entry, opts);
  }

  async readdirPromise(p, {
    withFileTypes
  } = {}) {
    return this.readdirSync(p, {
      withFileTypes: withFileTypes
    });
  }

  readdirSync(p, {
    withFileTypes
  } = {}) {
    const resolvedP = this.resolveFilename(`scandir '${p}'`, p);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`scandir '${p}'`);
    const directoryListing = this.listings.get(resolvedP);
    if (!directoryListing) throw ENOTDIR(`scandir '${p}'`);
    const entries = [...directoryListing];
    if (!withFileTypes) return entries;
    return entries.map(name => {
      return Object.assign(this.statImpl(`lstat`, sources_path/* ppath.join */.y1.join(p, name)), {
        name
      });
    });
  }

  async readlinkPromise(p) {
    const entry = this.prepareReadlink(p);
    return (await this.getFileSource(entry, {
      asyncDecompress: true
    })).toString();
  }

  readlinkSync(p) {
    const entry = this.prepareReadlink(p);
    return this.getFileSource(entry).toString();
  }

  prepareReadlink(p) {
    const resolvedP = this.resolveFilename(`readlink '${p}'`, p, false);
    if (!this.entries.has(resolvedP) && !this.listings.has(resolvedP)) throw ENOENT(`readlink '${p}'`); // Ensure that the last component is a directory (if it is we'll throw right after with EISDIR anyway)

    if (p[p.length - 1] === `/` && !this.listings.has(resolvedP)) throw ENOTDIR(`open '${p}'`);
    if (this.listings.has(resolvedP)) throw EINVAL(`readlink '${p}'`);
    const entry = this.entries.get(resolvedP);
    if (entry === undefined) throw new Error(`Unreachable`);
    if (!this.isSymbolicLink(entry)) throw EINVAL(`readlink '${p}'`);
    return entry;
  }

  async truncatePromise(p, len = 0) {
    const resolvedP = this.resolveFilename(`open '${p}'`, p);
    const index = this.entries.get(resolvedP);
    if (typeof index === `undefined`) throw EINVAL(`open '${p}'`);
    const source = await this.getFileSource(index, {
      asyncDecompress: true
    });
    const truncated = Buffer.alloc(len, 0x00);
    source.copy(truncated);
    return await this.writeFilePromise(p, truncated);
  }

  truncateSync(p, len = 0) {
    const resolvedP = this.resolveFilename(`open '${p}'`, p);
    const index = this.entries.get(resolvedP);
    if (typeof index === `undefined`) throw EINVAL(`open '${p}'`);
    const source = this.getFileSource(index);
    const truncated = Buffer.alloc(len, 0x00);
    source.copy(truncated);
    return this.writeFileSync(p, truncated);
  }

  watch(p, a, b) {
    let persistent;

    switch (typeof a) {
      case `function`:
      case `string`:
      case `undefined`:
        {
          persistent = true;
        }
        break;

      default:
        {
          ({
            persistent = true
          } = a);
        }
        break;
    }

    if (!persistent) return {
      on: () => {},
      close: () => {}
    };
    const interval = setInterval(() => {}, 24 * 60 * 60 * 1000);
    return {
      on: () => {},
      close: () => {
        clearInterval(interval);
      }
    };
  }

  watchFile(p, a, b) {
    const resolvedP = this.resolveFilename(`open '${p}'`, p);
    return watchFile(this, resolvedP, a, b);
  }

  unwatchFile(p, cb) {
    const resolvedP = this.resolveFilename(`open '${p}'`, p);
    return unwatchFile(this, resolvedP, cb);
  }

}
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/ZipOpenFS.ts






const ZIP_FD = 0x80000000;
const FILE_PARTS_REGEX = /.*?(?<!\/)\.zip(?=\/|$)/;
class ZipOpenFS extends FakeFS/* BasePortableFakeFS */.fS {
  constructor({
    libzip,
    baseFs = new NodeFS(),
    filter = null,
    maxOpenFiles = Infinity,
    readOnlyArchives = false,
    useCache = true,
    maxAge = 5000
  }) {
    super();
    this.fdMap = new Map();
    this.nextFd = 3;
    this.isZip = new Set();
    this.notZip = new Set();
    this.realPaths = new Map();
    this.limitOpenFilesTimeout = null;
    this.libzip = libzip;
    this.baseFs = baseFs;
    this.zipInstances = useCache ? new Map() : null;
    this.filter = filter;
    this.maxOpenFiles = maxOpenFiles;
    this.readOnlyArchives = readOnlyArchives;
    this.maxAge = maxAge;
  }

  static async openPromise(fn, opts) {
    const zipOpenFs = new ZipOpenFS(opts);

    try {
      return await fn(zipOpenFs);
    } finally {
      zipOpenFs.saveAndClose();
    }
  }

  getExtractHint(hints) {
    return this.baseFs.getExtractHint(hints);
  }

  getRealPath() {
    return this.baseFs.getRealPath();
  }

  saveAndClose() {
    unwatchAllFiles(this);

    if (this.zipInstances) {
      for (const [path, {
        zipFs
      }] of this.zipInstances.entries()) {
        zipFs.saveAndClose();
        this.zipInstances.delete(path);
      }
    }
  }

  discardAndClose() {
    unwatchAllFiles(this);

    if (this.zipInstances) {
      for (const [path, {
        zipFs
      }] of this.zipInstances.entries()) {
        zipFs.discardAndClose();
        this.zipInstances.delete(path);
      }
    }
  }

  resolve(p) {
    return this.baseFs.resolve(p);
  }

  remapFd(zipFs, fd) {
    const remappedFd = this.nextFd++ | ZIP_FD;
    this.fdMap.set(remappedFd, [zipFs, fd]);
    return remappedFd;
  }

  async openPromise(p, flags, mode) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.openPromise(p, flags, mode);
    }, async (zipFs, {
      subPath
    }) => {
      return this.remapFd(zipFs, await zipFs.openPromise(subPath, flags, mode));
    });
  }

  openSync(p, flags, mode) {
    return this.makeCallSync(p, () => {
      return this.baseFs.openSync(p, flags, mode);
    }, (zipFs, {
      subPath
    }) => {
      return this.remapFd(zipFs, zipFs.openSync(subPath, flags, mode));
    });
  }

  async readPromise(fd, buffer, offset, length, position) {
    if ((fd & ZIP_FD) === 0) return await this.baseFs.readPromise(fd, buffer, offset, length, position);
    const entry = this.fdMap.get(fd);
    if (typeof entry === `undefined`) throw Object.assign(new Error(`EBADF: bad file descriptor, read`), {
      code: `EBADF`
    });
    const [zipFs, realFd] = entry;
    return await zipFs.readPromise(realFd, buffer, offset, length, position);
  }

  readSync(fd, buffer, offset, length, position) {
    if ((fd & ZIP_FD) === 0) return this.baseFs.readSync(fd, buffer, offset, length, position);
    const entry = this.fdMap.get(fd);
    if (typeof entry === `undefined`) throw Object.assign(new Error(`EBADF: bad file descriptor, read`), {
      code: `EBADF`
    });
    const [zipFs, realFd] = entry;
    return zipFs.readSync(realFd, buffer, offset, length, position);
  }

  async writePromise(fd, buffer, offset, length, position) {
    if ((fd & ZIP_FD) === 0) {
      if (typeof buffer === `string`) {
        return await this.baseFs.writePromise(fd, buffer, offset);
      } else {
        return await this.baseFs.writePromise(fd, buffer, offset, length, position);
      }
    }

    const entry = this.fdMap.get(fd);
    if (typeof entry === `undefined`) throw Object.assign(new Error(`EBADF: bad file descriptor, write`), {
      code: `EBADF`
    });
    const [zipFs, realFd] = entry;

    if (typeof buffer === `string`) {
      return await zipFs.writePromise(realFd, buffer, offset);
    } else {
      return await zipFs.writePromise(realFd, buffer, offset, length, position);
    }
  }

  writeSync(fd, buffer, offset, length, position) {
    if ((fd & ZIP_FD) === 0) {
      if (typeof buffer === `string`) {
        return this.baseFs.writeSync(fd, buffer, offset);
      } else {
        return this.baseFs.writeSync(fd, buffer, offset, length, position);
      }
    }

    const entry = this.fdMap.get(fd);
    if (typeof entry === `undefined`) throw Object.assign(new Error(`EBADF: bad file descriptor, write`), {
      code: `EBADF`
    });
    const [zipFs, realFd] = entry;

    if (typeof buffer === `string`) {
      return zipFs.writeSync(realFd, buffer, offset);
    } else {
      return zipFs.writeSync(realFd, buffer, offset, length, position);
    }
  }

  async closePromise(fd) {
    if ((fd & ZIP_FD) === 0) return await this.baseFs.closePromise(fd);
    const entry = this.fdMap.get(fd);
    if (typeof entry === `undefined`) throw Object.assign(new Error(`EBADF: bad file descriptor, close`), {
      code: `EBADF`
    });
    this.fdMap.delete(fd);
    const [zipFs, realFd] = entry;
    return await zipFs.closePromise(realFd);
  }

  closeSync(fd) {
    if ((fd & ZIP_FD) === 0) return this.baseFs.closeSync(fd);
    const entry = this.fdMap.get(fd);
    if (typeof entry === `undefined`) throw Object.assign(new Error(`EBADF: bad file descriptor, close`), {
      code: `EBADF`
    });
    this.fdMap.delete(fd);
    const [zipFs, realFd] = entry;
    return zipFs.closeSync(realFd);
  }

  createReadStream(p, opts) {
    if (p === null) return this.baseFs.createReadStream(p, opts);
    return this.makeCallSync(p, () => {
      return this.baseFs.createReadStream(p, opts);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.createReadStream(subPath, opts);
    });
  }

  createWriteStream(p, opts) {
    if (p === null) return this.baseFs.createWriteStream(p, opts);
    return this.makeCallSync(p, () => {
      return this.baseFs.createWriteStream(p, opts);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.createWriteStream(subPath, opts);
    });
  }

  async realpathPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.realpathPromise(p);
    }, async (zipFs, {
      archivePath,
      subPath
    }) => {
      let realArchivePath = this.realPaths.get(archivePath);

      if (typeof realArchivePath === `undefined`) {
        realArchivePath = await this.baseFs.realpathPromise(archivePath);
        this.realPaths.set(archivePath, realArchivePath);
      }

      return this.pathUtils.join(realArchivePath, this.pathUtils.relative(sources_path/* PortablePath.root */.LZ.root, await zipFs.realpathPromise(subPath)));
    });
  }

  realpathSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.realpathSync(p);
    }, (zipFs, {
      archivePath,
      subPath
    }) => {
      let realArchivePath = this.realPaths.get(archivePath);

      if (typeof realArchivePath === `undefined`) {
        realArchivePath = this.baseFs.realpathSync(archivePath);
        this.realPaths.set(archivePath, realArchivePath);
      }

      return this.pathUtils.join(realArchivePath, this.pathUtils.relative(sources_path/* PortablePath.root */.LZ.root, zipFs.realpathSync(subPath)));
    });
  }

  async existsPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.existsPromise(p);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.existsPromise(subPath);
    });
  }

  existsSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.existsSync(p);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.existsSync(subPath);
    });
  }

  async accessPromise(p, mode) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.accessPromise(p, mode);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.accessPromise(subPath, mode);
    });
  }

  accessSync(p, mode) {
    return this.makeCallSync(p, () => {
      return this.baseFs.accessSync(p, mode);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.accessSync(subPath, mode);
    });
  }

  async statPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.statPromise(p);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.statPromise(subPath);
    });
  }

  statSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.statSync(p);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.statSync(subPath);
    });
  }

  async lstatPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.lstatPromise(p);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.lstatPromise(subPath);
    });
  }

  lstatSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.lstatSync(p);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.lstatSync(subPath);
    });
  }

  async chmodPromise(p, mask) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.chmodPromise(p, mask);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.chmodPromise(subPath, mask);
    });
  }

  chmodSync(p, mask) {
    return this.makeCallSync(p, () => {
      return this.baseFs.chmodSync(p, mask);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.chmodSync(subPath, mask);
    });
  }

  async chownPromise(p, uid, gid) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.chownPromise(p, uid, gid);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.chownPromise(subPath, uid, gid);
    });
  }

  chownSync(p, uid, gid) {
    return this.makeCallSync(p, () => {
      return this.baseFs.chownSync(p, uid, gid);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.chownSync(subPath, uid, gid);
    });
  }

  async renamePromise(oldP, newP) {
    return await this.makeCallPromise(oldP, async () => {
      return await this.makeCallPromise(newP, async () => {
        return await this.baseFs.renamePromise(oldP, newP);
      }, async () => {
        throw Object.assign(new Error(`EEXDEV: cross-device link not permitted`), {
          code: `EEXDEV`
        });
      });
    }, async (zipFsO, {
      subPath: subPathO
    }) => {
      return await this.makeCallPromise(newP, async () => {
        throw Object.assign(new Error(`EEXDEV: cross-device link not permitted`), {
          code: `EEXDEV`
        });
      }, async (zipFsN, {
        subPath: subPathN
      }) => {
        if (zipFsO !== zipFsN) {
          throw Object.assign(new Error(`EEXDEV: cross-device link not permitted`), {
            code: `EEXDEV`
          });
        } else {
          return await zipFsO.renamePromise(subPathO, subPathN);
        }
      });
    });
  }

  renameSync(oldP, newP) {
    return this.makeCallSync(oldP, () => {
      return this.makeCallSync(newP, () => {
        return this.baseFs.renameSync(oldP, newP);
      }, async () => {
        throw Object.assign(new Error(`EEXDEV: cross-device link not permitted`), {
          code: `EEXDEV`
        });
      });
    }, (zipFsO, {
      subPath: subPathO
    }) => {
      return this.makeCallSync(newP, () => {
        throw Object.assign(new Error(`EEXDEV: cross-device link not permitted`), {
          code: `EEXDEV`
        });
      }, (zipFsN, {
        subPath: subPathN
      }) => {
        if (zipFsO !== zipFsN) {
          throw Object.assign(new Error(`EEXDEV: cross-device link not permitted`), {
            code: `EEXDEV`
          });
        } else {
          return zipFsO.renameSync(subPathO, subPathN);
        }
      });
    });
  }

  async copyFilePromise(sourceP, destP, flags = 0) {
    const fallback = async (sourceFs, sourceP, destFs, destP) => {
      if ((flags & external_fs_.constants.COPYFILE_FICLONE_FORCE) !== 0) throw Object.assign(new Error(`EXDEV: cross-device clone not permitted, copyfile '${sourceP}' -> ${destP}'`), {
        code: `EXDEV`
      });
      if (flags & external_fs_.constants.COPYFILE_EXCL && (await this.existsPromise(sourceP))) throw Object.assign(new Error(`EEXIST: file already exists, copyfile '${sourceP}' -> '${destP}'`), {
        code: `EEXIST`
      });
      let content;

      try {
        content = await sourceFs.readFilePromise(sourceP);
      } catch (error) {
        throw Object.assign(new Error(`EINVAL: invalid argument, copyfile '${sourceP}' -> '${destP}'`), {
          code: `EINVAL`
        });
      }

      await destFs.writeFilePromise(destP, content);
    };

    return await this.makeCallPromise(sourceP, async () => {
      return await this.makeCallPromise(destP, async () => {
        return await this.baseFs.copyFilePromise(sourceP, destP, flags);
      }, async (zipFsD, {
        subPath: subPathD
      }) => {
        return await fallback(this.baseFs, sourceP, zipFsD, subPathD);
      });
    }, async (zipFsS, {
      subPath: subPathS
    }) => {
      return await this.makeCallPromise(destP, async () => {
        return await fallback(zipFsS, subPathS, this.baseFs, destP);
      }, async (zipFsD, {
        subPath: subPathD
      }) => {
        if (zipFsS !== zipFsD) {
          return await fallback(zipFsS, subPathS, zipFsD, subPathD);
        } else {
          return await zipFsS.copyFilePromise(subPathS, subPathD, flags);
        }
      });
    });
  }

  copyFileSync(sourceP, destP, flags = 0) {
    const fallback = (sourceFs, sourceP, destFs, destP) => {
      if ((flags & external_fs_.constants.COPYFILE_FICLONE_FORCE) !== 0) throw Object.assign(new Error(`EXDEV: cross-device clone not permitted, copyfile '${sourceP}' -> ${destP}'`), {
        code: `EXDEV`
      });
      if (flags & external_fs_.constants.COPYFILE_EXCL && this.existsSync(sourceP)) throw Object.assign(new Error(`EEXIST: file already exists, copyfile '${sourceP}' -> '${destP}'`), {
        code: `EEXIST`
      });
      let content;

      try {
        content = sourceFs.readFileSync(sourceP);
      } catch (error) {
        throw Object.assign(new Error(`EINVAL: invalid argument, copyfile '${sourceP}' -> '${destP}'`), {
          code: `EINVAL`
        });
      }

      destFs.writeFileSync(destP, content);
    };

    return this.makeCallSync(sourceP, () => {
      return this.makeCallSync(destP, () => {
        return this.baseFs.copyFileSync(sourceP, destP, flags);
      }, (zipFsD, {
        subPath: subPathD
      }) => {
        return fallback(this.baseFs, sourceP, zipFsD, subPathD);
      });
    }, (zipFsS, {
      subPath: subPathS
    }) => {
      return this.makeCallSync(destP, () => {
        return fallback(zipFsS, subPathS, this.baseFs, destP);
      }, (zipFsD, {
        subPath: subPathD
      }) => {
        if (zipFsS !== zipFsD) {
          return fallback(zipFsS, subPathS, zipFsD, subPathD);
        } else {
          return zipFsS.copyFileSync(subPathS, subPathD, flags);
        }
      });
    });
  }

  async appendFilePromise(p, content, opts) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.appendFilePromise(p, content, opts);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.appendFilePromise(subPath, content, opts);
    });
  }

  appendFileSync(p, content, opts) {
    return this.makeCallSync(p, () => {
      return this.baseFs.appendFileSync(p, content, opts);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.appendFileSync(subPath, content, opts);
    });
  }

  async writeFilePromise(p, content, opts) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.writeFilePromise(p, content, opts);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.writeFilePromise(subPath, content, opts);
    });
  }

  writeFileSync(p, content, opts) {
    return this.makeCallSync(p, () => {
      return this.baseFs.writeFileSync(p, content, opts);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.writeFileSync(subPath, content, opts);
    });
  }

  async unlinkPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.unlinkPromise(p);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.unlinkPromise(subPath);
    });
  }

  unlinkSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.unlinkSync(p);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.unlinkSync(subPath);
    });
  }

  async utimesPromise(p, atime, mtime) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.utimesPromise(p, atime, mtime);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.utimesPromise(subPath, atime, mtime);
    });
  }

  utimesSync(p, atime, mtime) {
    return this.makeCallSync(p, () => {
      return this.baseFs.utimesSync(p, atime, mtime);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.utimesSync(subPath, atime, mtime);
    });
  }

  async mkdirPromise(p, opts) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.mkdirPromise(p, opts);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.mkdirPromise(subPath, opts);
    });
  }

  mkdirSync(p, opts) {
    return this.makeCallSync(p, () => {
      return this.baseFs.mkdirSync(p, opts);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.mkdirSync(subPath, opts);
    });
  }

  async rmdirPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.rmdirPromise(p);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.rmdirPromise(subPath);
    });
  }

  rmdirSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.rmdirSync(p);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.rmdirSync(subPath);
    });
  }

  async linkPromise(existingP, newP) {
    return await this.makeCallPromise(newP, async () => {
      return await this.baseFs.linkPromise(existingP, newP);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.linkPromise(existingP, subPath);
    });
  }

  linkSync(existingP, newP) {
    return this.makeCallSync(newP, () => {
      return this.baseFs.linkSync(existingP, newP);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.linkSync(existingP, subPath);
    });
  }

  async symlinkPromise(target, p, type) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.symlinkPromise(target, p, type);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.symlinkPromise(target, subPath);
    });
  }

  symlinkSync(target, p, type) {
    return this.makeCallSync(p, () => {
      return this.baseFs.symlinkSync(target, p, type);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.symlinkSync(target, subPath);
    });
  }

  async readFilePromise(p, encoding) {
    return this.makeCallPromise(p, async () => {
      // This weird switch is required to tell TypeScript that the signatures are proper (otherwise it thinks that only the generic one is covered)
      switch (encoding) {
        case `utf8`:
          return await this.baseFs.readFilePromise(p, encoding);

        default:
          return await this.baseFs.readFilePromise(p, encoding);
      }
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.readFilePromise(subPath, encoding);
    });
  }

  readFileSync(p, encoding) {
    return this.makeCallSync(p, () => {
      // This weird switch is required to tell TypeScript that the signatures are proper (otherwise it thinks that only the generic one is covered)
      switch (encoding) {
        case `utf8`:
          return this.baseFs.readFileSync(p, encoding);

        default:
          return this.baseFs.readFileSync(p, encoding);
      }
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.readFileSync(subPath, encoding);
    });
  }

  async readdirPromise(p, {
    withFileTypes
  } = {}) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.readdirPromise(p, {
        withFileTypes: withFileTypes
      });
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.readdirPromise(subPath, {
        withFileTypes: withFileTypes
      });
    }, {
      requireSubpath: false
    });
  }

  readdirSync(p, {
    withFileTypes
  } = {}) {
    return this.makeCallSync(p, () => {
      return this.baseFs.readdirSync(p, {
        withFileTypes: withFileTypes
      });
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.readdirSync(subPath, {
        withFileTypes: withFileTypes
      });
    }, {
      requireSubpath: false
    });
  }

  async readlinkPromise(p) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.readlinkPromise(p);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.readlinkPromise(subPath);
    });
  }

  readlinkSync(p) {
    return this.makeCallSync(p, () => {
      return this.baseFs.readlinkSync(p);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.readlinkSync(subPath);
    });
  }

  async truncatePromise(p, len) {
    return await this.makeCallPromise(p, async () => {
      return await this.baseFs.truncatePromise(p, len);
    }, async (zipFs, {
      subPath
    }) => {
      return await zipFs.truncatePromise(subPath, len);
    });
  }

  truncateSync(p, len) {
    return this.makeCallSync(p, () => {
      return this.baseFs.truncateSync(p, len);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.truncateSync(subPath, len);
    });
  }

  watch(p, a, b) {
    return this.makeCallSync(p, () => {
      return this.baseFs.watch(p, // @ts-expect-error
      a, b);
    }, (zipFs, {
      subPath
    }) => {
      return zipFs.watch(subPath, // @ts-expect-error
      a, b);
    });
  }

  watchFile(p, a, b) {
    return this.makeCallSync(p, () => {
      return this.baseFs.watchFile(p, // @ts-expect-error
      a, b);
    }, () => {
      return watchFile(this, p, a, b);
    });
  }

  unwatchFile(p, cb) {
    return this.makeCallSync(p, () => {
      return this.baseFs.unwatchFile(p, cb);
    }, () => {
      return unwatchFile(this, p, cb);
    });
  }

  async makeCallPromise(p, discard, accept, {
    requireSubpath = true
  } = {}) {
    if (typeof p !== `string`) return await discard();
    const normalizedP = this.resolve(p);
    const zipInfo = this.findZip(normalizedP);
    if (!zipInfo) return await discard();
    if (requireSubpath && zipInfo.subPath === `/`) return await discard();
    return await this.getZipPromise(zipInfo.archivePath, async zipFs => await accept(zipFs, zipInfo));
  }

  makeCallSync(p, discard, accept, {
    requireSubpath = true
  } = {}) {
    if (typeof p !== `string`) return discard();
    const normalizedP = this.resolve(p);
    const zipInfo = this.findZip(normalizedP);
    if (!zipInfo) return discard();
    if (requireSubpath && zipInfo.subPath === `/`) return discard();
    return this.getZipSync(zipInfo.archivePath, zipFs => accept(zipFs, zipInfo));
  }

  findZip(p) {
    if (this.filter && !this.filter.test(p)) return null;
    let filePath = ``;

    while (true) {
      const parts = FILE_PARTS_REGEX.exec(p.substr(filePath.length));
      if (!parts) return null;
      filePath = this.pathUtils.join(filePath, parts[0]);

      if (this.isZip.has(filePath) === false) {
        if (this.notZip.has(filePath)) continue;

        try {
          if (!this.baseFs.lstatSync(filePath).isFile()) {
            this.notZip.add(filePath);
            continue;
          }
        } catch (_a) {
          return null;
        }

        this.isZip.add(filePath);
      }

      return {
        archivePath: filePath,
        subPath: this.pathUtils.join(sources_path/* PortablePath.root */.LZ.root, p.substr(filePath.length))
      };
    }
  }

  limitOpenFiles(max) {
    if (this.zipInstances === null) return;
    const now = Date.now();
    let nextExpiresAt = now + this.maxAge;
    let closeCount = max === null ? 0 : this.zipInstances.size - max;

    for (const [path, {
      zipFs,
      expiresAt,
      refCount
    }] of this.zipInstances.entries()) {
      if (refCount !== 0 || zipFs.hasOpenFileHandles()) {
        continue;
      } else if (now >= expiresAt) {
        zipFs.saveAndClose();
        this.zipInstances.delete(path);
        closeCount -= 1;
        continue;
      } else if (max === null || closeCount <= 0) {
        nextExpiresAt = expiresAt;
        break;
      }

      zipFs.saveAndClose();
      this.zipInstances.delete(path);
      closeCount -= 1;
    }

    if (this.limitOpenFilesTimeout === null && (max === null && this.zipInstances.size > 0 || max !== null)) {
      this.limitOpenFilesTimeout = setTimeout(() => {
        this.limitOpenFilesTimeout = null;
        this.limitOpenFiles(null);
      }, nextExpiresAt - now).unref();
    }
  }

  async getZipPromise(p, accept) {
    const getZipOptions = async () => ({
      baseFs: this.baseFs,
      libzip: this.libzip,
      readOnly: this.readOnlyArchives,
      stats: await this.baseFs.statPromise(p)
    });

    if (this.zipInstances) {
      let cachedZipFs = this.zipInstances.get(p);

      if (!cachedZipFs) {
        const zipOptions = await getZipOptions(); // We need to recheck because concurrent getZipPromise calls may
        // have instantiated the zip archive while we were waiting

        cachedZipFs = this.zipInstances.get(p);

        if (!cachedZipFs) {
          cachedZipFs = {
            zipFs: new ZipFS(p, zipOptions),
            expiresAt: 0,
            refCount: 0
          };
        }
      } // Removing then re-adding the field allows us to easily implement
      // a basic LRU garbage collection strategy


      this.zipInstances.delete(p);
      this.limitOpenFiles(this.maxOpenFiles - 1);
      this.zipInstances.set(p, cachedZipFs);
      cachedZipFs.expiresAt = Date.now() + this.maxAge;
      cachedZipFs.refCount += 1;

      try {
        return await accept(cachedZipFs.zipFs);
      } finally {
        cachedZipFs.refCount -= 1;
      }
    } else {
      const zipFs = new ZipFS(p, await getZipOptions());

      try {
        return await accept(zipFs);
      } finally {
        zipFs.saveAndClose();
      }
    }
  }

  getZipSync(p, accept) {
    const getZipOptions = () => ({
      baseFs: this.baseFs,
      libzip: this.libzip,
      readOnly: this.readOnlyArchives,
      stats: this.baseFs.statSync(p)
    });

    if (this.zipInstances) {
      let cachedZipFs = this.zipInstances.get(p);

      if (!cachedZipFs) {
        cachedZipFs = {
          zipFs: new ZipFS(p, getZipOptions()),
          expiresAt: 0,
          refCount: 0
        };
      } // Removing then re-adding the field allows us to easily implement
      // a basic LRU garbage collection strategy


      this.zipInstances.delete(p);
      this.limitOpenFiles(this.maxOpenFiles - 1);
      this.zipInstances.set(p, cachedZipFs);
      cachedZipFs.expiresAt = Date.now() + this.maxAge;
      return accept(cachedZipFs.zipFs);
    } else {
      const zipFs = new ZipFS(p, getZipOptions());

      try {
        return accept(zipFs);
      } finally {
        zipFs.saveAndClose();
      }
    }
  }

}
// CONCATENATED MODULE: ../yarnpkg-libzip/sources/makeInterface.ts
const number64 = [`number`, `number`];
var Errors;

(function (Errors) {
  Errors[Errors["ZIP_ER_OK"] = 0] = "ZIP_ER_OK";
  Errors[Errors["ZIP_ER_MULTIDISK"] = 1] = "ZIP_ER_MULTIDISK";
  Errors[Errors["ZIP_ER_RENAME"] = 2] = "ZIP_ER_RENAME";
  Errors[Errors["ZIP_ER_CLOSE"] = 3] = "ZIP_ER_CLOSE";
  Errors[Errors["ZIP_ER_SEEK"] = 4] = "ZIP_ER_SEEK";
  Errors[Errors["ZIP_ER_READ"] = 5] = "ZIP_ER_READ";
  Errors[Errors["ZIP_ER_WRITE"] = 6] = "ZIP_ER_WRITE";
  Errors[Errors["ZIP_ER_CRC"] = 7] = "ZIP_ER_CRC";
  Errors[Errors["ZIP_ER_ZIPCLOSED"] = 8] = "ZIP_ER_ZIPCLOSED";
  Errors[Errors["ZIP_ER_NOENT"] = 9] = "ZIP_ER_NOENT";
  Errors[Errors["ZIP_ER_EXISTS"] = 10] = "ZIP_ER_EXISTS";
  Errors[Errors["ZIP_ER_OPEN"] = 11] = "ZIP_ER_OPEN";
  Errors[Errors["ZIP_ER_TMPOPEN"] = 12] = "ZIP_ER_TMPOPEN";
  Errors[Errors["ZIP_ER_ZLIB"] = 13] = "ZIP_ER_ZLIB";
  Errors[Errors["ZIP_ER_MEMORY"] = 14] = "ZIP_ER_MEMORY";
  Errors[Errors["ZIP_ER_CHANGED"] = 15] = "ZIP_ER_CHANGED";
  Errors[Errors["ZIP_ER_COMPNOTSUPP"] = 16] = "ZIP_ER_COMPNOTSUPP";
  Errors[Errors["ZIP_ER_EOF"] = 17] = "ZIP_ER_EOF";
  Errors[Errors["ZIP_ER_INVAL"] = 18] = "ZIP_ER_INVAL";
  Errors[Errors["ZIP_ER_NOZIP"] = 19] = "ZIP_ER_NOZIP";
  Errors[Errors["ZIP_ER_INTERNAL"] = 20] = "ZIP_ER_INTERNAL";
  Errors[Errors["ZIP_ER_INCONS"] = 21] = "ZIP_ER_INCONS";
  Errors[Errors["ZIP_ER_REMOVE"] = 22] = "ZIP_ER_REMOVE";
  Errors[Errors["ZIP_ER_DELETED"] = 23] = "ZIP_ER_DELETED";
  Errors[Errors["ZIP_ER_ENCRNOTSUPP"] = 24] = "ZIP_ER_ENCRNOTSUPP";
  Errors[Errors["ZIP_ER_RDONLY"] = 25] = "ZIP_ER_RDONLY";
  Errors[Errors["ZIP_ER_NOPASSWD"] = 26] = "ZIP_ER_NOPASSWD";
  Errors[Errors["ZIP_ER_WRONGPASSWD"] = 27] = "ZIP_ER_WRONGPASSWD";
  Errors[Errors["ZIP_ER_OPNOTSUPP"] = 28] = "ZIP_ER_OPNOTSUPP";
  Errors[Errors["ZIP_ER_INUSE"] = 29] = "ZIP_ER_INUSE";
  Errors[Errors["ZIP_ER_TELL"] = 30] = "ZIP_ER_TELL";
  Errors[Errors["ZIP_ER_COMPRESSED_DATA"] = 31] = "ZIP_ER_COMPRESSED_DATA";
})(Errors || (Errors = {}));

const makeInterface = libzip => ({
  // Those are getters because they can change after memory growth
  get HEAP8() {
    return libzip.HEAP8;
  },

  get HEAPU8() {
    return libzip.HEAPU8;
  },

  errors: Errors,
  SEEK_SET: 0,
  SEEK_CUR: 1,
  SEEK_END: 2,
  ZIP_CHECKCONS: 4,
  ZIP_CREATE: 1,
  ZIP_EXCL: 2,
  ZIP_TRUNCATE: 8,
  ZIP_RDONLY: 16,
  ZIP_FL_OVERWRITE: 8192,
  ZIP_FL_COMPRESSED: 4,
  ZIP_OPSYS_DOS: 0x00,
  ZIP_OPSYS_AMIGA: 0x01,
  ZIP_OPSYS_OPENVMS: 0x02,
  ZIP_OPSYS_UNIX: 0x03,
  ZIP_OPSYS_VM_CMS: 0x04,
  ZIP_OPSYS_ATARI_ST: 0x05,
  ZIP_OPSYS_OS_2: 0x06,
  ZIP_OPSYS_MACINTOSH: 0x07,
  ZIP_OPSYS_Z_SYSTEM: 0x08,
  ZIP_OPSYS_CPM: 0x09,
  ZIP_OPSYS_WINDOWS_NTFS: 0x0a,
  ZIP_OPSYS_MVS: 0x0b,
  ZIP_OPSYS_VSE: 0x0c,
  ZIP_OPSYS_ACORN_RISC: 0x0d,
  ZIP_OPSYS_VFAT: 0x0e,
  ZIP_OPSYS_ALTERNATE_MVS: 0x0f,
  ZIP_OPSYS_BEOS: 0x10,
  ZIP_OPSYS_TANDEM: 0x11,
  ZIP_OPSYS_OS_400: 0x12,
  ZIP_OPSYS_OS_X: 0x13,
  ZIP_CM_DEFAULT: -1,
  ZIP_CM_STORE: 0,
  ZIP_CM_DEFLATE: 8,
  uint08S: libzip._malloc(1),
  uint16S: libzip._malloc(2),
  uint32S: libzip._malloc(4),
  uint64S: libzip._malloc(8),
  malloc: libzip._malloc,
  free: libzip._free,
  getValue: libzip.getValue,
  open: libzip.cwrap(`zip_open`, `number`, [`string`, `number`, `number`]),
  openFromSource: libzip.cwrap(`zip_open_from_source`, `number`, [`number`, `number`, `number`]),
  close: libzip.cwrap(`zip_close`, `number`, [`number`]),
  discard: libzip.cwrap(`zip_discard`, null, [`number`]),
  getError: libzip.cwrap(`zip_get_error`, `number`, [`number`]),
  getName: libzip.cwrap(`zip_get_name`, `string`, [`number`, `number`, `number`]),
  getNumEntries: libzip.cwrap(`zip_get_num_entries`, `number`, [`number`, `number`]),
  delete: libzip.cwrap(`zip_delete`, `number`, [`number`, `number`]),
  stat: libzip.cwrap(`zip_stat`, `number`, [`number`, `string`, `number`, `number`]),
  statIndex: libzip.cwrap(`zip_stat_index`, `number`, [`number`, ...number64, `number`, `number`]),
  fopen: libzip.cwrap(`zip_fopen`, `number`, [`number`, `string`, `number`]),
  fopenIndex: libzip.cwrap(`zip_fopen_index`, `number`, [`number`, ...number64, `number`]),
  fread: libzip.cwrap(`zip_fread`, `number`, [`number`, `number`, `number`, `number`]),
  fclose: libzip.cwrap(`zip_fclose`, `number`, [`number`]),
  dir: {
    add: libzip.cwrap(`zip_dir_add`, `number`, [`number`, `string`])
  },
  file: {
    add: libzip.cwrap(`zip_file_add`, `number`, [`number`, `string`, `number`, `number`]),
    getError: libzip.cwrap(`zip_file_get_error`, `number`, [`number`]),
    getExternalAttributes: libzip.cwrap(`zip_file_get_external_attributes`, `number`, [`number`, ...number64, `number`, `number`, `number`]),
    setExternalAttributes: libzip.cwrap(`zip_file_set_external_attributes`, `number`, [`number`, ...number64, `number`, `number`, `number`]),
    setMtime: libzip.cwrap(`zip_file_set_mtime`, `number`, [`number`, ...number64, `number`, `number`]),
    setCompression: libzip.cwrap(`zip_set_file_compression`, `number`, [`number`, ...number64, `number`, `number`])
  },
  ext: {
    countSymlinks: libzip.cwrap(`zip_ext_count_symlinks`, `number`, [`number`])
  },
  error: {
    initWithCode: libzip.cwrap(`zip_error_init_with_code`, null, [`number`, `number`]),
    strerror: libzip.cwrap(`zip_error_strerror`, `string`, [`number`])
  },
  name: {
    locate: libzip.cwrap(`zip_name_locate`, `number`, [`number`, `string`, `number`])
  },
  source: {
    fromUnattachedBuffer: libzip.cwrap(`zip_source_buffer_create`, `number`, [`number`, `number`, `number`, `number`]),
    fromBuffer: libzip.cwrap(`zip_source_buffer`, `number`, [`number`, `number`, ...number64, `number`]),
    free: libzip.cwrap(`zip_source_free`, null, [`number`]),
    keep: libzip.cwrap(`zip_source_keep`, null, [`number`]),
    open: libzip.cwrap(`zip_source_open`, `number`, [`number`]),
    close: libzip.cwrap(`zip_source_close`, `number`, [`number`]),
    seek: libzip.cwrap(`zip_source_seek`, `number`, [`number`, ...number64, `number`]),
    tell: libzip.cwrap(`zip_source_tell`, `number`, [`number`]),
    read: libzip.cwrap(`zip_source_read`, `number`, [`number`, `number`, `number`]),
    error: libzip.cwrap(`zip_source_error`, `number`, [`number`]),
    setMtime: libzip.cwrap(`zip_source_set_mtime`, `number`, [`number`, `number`])
  },
  struct: {
    stat: libzip.cwrap(`zipstruct_stat`, `number`, []),
    statS: libzip.cwrap(`zipstruct_statS`, `number`, []),
    statName: libzip.cwrap(`zipstruct_stat_name`, `string`, [`number`]),
    statIndex: libzip.cwrap(`zipstruct_stat_index`, `number`, [`number`]),
    statSize: libzip.cwrap(`zipstruct_stat_size`, `number`, [`number`]),
    statCompSize: libzip.cwrap(`zipstruct_stat_comp_size`, `number`, [`number`]),
    statCompMethod: libzip.cwrap(`zipstruct_stat_comp_method`, `number`, [`number`]),
    statMtime: libzip.cwrap(`zipstruct_stat_mtime`, `number`, [`number`]),
    error: libzip.cwrap(`zipstruct_error`, `number`, []),
    errorS: libzip.cwrap(`zipstruct_errorS`, `number`, []),
    errorCodeZip: libzip.cwrap(`zipstruct_error_code_zip`, `number`, [`number`])
  }
});
// CONCATENATED MODULE: ../yarnpkg-libzip/sources/sync.ts

let mod = null;
function getLibzipSync() {
  if (mod === null) mod = makeInterface(__webpack_require__(368));
  return mod;
}
async function getLibzipPromise() {
  return getLibzipSync();
}
// EXTERNAL MODULE: external "module"
var external_module_ = __webpack_require__(282);
var external_module_default = /*#__PURE__*/__webpack_require__.n(external_module_);

// EXTERNAL MODULE: external "string_decoder"
var external_string_decoder_ = __webpack_require__(304);
var external_string_decoder_default = /*#__PURE__*/__webpack_require__.n(external_string_decoder_);

// EXTERNAL MODULE: external "os"
var external_os_ = __webpack_require__(87);
var external_os_default = /*#__PURE__*/__webpack_require__.n(external_os_);

// CONCATENATED MODULE: ../yarnpkg-fslib/sources/index.ts























function getTempName(prefix) {
  const tmpdir = sources_path/* npath.toPortablePath */.cS.toPortablePath(external_os_default().tmpdir());
  const hash = Math.ceil(Math.random() * 0x100000000).toString(16).padStart(8, `0`);
  return sources_path/* ppath.join */.y1.join(tmpdir, `${prefix}${hash}`);
}

function patchFs(patchedFs, fakeFs) {
  const SYNC_IMPLEMENTATIONS = new Set([`accessSync`, `appendFileSync`, `createReadStream`, `chmodSync`, `chownSync`, `closeSync`, `copyFileSync`, `linkSync`, `lstatSync`, `lutimesSync`, `mkdirSync`, `openSync`, `readSync`, `readlinkSync`, `readFileSync`, `readdirSync`, `readlinkSync`, `realpathSync`, `renameSync`, `rmdirSync`, `statSync`, `symlinkSync`, `truncateSync`, `unlinkSync`, `unwatchFile`, `utimesSync`, `watch`, `watchFile`, `writeFileSync`, `writeSync`]);
  const ASYNC_IMPLEMENTATIONS = new Set([`accessPromise`, `appendFilePromise`, `chmodPromise`, `chownPromise`, `closePromise`, `copyFilePromise`, `linkPromise`, `lstatPromise`, `lutimesPromise`, `mkdirPromise`, `openPromise`, `readdirPromise`, `realpathPromise`, `readFilePromise`, `readdirPromise`, `readlinkPromise`, `renamePromise`, `rmdirPromise`, `statPromise`, `symlinkPromise`, `truncatePromise`, `unlinkPromise`, `utimesPromise`, `writeFilePromise`, `writeSync`]);
  const FILEHANDLE_IMPLEMENTATIONS = new Set([`appendFilePromise`, `chmodPromise`, `chownPromise`, `closePromise`, `readPromise`, `readFilePromise`, `statPromise`, `truncatePromise`, `utimesPromise`, `writePromise`, `writeFilePromise`]);

  const setupFn = (target, name, replacement) => {
    const orig = target[name];
    target[name] = replacement;

    if (typeof (orig === null || orig === void 0 ? void 0 : orig[external_util_.promisify.custom]) !== `undefined`) {
      replacement[external_util_.promisify.custom] = orig[external_util_.promisify.custom];
    }
  };
  /** Callback implementations */


  {
    setupFn(patchedFs, `exists`, (p, ...args) => {
      const hasCallback = typeof args[args.length - 1] === `function`;
      const callback = hasCallback ? args.pop() : () => {};
      process.nextTick(() => {
        fakeFs.existsPromise(p).then(exists => {
          callback(exists);
        }, () => {
          callback(false);
        });
      });
    });
    setupFn(patchedFs, `read`, (p, buffer, ...args) => {
      const hasCallback = typeof args[args.length - 1] === `function`;
      const callback = hasCallback ? args.pop() : () => {};
      process.nextTick(() => {
        fakeFs.readPromise(p, buffer, ...args).then(bytesRead => {
          callback(null, bytesRead, buffer);
        }, error => {
          callback(error);
        });
      });
    });

    for (const fnName of ASYNC_IMPLEMENTATIONS) {
      const origName = fnName.replace(/Promise$/, ``);
      if (typeof patchedFs[origName] === `undefined`) continue;
      const fakeImpl = fakeFs[fnName];
      if (typeof fakeImpl === `undefined`) continue;

      const wrapper = (...args) => {
        const hasCallback = typeof args[args.length - 1] === `function`;
        const callback = hasCallback ? args.pop() : () => {};
        process.nextTick(() => {
          fakeImpl.apply(fakeFs, args).then(result => {
            callback(null, result);
          }, error => {
            callback(error);
          });
        });
      };

      setupFn(patchedFs, origName, wrapper);
    }

    patchedFs.realpath.native = patchedFs.realpath;
  }
  /** Sync implementations */

  {
    setupFn(patchedFs, `existsSync`, p => {
      try {
        return fakeFs.existsSync(p);
      } catch (error) {
        return false;
      }
    });

    for (const fnName of SYNC_IMPLEMENTATIONS) {
      const origName = fnName;
      if (typeof patchedFs[origName] === `undefined`) continue;
      const fakeImpl = fakeFs[fnName];
      if (typeof fakeImpl === `undefined`) continue;
      setupFn(patchedFs, origName, fakeImpl.bind(fakeFs));
    }

    patchedFs.realpathSync.native = patchedFs.realpathSync;
  }
  /** Promise implementations */

  {
    // `fs.promises` is a getter that returns a reference to require(`fs/promises`),
    // so we can just patch `fs.promises` and both will be updated
    const origEmitWarning = process.emitWarning;

    process.emitWarning = () => {};

    let patchedFsPromises;

    try {
      patchedFsPromises = patchedFs.promises;
    } finally {
      process.emitWarning = origEmitWarning;
    }

    if (typeof patchedFsPromises !== `undefined`) {
      // `fs.promises.exists` doesn't exist
      for (const fnName of ASYNC_IMPLEMENTATIONS) {
        const origName = fnName.replace(/Promise$/, ``);
        if (typeof patchedFsPromises[origName] === `undefined`) continue;
        const fakeImpl = fakeFs[fnName];
        if (typeof fakeImpl === `undefined`) continue; // Open is a bit particular with fs.promises: it returns a file handle
        // instance instead of the traditional file descriptor number

        if (fnName === `open`) continue;
        setupFn(patchedFsPromises, origName, fakeImpl.bind(fakeFs));
      }

      class FileHandle {
        constructor(fd) {
          this.fd = fd;
        }

      }

      for (const fnName of FILEHANDLE_IMPLEMENTATIONS) {
        const origName = fnName.replace(/Promise$/, ``);
        const fakeImpl = fakeFs[fnName];
        if (typeof fakeImpl === `undefined`) continue;
        setupFn(FileHandle.prototype, origName, function (...args) {
          return fakeImpl.call(fakeFs, this.fd, ...args);
        });
      }

      setupFn(patchedFsPromises, `open`, async (...args) => {
        // @ts-expect-error
        const fd = await fakeFs.openPromise(...args);
        return new FileHandle(fd);
      }); // `fs.promises.realpath` doesn't have a `native` property
    }
  }
}
function extendFs(realFs, fakeFs) {
  const patchedFs = Object.create(realFs);
  patchFs(patchedFs, fakeFs);
  return patchedFs;
}
const tmpdirs = new Set();
let cleanExitRegistered = false;

function registerCleanExit() {
  if (cleanExitRegistered) return;
  cleanExitRegistered = true;
  process.once(`exit`, () => {
    xfs.rmtempSync();
  });
}

const xfs = Object.assign(new NodeFS(), {
  detachTemp(p) {
    tmpdirs.delete(p);
  },

  mktempSync(cb) {
    registerCleanExit();

    while (true) {
      const p = getTempName(`xfs-`);

      try {
        this.mkdirSync(p);
      } catch (error) {
        if (error.code === `EEXIST`) {
          continue;
        } else {
          throw error;
        }
      }

      const realP = this.realpathSync(p);
      tmpdirs.add(realP);

      if (typeof cb !== `undefined`) {
        try {
          return cb(realP);
        } finally {
          if (tmpdirs.has(realP)) {
            tmpdirs.delete(realP);

            try {
              this.removeSync(realP);
            } catch (_a) {// Too bad if there's an error
            }
          }
        }
      } else {
        return p;
      }
    }
  },

  async mktempPromise(cb) {
    registerCleanExit();

    while (true) {
      const p = getTempName(`xfs-`);

      try {
        await this.mkdirPromise(p);
      } catch (error) {
        if (error.code === `EEXIST`) {
          continue;
        } else {
          throw error;
        }
      }

      const realP = await this.realpathPromise(p);
      tmpdirs.add(realP);

      if (typeof cb !== `undefined`) {
        try {
          return await cb(realP);
        } finally {
          if (tmpdirs.has(realP)) {
            tmpdirs.delete(realP);

            try {
              await this.removePromise(realP);
            } catch (_a) {// Too bad if there's an error
            }
          }
        }
      } else {
        return realP;
      }
    }
  },

  async rmtempPromise() {
    await Promise.all(Array.from(tmpdirs.values()).map(async p => {
      try {
        await xfs.removePromise(p, {
          maxRetries: 0
        });
        tmpdirs.delete(p);
      } catch (_a) {// Too bad if there's an error
      }
    }));
  },

  rmtempSync() {
    for (const p of tmpdirs) {
      try {
        xfs.removeSync(p);
        tmpdirs.delete(p);
      } catch (_a) {// Too bad if there's an error
      }
    }
  }

});
// CONCATENATED MODULE: ../yarnpkg-fslib/sources/PosixFS.ts


class PosixFS extends ProxiedFS {
  constructor(baseFs) {
    super(sources_path/* npath */.cS);
    this.baseFs = baseFs;
  }

  mapFromBase(path) {
    return sources_path/* npath.fromPortablePath */.cS.fromPortablePath(path);
  }

  mapToBase(path) {
    return sources_path/* npath.toPortablePath */.cS.toPortablePath(path);
  }

}
// EXTERNAL MODULE: external "url"
var external_url_ = __webpack_require__(835);

// CONCATENATED MODULE: ./sources/loader/internalTools.ts

var ErrorCode;

(function (ErrorCode) {
  ErrorCode["API_ERROR"] = "API_ERROR";
  ErrorCode["BLACKLISTED"] = "BLACKLISTED";
  ErrorCode["BUILTIN_NODE_RESOLUTION_FAILED"] = "BUILTIN_NODE_RESOLUTION_FAILED";
  ErrorCode["MISSING_DEPENDENCY"] = "MISSING_DEPENDENCY";
  ErrorCode["MISSING_PEER_DEPENDENCY"] = "MISSING_PEER_DEPENDENCY";
  ErrorCode["QUALIFIED_PATH_RESOLUTION_FAILED"] = "QUALIFIED_PATH_RESOLUTION_FAILED";
  ErrorCode["INTERNAL"] = "INTERNAL";
  ErrorCode["UNDECLARED_DEPENDENCY"] = "UNDECLARED_DEPENDENCY";
  ErrorCode["UNSUPPORTED"] = "UNSUPPORTED";
})(ErrorCode || (ErrorCode = {})); // Some errors are exposed as MODULE_NOT_FOUND for compatibility with packages
// that expect this umbrella error when the resolution fails


const MODULE_NOT_FOUND_ERRORS = new Set([ErrorCode.BLACKLISTED, ErrorCode.BUILTIN_NODE_RESOLUTION_FAILED, ErrorCode.MISSING_DEPENDENCY, ErrorCode.MISSING_PEER_DEPENDENCY, ErrorCode.QUALIFIED_PATH_RESOLUTION_FAILED, ErrorCode.UNDECLARED_DEPENDENCY]);
/**
 * Simple helper function that assign an error code to an error, so that it can more easily be caught and used
 * by third-parties.
 */

function internalTools_makeError(pnpCode, message, data = {}) {
  const code = MODULE_NOT_FOUND_ERRORS.has(pnpCode) ? `MODULE_NOT_FOUND` : pnpCode;
  const propertySpec = {
    configurable: true,
    writable: true,
    enumerable: false
  };
  return Object.defineProperties(new Error(message), {
    code: { ...propertySpec,
      value: code
    },
    pnpCode: { ...propertySpec,
      value: pnpCode
    },
    data: { ...propertySpec,
      value: data
    }
  });
}
/**
 * Returns the module that should be used to resolve require calls. It's usually the direct parent, except if we're
 * inside an eval expression.
 */

function getIssuerModule(parent) {
  let issuer = parent;

  while (issuer && (issuer.id === `[eval]` || issuer.id === `<repl>` || !issuer.filename)) issuer = issuer.parent;

  return issuer || null;
}
function getPathForDisplay(p) {
  return sources_path/* npath.normalize */.cS.normalize(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(p));
}
// CONCATENATED MODULE: ./sources/loader/applyPatch.ts





function applyPatch(pnpapi, opts) {
  // @ts-expect-error
  const builtinModules = new Set(external_module_.Module.builtinModules || Object.keys(process.binding(`natives`)));
  /**
   * The cache that will be used for all accesses occuring outside of a PnP context.
   */

  const defaultCache = {};
  /**
   * Used to disable the resolution hooks (for when we want to fallback to the previous resolution - we then need
   * a way to "reset" the environment temporarily)
   */

  let enableNativeHooks = true; // @ts-expect-error

  process.versions.pnp = String(pnpapi.VERSIONS.std);

  const moduleExports = __webpack_require__(282);

  moduleExports.findPnpApi = lookupSource => {
    const lookupPath = lookupSource instanceof external_url_.URL ? (0,external_url_.fileURLToPath)(lookupSource) : lookupSource;
    const apiPath = opts.manager.findApiPathFor(lookupPath);
    if (apiPath === null) return null;
    const apiEntry = opts.manager.getApiEntry(apiPath, true);
    return apiEntry.instance;
  };

  function getRequireStack(parent) {
    const requireStack = [];

    for (let cursor = parent; cursor; cursor = cursor.parent) requireStack.push(cursor.filename || cursor.id);

    return requireStack;
  } // A small note: we don't replace the cache here (and instead use the native one). This is an effort to not
  // break code similar to "delete require.cache[require.resolve(FOO)]", where FOO is a package located outside
  // of the Yarn dependency tree. In this case, we defer the load to the native loader. If we were to replace the
  // cache by our own, the native loader would populate its own cache, which wouldn't be exposed anymore, so the
  // delete call would be broken.


  const originalModuleLoad = external_module_.Module._load;

  external_module_.Module._load = function (request, parent, isMain) {
    if (!enableNativeHooks) return originalModuleLoad.call(external_module_.Module, request, parent, isMain); // Builtins are managed by the regular Node loader

    if (builtinModules.has(request)) {
      try {
        enableNativeHooks = false;
        return originalModuleLoad.call(external_module_.Module, request, parent, isMain);
      } finally {
        enableNativeHooks = true;
      }
    }

    const parentApiPath = opts.manager.getApiPathFromParent(parent);
    const parentApi = parentApiPath !== null ? opts.manager.getApiEntry(parentApiPath, true).instance : null; // Requests that aren't covered by the PnP runtime goes through the
    // parent `_load` implementation. This is required for VSCode, for example,
    // which override `_load` to provide additional builtins to its extensions.

    if (parentApi === null) return originalModuleLoad(request, parent, isMain); // The 'pnpapi' name is reserved to return the PnP api currently in use
    // by the program

    if (request === `pnpapi`) return parentApi; // Request `Module._resolveFilename` (ie. `resolveRequest`) to tell us
    // which file we should load

    const modulePath = external_module_.Module._resolveFilename(request, parent, isMain); // We check whether the module is owned by the dependency tree of the
    // module that required it. If it isn't, then we need to create a new
    // store and possibly load its sandboxed PnP runtime.


    const isOwnedByRuntime = parentApi !== null ? parentApi.findPackageLocator(modulePath) !== null : false;
    const moduleApiPath = isOwnedByRuntime ? parentApiPath : opts.manager.findApiPathFor(sources_path/* npath.dirname */.cS.dirname(modulePath));
    const entry = moduleApiPath !== null ? opts.manager.getApiEntry(moduleApiPath) : {
      instance: null,
      cache: defaultCache
    }; // Check if the module has already been created for the given file

    const cacheEntry = entry.cache[modulePath];
    if (cacheEntry) return cacheEntry.exports; // Create a new module and store it into the cache
    // @ts-expect-error

    const module = new external_module_.Module(modulePath, parent); // @ts-expect-error

    module.pnpApiPath = moduleApiPath;
    entry.cache[modulePath] = module; // The main module is exposed as global variable

    if (isMain) {
      process.mainModule = module;
      module.id = `.`;
    } // Try to load the module, and remove it from the cache if it fails


    let hasThrown = true;

    try {
      // @ts-expect-error
      module.load(modulePath);
      hasThrown = false;
    } finally {
      if (hasThrown) {
        delete external_module_.Module._cache[modulePath];
      }
    }

    return module.exports;
  };

  function getIssuerSpecsFromPaths(paths) {
    return paths.map(path => ({
      apiPath: opts.manager.findApiPathFor(path),
      path,
      module: null
    }));
  }

  function getIssuerSpecsFromModule(module) {
    const issuer = getIssuerModule(module);
    const issuerPath = issuer !== null ? sources_path/* npath.dirname */.cS.dirname(issuer.filename) : process.cwd();
    return [{
      apiPath: opts.manager.getApiPathFromParent(issuer),
      path: issuerPath,
      module
    }];
  }

  function makeFakeParent(path) {
    const fakeParent = new external_module_.Module(``);
    const fakeFilePath = sources_path/* npath.join */.cS.join(path, `[file]`);
    fakeParent.paths = external_module_.Module._nodeModulePaths(fakeFilePath);
    return fakeParent;
  } // Splits a require request into its components, or return null if the request is a file path


  const pathRegExp = /^(?![a-zA-Z]:[\\/]|\\\\|\.{0,2}(?:\/|$))((?:@[^/]+\/)?[^/]+)\/*(.*|)$/;
  const originalModuleResolveFilename = external_module_.Module._resolveFilename;

  external_module_.Module._resolveFilename = function (request, parent, isMain, options) {
    if (builtinModules.has(request)) return request;
    if (!enableNativeHooks) return originalModuleResolveFilename.call(external_module_.Module, request, parent, isMain, options);

    if (options && options.plugnplay === false) {
      const {
        plugnplay,
        ...rest
      } = options; // Workaround a bug present in some version of Node (now fixed)
      // https://github.com/nodejs/node/pull/28078

      const forwardedOptions = Object.keys(rest).length > 0 ? rest : undefined;

      try {
        enableNativeHooks = false;
        return originalModuleResolveFilename.call(external_module_.Module, request, parent, isMain, forwardedOptions);
      } finally {
        enableNativeHooks = true;
      }
    } // We check that all the options present here are supported; better
    // to fail fast than to introduce subtle bugs in the runtime.


    if (options) {
      const optionNames = new Set(Object.keys(options));
      optionNames.delete(`paths`);
      optionNames.delete(`plugnplay`);

      if (optionNames.size > 0) {
        throw internalTools_makeError(ErrorCode.UNSUPPORTED, `Some options passed to require() aren't supported by PnP yet (${Array.from(optionNames).join(`, `)})`);
      }
    }

    const issuerSpecs = options && options.paths ? getIssuerSpecsFromPaths(options.paths) : getIssuerSpecsFromModule(parent);

    if (request.match(pathRegExp) === null) {
      const parentDirectory = (parent === null || parent === void 0 ? void 0 : parent.filename) != null ? sources_path/* npath.dirname */.cS.dirname(parent.filename) : null;
      const absoluteRequest = sources_path/* npath.isAbsolute */.cS.isAbsolute(request) ? request : parentDirectory !== null ? sources_path/* npath.resolve */.cS.resolve(parentDirectory, request) : null;

      if (absoluteRequest !== null) {
        const apiPath = parentDirectory === sources_path/* npath.dirname */.cS.dirname(absoluteRequest) && (parent === null || parent === void 0 ? void 0 : parent.pnpApiPath) ? parent.pnpApiPath : opts.manager.findApiPathFor(absoluteRequest);

        if (apiPath !== null) {
          issuerSpecs.unshift({
            apiPath,
            path: parentDirectory,
            module: null
          });
        }
      }
    }

    let firstError;

    for (const {
      apiPath,
      path,
      module
    } of issuerSpecs) {
      let resolution;
      const issuerApi = apiPath !== null ? opts.manager.getApiEntry(apiPath, true).instance : null;

      try {
        if (issuerApi !== null) {
          resolution = issuerApi.resolveRequest(request, path !== null ? `${path}/` : null);
        } else {
          if (path === null) throw new Error(`Assertion failed: Expected the path to be set`);
          resolution = originalModuleResolveFilename.call(external_module_.Module, request, module || makeFakeParent(path), isMain);
        }
      } catch (error) {
        firstError = firstError || error;
        continue;
      }

      if (resolution !== null) {
        return resolution;
      }
    }

    const requireStack = getRequireStack(parent);
    Object.defineProperty(firstError, `requireStack`, {
      configurable: true,
      writable: true,
      enumerable: false,
      value: requireStack
    });
    if (requireStack.length > 0) firstError.message += `\nRequire stack:\n- ${requireStack.join(`\n- `)}`;
    throw firstError;
  };

  const originalFindPath = external_module_.Module._findPath;

  external_module_.Module._findPath = function (request, paths, isMain) {
    if (request === `pnpapi`) return false;
    if (!enableNativeHooks) return originalFindPath.call(external_module_.Module, request, paths, isMain);

    for (const path of paths || []) {
      let resolution;

      try {
        const pnpApiPath = opts.manager.findApiPathFor(path);

        if (pnpApiPath !== null) {
          const api = opts.manager.getApiEntry(pnpApiPath, true).instance;
          resolution = api.resolveRequest(request, path) || false;
        } else {
          resolution = originalFindPath.call(external_module_.Module, request, [path], isMain);
        }
      } catch (error) {
        continue;
      }

      if (resolution) {
        return resolution;
      }
    }

    return false;
  };

  patchFs((external_fs_default()), new PosixFS(opts.fakeFs));
}
// CONCATENATED MODULE: ./sources/loader/hydrateRuntimeState.ts

function hydrateRuntimeState(data, {
  basePath
}) {
  const portablePath = sources_path/* npath.toPortablePath */.cS.toPortablePath(basePath);
  const absolutePortablePath = sources_path/* ppath.resolve */.y1.resolve(portablePath);
  const ignorePattern = data.ignorePatternData !== null ? new RegExp(data.ignorePatternData) : null;
  const packageRegistry = new Map(data.packageRegistryData.map(([packageName, packageStoreData]) => {
    return [packageName, new Map(packageStoreData.map(([packageReference, packageInformationData]) => {
      return [packageReference, {
        // We use ppath.join instead of ppath.resolve because:
        // 1) packageInformationData.packageLocation is a relative path when part of the SerializedState
        // 2) ppath.join preserves trailing slashes
        packageLocation: sources_path/* ppath.join */.y1.join(absolutePortablePath, packageInformationData.packageLocation),
        packageDependencies: new Map(packageInformationData.packageDependencies),
        packagePeers: new Set(packageInformationData.packagePeers),
        linkType: packageInformationData.linkType,
        discardFromLookup: packageInformationData.discardFromLookup || false
      }];
    }))];
  }));
  const packageLocatorsByLocations = new Map();
  const packageLocationLengths = new Set();

  for (const [packageName, storeData] of data.packageRegistryData) {
    for (const [packageReference, packageInformationData] of storeData) {
      if (packageName === null !== (packageReference === null)) throw new Error(`Assertion failed: The name and reference should be null, or neither should`);
      if (packageInformationData.discardFromLookup) continue; // @ts-expect-error: TypeScript isn't smart enough to understand the type assertion

      const packageLocator = {
        name: packageName,
        reference: packageReference
      };
      packageLocatorsByLocations.set(packageInformationData.packageLocation, packageLocator);
      packageLocationLengths.add(packageInformationData.packageLocation.length);
    }
  }

  for (const location of data.locationBlacklistData) packageLocatorsByLocations.set(location, null);

  const fallbackExclusionList = new Map(data.fallbackExclusionList.map(([packageName, packageReferences]) => {
    return [packageName, new Set(packageReferences)];
  }));
  const fallbackPool = new Map(data.fallbackPool);
  const dependencyTreeRoots = data.dependencyTreeRoots;
  const enableTopLevelFallback = data.enableTopLevelFallback;
  return {
    basePath: portablePath,
    dependencyTreeRoots,
    enableTopLevelFallback,
    fallbackExclusionList,
    fallbackPool,
    ignorePattern,
    packageLocationLengths: [...packageLocationLengths].sort((a, b) => b - a),
    packageLocatorsByLocations,
    packageRegistry
  };
}
// CONCATENATED MODULE: ./sources/loader/makeApi.ts




function makeApi(runtimeState, opts) {
  const alwaysWarnOnFallback = Number(process.env.PNP_ALWAYS_WARN_ON_FALLBACK) > 0;
  const debugLevel = Number(process.env.PNP_DEBUG_LEVEL); // @ts-expect-error

  const builtinModules = new Set(external_module_.Module.builtinModules || Object.keys(process.binding(`natives`))); // Splits a require request into its components, or return null if the request is a file path

  const pathRegExp = /^(?![a-zA-Z]:[\\/]|\\\\|\.{0,2}(?:\/|$))((?:@[^/]+\/)?[^/]+)\/*(.*|)$/; // Matches if the path starts with a valid path qualifier (./, ../, /)
  // eslint-disable-next-line no-unused-vars

  const isStrictRegExp = /^\.{0,2}\//; // Matches if the path must point to a directory (ie ends with /)

  const isDirRegExp = /\/$/; // We only instantiate one of those so that we can use strict-equal comparisons

  const topLevelLocator = {
    name: null,
    reference: null
  }; // Used for compatibility purposes - cf setupCompatibilityLayer

  const fallbackLocators = []; // To avoid emitting the same warning multiple times

  const emittedWarnings = new Set();
  if (runtimeState.enableTopLevelFallback === true) fallbackLocators.push(topLevelLocator);

  if (opts.compatibilityMode !== false) {
    // ESLint currently doesn't have any portable way for shared configs to
    // specify their own plugins that should be used (cf issue #10125). This
    // will likely get fixed at some point but it'll take time, so in the
    // meantime we'll just add additional fallback entries for common shared
    // configs.
    // Similarly, Gatsby generates files within the `public` folder located
    // within the project, but doesn't pre-resolve the `require` calls to use
    // its own dependencies. Meaning that when PnP see a file from the `public`
    // folder making a require, it thinks that your project forgot to list one
    // of your dependencies.
    for (const name of [`react-scripts`, `gatsby`]) {
      const packageStore = runtimeState.packageRegistry.get(name);

      if (packageStore) {
        for (const reference of packageStore.keys()) {
          if (reference === null) {
            throw new Error(`Assertion failed: This reference shouldn't be null`);
          } else {
            fallbackLocators.push({
              name,
              reference
            });
          }
        }
      }
    }
  }
  /**
   * The setup code will be injected here. The tables listed below are guaranteed to be filled after the call to
   * the $$DYNAMICALLY_GENERATED_CODE function.
   */


  const {
    ignorePattern,
    packageRegistry,
    packageLocatorsByLocations,
    packageLocationLengths
  } = runtimeState;
  /**
   * Allows to print useful logs just be setting a value in the environment
   */

  function makeLogEntry(name, args) {
    return {
      fn: name,
      args,
      error: null,
      result: null
    };
  }

  function maybeLog(name, fn) {
    if (opts.allowDebug === false) return fn;

    if (Number.isFinite(debugLevel)) {
      if (debugLevel >= 2) {
        return (...args) => {
          const logEntry = makeLogEntry(name, args);

          try {
            return logEntry.result = fn(...args);
          } catch (error) {
            throw logEntry.error = error;
          } finally {
            console.trace(logEntry);
          }
        };
      } else if (debugLevel >= 1) {
        return (...args) => {
          try {
            return fn(...args);
          } catch (error) {
            const logEntry = makeLogEntry(name, args);
            logEntry.error = error;
            console.trace(logEntry);
            throw error;
          }
        };
      }
    }

    return fn;
  }
  /**
   * Returns information about a package in a safe way (will throw if they cannot be retrieved)
   */


  function getPackageInformationSafe(packageLocator) {
    const packageInformation = getPackageInformation(packageLocator);

    if (!packageInformation) {
      throw internalTools_makeError(ErrorCode.INTERNAL, `Couldn't find a matching entry in the dependency tree for the specified parent (this is probably an internal error)`);
    }

    return packageInformation;
  }
  /**
   * Returns whether the specified locator is a dependency tree root (in which case it's part of the project) or not
   */


  function isDependencyTreeRoot(packageLocator) {
    if (packageLocator.name === null) return true;

    for (const dependencyTreeRoot of runtimeState.dependencyTreeRoots) if (dependencyTreeRoot.name === packageLocator.name && dependencyTreeRoot.reference === packageLocator.reference) return true;

    return false;
  }
  /**
   * Implements the node resolution for folder access and extension selection
   */


  function applyNodeExtensionResolution(unqualifiedPath, candidates, {
    extensions
  }) {
    let stat;

    try {
      candidates.push(unqualifiedPath);
      stat = opts.fakeFs.statSync(unqualifiedPath);
    } catch (error) {} // If the file exists and is a file, we can stop right there


    if (stat && !stat.isDirectory()) return opts.fakeFs.realpathSync(unqualifiedPath); // If the file is a directory, we must check if it contains a package.json with a "main" entry

    if (stat && stat.isDirectory()) {
      let pkgJson;

      try {
        pkgJson = JSON.parse(opts.fakeFs.readFileSync(sources_path/* ppath.join */.y1.join(unqualifiedPath, `package.json`), `utf8`));
      } catch (error) {}

      let nextUnqualifiedPath;
      if (pkgJson && pkgJson.main) nextUnqualifiedPath = sources_path/* ppath.resolve */.y1.resolve(unqualifiedPath, pkgJson.main); // If the "main" field changed the path, we start again from this new location

      if (nextUnqualifiedPath && nextUnqualifiedPath !== unqualifiedPath) {
        const resolution = applyNodeExtensionResolution(nextUnqualifiedPath, candidates, {
          extensions
        });

        if (resolution !== null) {
          return resolution;
        }
      }
    } // Otherwise we check if we find a file that match one of the supported extensions


    for (let i = 0, length = extensions.length; i < length; i++) {
      const candidateFile = `${unqualifiedPath}${extensions[i]}`;
      candidates.push(candidateFile);

      if (opts.fakeFs.existsSync(candidateFile)) {
        return candidateFile;
      }
    } // Otherwise, we check if the path is a folder - in such a case, we try to use its index


    if (stat && stat.isDirectory()) {
      for (let i = 0, length = extensions.length; i < length; i++) {
        const candidateFile = sources_path/* ppath.format */.y1.format({
          dir: unqualifiedPath,
          name: `index`,
          ext: extensions[i]
        });
        candidates.push(candidateFile);

        if (opts.fakeFs.existsSync(candidateFile)) {
          return candidateFile;
        }
      }
    } // Otherwise there's nothing else we can do :(


    return null;
  }
  /**
   * This function creates fake modules that can be used with the _resolveFilename function.
   * Ideally it would be nice to be able to avoid this, since it causes useless allocations
   * and cannot be cached efficiently (we recompute the nodeModulePaths every time).
   *
   * Fortunately, this should only affect the fallback, and there hopefully shouldn't have a
   * lot of them.
   */


  function makeFakeModule(path) {
    // @ts-expect-error
    const fakeModule = new external_module_.Module(path, null);
    fakeModule.filename = path;
    fakeModule.paths = external_module_.Module._nodeModulePaths(path);
    return fakeModule;
  }
  /**
   * Normalize path to posix format.
   */


  function normalizePath(p) {
    return sources_path/* npath.toPortablePath */.cS.toPortablePath(p);
  }
  /**
   * Forward the resolution to the next resolver (usually the native one)
   */


  function callNativeResolution(request, issuer) {
    if (issuer.endsWith(`/`)) issuer = sources_path/* ppath.join */.y1.join(issuer, `internal.js`); // Since we would need to create a fake module anyway (to call _resolveLookupPath that
    // would give us the paths to give to _resolveFilename), we can as well not use
    // the {paths} option at all, since it internally makes _resolveFilename create another
    // fake module anyway.

    return external_module_.Module._resolveFilename(request, makeFakeModule(sources_path/* npath.fromPortablePath */.cS.fromPortablePath(issuer)), false, {
      plugnplay: false
    });
  }
  /**
   *
   */


  function isPathIgnored(path) {
    if (ignorePattern === null) return false;
    const subPath = sources_path/* ppath.contains */.y1.contains(runtimeState.basePath, path);
    if (subPath === null) return false;

    if (ignorePattern.test(subPath.replace(/\/$/, ``))) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * This key indicates which version of the standard is implemented by this resolver. The `std` key is the
   * Plug'n'Play standard, and any other key are third-party extensions. Third-party extensions are not allowed
   * to override the standard, and can only offer new methods.
   *
   * If a new version of the Plug'n'Play standard is released and some extensions conflict with newly added
   * functions, they'll just have to fix the conflicts and bump their own version number.
   */


  const VERSIONS = {
    std: 3,
    resolveVirtual: 1
  };
  /**
   * We export a special symbol for easy access to the top level locator.
   */

  const topLevel = topLevelLocator;
  /**
   * Gets the package information for a given locator. Returns null if they cannot be retrieved.
   */

  function getPackageInformation({
    name,
    reference
  }) {
    const packageInformationStore = packageRegistry.get(name);
    if (!packageInformationStore) return null;
    const packageInformation = packageInformationStore.get(reference);
    if (!packageInformation) return null;
    return packageInformation;
  }
  /**
   * Find all packages that depend on the specified one.
   *
   * Note: This is a private function; we expect consumers to implement it
   * themselves. We keep it that way because this implementation isn't
   * optimized at all, since we only need it when printing errors.
   */


  function findPackageDependents({
    name,
    reference
  }) {
    const dependents = [];

    for (const [dependentName, packageInformationStore] of packageRegistry) {
      if (dependentName === null) continue;

      for (const [dependentReference, packageInformation] of packageInformationStore) {
        if (dependentReference === null) continue;
        const dependencyReference = packageInformation.packageDependencies.get(name);
        if (dependencyReference !== reference) continue; // Don't forget that all packages depend on themselves

        if (dependentName === name && dependentReference === reference) continue;
        dependents.push({
          name: dependentName,
          reference: dependentReference
        });
      }
    }

    return dependents;
  }
  /**
   * Find all packages that broke the peer dependency on X, starting from Y.
   *
   * Note: This is a private function; we expect consumers to implement it
   * themselves. We keep it that way because this implementation isn't
   * optimized at all, since we only need it when printing errors.
   */


  function findBrokenPeerDependencies(dependency, initialPackage) {
    const brokenPackages = new Map();
    const alreadyVisited = new Set();

    const traversal = currentPackage => {
      const identifier = JSON.stringify(currentPackage.name);
      if (alreadyVisited.has(identifier)) return;
      alreadyVisited.add(identifier);
      const dependents = findPackageDependents(currentPackage);

      for (const dependent of dependents) {
        const dependentInformation = getPackageInformationSafe(dependent);

        if (dependentInformation.packagePeers.has(dependency)) {
          traversal(dependent);
        } else {
          let brokenSet = brokenPackages.get(dependent.name);
          if (typeof brokenSet === `undefined`) brokenPackages.set(dependent.name, brokenSet = new Set());
          brokenSet.add(dependent.reference);
        }
      }
    };

    traversal(initialPackage);
    const brokenList = [];

    for (const name of [...brokenPackages.keys()].sort()) for (const reference of [...brokenPackages.get(name)].sort()) brokenList.push({
      name,
      reference
    });

    return brokenList;
  }
  /**
   * Finds the package locator that owns the specified path. If none is found, returns null instead.
   */


  function findPackageLocator(location) {
    let relativeLocation = normalizePath(sources_path/* ppath.relative */.y1.relative(runtimeState.basePath, location));
    if (!relativeLocation.match(isStrictRegExp)) relativeLocation = `./${relativeLocation}`;
    if (location.match(isDirRegExp) && !relativeLocation.endsWith(`/`)) relativeLocation = `${relativeLocation}/`;
    let from = 0; // If someone wants to use a binary search to go from O(n) to O(log n), be my guest

    while (from < packageLocationLengths.length && packageLocationLengths[from] > relativeLocation.length) from += 1;

    for (let t = from; t < packageLocationLengths.length; ++t) {
      const locator = packageLocatorsByLocations.get(relativeLocation.substr(0, packageLocationLengths[t]));
      if (typeof locator === `undefined`) continue; // Ensures that the returned locator isn't a blacklisted one.
      //
      // Blacklisted packages are packages that cannot be used because their dependencies cannot be deduced. This only
      // happens with peer dependencies, which effectively have different sets of dependencies depending on their
      // parents.
      //
      // In order to deambiguate those different sets of dependencies, the Yarn implementation of PnP will generate a
      // symlink for each combination of <package name>/<package version>/<dependent package> it will find, and will
      // blacklist the target of those symlinks. By doing this, we ensure that files loaded through a specific path
      // will always have the same set of dependencies, provided the symlinks are correctly preserved.
      //
      // Unfortunately, some tools do not preserve them, and when it happens PnP isn't able anymore to deduce the set of
      // dependencies based on the path of the file that makes the require calls. But since we've blacklisted those
      // paths, we're able to print a more helpful error message that points out that a third-party package is doing
      // something incompatible!

      if (locator === null) {
        const locationForDisplay = getPathForDisplay(location);
        throw internalTools_makeError(ErrorCode.BLACKLISTED, `A forbidden path has been used in the package resolution process - this is usually caused by one of your tools calling 'fs.realpath' on the return value of 'require.resolve'. Since we need to use symlinks to simultaneously provide valid filesystem paths and disambiguate peer dependencies, they must be passed untransformed to 'require'.\n\nForbidden path: ${locationForDisplay}`, {
          location: locationForDisplay
        });
      }

      return locator;
    }

    return null;
  }
  /**
   * Transforms a request (what's typically passed as argument to the require function) into an unqualified path.
   * This path is called "unqualified" because it only changes the package name to the package location on the disk,
   * which means that the end result still cannot be directly accessed (for example, it doesn't try to resolve the
   * file extension, or to resolve directories to their "index.js" content). Use the "resolveUnqualified" function
   * to convert them to fully-qualified paths, or just use "resolveRequest" that do both operations in one go.
   *
   * Note that it is extremely important that the `issuer` path ends with a forward slash if the issuer is to be
   * treated as a folder (ie. "/tmp/foo/" rather than "/tmp/foo" if "foo" is a directory). Otherwise relative
   * imports won't be computed correctly (they'll get resolved relative to "/tmp/" instead of "/tmp/foo/").
   */


  function resolveToUnqualified(request, issuer, {
    considerBuiltins = true
  } = {}) {
    // The 'pnpapi' request is reserved and will always return the path to the PnP file, from everywhere
    if (request === `pnpapi`) return sources_path/* npath.toPortablePath */.cS.toPortablePath(opts.pnpapiResolution); // Bailout if the request is a native module

    if (considerBuiltins && builtinModules.has(request)) return null;
    const requestForDisplay = getPathForDisplay(request);
    const issuerForDisplay = issuer && getPathForDisplay(issuer); // We allow disabling the pnp resolution for some subpaths.
    // This is because some projects, often legacy, contain multiple
    // levels of dependencies (ie. a yarn.lock inside a subfolder of
    // a yarn.lock). This is typically solved using workspaces, but
    // not all of them have been converted already.

    if (issuer && isPathIgnored(issuer)) {
      // Absolute paths that seem to belong to a PnP tree are still
      // handled by our runtime even if the issuer isn't. This is
      // because the native Node resolution uses a special version
      // of the `stat` syscall which would otherwise bypass the
      // filesystem layer we require to access the files.
      if (!sources_path/* ppath.isAbsolute */.y1.isAbsolute(request) || findPackageLocator(request) === null) {
        const result = callNativeResolution(request, issuer);

        if (result === false) {
          throw internalTools_makeError(ErrorCode.BUILTIN_NODE_RESOLUTION_FAILED, `The builtin node resolution algorithm was unable to resolve the requested module (it didn't go through the pnp resolver because the issuer was explicitely ignored by the regexp)\n\nRequire request: "${requestForDisplay}"\nRequired by: ${issuerForDisplay}\n`, {
            request: requestForDisplay,
            issuer: issuerForDisplay
          });
        }

        return sources_path/* npath.toPortablePath */.cS.toPortablePath(result);
      }
    }

    let unqualifiedPath; // If the request is a relative or absolute path, we just return it normalized

    const dependencyNameMatch = request.match(pathRegExp);

    if (!dependencyNameMatch) {
      if (sources_path/* ppath.isAbsolute */.y1.isAbsolute(request)) {
        unqualifiedPath = sources_path/* ppath.normalize */.y1.normalize(request);
      } else {
        if (!issuer) {
          throw internalTools_makeError(ErrorCode.API_ERROR, `The resolveToUnqualified function must be called with a valid issuer when the path isn't a builtin nor absolute`, {
            request: requestForDisplay,
            issuer: issuerForDisplay
          });
        } // We use ppath.join instead of ppath.resolve because:
        // 1) The request is a relative path in this branch
        // 2) ppath.join preserves trailing slashes


        const absoluteIssuer = sources_path/* ppath.resolve */.y1.resolve(issuer);

        if (issuer.match(isDirRegExp)) {
          unqualifiedPath = sources_path/* ppath.normalize */.y1.normalize(sources_path/* ppath.join */.y1.join(absoluteIssuer, request));
        } else {
          unqualifiedPath = sources_path/* ppath.normalize */.y1.normalize(sources_path/* ppath.join */.y1.join(sources_path/* ppath.dirname */.y1.dirname(absoluteIssuer), request));
        }
      } // No need to use the return value; we just want to check the blacklist status


      findPackageLocator(unqualifiedPath);
    } // Things are more hairy if it's a package require - we then need to figure out which package is needed, and in
    // particular the exact version for the given location on the dependency tree
    else {
        if (!issuer) {
          throw internalTools_makeError(ErrorCode.API_ERROR, `The resolveToUnqualified function must be called with a valid issuer when the path isn't a builtin nor absolute`, {
            request: requestForDisplay,
            issuer: issuerForDisplay
          });
        }

        const [, dependencyName, subPath] = dependencyNameMatch;
        const issuerLocator = findPackageLocator(issuer); // If the issuer file doesn't seem to be owned by a package managed through pnp, then we resort to using the next
        // resolution algorithm in the chain, usually the native Node resolution one

        if (!issuerLocator) {
          const result = callNativeResolution(request, issuer);

          if (result === false) {
            throw internalTools_makeError(ErrorCode.BUILTIN_NODE_RESOLUTION_FAILED, `The builtin node resolution algorithm was unable to resolve the requested module (it didn't go through the pnp resolver because the issuer doesn't seem to be part of the Yarn-managed dependency tree).\n\nRequire path: "${requestForDisplay}"\nRequired by: ${issuerForDisplay}\n`, {
              request: requestForDisplay,
              issuer: issuerForDisplay
            });
          }

          return sources_path/* npath.toPortablePath */.cS.toPortablePath(result);
        }

        const issuerInformation = getPackageInformationSafe(issuerLocator); // We obtain the dependency reference in regard to the package that request it

        let dependencyReference = issuerInformation.packageDependencies.get(dependencyName);
        let fallbackReference = null; // If we can't find it, we check if we can potentially load it from the packages that have been defined as potential fallbacks.
        // It's a bit of a hack, but it improves compatibility with the existing Node ecosystem. Hopefully we should eventually be able
        // to kill this logic and become stricter once pnp gets enough traction and the affected packages fix themselves.

        if (dependencyReference == null) {
          if (issuerLocator.name !== null) {
            // To allow programs to become gradually stricter, starting from the v2 we enforce that workspaces cannot depend on fallbacks.
            // This works by having a list containing all their locators, and checking when a fallback is required whether it's one of them.
            const exclusionEntry = runtimeState.fallbackExclusionList.get(issuerLocator.name);
            const canUseFallbacks = !exclusionEntry || !exclusionEntry.has(issuerLocator.reference);

            if (canUseFallbacks) {
              for (let t = 0, T = fallbackLocators.length; t < T; ++t) {
                const fallbackInformation = getPackageInformationSafe(fallbackLocators[t]);
                const reference = fallbackInformation.packageDependencies.get(dependencyName);
                if (reference == null) continue;
                if (alwaysWarnOnFallback) fallbackReference = reference;else dependencyReference = reference;
                break;
              }

              if (runtimeState.enableTopLevelFallback) {
                if (dependencyReference == null && fallbackReference === null) {
                  const reference = runtimeState.fallbackPool.get(dependencyName);

                  if (reference != null) {
                    fallbackReference = reference;
                  }
                }
              }
            }
          }
        } // If we can't find the path, and if the package making the request is the top-level, we can offer nicer error messages


        let error = null;

        if (dependencyReference === null) {
          if (isDependencyTreeRoot(issuerLocator)) {
            error = internalTools_makeError(ErrorCode.MISSING_PEER_DEPENDENCY, `Your application tried to access ${dependencyName} (a peer dependency); this isn't allowed as there is no ancestor to satisfy the requirement. Use a devDependency if needed.\n\nRequired package: ${dependencyName} (via "${requestForDisplay}")\nRequired by: ${issuerForDisplay}\n`, {
              request: requestForDisplay,
              issuer: issuerForDisplay,
              dependencyName
            });
          } else {
            const brokenAncestors = findBrokenPeerDependencies(dependencyName, issuerLocator);

            if (brokenAncestors.every(ancestor => isDependencyTreeRoot(ancestor))) {
              error = internalTools_makeError(ErrorCode.MISSING_PEER_DEPENDENCY, `${issuerLocator.name} tried to access ${dependencyName} (a peer dependency) but it isn't provided by your application; this makes the require call ambiguous and unsound.\n\nRequired package: ${dependencyName} (via "${requestForDisplay}")\nRequired by: ${issuerLocator.name}@${issuerLocator.reference} (via ${issuerForDisplay})\n${brokenAncestors.map(ancestorLocator => `Ancestor breaking the chain: ${ancestorLocator.name}@${ancestorLocator.reference}\n`).join(``)}\n`, {
                request: requestForDisplay,
                issuer: issuerForDisplay,
                issuerLocator: Object.assign({}, issuerLocator),
                dependencyName,
                brokenAncestors
              });
            } else {
              error = internalTools_makeError(ErrorCode.MISSING_PEER_DEPENDENCY, `${issuerLocator.name} tried to access ${dependencyName} (a peer dependency) but it isn't provided by its ancestors; this makes the require call ambiguous and unsound.\n\nRequired package: ${dependencyName} (via "${requestForDisplay}")\nRequired by: ${issuerLocator.name}@${issuerLocator.reference} (via ${issuerForDisplay})\n${brokenAncestors.map(ancestorLocator => `Ancestor breaking the chain: ${ancestorLocator.name}@${ancestorLocator.reference}\n`).join(``)}\n`, {
                request: requestForDisplay,
                issuer: issuerForDisplay,
                issuerLocator: Object.assign({}, issuerLocator),
                dependencyName,
                brokenAncestors
              });
            }
          }
        } else if (dependencyReference === undefined) {
          if (!considerBuiltins && builtinModules.has(request)) {
            if (isDependencyTreeRoot(issuerLocator)) {
              error = internalTools_makeError(ErrorCode.UNDECLARED_DEPENDENCY, `Your application tried to access ${dependencyName}. While this module is usually interpreted as a Node builtin, your resolver is running inside a non-Node resolution context where such builtins are ignored. Since ${dependencyName} isn't otherwise declared in your dependencies, this makes the require call ambiguous and unsound.\n\nRequired package: ${dependencyName} (via "${requestForDisplay}")\nRequired by: ${issuerForDisplay}\n`, {
                request: requestForDisplay,
                issuer: issuerForDisplay,
                dependencyName
              });
            } else {
              error = internalTools_makeError(ErrorCode.UNDECLARED_DEPENDENCY, `${issuerLocator.name} tried to access ${dependencyName}. While this module is usually interpreted as a Node builtin, your resolver is running inside a non-Node resolution context where such builtins are ignored. Since ${dependencyName} isn't otherwise declared in ${issuerLocator.name}'s dependencies, this makes the require call ambiguous and unsound.\n\nRequired package: ${dependencyName} (via "${requestForDisplay}")\nRequired by: ${issuerForDisplay}\n`, {
                request: requestForDisplay,
                issuer: issuerForDisplay,
                issuerLocator: Object.assign({}, issuerLocator),
                dependencyName
              });
            }
          } else {
            if (isDependencyTreeRoot(issuerLocator)) {
              error = internalTools_makeError(ErrorCode.UNDECLARED_DEPENDENCY, `Your application tried to access ${dependencyName}, but it isn't declared in your dependencies; this makes the require call ambiguous and unsound.\n\nRequired package: ${dependencyName} (via "${requestForDisplay}")\nRequired by: ${issuerForDisplay}\n`, {
                request: requestForDisplay,
                issuer: issuerForDisplay,
                dependencyName
              });
            } else {
              error = internalTools_makeError(ErrorCode.UNDECLARED_DEPENDENCY, `${issuerLocator.name} tried to access ${dependencyName}, but it isn't declared in its dependencies; this makes the require call ambiguous and unsound.\n\nRequired package: ${dependencyName} (via "${requestForDisplay}")\nRequired by: ${issuerLocator.name}@${issuerLocator.reference} (via ${issuerForDisplay})\n`, {
                request: requestForDisplay,
                issuer: issuerForDisplay,
                issuerLocator: Object.assign({}, issuerLocator),
                dependencyName
              });
            }
          }
        }

        if (dependencyReference == null) {
          if (fallbackReference === null || error === null) throw error || new Error(`Assertion failed: Expected an error to have been set`);
          dependencyReference = fallbackReference;
          const message = error.message.replace(/\n.*/g, ``);
          error.message = message;

          if (!emittedWarnings.has(message)) {
            emittedWarnings.add(message);
            process.emitWarning(error);
          }
        } // We need to check that the package exists on the filesystem, because it might not have been installed


        const dependencyLocator = Array.isArray(dependencyReference) ? {
          name: dependencyReference[0],
          reference: dependencyReference[1]
        } : {
          name: dependencyName,
          reference: dependencyReference
        };
        const dependencyInformation = getPackageInformationSafe(dependencyLocator);

        if (!dependencyInformation.packageLocation) {
          throw internalTools_makeError(ErrorCode.MISSING_DEPENDENCY, `A dependency seems valid but didn't get installed for some reason. This might be caused by a partial install, such as dev vs prod.\n\nRequired package: ${dependencyLocator.name}@${dependencyLocator.reference} (via "${requestForDisplay}")\nRequired by: ${issuerLocator.name}@${issuerLocator.reference} (via ${issuerForDisplay})\n`, {
            request: requestForDisplay,
            issuer: issuerForDisplay,
            dependencyLocator: Object.assign({}, dependencyLocator)
          });
        } // Now that we know which package we should resolve to, we only have to find out the file location
        // packageLocation is always absolute as it's returned by getPackageInformationSafe


        const dependencyLocation = dependencyInformation.packageLocation;

        if (subPath) {
          // We use ppath.join instead of ppath.resolve because:
          // 1) subPath is always a relative path
          // 2) ppath.join preserves trailing slashes
          unqualifiedPath = sources_path/* ppath.join */.y1.join(dependencyLocation, subPath);
        } else {
          unqualifiedPath = dependencyLocation;
        }
      }

    return sources_path/* ppath.normalize */.y1.normalize(unqualifiedPath);
  }
  /**
   * Transforms an unqualified path into a qualified path by using the Node resolution algorithm (which automatically
   * appends ".js" / ".json", and transforms directory accesses into "index.js").
   */


  function resolveUnqualified(unqualifiedPath, {
    extensions = Object.keys(external_module_.Module._extensions)
  } = {}) {
    const candidates = [];
    const qualifiedPath = applyNodeExtensionResolution(unqualifiedPath, candidates, {
      extensions
    });

    if (qualifiedPath) {
      return sources_path/* ppath.normalize */.y1.normalize(qualifiedPath);
    } else {
      const unqualifiedPathForDisplay = getPathForDisplay(unqualifiedPath);
      throw internalTools_makeError(ErrorCode.QUALIFIED_PATH_RESOLUTION_FAILED, `Qualified path resolution failed - none of the candidates can be found on the disk.\n\nSource path: ${unqualifiedPathForDisplay}\n${candidates.map(candidate => `Rejected candidate: ${getPathForDisplay(candidate)}\n`).join(``)}`, {
        unqualifiedPath: unqualifiedPathForDisplay
      });
    }
  }
  /**
   * Transforms a request into a fully qualified path.
   *
   * Note that it is extremely important that the `issuer` path ends with a forward slash if the issuer is to be
   * treated as a folder (ie. "/tmp/foo/" rather than "/tmp/foo" if "foo" is a directory). Otherwise relative
   * imports won't be computed correctly (they'll get resolved relative to "/tmp/" instead of "/tmp/foo/").
   */


  function resolveRequest(request, issuer, {
    considerBuiltins,
    extensions
  } = {}) {
    const unqualifiedPath = resolveToUnqualified(request, issuer, {
      considerBuiltins
    });
    if (unqualifiedPath === null) return null;

    try {
      return resolveUnqualified(unqualifiedPath, {
        extensions
      });
    } catch (resolutionError) {
      if (resolutionError.pnpCode === `QUALIFIED_PATH_RESOLUTION_FAILED`) Object.assign(resolutionError.data, {
        request: getPathForDisplay(request),
        issuer: issuer && getPathForDisplay(issuer)
      });
      throw resolutionError;
    }
  }

  function resolveVirtual(request) {
    const normalized = sources_path/* ppath.normalize */.y1.normalize(request);
    const resolved = VirtualFS.resolveVirtual(normalized);
    return resolved !== normalized ? resolved : null;
  }

  return {
    VERSIONS,
    topLevel,
    getLocator: (name, referencish) => {
      if (Array.isArray(referencish)) {
        return {
          name: referencish[0],
          reference: referencish[1]
        };
      } else {
        return {
          name,
          reference: referencish
        };
      }
    },
    getDependencyTreeRoots: () => {
      return [...runtimeState.dependencyTreeRoots];
    },
    getPackageInformation: locator => {
      const info = getPackageInformation(locator);
      if (info === null) return null;
      const packageLocation = sources_path/* npath.fromPortablePath */.cS.fromPortablePath(info.packageLocation);
      const nativeInfo = { ...info,
        packageLocation
      };
      return nativeInfo;
    },
    findPackageLocator: path => {
      return findPackageLocator(sources_path/* npath.toPortablePath */.cS.toPortablePath(path));
    },
    resolveToUnqualified: maybeLog(`resolveToUnqualified`, (request, issuer, opts) => {
      const portableIssuer = issuer !== null ? sources_path/* npath.toPortablePath */.cS.toPortablePath(issuer) : null;
      const resolution = resolveToUnqualified(sources_path/* npath.toPortablePath */.cS.toPortablePath(request), portableIssuer, opts);
      if (resolution === null) return null;
      return sources_path/* npath.fromPortablePath */.cS.fromPortablePath(resolution);
    }),
    resolveUnqualified: maybeLog(`resolveUnqualified`, (unqualifiedPath, opts) => {
      return sources_path/* npath.fromPortablePath */.cS.fromPortablePath(resolveUnqualified(sources_path/* npath.toPortablePath */.cS.toPortablePath(unqualifiedPath), opts));
    }),
    resolveRequest: maybeLog(`resolveRequest`, (request, issuer, opts) => {
      const portableIssuer = issuer !== null ? sources_path/* npath.toPortablePath */.cS.toPortablePath(issuer) : null;
      const resolution = resolveRequest(sources_path/* npath.toPortablePath */.cS.toPortablePath(request), portableIssuer, opts);
      if (resolution === null) return null;
      return sources_path/* npath.fromPortablePath */.cS.fromPortablePath(resolution);
    }),
    resolveVirtual: maybeLog(`resolveVirtual`, path => {
      const result = resolveVirtual(sources_path/* npath.toPortablePath */.cS.toPortablePath(path));

      if (result !== null) {
        return sources_path/* npath.fromPortablePath */.cS.fromPortablePath(result);
      } else {
        return null;
      }
    })
  };
}
// CONCATENATED MODULE: ./sources/loader/makeManager.ts


function makeManager(pnpapi, opts) {
  const initialApiPath = sources_path/* npath.toPortablePath */.cS.toPortablePath(pnpapi.resolveToUnqualified(`pnpapi`, null));
  const initialApiStats = opts.fakeFs.statSync(sources_path/* npath.toPortablePath */.cS.toPortablePath(initialApiPath));
  const apiMetadata = new Map([[initialApiPath, {
    cache: external_module_.Module._cache,
    instance: pnpapi,
    stats: initialApiStats,
    lastRefreshCheck: Date.now()
  }]]);

  function loadApiInstance(pnpApiPath) {
    const nativePath = sources_path/* npath.fromPortablePath */.cS.fromPortablePath(pnpApiPath); // @ts-expect-error

    const module = new external_module_.Module(nativePath, null); // @ts-expect-error

    module.load(nativePath);
    return module.exports;
  }

  function refreshApiEntry(pnpApiPath, apiEntry) {
    const timeNow = Date.now();
    if (timeNow - apiEntry.lastRefreshCheck < 500) return;
    apiEntry.lastRefreshCheck = timeNow;
    const stats = opts.fakeFs.statSync(pnpApiPath);

    if (stats.mtime > apiEntry.stats.mtime) {
      console.warn(`[Warning] The runtime detected new informations in a PnP file; reloading the API instance (${pnpApiPath})`);
      apiEntry.instance = loadApiInstance(pnpApiPath);
      apiEntry.stats = stats;
    }
  }

  function getApiEntry(pnpApiPath, refresh = false) {
    let apiEntry = apiMetadata.get(pnpApiPath);

    if (typeof apiEntry !== `undefined`) {
      if (refresh) {
        refreshApiEntry(pnpApiPath, apiEntry);
      }
    } else {
      apiMetadata.set(pnpApiPath, apiEntry = {
        cache: {},
        instance: loadApiInstance(pnpApiPath),
        stats: opts.fakeFs.statSync(pnpApiPath),
        lastRefreshCheck: Date.now()
      });
    }

    return apiEntry;
  }

  const findApiPathCache = new Map();

  function addToCache(start, end, target) {
    let curr;
    let next = start;

    do {
      curr = next;
      findApiPathCache.set(curr, target);
      next = sources_path/* ppath.dirname */.y1.dirname(curr);
    } while (curr !== end);
  }

  function findApiPathFor(modulePath) {
    const start = VirtualFS.resolveVirtual(sources_path/* ppath.resolve */.y1.resolve(sources_path/* npath.toPortablePath */.cS.toPortablePath(modulePath)));
    let curr;
    let next = start;

    do {
      curr = next;
      const cached = findApiPathCache.get(curr);

      if (cached !== undefined) {
        addToCache(start, curr, cached);
        return cached;
      }

      const candidate = sources_path/* ppath.join */.y1.join(curr, `.pnp.js`);

      if (xfs.existsSync(candidate) && xfs.statSync(candidate).isFile()) {
        addToCache(start, curr, candidate);
        return candidate;
      }

      const cjsCandidate = sources_path/* ppath.join */.y1.join(curr, `.pnp.cjs`);

      if (xfs.existsSync(cjsCandidate) && xfs.statSync(cjsCandidate).isFile()) {
        addToCache(start, curr, cjsCandidate);
        return cjsCandidate;
      }

      next = sources_path/* ppath.dirname */.y1.dirname(curr);
    } while (curr !== sources_path/* PortablePath.root */.LZ.root);

    addToCache(start, curr, null);
    return null;
  }

  function getApiPathFromParent(parent) {
    if (parent == null) return initialApiPath;

    if (typeof parent.pnpApiPath === `undefined`) {
      if (parent.filename !== null) {
        return parent.pnpApiPath = findApiPathFor(parent.filename);
      } else {
        return initialApiPath;
      }
    }

    if (parent.pnpApiPath !== null) return parent.pnpApiPath;
    return null;
  }

  return {
    getApiPathFromParent,
    findApiPathFor,
    getApiEntry
  };
}
// CONCATENATED MODULE: ./sources/loader/_entryPoint.ts








 // We must copy the fs into a local, because otherwise
// 1. we would make the NodeFS instance use the function that we patched (infinite loop)
// 2. Object.create(fs) isn't enough, since it won't prevent the proto from being modified

const localFs = { ...(external_fs_default())
};
const nodeFs = new NodeFS(localFs);
const defaultRuntimeState = $$SETUP_STATE(hydrateRuntimeState);
const defaultPnpapiResolution = __filename; // We create a virtual filesystem that will do three things:
// 1. all requests inside a folder named "$$virtual" will be remapped according the virtual folder rules
// 2. all requests going inside a Zip archive will be handled by the Zip fs implementation
// 3. any remaining request will be forwarded to Node as-is

const defaultFsLayer = new VirtualFS({
  baseFs: new ZipOpenFS({
    baseFs: nodeFs,
    libzip: getLibzipSync(),
    maxOpenFiles: 80,
    readOnlyArchives: true
  })
});
let manager;
const defaultApi = Object.assign(makeApi(defaultRuntimeState, {
  fakeFs: defaultFsLayer,
  pnpapiResolution: defaultPnpapiResolution
}), {
  /**
   * Can be used to generate a different API than the default one (for example
   * to map it on `/` rather than the local directory path, or to use a
   * different FS layer than the default one).
   */
  makeApi: ({
    basePath = undefined,
    fakeFs = defaultFsLayer,
    pnpapiResolution = defaultPnpapiResolution,
    ...rest
  }) => {
    const apiRuntimeState = typeof basePath !== `undefined` ? $$SETUP_STATE(hydrateRuntimeState, basePath) : defaultRuntimeState;
    return makeApi(apiRuntimeState, {
      fakeFs,
      pnpapiResolution,
      ...rest
    });
  },

  /**
   * Will inject the specified API into the environment, monkey-patching FS. Is
   * automatically called when the hook is loaded through `--require`.
   */
  setup: api => {
    applyPatch(api || defaultApi, {
      fakeFs: defaultFsLayer,
      manager
    });
  }
});
manager = makeManager(defaultApi, {
  fakeFs: defaultFsLayer
}); // eslint-disable-next-line arca/no-default-export

/* harmony default export */ const _entryPoint = (defaultApi);

if (__non_webpack_module__.parent && __non_webpack_module__.parent.id === `internal/preload`) {
  defaultApi.setup();

  if (__non_webpack_module__.filename) {
    // We delete it from the cache in order to support the case where the CLI resolver is invoked from "yarn run"
    // It's annoying because it might cause some issues when the file is multiple times in NODE_OPTIONS, but it shouldn't happen anyway.
    delete (external_module_default())._cache[__non_webpack_module__.filename];
  }
}

if (process.mainModule === __non_webpack_module__) {
  const reportError = (code, message, data) => {
    process.stdout.write(`${JSON.stringify([{
      code,
      message,
      data
    }, null])}\n`);
  };

  const reportSuccess = resolution => {
    process.stdout.write(`${JSON.stringify([null, resolution])}\n`);
  };

  const processResolution = (request, issuer) => {
    try {
      reportSuccess(defaultApi.resolveRequest(request, issuer));
    } catch (error) {
      reportError(error.code, error.message, error.data);
    }
  };

  const processRequest = data => {
    try {
      const [request, issuer] = JSON.parse(data);
      processResolution(request, issuer);
    } catch (error) {
      reportError(`INVALID_JSON`, error.message, error.data);
    }
  };

  if (process.argv.length > 2) {
    if (process.argv.length !== 4) {
      process.stderr.write(`Usage: ${process.argv[0]} ${process.argv[1]} <request> <issuer>\n`);
      process.exitCode = 64;
      /* EX_USAGE */
    } else {
      processResolution(process.argv[2], process.argv[3]);
    }
  } else {
    let buffer = ``;
    const decoder = new (external_string_decoder_default()).StringDecoder();
    process.stdin.on(`data`, chunk => {
      buffer += decoder.write(chunk);

      do {
        const index = buffer.indexOf(`\n`);
        if (index === -1) break;
        const line = buffer.slice(0, index);
        buffer = buffer.slice(index + 1);
        processRequest(line);
      } while (true);
    });
  }
}

/***/ }),

/***/ 368:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var frozenFs = Object.assign({}, __webpack_require__(747));
var Module = typeof Module !== "undefined" ? Module : {};
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = function(status, toThrow) {
  throw toThrow;
};
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = true;
var scriptDirectory = "";
function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  }
  return scriptDirectory + path;
}
var read_, readBinary;
var nodeFS;
var nodePath;
if (ENVIRONMENT_IS_NODE) {
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = __webpack_require__(622).dirname(scriptDirectory) + "/";
  } else {
    scriptDirectory = __dirname + "/";
  }
  read_ = function shell_read(filename, binary) {
    var ret = tryParseAsDataURI(filename);
    if (ret) {
      return binary ? ret : ret.toString();
    }
    if (!nodeFS) nodeFS = frozenFs;
    if (!nodePath) nodePath = __webpack_require__(622);
    filename = nodePath["normalize"](filename);
    return nodeFS["readFileSync"](filename, binary ? null : "utf8");
  };
  readBinary = function readBinary(filename) {
    var ret = read_(filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };
  if (process["argv"].length > 1) {
    thisProgram = process["argv"][1].replace(/\\/g, "/");
  }
  arguments_ = process["argv"].slice(2);
  if (true) {
    module["exports"] = Module;
  }
  (function() {})("uncaughtException", function(ex) {
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });
  (function() {})("unhandledRejection", abort);
  quit_ = function(status) {
    process["exit"](status);
  };
  Module["inspect"] = function() {
    return "[Emscripten Module object]";
  };
} else {
}
var out = Module["print"] || console.log.bind(console);
var err = Module["printErr"] || console.warn.bind(console);
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
moduleOverrides = null;
if (Module["arguments"]) arguments_ = Module["arguments"];
if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
if (Module["quit"]) quit_ = Module["quit"];
var tempRet0 = 0;
var setTempRet0 = function(value) {
  tempRet0 = value;
};
var wasmBinary;
if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
var noExitRuntime;
if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
if (typeof WebAssembly !== "object") {
  abort("no native wasm support detected");
}
function getValue(ptr, type, noSafe) {
  type = type || "i8";
  if (type.charAt(type.length - 1) === "*") type = "i32";
  switch (type) {
    case "i1":
      return HEAP8[ptr >> 0];
    case "i8":
      return HEAP8[ptr >> 0];
    case "i16":
      return HEAP16[ptr >> 1];
    case "i32":
      return HEAP32[ptr >> 2];
    case "i64":
      return HEAP32[ptr >> 2];
    case "float":
      return HEAPF32[ptr >> 2];
    case "double":
      return HEAPF64[ptr >> 3];
    default:
      abort("invalid type for getValue: " + type);
  }
  return null;
}
var wasmMemory;
var wasmTable = new WebAssembly.Table({
  initial: 31,
  maximum: 31 + 0,
  element: "anyfunc"
});
var ABORT = false;
var EXITSTATUS = 0;
function assert(condition, text) {
  if (!condition) {
    abort("Assertion failed: " + text);
  }
}
function getCFunc(ident) {
  var func = Module["_" + ident];
  assert(
    func,
    "Cannot call unknown function " + ident + ", make sure it is exported"
  );
  return func;
}
function ccall(ident, returnType, argTypes, args, opts) {
  var toC = {
    string: function(str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) {
        var len = (str.length << 2) + 1;
        ret = stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    },
    array: function(arr) {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };
  function convertReturnValue(ret) {
    if (returnType === "string") return UTF8ToString(ret);
    if (returnType === "boolean") return Boolean(ret);
    return ret;
  }
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);
  ret = convertReturnValue(ret);
  if (stack !== 0) stackRestore(stack);
  return ret;
}
function cwrap(ident, returnType, argTypes, opts) {
  argTypes = argTypes || [];
  var numericArgs = argTypes.every(function(type) {
    return type === "number";
  });
  var numericRet = returnType !== "string";
  if (numericRet && numericArgs && !opts) {
    return getCFunc(ident);
  }
  return function() {
    return ccall(ident, returnType, argTypes, arguments, opts);
  };
}
var UTF8Decoder =
  typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
function UTF8ArrayToString(heap, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(heap.subarray(idx, endPtr));
  } else {
    var str = "";
    while (idx < endPtr) {
      var u0 = heap[idx++];
      if (!(u0 & 128)) {
        str += String.fromCharCode(u0);
        continue;
      }
      var u1 = heap[idx++] & 63;
      if ((u0 & 224) == 192) {
        str += String.fromCharCode(((u0 & 31) << 6) | u1);
        continue;
      }
      var u2 = heap[idx++] & 63;
      if ((u0 & 240) == 224) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
      }
      if (u0 < 65536) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 65536;
        str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
      }
    }
  }
  return str;
}
function UTF8ToString(ptr, maxBytesToRead) {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
}
function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  for (var i = 0; i < str.length; ++i) {
    var u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343) {
      var u1 = str.charCodeAt(++i);
      u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
    }
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 192 | (u >> 6);
      heap[outIdx++] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 224 | (u >> 12);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 240 | (u >> 18);
      heap[outIdx++] = 128 | ((u >> 12) & 63);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
    }
  }
  heap[outIdx] = 0;
  return outIdx - startIdx;
}
function stringToUTF8(str, outPtr, maxBytesToWrite) {
  return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
}
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    var u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343)
      u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
    if (u <= 127) ++len;
    else if (u <= 2047) len += 2;
    else if (u <= 65535) len += 3;
    else len += 4;
  }
  return len;
}
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}
function writeArrayToMemory(array, buffer) {
  HEAP8.set(array, buffer);
}
var WASM_PAGE_SIZE = 65536;
function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module["HEAP8"] = HEAP8 = new Int8Array(buf);
  Module["HEAP16"] = HEAP16 = new Int16Array(buf);
  Module["HEAP32"] = HEAP32 = new Int32Array(buf);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
  Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
  Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
  Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
  Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
}
var DYNAMIC_BASE = 5263680,
  DYNAMICTOP_PTR = 20640;
var INITIAL_INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
if (Module["wasmMemory"]) {
  wasmMemory = Module["wasmMemory"];
} else {
  wasmMemory = new WebAssembly.Memory({
    initial: INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
    maximum: 2147483648 / WASM_PAGE_SIZE
  });
}
if (wasmMemory) {
  buffer = wasmMemory.buffer;
}
INITIAL_INITIAL_MEMORY = buffer.byteLength;
updateGlobalBufferAndViews(buffer);
HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
function callRuntimeCallbacks(callbacks) {
  while (callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == "function") {
      callback(Module);
      continue;
    }
    var func = callback.func;
    if (typeof func === "number") {
      if (callback.arg === undefined) {
        Module["dynCall_v"](func);
      } else {
        Module["dynCall_vi"](func, callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
function preRun() {
  if (Module["preRun"]) {
    if (typeof Module["preRun"] == "function")
      Module["preRun"] = [Module["preRun"]];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function initRuntime() {
  runtimeInitialized = true;
  if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
  TTY.init();
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  FS.ignorePermissions = false;
  callRuntimeCallbacks(__ATMAIN__);
}
function postRun() {
  if (Module["postRun"]) {
    if (typeof Module["postRun"] == "function")
      Module["postRun"] = [Module["postRun"]];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
var Math_abs = Math.abs;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_min = Math.min;
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
function getUniqueRunDependency(id) {
  return id;
}
function addRunDependency(id) {
  runDependencies++;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
}
function removeRunDependency(id) {
  runDependencies--;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
function abort(what) {
  if (Module["onAbort"]) {
    Module["onAbort"](what);
  }
  what += "";
  out(what);
  err(what);
  ABORT = true;
  EXITSTATUS = 1;
  what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
  throw new WebAssembly.RuntimeError(what);
}
function hasPrefix(str, prefix) {
  return String.prototype.startsWith
    ? str.startsWith(prefix)
    : str.indexOf(prefix) === 0;
}
var dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(filename) {
  return hasPrefix(filename, dataURIPrefix);
}
var wasmBinaryFile =
  "data:application/octet-stream;base64,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A3I2AgQgASAFaiIEIANBAXI2AgQgAyAEaiADNgIAIAgEQCAIQQN2IgVBA3RB4JwBaiEAQcycASgCACECAn9BASAFdCIFIAZxRQRAQbicASAFIAZyNgIAIAAMAQsgACgCCAshBSAAIAI2AgggBSACNgIMIAIgADYCDCACIAU2AggLQcycASAENgIAQcCcASADNgIACyABQQhqIQALIAtBEGokACAAC4IEAQN/IAJBgARPBEAgACABIAIQExogAA8LIAAgAmohAwJAIAAgAXNBA3FFBEACQCACQQFIBEAgACECDAELIABBA3FFBEAgACECDAELIAAhAgNAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANPDQEgAkEDcQ0ACwsCQCADQXxxIgRBwABJDQAgAiAEQUBqIgVLDQADQCACIAEoAgA2AgAgAiABKAIENgIEIAIgASgCCDYCCCACIAEoAgw2AgwgAiABKAIQNgIQIAIgASgCFDYCFCACIAEoAhg2AhggAiABKAIcNgIcIAIgASgCIDYCICACIAEoAiQ2AiQgAiABKAIoNgIoIAIgASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUFAayEBIAJBQGsiAiAFTQ0ACwsgAiAETw0BA0AgAiABKAIANgIAIAFBBGohASACQQRqIgIgBEkNAAsMAQsgA0EESQRAIAAhAgwBCyADQXxqIgQgAEkEQCAAIQIMAQsgACECA0AgAiABLQAAOgAAIAIgAS0AAToAASACIAEtAAI6AAIgAiABLQADOgADIAFBBGohASACQQRqIgIgBE0NAAsLIAIgA0kEQANAIAIgAS0AADoAACABQQFqIQEgAkEBaiICIANHDQALCyAACz8BAX8jAEEQayIDJAAgAyAANgIMIAMgATYCCCADIAI2AgQgAygCDCADKAIIIAMoAgQQ1gEhACADQRBqJAAgAAvdAQEBfyMAQRBrIgEkACABIAA2AgwCQCABKAIMRQ0AIAEoAgwoAjBBAEsEQCABKAIMIgAgACgCMEF/ajYCMAsgASgCDCgCMEEASw0AIAEoAgwoAiBBAEsEQCABKAIMQQE2AiAgASgCDBAyGgsgASgCDCgCJEEBRgRAIAEoAgwQagsCQCABKAIMKAIsRQ0AIAEoAgwtAChBAXEN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QSBqJAALiwMBAX8jAEEwayIDJAAgAyAANgIkIAMgATYCICADIAI3AxgCQCADKAIkLQAoQQFxBEAgA0J/NwMoDAELAkACQCADKAIkKAIgQQBNDQAgAykDGEL///////////8AVg0AIAMpAxhCAFgNASADKAIgDQELIAMoAiRBDGpBEkEAEBUgA0J/NwMoDAELIAMoAiQtADVBAXEEQCADQn83AygMAQsCfyMAQRBrIgAgAygCJDYCDCAAKAIMLQA0QQFxCwRAIANCADcDKAwBCyADKQMYUARAIANCADcDKAwBCyADQgA3AxADQCADKQMQIAMpAxhUBEAgAyADKAIkIAMoAiAgAykDEKdqIAMpAxggAykDEH1BARAiIgI3AwggAkIAUwRAIAMoAiRBAToANSADKQMQUARAIANCfzcDKAwECyADIAMpAxA3AygMAwsgAykDCFAEQCADKAIkQQE6ADQFIAMgAykDCCADKQMQfDcDEAwCCwsLIAMgAykDEDcDKAsgAykDKCECIANBMGokACACCzYBAX8jAEEQayIBIAA2AgwCfiABKAIMLQAAQQFxBEAgASgCDCkDCCABKAIMKQMQfQwBC0IACwuyAQIBfwF+IwBBEGsiASQAIAEgADYCBCABIAEoAgRCCBAfNgIAAkAgASgCAEUEQCABQgA3AwgMAQsgASABKAIALQAArSABKAIALQAHrUI4hiABKAIALQAGrUIwhnwgASgCAC0ABa1CKIZ8IAEoAgAtAAStQiCGfCABKAIALQADrUIYhnwgASgCAC0AAq1CEIZ8IAEoAgAtAAGtQgiGfHw3AwgLIAEpAwghAiABQRBqJAAgAguoAQEBfyMAQRBrIgEkACABIAA2AggCQCABKAIIKAIgQQBNBEAgASgCCEEMakESQQAQFSABQX82AgwMAQsgASgCCCIAIAAoAiBBf2o2AiAgASgCCCgCIEUEQCABKAIIQQBCAEECECIaIAEoAggoAgAEQCABKAIIKAIAEDJBAEgEQCABKAIIQQxqQRRBABAVCwsLIAFBADYCDAsgASgCDCEAIAFBEGokACAAC/ECAgJ/AX4CQCACRQ0AIAAgAmoiA0F/aiABOgAAIAAgAToAACACQQNJDQAgA0F+aiABOgAAIAAgAToAASADQX1qIAE6AAAgACABOgACIAJBB0kNACADQXxqIAE6AAAgACABOgADIAJBCUkNACAAQQAgAGtBA3EiBGoiAyABQf8BcUGBgoQIbCIANgIAIAMgAiAEa0F8cSICaiIBQXxqIAA2AgAgAkEJSQ0AIAMgADYCCCADIAA2AgQgAUF4aiAANgIAIAFBdGogADYCACACQRlJDQAgAyAANgIYIAMgADYCFCADIAA2AhAgAyAANgIMIAFBcGogADYCACABQWxqIAA2AgAgAUFoaiAANgIAIAFBZGogADYCACACIANBBHFBGHIiAWsiAkEgSQ0AIACtIgVCIIYgBYQhBSABIANqIQEDQCABIAU3AxggASAFNwMQIAEgBTcDCCABIAU3AwAgAUEgaiEBIAJBYGoiAkEfSw0ACwsL3AEBAX8jAEEQayIBJAAgASAANgIMIAEoAgwEQCABKAIMKAIoBEAgASgCDCgCKEEANgIoIAEoAgwoAihCADcDICABKAIMAn4gASgCDCkDGCABKAIMKQMgVgRAIAEoAgwpAxgMAQsgASgCDCkDIAs3AxgLIAEgASgCDCkDGDcDAANAIAEpAwAgASgCDCkDCFpFBEAgASgCDCgCACABKQMAp0EEdGooAgAQFiABIAEpAwBCAXw3AwAMAQsLIAEoAgwoAgAQFiABKAIMKAIEEBYgASgCDBAWCyABQRBqJAALYAIBfwF+IwBBEGsiASQAIAEgADYCBAJAIAEoAgQoAiRBAUcEQCABKAIEQQxqQRJBABAVIAFCfzcDCAwBCyABIAEoAgRBAEIAQQ0QIjcDCAsgASkDCCECIAFBEGokACACC6ABAQF/IwBBIGsiAyQAIAMgADYCGCADIAE2AhQgAyACNwMIIAMgAygCGCgCACADKAIUIAMpAwgQywEiAjcDAAJAIAJCAFMEQCADKAIYQQhqIAMoAhgoAgAQGCADQX82AhwMAQsgAykDACADKQMIUgRAIAMoAhhBCGpBBkEbEBUgA0F/NgIcDAELIANBADYCHAsgAygCHCEAIANBIGokACAAC2sBAX8jAEEgayICIAA2AhwgAkIBIAIoAhythjcDECACQQxqIAE2AgADQCACIAIoAgwiAEEEajYCDCACIAAoAgA2AgggAigCCEEASEUEQCACIAIpAxBCASACKAIIrYaENwMQDAELCyACKQMQCy8BAX8jAEEQayIBJAAgASAANgIMIAEoAgwoAggQFiABKAIMQQA2AgggAUEQaiQAC80BAQF/IwBBEGsiAiQAIAIgADYCCCACIAE2AgQCQCACKAIILQAoQQFxBEAgAkF/NgIMDAELIAIoAgRFBEAgAigCCEEMakESQQAQFSACQX82AgwMAQsgAigCBBA8IAIoAggoAgAEQCACKAIIKAIAIAIoAgQQOUEASARAIAIoAghBDGogAigCCCgCABAYIAJBfzYCDAwCCwsgAigCCCACKAIEQjhBAxAiQgBTBEAgAkF/NgIMDAELIAJBADYCDAsgAigCDCEAIAJBEGokACAACzEBAX8jAEEQayIBJAAgASAANgIMIAEoAgwEQCABKAIMEFwgASgCDBAWCyABQRBqJAAL3wQBAX8jAEEgayICIAA2AhggAiABNgIUAkAgAigCGEUEQCACQQE2AhwMAQsgAiACKAIYKAIANgIMAkAgAigCGCgCCARAIAIgAigCGCgCCDYCEAwBCyACQQE2AhAgAkEANgIIA0ACQCACKAIIIAIoAhgvAQRPDQACQCACKAIMIAIoAghqLQAAQR9KBEAgAigCDCACKAIIai0AAEGAAUgNAQsgAigCDCACKAIIai0AAEENRg0AIAIoAgwgAigCCGotAABBCkYNACACKAIMIAIoAghqLQAAQQlGBEAMAQsgAkEDNgIQAkAgAigCDCACKAIIai0AAEHgAXFBwAFGBEAgAkEBNgIADAELAkAgAigCDCACKAIIai0AAEHwAXFB4AFGBEAgAkECNgIADAELAkAgAigCDCACKAIIai0AAEH4AXFB8AFGBEAgAkEDNgIADAELIAJBBDYCEAwECwsLIAIoAgggAigCAGogAigCGC8BBE8EQCACQQQ2AhAMAgsgAkEBNgIEA0AgAigCBCACKAIATQRAIAIoAgwgAigCCCACKAIEamotAABBwAFxQYABRwRAIAJBBDYCEAwGBSACIAIoAgRBAWo2AgQMAgsACwsgAiACKAIAIAIoAghqNgIICyACIAIoAghBAWo2AggMAQsLCyACKAIYIAIoAhA2AgggAigCFARAAkAgAigCFEECRw0AIAIoAhBBA0cNACACQQI2AhAgAigCGEECNgIICwJAIAIoAhQgAigCEEYNACACKAIQQQFGDQAgAkEFNgIcDAILCyACIAIoAhA2AhwLIAIoAhwLagEBfyMAQRBrIgEgADYCDCAB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AUEQaiQAC/EBAQF/IwBBEGsiASAANgIMIAEoAgxBADYCACABKAIMQQA6AAQgASgCDEEAOgAFIAEoAgxBAToABiABKAIMQb8GOwEIIAEoAgxBCjsBCiABKAIMQQA7AQwgASgCDEF/NgIQIAEoAgxBADYCFCABKAIMQQA2AhggASgCDEIANwMgIAEoAgxCADcDKCABKAIMQQA2AjAgASgCDEEANgI0IAEoAgxBADYCOCABKAIMQQA2AjwgASgCDEEAOwFAIAEoAgxBgIDYjXg2AkQgASgCDEIANwNIIAEoAgxBADsBUCABKAIMQQA7AVIgASgCDEEANgJUC9oTAQF/IwBBsAFrIgMkACADIAA2AqgBIAMgATYCpAEgAyACNgKgASADQQA2ApABIAMgAygCpAEoAjBBABA7NgKUASADIAMoAqQBKAI4QQAQOzYCmAECQAJAAkACQCADKAKUAUECRgRAIAMoApgBQQFGDQELIAMoApQBQQFGBEAgAygCmAFBAkYNAQsgAygClAFBAkcNASADKAKYAUECRw0BCyADKAKkASIAIAAvAQxBgBByOwEMDAELIAMoAqQBIgAgAC8BDEH/7wNxOwEMIAMoApQBQQJGBEAgA0H14AEgAygCpAEoAjAgAygCqAFBCGoQxAE2ApABIAMoApABRQRAIANBfzYCrAEMAwsLAkAgAygCoAFBgAJxDQAgAygCmAFBAkcNACADQfXGASADKAKkASgCOCADKAKoAUEIahDEATYCSCADKAJIRQRAIAMoApABECQgA0F/NgKsAQwDCyADKAJIIAMoApABNgIAIAMgAygCSDYCkAELCwJAIAMoAqQBLwFSRQRAIAMoAqQBIgAgAC8BDEH+/wNxOwEMDAELIAMoAqQBIgAgAC8BDEEBcjsBDAsgAyADKAKkASADKAKgARCAAUEBcToAhgEgAyADKAKgAUGACnFBgApHBH8gAy0AhgEFQQELQQFxOgCHASADAn9BASADKAKkAS8BUkGBAkYNABpBASADKAKkAS8BUkGCAkYNABogAygCpAEvAVJBgwJGC0EBcToAhQEgAy0AhwFBAXEEQCADIANBIGpCHBAqNgIcIAMoAhxFBEAgAygCqAFBCGpBDkEAEBUgAygCkAEQJCADQX82AqwBDAILAkAgAygCoAFBgAJxBEACQCADKAKgAUGACHENACADKAKkASkDIEL/////D1YNACADKAKkASkDKEL/////D1gNAgsgAygCHCADKAKkASkDKBAuIAMoAhwgAygCpAEpAyAQLgwBCwJAAkAgAygCoAFBgAhxDQAgAygCpAEpAyBC/////w9WDQAgAygCpAEpAyhC/////w9WDQAgAygCpAEpA0hC/////w9YDQELIAMoAqQBKQMoQv////8PWgRAIAMoAhwgAygCpAEpAygQLgsgAygCpAEpAyBC/////w9aBEAgAygCHCADKAKkASkDIBAuCyADKAKkASkDSEL/////D1oEQCADKAIcIAMoAqQBKQNIEC4LCwsCfyMAQRBrIgAgAygCHDYCDCAAKAIMLQAAQQFxRQsEQCADKAKoAUEIakEUQQAQFSADKAIcEBcgAygCkAEQJCADQX82AqwBDAILIANBAQJ/IwBBEGsiACADKAIcNgIMAn4gACgCDC0AAEEBcQRAIAAoAgwpAxAMAQtCAAunQf//A3ELIANBIGpBgAYQUDYCjAEgAygCHBAXIAMoAowBIAMoApABNgIAIAMgAygCjAE2ApABCyADLQCFAUEBcQRAIAMgA0EVakIHECo2AhAgAygCEEUEQCADKAKoAUEIakEOQQAQFSADKAKQARAkIANBfzYCrAEMAgsgAygCEEECECAgAygCEEHP0wBBAhBAIAMoAhAgAygCpAEvAVJB/wFxEIoBIAMoAhAgAygCpAEoAhBB//8DcRAgAn8jAEEQayIAIAMoAhA2AgwgACgCDC0AAEEBcUULBEAgAygCqAFBCGpBFEEAEBUgAygCEBAXIAMoApABECQgA0F/NgKsAQwCCyADQYGyAkEHIANBFWpBgAYQUDYCDCADKAIQEBcgAygCDCADKAKQATYCACADIAMoAgw2ApABCyADIANB0ABqQi4QKiIANgJMIABFBEAgAygCqAFBCGpBDkEAEBUgAygCkAEQJCADQX82AqwBDAELIAMoAkxBxdMAQcrTACADKAKgAUGAAnEbQQQQQCADKAKgAUGAAnFFBEAgAygCTAJ/QS0gAy0AhgFBAXENABogAygCpAEvAQgLQf//A3EQIAsgAygCTAJ/QS0gAy0AhgFBAXENABogAygCpAEvAQoLQf//A3EQICADKAJMIAMoAqQBLwEMECACQCADLQCFAUEBcQRAIAMoAkxB4wAQIAwBCyADKAJMIAMoAqQBKAIQQf//A3EQIAsgAygCpAEoAhQgA0GeAWogA0GcAWoQwwEgAygCTCADLwGeARAgIAMoAkwgAy8BnAEQIAJAAkAgAy0AhQFBAXFFDQAgAygCpAEpAyhCFFoNACADKAJMQQAQIQwBCyADKAJMIAMoAqQBKAIYECELAkACQCADKAKgAUGAAnFBgAJHDQAgAygCpAEpAyBC/////w9UBEAgAygCpAEpAyhC/////w9UDQELIAMoAkxBfxAhIAMoAkxBfxAhDAELAkAgAygCpAEpAyBC/////w9UBEAgAygCTCADKAKkASkDIKcQIQwBCyADKAJMQX8QIQsCQCADKAKkASkDKEL/////D1QEQCADKAJMIAMoAqQBKQMopxAhDAELIAMoAkxBfxAhCwsgAygCTCADKAKkASgCMBBSQf//A3EQICADIAMoAqQBKAI0IAMoAqABEIIBQf//A3EgAygCkAFBgAYQggFB//8DcWo2AogBIAMoAkwgAygCiAFB//8DcRAgIAMoAqABQYACcUUEQCADKAJMIAMoAqQBKAI4EFJB//8DcRAgIAMoAkwgAygCpAEoAjxB//8DcRAgIAMoAkwgAygCpAEvAUAQICADKAJMIAMoAqQBKAJEECECQCADKAKkASkDSEL/////D1QEQCADKAJMIAMoAqQBKQNIpxAhDAELIAMoAkxBfxAhCwsCfyMAQRBrIgAgAygCTDYCDCAAKAIMLQAAQQFxRQsEQCADKAKoAUEIakEUQQAQFSADKAJMEBcgAygCkAEQJCADQX82AqwBDAELIAMoAqgBIANB0ABqAn4jAEEQayIAIAMoAkw2AgwCfiAAKAIMLQAAQQFxBEAgACgCDCkDEAwBC0IACwsQNkEASARAIAMoAkwQFyADKAKQARAkIANBfzYCrAEMAQsgAygCTBAXIAMoAqQBKAIwBEAgAygCqAEgAygCpAEoAjAQhgFBAEgEQCADKAKQARAkIANBfzYCrAEMAgsLIAMoApABBEAgAygCqAEgAygCkAFBgAYQgQFBAEgEQCADKAKQARAkIANBfzYCrAEMAgsLIAMoApABECQgAygCpAEoAjQEQCADKAKoASADKAKkASgCNCADKAKgARCBAUEASARAIANBfzYCrAEMAgsLIAMoAqABQYACcUUEQCADKAKkASgC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CyABIAEoAggoAhw2AgQCQAJAIAEoAgRFDQAgASgCBCgCACABKAIIRw0AIAEoAgQoAgRBKkYNASABKAIEKAIEQTlGDQEgASgCBCgCBEHFAEYNASABKAIEKAIEQckARg0BIAEoAgQoAgRB2wBGDQEgASgCBCgCBEHnAEYNASABKAIEKAIEQfEARg0BIAEoAgQoAgRBmgVGDQELIAFBATYCDAwBCyABQQA2AgwLIAEoAgwL0gQBAX8jAEEgayIDIAA2AhwgAyABNgIYIAMgAjYCFCADIAMoAhxB3BZqIAMoAhRBAnRqKAIANgIQIAMgAygCFEEBdDYCDANAAkAgAygCDCADKAIcKALQKEoNAAJAIAMoAgwgAygCHCgC0ChODQAgAygCGCADKAIcIAMoAgxBAnRqQeAWaigCAEECdGovAQAgAygCGCADKAIcQdwWaiADKAIMQQJ0aigCAEECdGovAQBOBEAgAygCGCADKAIcIAMoAgxBAnRqQeAWaigCAEECdGovAQAgAygCGCADKAIcQdwWaiADKAIMQQJ0aigCAEECdGovAQBHDQEgAygCHCADKAIMQQJ0akHgFmooAgAgAygCHEHYKGpqLQAAIAMoAhxB3BZqIAMoAgxBAnRqKAIAIAMoAhxB2Chqai0AAEoNAQsgAyADKAIMQQFqNgIMCyADKAIYIAMoAhBBAnRqLwEAIAMoAhggAygCHEHcFmogAygCDEECdGooAgBBAnRqLwEASA0AAkAgAygCGCADKAIQQQJ0ai8BACADKAIYIAMoAhxB3BZqIAMoAgxBAnRqKAIAQQJ0ai8BAEcNACADKAIQIAMoAhxB2Chqai0AACADKAIcQdwWaiADKAIMQQJ0aigCACADKAIcQdgoamotAABKDQAMAQsgAygCHEHcFmogAygCFEECdGogAygCHEHcFmogAygCDEECdGooAgA2AgAgAyADKAIMNgIUIAMgAygCDEEBdDYCDAwBCwsgAygCHEHcFmogAygCFEECdGogAygCEDYCAAvnCAEDfyMAQTBrIgIkACACIAA2AiwgAiABNgIoIAIgAigCKCgCADYCJCACIAIoAigoAggoAgA2AiAgAiACKAIoKAIIKAIMNgIcIAJBfzYCECACKAIsQQA2AtAoIAIoAixBvQQ2AtQoIAJBADYCGANAIAIoAhggAigCHE5FBEACQCACKAIkIAIoAhhBAnRqLwEABEAgAiACKAIYIgE2AhAgAigCLEHcFmohAyACKAIsIgQoAtAoQQFqIQAgBCAANgLQKCAAQQJ0IANqIAE2AgAgAigCGCACKAIsQdgoampBADoAAAwBCyACKAIkIAIoAhhBAnRqQQA7AQILIAIgAigCGEEBajYCGAwBCwsDQCACKAIsKALQKEECSARAAkAgAigCEEECSARAIAIgAigCEEEBaiIANgIQDAELQQAhAAsgAigCLEHcFmohAyACKAIsIgQoAtAoQQFqIQEgBCABNgLQKCABQQJ0IANqIAA2AgAgAiAANgIMIAIoAiQgAigCDEECdGpBATsBACACKAIMIAIoAixB2ChqakEAOgAAIAIoAiwiACAAKAKoLUF/ajYCqC0gAigCIARAIAIoAiwiACAAKAKsLSACKAIgIAIoAgxBAnRqLwECazYCrC0LDAELCyACKAIoIAIoAhA2AgQgAiACKAIsKALQKEECbTYCGANAIAIoAhhBAUhFBEAgAigCLCACKAIkIAIoAhgQdSACIAIoAhhBf2o2AhgMAQsLIAIgAigCHDYCDANAIAIgAigCLCgC4BY2AhggAigCLEHcFmohASACKAIsIgMoAtAoIQAgAyAAQX9qNgLQKCACKAIsIABBAnQgAWooAgA2AuAWIAIoAiwgAigCJEEBEHUgAiACKAIsKALgFjYCFCACKAIYIQEgAigCLEHcFmohAyACKAIsIgQoAtQoQX9qIQAgBCAANgLUKCAAQQJ0IANqIAE2AgAgAigCFCEBIAIoAixB3BZqIQMgAigCLCIEKALUKEF/aiEAIAQgADYC1CggAEECdCADaiABNgIAIAIoAiQgAigCDEECdGogAigCJCACKAIYQQJ0ai8BACACKAIkIAIoAhRBAnRqLwEAajsBACACKAIMIAIoAixB2ChqagJ/IAIoAhggAigCLEHYKGpqLQAAIAIoAhQgAigCLEHYKGpqLQAATgRAIAIoAhggAigCLEHYKGpqLQAADAELIAIoAhQgAigCLEHYKGpqLQAAC0EBajoAACACKAIkIAIoAhRBAnRqIAIoAgwiADsBAiACKAIkIAIoAhhBAnRqIAA7AQIgAiACKAIMIgBBAWo2AgwgAigCLCAANgLgFiACKAIsIAIoAiRBARB1IAIoAiwoAtAoQQJODQAL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ADoAGyADIAE2AhQgAyACNgIQIANByAAQGSIANgIMAkAgAEUEQCADKAIQQQFBtJwBKAIAEBUgA0EANgIcDAELIAMoAgwgAygCEDYCACADKAIMIAMtABtBAXE6AAQgAygCDCADKAIUNgIIAkAgAygCDCgCCEEBTgRAIAMoAgwoAghBCUwNAQsgAygCDEEJNgIICyADKAIMQQA6AAwgAygCDEEANgIwIAMoAgxBADYCNCADKAIMQQA2AjggAyADKAIMNgIcCyADKAIcIQAgA0EgaiQAIAAL4wgBAX8jAEFAaiICIAA2AjggAiABNgI0IAIgAigCOCgCfDYCMCACIAIoAjgoAjggAigCOCgCbGo2AiwgAiACKAI4KAJ4NgIgIAIgAigCOCgCkAE2AhwgAgJ/IAIoAjgoAmwgAigCOCgCLEGGAmtLBEAgAigCOCgCbCACKAI4KAIsQYYCa2sMAQtBAAs2AhggAiACKAI4KAJANgIUIAIgAigCOCgCNDYCECACIAIoAjgoAjggAigCOCgCbGpBggJqNgIMIAIgAigCLCACKAIgQQFrai0AADoACyACIAIoAiwgAigCIGotAAA6AAogAigCOCgCeCACKAI4KAKMAU8EQCACIAIoAjBBAnY2AjALIAIoAhwgAigCOCgCdEsEQCACIAIoAjgoAnQ2AhwLA0ACQCACIAIoAjgoAjggAigCNGo2AigCQCACKAIoIAIoAiBqLQAAIAItAApHDQAgAigCKCACKAIgQQFrai0AACACLQALRw0AIAIoAigtAAAgAigCLC0AAEcNACACIAIoAigiAEEBajYCKCAALQABIAIoAiwtAAFHBEAMAQsgAiACKAIsQQJqNgIsIAIgAigCKEEBajYCKANAIAIgAigCLCIAQQFqNgIsIAAtAAEhASACIAIoAigiAEEBajYCKAJ/QQAgAC0AASABRw0AGiACIAIoAiwiAEEBajYCLCAALQABIQEgAiACKAIoIgBBAWo2AihBACAALQABIAFHDQAaIAIgAigCLCIAQQFqNgIsIAAtAAEhASACIAIoAigiAEEBajYCKEEAIAAtAAEgAUcNABogAiACKAIsIgBBAWo2AiwgAC0AASEBIAIgAigCKCIAQQFqNgIoQQAgAC0AASABRw0AGiACIAIoAiwiAEEBajYCLCAALQABIQEgAiACKAIoIgBB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IAIoAigoAmxrQQFrNgIUAkAgAigCKCgCACgCBCACKAIUTQ0AIAIoAigoAlwgAigCKCgCLEgNACACKAIoIgAgACgCXCACKAIoKAIsazYCXCACKAIoIgAgACgCbCACKAIoKAIsazYCbCACKAIoKAI4IAIoAigoAjggAigCKCgCLGogAigCKCgCbBAaGiACKAIoKAKwLUECSQRAIAIoAigiACAAKAKwLUEBajYCsC0LIAIgAigCKCgCLCACKAIUajYCFAsgAigCFCACKAIoKAIAKAIESwRAIAIgAigCKCgCACgCBDYCFAsgAigCFARAIAIoAigoAgAgAigCKCgCOCACKAIoKAJsaiACKAIUEHMaIAIoAigiACACKAIUIAAoAmxqNgJsCyACKAIoKALALSACKAIoKAJsSQRAIAIoAiggAigCKCgCbDYCwC0LIAIgAigCKCgCvC1BKmpBA3U2AhQgAgJ/Qf//AyACKAIoKAIMIAIoAhRrQf//A0sNABogAigCKCgCDCACKAIUaws2AhQgAgJ/IAIoAhQgAigCKCgCLEsEQCACKAIoKAIsDAELIAIoAhQLNgIgIAIgAigCKCgCbCACKAIoKAJcazYCGAJAIAIoAhggAigCIEkEQCACKAIYRQRAIAIoAiRBBEcNAgsgAigCJEUNASACKAIoKAIAKAIEDQEgAigCGCACKAIUSw0BCyACAn8gAigCGCACKAIUSwRAIAIoAhQMAQsgAigCGAs2AhwgAkEBQQACf0EAIAIoAiRBBEcNABpBACACKAIoKAIAKAIEDQAaIAIoAhwgAigCGEYLQQFxGzYCECACKAIoIAIoAigoAjggAigCKCgCXGogAigCHCACKAIQEFcgAigCKCIAIAIoAhwgACgCXGo2AlwgAigCKCgCABAdCyACQQJBACACKAIQGzYCLAsgAigCLCEAIAJBMGokACAAC7ICAQF/IwBBEGsiASQAIAEgADYCCAJAIAEoAggQdARAIAFBfjYCDAwBCyABIAEoAggoAhwoAgQ2AgQgASgCCCgCHCgCCARAIAEoAggoAiggASgCCCgCHCgCCCABKAIIKAIkEQQACyABKAIIKAIcKAJEBEAgASgCCCgCKCABKAIIKAIcKAJEIAEoAggoAiQRBAALIAEoAggoAhwoAkAEQCABKAIIKAIoIAEoAggoAhwoAkAgASgC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AEEBcUULBEAgAygCEEEUQQAQFSADKAIEEBcgA0EANgIcDAELIAMgAy8BGgJ/IwBBEGsiACADKAIENgIMAn4gACgCDC0AAEEBcQRAIAAoAgwpAxAMAQtCAAunQf//A3ELAn8jAEEQayIAIAMoAgQ2AgwgACgCDCgCBAtBgAYQUDYCACADKAIEEBcgAyADKAIANgIcCyADKAIcIQAgA0EgaiQAIAALtAIBAX8jAEEwayIDJAAgAyAANgIoIAMgATcDICADIAI2AhwCQCADKQMgUARAIANBAToALwwBCyADIAMoAigpAxAgAykDIHw3AwgCQCADKQMIIAMpAyBaBEAgAykDCEL/////AFgNAQsgAygCHEEOQQAQFSADQQA6AC8MAQsgAyADKAIoKAIAIAMpAwinQQR0EE0iADYCBCAARQRAIAMoAhxBDkEAEBUgA0EAOgAvDAELIAMoAiggAygCBDYCACADIAMoAigpAwg3AxADQCADKQMQIAMpAwhaRQRAIAMoAigoAgAgAykDEKdBBHRqEIwBIAMgAykDEEIBfDcDEAwBCwsgAygCKCADKQMIIgE3AxAgAygCKCABNwMIIANBAToALwsgAy0AL0EBcSEAIANBMGokACAAC8wBAQF/IwBBIGsiAiQAIAIgADcDECACIAE2AgwgAkEwEBkiATYCCAJAIAFFBEAgAigCDEEOQQAQFSACQQA2AhwMAQsgAigCCEEANgIAIAIoAghCADcDECACKAIIQgA3AwggAigCCEIANwMgIAIoAghCADcDGCACKAIIQQA2AiggAigCCEEAOgAsIAIoAgggAikDECACKAIMEMUBQQFxRQRAIAIoAggQJSACQQA2AhwMAQsgAiACKAIINgIcCyACKAIcIQEgAkEgaiQAIAELtgUBAX8jAEEwayICJAAgAiAANgIoIAIgATcDIAJAIAIpAyAgAigCKCkDMFoEQCACKAIoQQhqQRJBABAVIAJBfzYCLAwBCyACIAIoAigoAkAgAikDIKdBBHRqNgIcAkAgAigCHCgCAARAIAIoAhwoAgAtAARBAXFFDQELIAJBADYCLAwBCyACKAIcKAIAKQNIQhp8Qv///////////wBWBEAgAigCKEEIakEEQRYQFSACQX82AiwMAQsgAigCKCgCACACKAIcKAIAKQNIQhp8QQAQKEEASARAIAIoAihBCGogAigCKCgCABAYIAJBfzYCLAwBCyACIAIoAigoAgBCBCACQRhqIAIoAihBCGoQQSIANgIUIABFBEAgAkF/NgIsDAELIAIgAigCFBAeOwESIAIgAigCFBAeOwEQIAIoAhQQSEEBcUUEQCACKAIUEBcgAigCKEEIakEUQQAQFSACQX82AiwMAQsgAigCFBAXIAIvARBBAEoEQCACKAIoKAIAIAIvARKtQQEQKEEASARAIAIoAihBCGpBBEG0nAEoAgAQFSACQX82AiwMAgsgAkEAIAIoAigoAgAgAi8BEEEAIAIoAihBCGoQYDYCCCACKAIIRQRAIAJBfzYCLAwCCyACKAIIIAIvARBBgAIgAkEMaiACKAIoQQhqEIQBQQFxRQRAIAIoAggQFiACQX82AiwMAgsgAigCCBAWIAIoAgwEQCACIAIoAgwQgwE2AgwgAigCHCgCACgCNCACKAIMEIUBIQAgAigCHCgCACAANgI0CwsgAigCHCgCAEEBOgAEAkAgAigCHCgCBEUNACACKAIcKAIELQAEQQFxDQAgAigCHCgCBCACKAIcKAIAKAI0NgI0IAIoAhwoAgRBAToABAsgAkEANgIsCyACKAIsIQAgAkEwaiQAIAALBwAgACgCAAuMAQEBfyMAQSBrIgIkACACIAA2AhggAiABNgIUIAJBADYCEAJAIAIoAhRFBEAgAkEANgIcDAELIAIgAigCFBAZNgIMIAIoAgxFBEAgAigCEEEOQQAQFSACQQA2AhwMAQsgAigCDCACKAIYIAIoAhQQGhogAiACKAIMNgIcCyACKAIcIQAgAkEgaiQAIAALGABBqJwBQgA3AgBBsJwBQQA2AgBBqJwBC4gBAQF/IwBBIGsiAyQAIAMgADYCFCADIAE2AhAgAyACNwMIAkACQCADKAIUKAIkQQFGBEAgAykDCEL///////////8AWA0BCyADKAIUQQxqQRJBABAVIANCfzcDGAwBCyADIAMoAhQgAygCECADKQMIQQsQIjcDGAsgAykDGCECIANBIGokACACC3MBAX8jAEEgayIBJAAgASAANgIYIAFCCDcDECABIAEoAhgpAxAgASkDEHw3AwgCQCABKQMIIAEoAhgpAxBUBEAgASgCGEEAOgAAIAFBfzYCHAwBCyABIAEoAhggASkDCBAtNgIcCyABKAIcGiAB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AmwLIAQoAmwhACAEQfAAaiQAIAAL1wEBAX8jAEEgayICJAAgAiAANgIYIAIgATYCFCACQYmYATYCECACQQQ2AgwCQAJAIAIoAhQgAigCDE8EQCACKAIMDQELIAJBADYCHAwBCyACIAIoAhhBf2o2AggDQAJAIAIgAigCCEEBaiACKAIQLQAAIAIoAhggAigCCGsgAigCFCACKAIMa2oQpgEiADYCCCAARQ0AIAIoAghBAWogAigCEEEBaiACKAIMQQFrEFMNASACIAIoAgg2AhwMAgsLIAJBADYCHAsgAigCHCEAIAJBIGokACAAC8EGAQF/IwBB4ABrIgIkACACIAA2AlggAiABNwNQAkAgAikDUEIWVARAIAIoAlhBCGpBE0EAEBUgAkEANgJcDAELIAICfiACKQNQQqqABFQEQCACKQNQDAELQqqABAs3AzAgAigCWCgCAEIAIAIpAzB9QQIQKEEASARAIwBBEGsiACACKAJYKAIANgIMIAIgACgCDEEMajYCCAJAAn8jAEEQayIAIAIoAgg2AgwgACgCDCgCAEEERgsEQCMAQRBrIgAgAigCCDYCDCAAKAIMKAIEQRZGDQELIAIoAlhBCGogAigCCBBEIAJBADYCXAwCCwsgAiACKAJYKAIAEEoiATcDOCABQgBTBEAgAigCWEEIaiACKAJYKAIAEBggAkEANgJcDAELIAIgAigCWCgCACACKQMwQQAgAigCWEEIahBBIgA2AgwgAEUEQCACQQA2AlwMAQsgAkJ/NwMgIAJBADYCTCACKQMwQqqABFoEQCACKAIMQhQQLRoLIAJBEGpBE0EAEBUgAiACKAIMQgAQHzYCRANAAkAgAiACKAJEIAIoAgwQMEISfacQ9gEiADYCRCAARQ0AIAIoAgwgAigCRAJ/IwBBEGsiACACKAIMNgIMIAAoAgwoAgQLa6wQLRogAiACKAJYIAIoAgwgAikDOCACQRBqEPUBIgA2AkggAARAAkAgAigCTARAIAIpAyBCAFcEQCACIAIoAlggAigCTCACQRBqEGU3AyALIAIgAigCWCACKAJIIAJBEGoQZTcDKAJAIAIpAyAgAikDKFMEQCACKAJMECUgAiACKAJINgJMIAIgAikDKDcDIAwBCyACKAJIECULDAELIAIgAigCSDYCTAJAIAIoAlgoAgRBBHEEQCACIAIo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QXhGBEAgABCQAg0BCyADQYFgTwR/QbScAUEAIANrNgIAQX8FIAMLDAELIAIgABCPAiACIAEQAiIAQYFgTwR/QbScAUEAIABrNgIAQX8FIAALCyEAIAJBIGokACAAC54BAQN/A0AgACACaiIDIAJB2JcBai0AADoAACACQQ5HIQQgAkEBaiECIAQNAAsgAQRAQQ4hAiABIQMDQCACQQFqIQIgA0EJSyEEIANBCm4hAyAEDQALIAAgAmpBADoAAANAIAAgAkF/aiICaiABIAFBCm4iA0EKbGtBMHI6AAAgAUEJSyEEIAMhASAEDQALDwsgA0EwOgAAIABBADoADws3AQF/IwBBIGsiASQAAn9BASAAIAFBCGoQCCIARQ0AGkG0nAEgADYCAEEACyEAIAFBIGokACAACyABAn8gABAsQQFqIgEQGSICRQRAQQAPCyACIAAgARAaC6UBAQF/IwBBIGsiAiAANgIUIAIgATYCEAJAIAIoAhRFBEAgAkJ/NwMYDAELIAIoAhBBCHEEQCACIAIoAhQpAzA3AwgDQEEAIQAgAikDCEIAVgR/IAIoAhQoAkAgAikDCEIBfadBBHRqKAIARQVBAAtBAXEEQCACIAIpAwhCf3w3AwgMAQsLIAIgAikDCDcDGAwBCyACIAIoAhQpAzA3AxgLIAIpAxgL8gEBAX8jAEEgayIDJAAgAyAANgIUIAMgATYCECADIAI3AwgCQCADKAIURQRAIANCfzcDGAwBCyADKAIUKAIEBEAgA0J/NwMYDAELIAMpAwhC////////////AFYEQCADKAIUQQRqQRJBABAVIANCfzcDGAwBCwJAIAMoAhQtABBBAXFFBEAgAykDCFBFDQELIANCADcDGAwBCyADIAMoAhQoAhQgAygCECADKQMIEC8iAjcDACACQgBTBEAgAygCFEEEaiADKAIUKAIUEBggA0J/NwMYDAELIAMgAykDADcDGAsgAykDGCECIANBIGokACACC0cBAX8jAEEgayIDJAAgAyAANgIcIAMgATcDECADIAI2AgwgAygCHCADKQMQIAMoAgwgAygCHCgCHBCdASEAIANBIGokACAAC38CAX8BfiMAQSBrIgMkACADIAA2AhggAyABNgIUIAMgAjYCECADIAMoAhggAygCFCADKAIQEG4iBDcDCAJAIARCAFMEQCADQQA2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aiIBaiICLQAAQS9HDQALIAILqQEBA38CQCAALQAAIgJFDQADQCABLQAAIgRFBEAgAiEDDAILAkAgAiAERg0AIAJBIHIgAiACQb9/akEaSRsgAS0AACICQSByIAIgAkG/f2pBGkkbRg0AIAAtAAAhAwwCCyABQQFqIQEgAC0AASECIABBAWohACACDQALCyADQf8BcSIAQSByIAAgAEG/f2pBGkkbIAEtAAAiAEEgciAAIABBv39qQRpJG2sL6AMBA38jAEGwAWsiASQAIAEgADYCqAEgASgCqAEQOAJAAkAgASgCqAEoAgBBAE4EQCABKAKoASgCAEGgDigCAEgNAQsgASABKAKoASgCADYCECABQSBqQbyXASABQRBqEG8gAUEANgKkASABIAFBIGo2AqABDAELIAEgASgCqAEoAgBBAnRBoA1qKAIANgKkAQJAAkACQAJAIAEoAqgBKAIAQQJ0QbAOaigCAEF/ag4CAAECCyABIAEoAqgBKAIEQZCaASgCABClAjYCoAEMAgsjAEEQayIAIAEoAqgBKAIENgIMIAFBACAAKAIMa0ECdEHY1ABqKAIANgKgAQwBCyABQQA2AqABCwsCQCABKAKgAUUEQCABIAEoAqQBNgKsAQwBCyABIAEoAqABECwCfyABKAKkAQRAIAEoAqQBECxBAmoMAQtBAAtqQQFqEBkiADYCHCAARQRAIAFB2A0oAgA2AqwBDAELIAEoAhwhAAJ/IAEoAqQBBEAgASgCpAEMAQtB1JcBCyECQdWXAUHUlwEgASgCpAEbIQMgASABKAKgATYCCCABIAM2AgQgASACNgIAIABBzZcBIAEQbyABKAKoASABKAIcNgIIIAEgASgCHDYCrAELIAEoAqwBIQAgAUGwAWokACAAC3EBA38CQAJAA0AgACACQdCIAWotAABHBEBB1wAhAyACQQFqIgJB1wBHDQEMAgsLIAIiAw0AQbCJASEADAELQbCJASECA0AgAi0AACEEIAJBAWoiACECIAQNACAAIQIgA0F/aiIDDQALCyABKAIUGiAACzMBAX8gACgCFCIDIAEgAiAAKAIQIANrIgEgASACSxsiARAaGiAAIAAoAhQgAWo2AhQgAguKAQECfyMAQaABayIDJAAgA0EIakG4hwFBkAEQGhogAyAANgI0IAMgADYCHCADQX4gAGsiBEH/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NgIAQX8PCyAAQgA3AgQgACAAKAIsIgE2AhwgACABNgIUIAAgASAAKAIwajYCEEEACwYAQfSgAQsGAEHwoAELBgBB6KABC9kDAgJ/An4jAEEgayICJAACQCABQv///////////wCDIgVCgICAgICAwP9DfCAFQoCAgICAgMCAvH98VARAIAFCBIYgAEI8iIQhBCAAQv//////////D4MiAEKBgICAgICAgAhaBEAgBEKBgICAgICAgMAAfCEEDAILIARCgICAgICAgIBAfSEEIABCgICAgICAgIAIhUIAUg0BIARCAYMgBHwhBAwBCyAAUCAFQoCAgICAgMD//wBUIAVCgICAgICAwP//AFEbRQRAIAFCBIYgAEI8iIRC/////////wODQoCAgICAgID8/wCEIQQMAQtCgICAgICAgPj/ACEEIAVC////////v//DAFYNAEIAIQQgBUIwiKciA0GR9wBJDQAgAkEQaiAAIAFC////////P4NCgICAgICAwACEIgQgA0H/iH9qELQCIAIgACAEQYH4ACADaxCzAiACKQMIQgSGIAIpAwAiAEI8iIQhBCACKQMQIAIpAxiEQgBSrSAAQv//////////D4OEIgBCgYCAgICAgIAIWgRAIARCAXwhBAwBCyAAQoCAgICAgICACIVCAFINACAEQgGDIAR8IQQLIAJBIGokACAEIAFCgICAgICAgICAf4OEvwtQAQF+AkAgA0HAAHEEQCACIANBQGqtiCEBQgAhAgwBCyADRQ0AIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIghAgsgACABNwMAIAAgAjcDCAtQAQF+AkAgA0HAAHEEQCABIANBQGqthiECQgAhAQwBCyADRQ0AIAIgA60iBIYgAUHAACADa62IhCECIAEgBIYhAQsgACABNwMAIAAgAjcDCAuLAgACQCAABH8gAUH/AE0NAQJAQZCaASgCACgCAEUEQCABQYB/cUGAvwNGDQMMAQsgAUH/D00EQCAAIAFBP3FBgAFyOgABIAAgAUEGdkHAAXI6AABBAg8LIAFBgLADT0EAIAFBgEBxQYDAA0cbRQRAIAAgAUE/cUGAAXI6AAIgACABQQx2QeABcjoAACAAIAFBBnZBP3FBgAFyOgABQQMPCyABQYCAfGpB//8/TQRAIAAgAUE/cUGAAXI6AAMgACABQRJ2QfABcjoAACAAIAFBBnZBP3FBgAFyOgACIAAgAUEMdkE/cUGAAXI6AAFBBA8LC0G0nAFBGTYCAEF/BUEBCw8LIAAgAToAAEEBC74CAQF/IwBBwMAAayIDJAAgAyAANgK4QCADIAE2ArRAIAMgAjcDqEACQCADKAK0QBBJQQBIBEAgAygCuEBBCGogAygCtEAQGCADQX82ArxADAELIANBADYCDCADQgA3AxADQAJAIAMgAygCtEAgA0EgakKAwAAQLyICNwMYIAJCAFcNACADKAK4QCADQSBqIAMpAxgQNkEASARAIANBfzYCDAUgAykDGEKAwABSDQIgAygCuEAoAlRFDQIgAykDqEBCAFcNAiADIAMpAxggAykDEHw3AxAgAygCuEAoAlQgAykDELkgAykDqEC5oxBYDAILCwsgAykDGEIAUwRAIAMoArhAQQhqIAMoArRAEBggA0F/NgIMCyADKAK0QBAyGiADIAMoAgw2ArxACyADKAK8QCEAIANBwMAAaiQAIAALqgEBAX8jAEEwayIDJAAgAyAANgIoIAMgATYCJCADIAI3AxggAyADKAIoKAIAEDUiAjcDEAJAIAJCAFMEQCADQX82AiwMAQsgAyADKAIoIAMoAiQgAykDGBCRAyICNwMAIAJCAFMEQCADQX82AiwMAQsgAyADKAIoKAIAEDUiAjcDCCACQgBTBEAgA0F/NgIsDAELIANBADYCLAsgAygCLCEAIANBMGokACAAC/4BAQF/IwBBoMAAayICJAAgAiAANgKYQCACIAE3A5BAIAIgAikDkEC6OQMAAkADQCACKQOQQEIAVgRAIAICfkKAwAAgAikDkEBCgMAAVg0AGiACKQOQQAs+AgwgAigCmEAoAgAgAkEQaiACKAIMrSACKAKYQEEIahBhQQBIBEAgAkF/NgKcQAwDCyACKAKYQCACQRBqIAIoAgytEDZBAEgEQCACQX82ApxADAMFIAIgAikDkEAgAjUCDH03A5BAIAIoAphAKAJUIAIrAwAgAikDkEC6oSACKwMAoxBYDAILAAsLIAJBADYCnEALIAIoApxAIQAgAkGgwABqJAAgAAvnEQIBfwF+IwBBoAFrIgMkACADIAA2ApgBIAMgATYClAEgAyACNgKQAQJAIAMoApQBIANBOGoQOUEASARAIAMoApgBQQhqIAMoApQBEBggA0F/NgKcAQwBCyADKQM4QsAAg1AEQCADIAMpAzhCwACENwM4IANBADsBaAsCQAJAIAMoApABKAIQQX9HBEAgAygCkAEoAhBBfkcNAQsgAy8BaEUNACADKAKQASADLwFoNgIQDAELAkACQCADKAKQASgCEA0AIAMpAzhCBINQDQAgAyADKQM4QgiENwM4IAMgAykDUDcDWAwBCyADIAMpAzhC9////w+DNwM4CwsgAykDOEKAAYNQBEAgAyADKQM4QoABhDcDOCADQQA7AWoLIANBgAI2AiQCQCADKQM4QgSDUARAIAMgAygCJEGACHI2AiQgA0J/NwNwDAELIAMoApABIAMpA1A3AyggAyADKQNQNwNwAkAgAykDOEIIg1AEQAJAAkACQAJAAkACfwJAIAMoApABKAIQQX9HBEAgAygCkAEoAhBBfkcNAQtBCAwBCyADKAKQASgCEAtB//8DcQ4NAgMDAwMDAwMBAwMDAAMLIANClMLk8w83AxAMAwsgA0KDg7D/DzcDEAwCCyADQv////8PNwMQDAELIANCADcDEAsgAykDUCADKQMQVgRAIAMgAygCJEGACHI2AiQLDAELIAMoApABIAMpA1g3AyALCyADIAMoApgBKAIAEDUiBDcDiAEgBEIAUwRAIAMoApgBQQhqIAMoApgBKAIAEBggA0F/NgKcAQwBCyADKAKQASIAIAAvAQxB9/8DcTsBDCADIAMoApgBIAMoApABIAMoAiQQXiIANgIoIABBAEgEQCADQX82ApwBDAELIAMgAy8BaAJ/AkAgAygCkAEoAhBBf0cEQCADKAKQASgCEEF+Rw0BC0EIDAELIAMoApABKAIQC0H//wNxRzoAIiADIAMtACJBAXEEfyADLwFoQQBHBUEAC0EBcToAISADIAMvAWgEfyADLQAhBUEBC0EBcToAICADIAMtACJBAXEEfyADKAKQASgCEEEARwVBAAtBAXE6AB8gAwJ/QQEgAy0AIkEBcQ0AGkEBIAMoApABKAIAQYABcQ0AGiADKAKQAS8BUiADLwFqRwtBAXE6AB4gAyADLQAeQQFxBH8gAy8BakEARwVBAAtBAXE6AB0gAyADLQAeQQFxBH8gAygCkAEvAVJBAEcFQQALQQFxOgAcIAMgAygClAE2AjQjAEEQayIAIAMoAjQ2AgwgACgCDCIAIAAoAjBBAWo2AjAgAy0AHUEBcQRAIAMgAy8BakEAEHciADYCDCAARQRAIAMoApgBQQhqQRhBABAVIAMoAjQQHCADQX82ApwBDAILIAMgAygCmAEgAygCNCADLwFqQQAgAygCmAEoAhwgAygCDBEGACIANgIwIABFBEAgAygCNBAcIANBfzYCnAEMAgsgAygCNBAcIAMgAygCMDYCNAsgAy0AIUEBcQRAIAMgAygCmAEgAygCNCADLwFoEKsBIgA2AjAgAEUEQCADKAI0EBwgA0F/NgKcAQwCCyADKAI0EBwgAyADKAIwNgI0CyADLQAgQQFxBEAgAyADKAKYASADKAI0QQAQqgEiADYCMCAARQRAIAMoAjQQHCADQX82ApwBDAILIAMoAjQQHCADIAMoAjA2AjQLIAMtAB9BAXEEQCADIAMoApgBIAMoAjQgAygCkAEoAhAgAygCkAEvAVAQwwIiADYCMCAARQRAIAMoAjQQHCADQX82ApwBDAILIAMoAjQQHCADIAMoAjA2AjQLIAMtABxBAXEEQCADQQA2AgQCQCADKAKQASgCVARAIAMgAygCkAEoAlQ2AgQMAQsgAygCmAEoAhwEQCADIAMoApgBKAIcNgIECwsgAyADKAKQAS8BUkEBEHciADYCCCAARQRAIAMoApgBQQhqQRhBABAVIAMoAjQQHCADQX82ApwBDAILIAMgAygCmAEgAygCNCADKAKQAS8BUkEBIAMoAgQgAygCCBEGACIANgIwIABFBEAgAygCNBAcIANBfzYCnAEMAgsgAygCNBAcIAMgAygCMDYCNAsgAyADKAKYASgCABA1IgQ3A4ABIARCAFMEQCADKAKYAUEIaiADKAKYASgCABAYIANBfzYCnAEMAQsgAyADKAKYASADKAI0IAMpA3AQtgI2AiwgAygCNCADQThqEDlBAEgEQCADKAKYAUEIaiADKAI0EBggA0F/NgIsCyADIAMoAjQQvAIiADoAIyAAQRh0QRh1QQBIBEAgAygCmAFBCGogAygCNBAYIANBfzYCLAsgAygCNBAcIAMoAixBAEgEQCADQX82ApwBDAELIAMgAygCmAEoAgAQNSIENwN4IARCAFMEQCADKAKYAUEIaiADKAKYASgCABAYIANBfzYCnAEMAQsgAygCmAEoAgAgAykDiAEQqAFBAEgEQCADKAKYAUEIaiADKAKYASgCABAYIANBfzYCnAEMAQsgAykDOELkAINC5ABSBEAgAygCmAFBCGpBFEEAEBUgA0F/NgKcAQwBCyADKAKQASgCAEEgcUUEQAJAIAMpAzhCEINCAFIEQCADKAKQASADKAJgNgIUDAELIAMoApABQRRqEAEaCwsgAygCkAEgAy8BaDYCECADKAKQASADKAJkNgIYIAMoApABIAMpA1A3AyggAygCkAEgAykDeCADKQOAAX03AyAgAygCkAEgAygCkAEvAQxB+f8DcSADLQAjQQF0cjsBDCADKAKQASADKAIkQYAIcUEARxCLAyADIAMoApgBIAMoApABIAMoAiQQXiIANgIsIABBAEgEQCADQX82ApwBDAELIAMoAiggAygCLEcEQCADKAKYAUEIakEUQQAQFSADQX82ApwBDAELIAMoApgBKAIAIAMpA3gQqAFBAEgEQCADKAKYAUEIaiADKAKYASgCABAYIANBfzYCnAEMAQsgA0EANgKcAQsgAygCnAEhACADQaABaiQAIAALrwIBAX8jAEEgayICIAA2AhwgAiABNgIYIAJBADYCFCACQgA3AwACQCACKAIcLQAoQQFxRQRAIAIoAhwoAhggAigCHCgCFEYNAQsgAkEBNgIUCyACQgA3AwgDQCACKQMIIAIoAhwpAzBUBEACQAJAIAIoAhwoAkAgAikDCKdBBHRqKAIIDQAgAigCHCgCQCACKQMIp0EEdGotAAxBAXENACACKAIcKAJAIAIpAwinQQR0aigCBEUNASACKAIcKAJAIAIpAwinQQR0aigCBCgCAEUNAQsgAkEBNgIUCyACKAIcKAJAIAIpAwinQQR0ai0ADEEBcUUEQCACIAIpAwBCAXw3AwALIAIgAikDCEIBfDcDCAwBCwsgAigCGARAIAIoAhggAikDADcDAAsgAigCFAuMEAMCfwF+AXwjAEHgAGsiASQAIAEgADYCWAJAIAEoAlhFBEAgAUF/NgJcDAELIAEgASgCWCABQUBrELoCNgIkIAEpA0BQBEACQCABKAJYKAIEQQhxRQRAIAEoAiRFDQELIAEoAlgoAgAQhQJBAEgEQAJAAn8jAEEQayICIAEoAlgoAgA2AgwjAEEQayIAIAIoAgxBDGo2AgwgACgCDCgCAEEWRgsEQCMAQRBrIgIgASgCWCgCADYCDCMAQRBr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OgAfCyADLQAfQQFxIQAgA0EgaiQAIAALkAEBAX8jAEEQayIBJAAgASAANgIIIAEgASgCCDYCBAJAIAEoAgQtAARBAXEEQCABIAEoAgRBEGoQsgE2AgAMAQsgASABKAIEQRBqEM4CNgIACwJAIAEoAgAEQCABKAIEKAIAQQ0gASgCABAVIAFBADoADwwBCyABQQE6AA8LIAEtAA9BAXEhACABQRBqJAAgAAvAAQEBfyMAQRBrIgEkACABIAA2AgggASABKAIINgIEIAEoAgRBADYCFCABKAIEQQA2AhAgASgCBEEANgIgIAEoAgRBADYCHAJAIAEoAgQtAARBAXEEQCABIAEoAgRBEGogASgCBCgCCBDiAjYCAAwBCyABIAEoAgRBEGoQ0wI2AgALAkAgASgCAARAIAEoAgQoAgBBDSABKAIAEBUgAUEAOgAPDAELIAFBAToADwsgAS0AD0EBcSEAIAFBEGokACAAC28BAX8jAEEQayIBIAA2AgggASABKAIINgIEAkAgASgCBC0ABEEBcUUEQCABQQA2AgwMAQsgASgCBCgCCEEDSARAIAFBAjYCDAwBCyABKAIEKAIIQQdKBEAgAUEBNgIMDAELIAFBADYCDAsgASgCDAssAQF/IwBBEGsiASQAIAEgADYCDCABIAEoAgw2AgggASgCCBAWIAFBEGokAAs8AQF/IwBBEGsiAyQAIAMgADsBDiADIAE2AgggAyACNgIEQQEgAygCCCADKAIEEK8BIQAgA0EQaiQAIAALmQEBAX8jAEEQayIBJAAgASAANgIIAkAgASgCCBBLBEAgAUF+NgIMDAELIAEgASgCCCgCHDYCBCABKAIEKAI4BEAgASgCCCgCKCABKAIEKAI4IAEoAggoAiQRBAALIAEoAggoAiggASgCCCgCHCABKAIIKAIkEQQAIAEoAghBADYCHCABQQA2AgwLIAEoAgwhACABQRBqJAAgAAudBAEBfyMAQSBrIgMkACADIAA2AhggAyABNgIUIAMgAjYCECADIAMoAhgoAhw2AgwCQCADKAIMKAI4RQRAIAMoAhgoAihBASADKAIMKAIodEEBIAMoAhgoAiARAQAhACADKAIMIAA2AjggAygCDCgCOEUEQCADQQE2AhwMAgsLIAMoAgwoAixFBEAgAygCDEEBIAMoAgwoAih0NgIsIAMoAgxB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ODYCQCABKAJYIAEoAjAQ1wIgASABKAJYKAIMNgJIIAEgASgCWCgCEDYCQCABIAEoAlgoAgA2AkwgASABKAJYKAIENgJEIAEgASgCUCgCPDYCPCABIAEoAlAoAkA2AjggASgCUCgCBEG//gBGBEAgASgCUEF/NgLINwsMDQsgASgCUEEANgLINwNAAkAgASABKAJQKAJQIAEoAjxBASABKAJQKAJYdEEBa3FBAnRqKAEANgEgIAEtACEgASgCOE0NACABKAJERQ0NIAEgASgCREF/ajYCRCABIAEoAkwiAEEBajYCTCABIAEoAjwgAC0AACABKAI4dGo2AjwgASABKAI4QQhqNgI4DAELCwJAIAEtACBFDQAgAS0AIEHwAXENACABIAEoASA2ARgDQAJAIAEgASgCUCgCUCABLwEaIAEoAjxBASABLQAZIAEtABhqdEEBa3EgAS0AGXZqQQJ0aigBADYBICABLQAZIAEtACFqIAEoAjhNDQAgASgCREUNDiABIAEoAkRBf2o2AkQgASABKAJMIgBBAWo2AkwgASABKAI8IAAtAAAgASgCOHRqNgI8IAEgASgCOEEIajYCOAwBCwsgASABKAI8IAEtABl2NgI8IAEgASgCOCABLQAZazYCOCABKAJQIgAgAS0AGSAAKALIN2o2Asg3CyABIAEoAjwgAS0AIXY2AjwgASABKAI4IAEtACFrNgI4IAEoAlAiACABLQAhIAAoAsg3ajYCyDcgASgCUCABLwEiNgJEIAEtACBFBEAgASgCUEHN/gA2AgQMDQsgAS0AIEEgcQRAIAEoAlBBfzYCyDcgASgCUEG//gA2AgQMDQsgAS0AIEHAAHEEQCABKAJYQYfxADYCGCABKAJQQdH+ADYCBAwNCyABKAJQIAEtACBBD3E2AkwgASgCUEHJ/gA2AgQLIAEoAlAoAkwEQANAIAEoAjggASgCUCgCTEkEQCABKAJERQ0NIAEgASgCREF/ajYCRCABIAEoAkwiAEEBajYCTCABIAEoAjwgAC0AACABKAI4dGo2AjwgASABKAI4QQhqNgI4DAELCyABKAJQIgAgACgCRCABKAI8QQEgASgCUCgCTHRBAWtxajYCRCABIAEoAjwgASgCUCgCTHY2AjwgASABKAI4IAEoAlAoAkxrNgI4IAEoAlAiACABKAJQKAJMIAAoAsg3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UCIAQQFqNgJQIAIgAigCLCAALQAAIAIoAih0ajYCLCACIAIoAihBCGo2AiggAigCKCACKAIMSQRAIAIgAigCUCIAQQFqNgJQIAIgAigCLCAALQAAIAIoAih0ajYCLCACIAIoAihBCGo2AigLCyACIAIoAgQgAigCLEEBIAIoAgx0QQFrcWo2AgQgAiACKAIsIAIoAgx2NgIsIAIgAigCKCACKAIMazYCKCACIAIoAkggAigCRGs2AgwCQCACKAIEIAIoAgxLBEAgAiACKAIEIAIoAgxrNgIMIAIoAgwgAigCOEsEQCACKAJUKALENwRAIAIoAlxBsO0ANgIYIAIoAlRB0f4ANgIEDAoLCyACIAIoAjA2AgACQCACKAI0RQRAIAIgAigCACACKAI8IAIoAgxrajYCACACKAIMIAIoAghJBEAgAiACKAIIIAIoAgxrNgIIA0AgAiACKAIAIgBBAWo2AgAgAC0AACEAIAIgAigCSCIBQQFqNgJIIAEgADoAACACIAIoAgxBf2oiADYCDCAADQALIAIgAigCSCACKAIEazYCAAsMAQsCQCACKAI0IAIoAgxJBEAgAiACKAIAIAIoAjwgAigCNGogAigCDGtqNgIAIAIgAigCDCACKAI0azYCDCACKAIMIAIoAghJBEAgAiACKAIIIAIoAgxrNgIIA0AgAiACKAIAIgBBAWo2AgAgAC0AACEAIAIgAigCSCIBQQFqNgJIIAEgADoAACACIAIoAgxBf2oiADYCDCAADQALIAIgAigCMDYCACACKAI0IAIoAghJBEAgAiACKAI0NgIMIAIgAigCCCACKAIMazYCCANAIAIgAigCACIAQQFqNgIAIAAtAAAhACACIAIoAkgiAUEBajYCSCABIAA6AAAgAiACKAIMQX9qIgA2AgwgAA0ACyACIAIoAkggAigCBGs2AgALCwwBCyACIAIoAgAgAigCNCACKAIMa2o2AgAgAigCDCACKAIISQRAIAIgAigCCCACKAIMazYCCANAIAIgAigCACIAQQFqNgIAIAAtAAAhACACIAIoAkgiAUEBajYCSCABIAA6AAAgAiACKAIMQX9qIgA2AgwgAA0ACyACIAIoAkggAigCBGs2AgALCwsDQCACKAIIQQJNRQRAIAIgAigCACIAQQFqNgIAIAAtAAAhACACIAIoAkgiAUEBajYCSCABIAA6AAAgAiACKAIAIgBBAWo2AgAgAC0AACEAIAIgAigCSCIBQQFqNgJIIAEgADoAACACIAIoAgAiAEEBajYCACAALQAAIQAgAiACKAJIIgFBAWo2AkggASAAOgAAIAIgAigCCEEDazYCCAwBCwsMAQsgAiACKAJIIAIoAgRrNgIAA0AgAiACKAIAIgBBAWo2AgAgAC0AACEAIAIgAigCSCIBQQFqNgJIIAEgADoAACACIAIoAgAiAEEBajYCACAALQAAIQAgAiACKAJIIgFBAWo2AkggASAAOgAAIAIgAigCACIAQQFqNgIAIAAtAAAhACACIAIoAkgiAUEBajYCSCABIAA6AAAgAiACKAIIQQNrNgIIIAIoAghBAksNAAsLIAIoAggEQCACIAIoAgAiAEEBajYCACAALQAAIQAgAiACKAJIIgFBAWo2AkggASAAOgAAIAIoAghBAUsEQCACIAIoAgAiAEEBajYCACAALQAAIQAgAiACKAJIIgFBAWo2AkggASAAOgAACwsMAgsgAigCDEHAAHFFBEAgAkEQaiACKAIgIAIvARIgAigCLEEBIAIoAgx0QQFrcWpBAnRqKAEANgEADAELCyACKAJcQc7tADYCGCACKAJUQdH+ADYCBAwECwwCCyACKAIMQcAAcUUEQCACQRBqIAIoAiQgAi8BEiACKAIsQQEgAigCDHRBAWtxakECdGooAQA2AQAMAQsLIAIoAgxBIHEEQCACKAJUQb/+ADYCBAwCCyACKAJcQeTtADYCGCACKAJUQdH+ADYCBAwBC0EAIQAgAigCUCACKAJMSQR/IAIoAkggAigCQEkFQQALQQFxDQELCyACIAIoAihBA3Y2AgggAiACKAJQIAIoAghrNgJQIAIgAigCKCACKAIIQQN0azYCKCACIAIoAixBASACKAIodEEBa3E2AiwgAigCXCACKAJQNgIAIAIoAlwgAigCSDYCDCACKAJcAn8gAigCUCACKAJMSQRAIAIoAkwgAigCUGtBBWoMAQtBBSACKAJQIAIoAkxraws2AgQgAigCXAJ/IAIoAkggAigCQEkEQCACKAJAIAIoAkhrQYECagwBC0GBAiACKAJIIAIoAkBraws2AhAgAigCVCACKAIsNgI8IAIoAlQgAigCKDYCQAvBEAECfyMAQSBrIgIkACACIAA2AhggAiAB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Ai8BEDsBACACLQATIQEgAigCKCIAKAKYLSEDIAAgACgCoC0iAEEBajYCoC0gACADaiABOgAAIAIgAi8BEEF/ajsBECACKAIoIAItABNBgNkAai0AAEECdGpBmAlqIgAgAC8BAEEBajsBACACKAIoQYgTagJ/IAIvARBBgAJIBEAgAi8BEC0AgFUMAQsgAi8BEEEHdUGAAmotAIBVC0ECdGoiACAALwEAQQFqOwEAIAIgAigCKCgCoC0gAigCKCgCnC1BAWtGNgIgIAIoAigiACAAKAJ0IAIoAigoAmBrNgJ0IAIoAigiACACKAIoKAJgIAAoAmxqNgJsIAIoAihBADYCYAwBCyACIAIoAigiACgCOCAAKAJsai0AADoADyACKAIoIgAoAqQtIAAoAqAtQQF0akEAOwEAIAItAA8hASACKAIoIgAoApgtIQMgACAAKAKgLSIAQQFqNgKgLSAAIANqIAE6AAAgAigCKCACLQAPQQJ0aiIAIAAvAZQBQQFqOwGUASACIAIoAigoAqAtIAIoAigoApwtQQFrRjYCICACKAIoIgAgACgCdEF/ajYCdCACKAIoIgAgACgCbEEBajYCbAsgAigCIARAIAIoAigCfyACKAIoKAJcQQBOBEAgAigCKCgCOCACKAIoKAJcagwBC0EACyACKAIoKAJsIAIoAigoAlxrQQAQKSACKAIoIAIoAigoAmw2AlwgAigCKCgCABAdIAIoAigoAgAoAhBFBEAgAkEANgIsDAQLCwwBCwsgAigCKEEANgK0LSACKAIkQQRGBEAgAigCKAJ/IAIoAigoAlxBAE4EQCACKAIoKAI4IAIoAigoAlxqDAELQQALIAIoAigoAmwgAigCKCgCXGtBARApIAIoAiggAigCKCgCbDYCXCACKAIoKAIAEB0gAigCKCgCACgCEEUEQCACQQI2AiwMAgsgAkEDNgIsDAELIAIoAigoAqAtBEAgAigCKAJ/IAIoAigoAlxBAE4EQCACKAIoKAI4IAIoAigoAlxqDAELQQALIAIoAigoAmwgAigCKCgCXGtBABApIAIoAiggAigCKCgCbDYCXCACKAIoKAIAEB0gAigCKCgCACgCEEUEQCACQQA2AiwMAgsLIAJBATYCLAsgAigCLCEAIAJBMGokACAAC8AFAQJ/IwBBIGsiAiQAIAIgADYCGCACIAE2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EB0gAigCLCgCGEEASgRAIAIoAixBACACKAIsKAIYazYCGAsgAkEAQQEgAigCLCgCFBs2AjwLIAIoAjwhACACQUBrJAAgAAuOAgEBfyMAQSBrIgEgADYCHCABIAEoAhwoAiw2AgwgASABKAIcKAJMNgIYIAEgASgCHCgCRCABKAIYQQF0ajYCEANAIAEgASgCEEF+aiIANgIQIAEgAC8BADYCFCABKAIQAn8gASgCFCABKAIMTwRAIAEoAhQgASgCDGsMAQtBAAs7AQAgASABKAIYQX9qIgA2AhggAA0ACyABIAEoAgw2AhggASABKAIcKAJAIAEoAhhBAXRqNgIQA0AgASABKAIQQX5qIgA2AhAgASAALwEANgIUIAEoAhACfyABKAIUIAEoAgxPBEAgASgCFCABKAIMawwBC0EACzsBACABIAEoAhhBf2oiADYCGCAADQALC0UAQaCcAUIANwMAQZicAUIANwMAQZCcAUIANwMAQYicAUIANwMAQYCcAUIANwMAQfibAUIANwMAQfCbAUIANwMAQfCbAQuoAgEBfyMAQRBrIgEkACABIAA2AgwgASgCDCABKAIMKAIsQQF0NgI8IAEoAgwoAkQgASgCDCgCTEEBa0EBdGpBADsBACABKAIMKAJEQQAgASgCDCgCTEEBa0EBdBAzIAEoAgwgASgCDCgChAFBDGxBsOoAai8BAjYCgAEgASgCDCABKAIMKAKEAUEMbEGw6gBqLwEANgKMASABKAIMIAEoAgwoAoQBQQxsQbDqAGovAQQ2ApABIAEoAgwgASgCDCgChAFBDGxBsOoAai8BBjYCfCABKAIMQQA2AmwgASgCDEEANgJcIAEoAgxBADYCdCABKAIMQQA2ArQtIAEoAgxBAjYCeCABKAIMQQI2AmAgASgCDEEANgJoIAEoAgxBADYCSCABQRBqJAALmwIBAX8jAEEQayIBJAAgASAANgIIAkAgASgCCBB0BEAgAUF+NgIMDAELIAEoAghBADYCFCABKAIIQQA2AgggASgCCEEANgIYIAEoAghBAjYCLCABIAEoAggoAhw2AgQgASgCBEEANgIUIAEoAgQgASgCBCgCCDYCECABKAIEKAIYQQBIBEAgASgCBEEAIAEoAgQoAhhrNgIYCyABKAIEAn9BOSABKAIEKAIYQQJGDQAaQSpB8QAgASgCBCgC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KAIMQfwUajYCsBYgASgCDEGo2wA2ArgWIAEoAgxBADsBuC0gASgCDEEANgK8LSABKAIMELkBIAFBEGokAAvXDQEBfyMAQSBrIgMgADYCGCADIAE2AhQgAyACNgIQIAMgAygCGEEQdjYCDCADIAMoAhhB//8DcTYCGAJAIAMoAhBBAUYEQCADIAMoAhQtAAAgAygCGGo2AhggAygCGEHx/wNPBEAgAyADKAIYQfH/A2s2AhgLIAMgAygCGCADKAIMajYCDCADKAIMQfH/A08EQCADIAMoAgxB8f8DazYCDAsgAyADKAIYIAMoAgxBEHRyNgIcDAELIAMoAhRFBEAgA0EBNgIcDAELIAMoAhBBEEkEQANAIAMgAygCECIAQX9qNgIQIAAEQCADIAMoAhQiAEEBajYCFCADIAAtAAAgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMDAELCyADKAIYQfH/A08EQCADIAMoAhhB8f8DazYCGAsgAyADKAIMQfH/A3A2AgwgAyADKAIYIAMoAgxBEHRyNgIcDAELA0AgAygCEEGwK0lFBEAgAyADKAIQQbArazYCECADQdsCNgIIA0AgAyADKAIULQAAIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAEgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0AAiADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQADIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAQgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ABSADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAGIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAcgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ACCADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAJIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAogAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ACyADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAMIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAA0gAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ADiADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAPIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhRBEGo2AhQgAyADKAIIQX9qIgA2AgggAA0ACyADIAMoAhhB8f8DcDYCGCADIAMoAgxB8f8DcDYCDAwBCwsgAygCEARAA0AgAygCEEEQSUUEQCADIAMoAhBBEGs2AhAgAyADKAIULQAAIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAEgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0AAiADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQADIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAQgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ABSADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAGIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAcgAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ACCADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAJIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAAogAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ACyADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAMIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhQtAA0gAygCGGo2AhggAyADKAIYIAMoAgxqNgIMIAMgAygCFC0ADiADKAIYajYCGCADIAMoAhggAygCDGo2AgwgAyADKAIULQAPIAMoAhhqNgIYIAMgAygCGCADKAIMajYCDCADIAMoAhRBEGo2AhQMAQsLA0AgAyADKAIQIgBBf2o2AhAgAARAIAMgAygCFCIAQQFqNgIUIAMgAC0AACADKAIYajYCGCADIAMoAhggAygCDGo2AgwMAQsLIAMgAygCGEHx/wNwNgIYIAMgAygCDEHx/wNwNgIMCyADIAMoAhggAygC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CyABKAIIQQE2AiQgAUEANgIMCyABKAIMIQAgAUEQaiQAIAALgwEBAX8jAEEQayICJAAgAiAANgIIIAIgATcDAAJAIAIoAggoAiRBAUYEQCACKAIIQQxqQRJBABAVIAJBfzYCDAwBCyACKAIIQQAgAikDAEERECJCAFMEQCACQX82AgwMAQsgAigCCEEBNgIkIAJBADYCDAsgAigCDCEAIAJBEGokACAAC1sBAX8jAEEgayIDJAAgAyAANgIcIAMgATkDECADIAI5AwggAygCHARAIAMoAhwgAysDEDkDICADKAIcIAMrAwg5AyggAygCHEQAAAAAAAAAABBYCyADQSBqJAALWAEBfyMAQRBrIgEkACABIAA2AgwgASgCDARAIAEoAgxEAAAAAAAAAAA5AxggASgCDCgCAEQAAAAAAAAAACABKAIMKAIMIAEoAgwoAgQRGgALIAFBEGokAAtIAQF/IwBBEGsiASQAIAEgADYCDCABKAIMBEAgASgCDCgCCARAIAEoAgwoAgwgASgCDCgCCBEDAAsgASgCDBAWCyABQRBqJAALKwEBfyMAQRBrIgEkACABIAA2AgwgASgCDEQAAAAAAADwPxBYIAFBEGokAAucAgIBfwF8IwBBIGsiASAANwMQIAEgASkDELpEAAAAAAAA6D+jOQMIAkAgASsDCEQAAOD////vQWQEQCABQX82AgQMAQsgAQJ/IAErAwgiAkQAAAAAAADwQWMgAkQAAAAAAAAAAGZxBEAgAqsMAQtBAAs2AgQLAkAgASgCBEGAgICAeEsEQCABQYCAgIB4NgIcDAELIAEgASgCBEF/ajYCBCABIAEoAgQgASgCBEEBdnI2AgQgASABKAIEIAEoAgRBAnZyNgIEIAEgASgCBCABKAIEQQR2cjYCBCABIAEoAgQgASgCBEEIdnI2AgQgASABKAIEIAEoAgRBEHZyNgIEIAEgASgCBEEBajYCBCABIAEoAgQ2AhwLIAEoAhwLkwEBAX8jAEEgayIDJAAgAyAANgIYIAMgATcDECADIAI2AgwCQCADKQMQUARAIANBAToAHwwBCyADIAMpAxAQ/QI2AgggAygCCCADKAIYKAIATQRAIANBAToAHwwBCyADKAIYIAMoAgggAygCDBBaQQFxRQRAIANBADoAHwwBCyADQQE6AB8LIAMtAB8aIANBIGok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ACADKQMIQQAQKEEASARAIAMoAhQgAygCJCgCABAYIANCADcDKAwCCyADKAIkKAIAIANCBBAvQgRSBEAgAygCFCADKAIkKAIAEBggA0IANwMoDAILIAMoAABB0JadwABGBEAgAyADKQMIQgR8NwMICyADIAMpAwhCDHw3AwggAygCBEEAEIABQQFxBEAgAyADKQMIQgh8NwMICyADKQMIQv///////////wBWBEAgAygCFEEEQRYQFSADQgA3AygMAgsLIAMgAykDCDcDKAsgAykDKCEBIANBMGokACABCwYAQbScAQv/AQEBfyMAQRBrIgIkACACIAA2AgwgAiABOgALAkAgAigCDCgCEEEORgRAIAIoAgxBPzsBCgwBCyACKAIMKAIQQQxGBEAgAigCDEEuOwEKDAELAkAgAi0AC0EBcUUEQCACKAIMQQAQgAFBAXFFDQELIAIoAgxBLTsBCgwBCwJAIAIoAgwoAhBBCEcEQCACKAIMLwFSQQFHDQELIAIoAgxBFDsBCgwBCyACIAIoAgwoAjAQUiIAOwEIIABB//8DcUEASgRAIAIoAgwoAjAoAgAgAi8BCEEBa2otAABBL0YEQCACKAIMQRQ7AQoMAgsLIAIoAgxBCjsBCgsgAkEQaiQAC8ACAQF/IwBBMGsiAiQAIAIgADYCKCACQYACOwEmIAIgATYCICACIAIvASZBgAJxQQBHOgAbIAJBHkEuIAItABtBAXEbNgIcAkAgAigCKEEaQRwgAi0AG0EBcRusQQEQKEEASARAIAIoAiAgAigCKBAYIAJBfzYCLAwBCyACIAIoAihBBEEGIAItABtBAXEbrCACQQ5qIAIoAiAQQSIANgIIIABFBEAgAkF/NgIsDAELIAJBADYCFANAIAIoAhRBAkEDIAItABtBAXEbSARAIAIgAigCCBAeQf//A3EgAigCHGo2AhwgAiACKAIUQQFqNgIUDAELCyACKAIIEEhBAXFFBEAgAigCIEEUQQAQFSACKAIIEBcgAkF/NgIsDAELIAIoAggQFyACIAIoAhw2AiwLIAIoAiwhACACQTBqJAAgAAv/AwEBfyMAQSBrIgIkACACIAA2AhggAiABNgIUAkAgAigCGCgCEEHjAEcEQCACQQE6AB8MAQsgAiACKAIYKAI0IAJBEmpBgbICQYAGQQAQXzYCCAJAIAIoAggEQCACLwESQQdODQELIAIoAhRBFUEAEBUgAkEAOgAfDAELIAIgAigCCCACLwESrRAqIgA2AgwgAEUEQCACKAIUQRRBABAVIAJBADoAHwwBCyACQQE6AAcCQAJAAkAgAigCDBAeQX9qDgICAAELIAIoAhgpAyhCFFQEQCACQQA6AAcLDAELIAIoAhRBGEEAEBUgAigCDBAXIAJBADoAHwwBCyACKAIMQgIQHy8AAEHBigFHBEAgAigCFEEYQQAQFSACKAIMEBcgAkEAOgAfDAELAkACQAJAAkACQCACKAIMEIsBQX9qDgMAAQIDCyACQYECOwEEDAMLIAJBggI7AQQMAgsgAkGDAjsBBAwBCyACKAIUQRhBABAVIAIoAgwQFyACQQA6AB8MAQsgAi8BEkEHRwRAIAIoAhRBFUEAEBUgAigCDBAXIAJBADoAHwwBCyACKAIYIAItAAdBAXE6AAYgAigCGCACLwEEOwFSIAIoAgwQHkH//wNxIQAgAigCGCAANgIQIAIoAgwQFyACQQE6AB8LIAItAB9BAXEhACACQSBqJAAgAAu5AQEBfyMAQTBrIgIkACACIAA7AS4gAiABOwEsIAJCADcCACACQQA2AiggAkIANwIgIAJCADcCGCACQgA3AhAgAkIANwIIIAJBADYCICACIAIvASxBCXVB0ABqNgIUIAIgAi8BLEEFdUEPcUEBazYCECACIAIvASxBH3E2AgwgAiACLwEuQQt1NgIIIAIgAi8BLkEFdUE/cTYCBCACIAIvAS5BAXRBPnE2AgAgAhAMIQAgAkEwaiQAIAALTAECfyMAQRBrIgAkACAAQdgAEBkiATYCCAJAIAFFBEAgAEEANgIMDAELIAAoAggQXSAAIAAoAgg2AgwLIAAoAgwhASAAQRBqJAAgAQsHACAALwEwC+AIAQF/IwBBwAFrIgMkACADIAA2ArQBIAMgATYCsAEgAyACNwOoASADIAMoArQBKAIAEDUiAjcDIAJAIAJCAFMEQCADKAK0AUEIaiADKAK0ASgCABAYIANCfzcDuAEMAQsgAyADKQMgNwOgASADQQA6ABcgA0IANwMYA0AgAykDGCADKQOoAVQEQCADIAMoArQBKAJAIAMoArABIAMpAxinQQN0aikDAKdBBHRqNgIMIAMgAygCtAECfyADKAIMKAIEBEAgAygCDCgCBAwBCyADKAIMKAIAC0GABBBeIgA2AhAgAEEASARAIANCfzcDuAEMAwsgAygCEARAIANBAToAFwsgAyADKQMYQgF8NwMYDAELCyADIAMoArQBKAIAEDUiAjcDICACQgBTBEAgAygCtAFBCGogAygCtAEoAgAQGCADQn83A7gBDAELIAMgAykDICADKQOgAX03A5gBAkAgAykDoAFC/////w9YBEAgAykDqAFC//8DWA0BCyADQQE6ABcLIAMgA0EwakLiABAqIgA2AiwgAEUEQCADKAK0AUEIakEOQQAQFSADQn83A7gBDAELIAMtABdBAXEEQCADKAIsQbbTAEEEEEAgAygCLEIsEC4gAygCLEEtECAgAygCLEEtECAgAygCLEEAECEgAygCLEEAECEgAygCLCADKQOoARAuIAMoAiwgAykDqAEQLiADKAIsIAMpA5gBEC4gAygCLCADKQOgARAuIAMoAixBu9MAQQQQQCADKAIsQQAQISADKAIsIAMpA6ABIAMpA5gBfBAuIAMoAixBARAhCyADKAIsQcDTAEEEEEAgAygCLEEAECEgAygCLAJ+Qv//AyADKQOoAUL//wNaDQAaIAMpA6gBC6dB//8DcRAgIAMoAiwCfkL//wMgAykDqAFC//8DWg0AGiADKQOoAQunQf//A3EQICADKAIsAn9BfyADKQOYAUL/////D1oNABogAykDmAGnCxAhIAMoAiwCf0F/IAMpA6ABQv////8PWg0AGiADKQOgAacLECEgAwJ/IAMoArQBLQAoQQFxBEAgAygCtAEoAiQMAQsgAygCtAEoAiALNgKUASADKAIsAn8gAygClAEEQCADKAKUAS8BBAwBC0EAC0H//wNxECACfyMAQRBrIgAgAygCLDYCDCAAKAIMLQAAQQFxRQsEQCADKAK0AUEIakEUQQAQFSADKAIsEBcgA0J/NwO4AQwBCyADKAK0AQJ/IwBBEGsiACADKAIsNgIMIAAoAgwoAgQLAn4jAEEQayIAIAMoAiw2AgwCfiAAKAIMLQAAQQFxBEAgACgCDCkDEAwBC0IACwsQNkEASARAIAMoAiwQFyADQn83A7gBDAELIAMoAiwQFyADKAKUAQRAIAMoArQBIAMoApQBKAIAIAMoApQBLwEErRA2QQBIBEAgA0J/NwO4AQwCCwsgAyADKQOYATcDuAELIAMpA7gBIQIgA0HAAWokACACCwcAIAAoAiALCABBAUE4EHsLAwABCwvyjQEnAEGACAuUBU5vIGVycm9yAE11bHRpLWRpc2sgemlwIGFyY2hpdmVzIG5vdCBzdXBwb3J0ZWQAUmVuYW1pbmcgdGVtcG9yYXJ5IGZpbGUgZmFpbGVkAENsb3NpbmcgemlwIGFyY2hpdmUgZmFpbGVkAFNlZWsgZXJyb3IAUmVhZCBlcnJvcgBXcml0ZSBlcnJvcgBDUkMgZXJyb3IAQ29udGFpbmluZyB6aXAgYXJjaGl2ZSB3YXMgY2xvc2VkAE5vIHN1Y2ggZmlsZQBGaWxlIGFscmVhZHkgZXhpc3RzAENhbid0IG9wZW4gZmlsZQBGYWlsdXJlIHRvIGNyZWF0ZSB0ZW1wb3JhcnkgZmlsZQBabGliIGVycm9yAE1hbGxvYyBmYWlsdXJlAEVudHJ5IGhhcyBiZWVuIGNoYW5nZWQAQ29tcHJlc3Npb24gbWV0aG9kIG5vdCBzdXBwb3J0ZWQAUHJlbWF0dXJlIGVuZCBvZiBmaWxlAEludmFsaWQgYXJndW1lbnQATm90IGEgemlwIGFyY2hpdmUASW50ZXJuYWwgZXJyb3IAWmlwIGFyY2hpdmUgaW5jb25zaXN0ZW50AENhbid0IHJlbW92ZSBmaWxlAEVudHJ5IGhhcyBiZWVuIGRlbGV0ZWQARW5jcnlwdGlvbiBtZXRob2Qgbm90IHN1cHBvcnRlZABSZWFkLW9ubHkgYXJjaGl2ZQBObyBwYXNzd29yZCBwcm92aWRlZABXcm9uZyBwYXNzd29yZCBwcm92aWRlZABPcGVyYXRpb24gbm90IHN1cHBvcnRlZABSZXNvdXJjZSBzdGlsbCBpbiB1c2UAVGVsbCBlcnJvcgBDb21wcmVzc2VkIGRhdGEgaW52YWxpZABBoQ0LgAEEAAAJBAAALwQAAE4EAABpBAAAdAQAAH8EAACLBAAAlQQAALcEAADEBAAA2AQAAOgEAAAJBQAAFAUAACMFAAA6BQAAWwUAAHEFAACCBQAAlAUAAKMFAAC8BQAAzgUAAOUFAAAFBgAAFwYAACwGAABEBgAAXAYAAHIGAAB9BgAAIABBuA4LEQEAAAABAAAAAQAAAAEAAAABAEHcDgsJAQAAAAEAAAACAEGIDwsBAQBBqA8LAQEAQbQP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AJoACABaAAgA2gAIADoACAC6AAgAegAIAPoACAAGAAgAhgAIAEYACADGAAgAJgAIAKYACABmAAgA5gAIABYACACWAAgAVgAIANYACAA2AAgAtgAIAHYACAD2AAgADgAIAI4ACABOAAgAzgAIAC4ACACuAAgAbgAIAO4ACAAeAAgAngAIAF4ACADeAAgAPgAIAL4ACAB+AAgA/gAIAAEACACBAAgAQQAIAMEACAAhAAgAoQAIAGEACADhAAgAEQAIAJEACABRAAgA0QAIADEACACxAAgAcQAIAPEACAAJAAgAiQAIAEkACADJAAgAKQAIAKkACABpAAgA6QAIABkACACZAAgAWQAIANkACAA5AAgAuQAIAHkACAD5AAgABQAIAIUACABFAAgAxQAIACUACAClAAgAZQAIAOUACAAVAAgAlQAIAFUACADVAAgANQAIALUACAB1AAgA9QAIAA0ACACNAAgATQAIAM0ACAAtAAgArQAIAG0ACADtAAgAHQAIAJ0ACABdAAgA3QAIAD0ACAC9AAgAfQAIAP0ACAATAAkAEwEJAJMACQCTAQkAUwAJAFMBCQDTAAkA0wEJADMACQAzAQkAswAJALMBCQBzAAkAcwEJAPMACQDzAQkACwAJAAsBCQCLAAkAiwEJAEsACQBLAQkAywAJAMsBCQArAAkAKwEJAKsACQCrAQkAawAJAGsBCQDrAAkA6wEJABsACQAbAQkAmwAJAJsBCQBbAAkAWwEJANsACQDbAQkAOwAJADsBCQC7AAkAuwEJAHsACQB7AQkA+wAJAPsBCQAHAAkABwEJAIcACQCHAQkARwAJAEcBCQDHAAkAxwEJACcACQAnAQkApwAJAKcBCQBnAAkAZwEJAOcACQDnAQkAFwAJABcBCQCXAAkAlwEJAFcACQBXAQkA1wAJANcBCQA3AAkANwEJALcACQC3AQkAdwAJAHcBCQD3AAkA9wEJAA8ACQAPAQkAjwAJAI8BCQBPAAkATwEJAM8ACQDPAQkALwAJAC8BCQCvAAkArwEJAG8ACQBvAQkA7wAJAO8BCQAfAAkAHwEJAJ8ACQCfAQkAXwAJAF8BCQDfAAkA3wEJAD8ACQA/AQkAvwAJAL8BCQB/AAkAfwEJAP8ACQD/AQkAAAAHAEAABwAgAAcAYAAHABAABwBQAAcAMAAHAHAABwAIAAcASAAH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CBQAFQjjABMHKwAACHQAAAg0AAAJyAARBw0AAAhkAAAIJAAACagAAAgEAAAIhAAACEQAAAnoABAHCAAACFwAAAgcAAAJmAAUB1MAAAh8AAAIPAAACdgAEgcXAAAIbAAACCwAAAm4AAAIDAAACIwAAAhMAAAJ+AAQBwMAAAhSAAAIEgAVCKMAEwcjAAAIcgAACDIAAAnEABEHCwAACGIAAAgiAAAJpAAACAIAAAiCAAAIQgAACeQAEAcHAAAIWgAACBoAAAmUABQHQwAACHoAAAg6AAAJ1AASBxMAAAhqAAAIKgAACbQAAAgKAAAIigAACEoAAAn0ABAHBQAACFYAAAgWAEAIAAATBzMAAAh2AAAINgAACcwAEQcPAAAIZgAACCYAAAmsAAAIBgAACIYAAAhGAAAJ7AAQBwkAAAheAAAIHgAACZwAFAdjAAAIfgAACD4AAAncABIHGwAACG4AAAguAAAJvAAACA4AAAiOAAAITgAACfwAYAcAAAAIUQAACBEAFQiDABIHHwAACHEAAAgxAAAJwgAQBwoAAAhhAAAIIQAACaIAAAgBAAAIgQAACEEAAAniABAHBgAACFkAAAgZAAAJkgATBzsAAAh5AAAIOQAACdIAEQcRAAAIaQAACCkAAAmyAAAICQAACIkAAAhJAAAJ8gAQBwQAAAhVAAAIFQAQCAIBEwcrAAAIdQAACDUAAAnKABEHDQAACGUAAAglAAAJqgAACAUAAAiFAAAIRQAACeoAEAcIAAAIXQAACB0AAAmaABQHUwAACH0AAAg9AAAJ2gASBxcAAAhtAAAILQAACboAAAgNAAAIjQAACE0AAAn6ABAHAwAACFMAAAgTABUIwwATByMAAAhzAAAIMwAACcYAEQcLAAAIYwAACCMAAAmmAAAIAwAACIMAAAhDAAAJ5gAQBwcAAAhbAAAIGwAACZYAFAdDAAAIewAACDsAAAnWABIHEwAACGsAAAgrAAAJtgAACAsAAAiLAAAISwAACfYAEAcFAAAIVwAACBcAQAgAABMHMwAACHcAAAg3AAAJzgARBw8AAAhnAAAIJwAACa4AAAgHAAAIhwAACEcAAAnuABAHCQAACF8AAAgfAAAJngAUB2MAAAh/AAAIPwAACd4AEgcbAAAIbwAACC8AAAm+AAAIDwAACI8AAAhPAAAJ/gBgBwAAAAhQAAAIEAAUCHMAEgcfAAAIcAAACDAAAAnBABAHCgAACGAAAAggAAAJoQAACAAAAAiAAAAIQAAACeEAEAcGAAAIWAAACBgAAAmRABMHOwAACHgAAAg4AAAJ0QARBxEAAAhoAAAIKAAACbEAAAgIAAAIiAAACEgAAAnxABAHBAAACFQAAAgUABUI4wATBysAAAh0AAAINAAACckAEQcNAAAIZAAACCQAAAmpAAAIBAAACIQAAAhEAAAJ6QAQBwgAAAhcAAAIHAAACZkAFAdTAAAIfAAACDwAAAnZABIHFwAACGwAAAgsAAAJuQAACAwAAAiMAAAITAAACfkAEAcDAAAIUgAACBIAFQijABMHIwAACHIAAAgyAAAJxQARBwsAAAhiAAAIIgAACaUAAAgCAAAIggAACEIAAAnlABAHBwAACFoAAAgaAAAJlQAUB0MAAAh6AAAIOgAACdUAEgcTAAAIagAACCoAAAm1AAAICgAACIoAAAhKAAAJ9QAQBwUAAAhWAAAIFgBACAAAEwczAAAIdgAACDYAAAnNABEHDwAACGYAAAgmAAAJrQAACAYAAAiGAAAIRgAACe0AEAcJAAAIXgAACB4AAAmdABQHYwAACH4AAAg+AAAJ3QASBxsAAAhuAAAILgAACb0AAAgOAAAIjgAACE4AAAn9AGAHAAAACFEAAAgRABUIgwASBx8AAAhxAAAIMQAACcMAEAcKAAAIYQAACCEAAAmjAAAIAQAACIEAAAhBAAAJ4wAQBwYAAAhZAAAIGQAACZMAEwc7AAAIeQAACDkAAAnTABEHEQAACGkAAAgpAAAJswAACAkAAAiJAAAISQAACfMAEAcEAAAIVQAACBUAEAgCARMHKwAACHUAAAg1AAAJywARBw0AAAhlAAAIJQAACasAAAgFAAAIhQAACEUAAAnrABAHCAAACF0AAAgdAAAJmwAUB1MAAAh9AAAIPQAACdsAEgcXAAAIbQAACC0AAAm7AAAIDQAACI0AAAhNAAAJ+wAQBwMAAAhTAAAIEwAVCMMAEwcjAAAIcwAACDMAAAnHABEHCwAACGMAAAgjAAAJpwAACAMAAAiDAAAIQwAACecAEAcHAAAIWwAACBsAAAmXABQHQwAACHsAAAg7AAAJ1wASBxMAAAhrAAAIKwAACbcAAAgLAAAIiwAACEsAAAn3ABAHBQAACFcAAAgXAEAIAAATBzMAAAh3AAAINwAACc8AEQcPAAAIZwAACCcAAAmvAAAIBwAACIcAAAhHAAAJ7wAQBwkAAAhfAAAIHwAACZ8AFAdjAAAIfwAACD8AAAnfABIHGwAACG8AAAgvAAAJvwAACA8AAAiPAAAITwAACf8AEAUBABcFAQETBREAGwUBEBEFBQAZBQEEFQVBAB0FAUAQBQMAGAUBAhQFIQAcBQEgEgUJABoFAQgWBYEAQAUAABAFAgAXBYEBEwUZABsFARgRBQcAGQUBBhUFYQAdBQFgEAUEABgFAQMUBTEAHAUBMBIFDQAaBQEMFgXBAEAFAAAxLjIuMTEALSsgICAwWDB4AChudWxsKQBBsIMBC0ERAAoAERERAAAAAAUAAAAAAAAJAAAAAAsAAAAAAAAAABEADwoREREDCgcAAQAJCwsAAAkGCwAACwAGEQAAABEREQBBgYQBCyELAAAAAAAAAAARAAoKERERAAoAAAIACQsAAAAJAAsAAAsAQbuEAQsBDABBx4QBCxUMAAAAAAwAAAAACQwAAAAAAAwAAAwAQfWEAQsBDgBBgYUBCxUNAAAABA0AAAAACQ4AAAAAAA4AAA4AQa+FAQsBEABBu4UBCx4PAAAAAA8AAAAACRAAAAAAABAAABAAABIAAAASEhIAQfKFAQsOEgAAABISEgAAAAAAAAkAQaOGAQsBCwBBr4YBCxUKAAAAAAoAAAAACQsAAAAAAAsAAAsAQd2GAQsBDABB6YYBC0sMAAAAAAwAAAAACQwAAAAAAAwAAAwAADAxMjM0NTY3ODlBQkNERUYtMFgrMFggMFgtMHgrMHggMHgAaW5mAElORgBuYW4ATkFOAC4AQdyHAQsBFwBBg4gBCwX//////wBB0IgBC1cZEkQ7Aj8sRxQ9MzAKGwZGS0U3D0kOjhcDQB08aSs2H0otHAEgJSkhCAwVFiIuEDg+CzQxGGR0dXYvQQl/OREjQzJCiYqLBQQmKCcNKh41jAcaSJMTlJUAQbCJAQvdDklsbGVnYWwgYnl0ZSBzZXF1ZW5jZQBEb21haW4gZXJyb3IAUmVzdWx0IG5vdCByZXByZXNlbnRhYmxlAE5vdCBhIHR0eQBQZXJtaXNzaW9uIGRlbmllZABPcGVyYXRpb24gbm90IHBlcm1pdHRlZABObyBzdWNoIGZpbGUgb3IgZGlyZWN0b3J5AE5vIHN1Y2ggcHJvY2VzcwBGaWxlIGV4aXN0cwBWYWx1ZSB0b28gbGFyZ2UgZm9yIGRhdGEgdHlwZQBObyBzcGFjZSBsZWZ0IG9uIGRldmljZQBPdXQgb2YgbWVtb3J5AFJlc291cmNlIGJ1c3kASW50ZXJydXB0ZWQgc3lzdGVtIGNhbGwAUmVzb3VyY2UgdGVtcG9yYXJpbHkgdW5hdmFpbGFibGUASW52YWxpZCBzZWVrAENyb3NzLWRldmljZSBsaW5rAFJlYWQtb25seSBmaWxlIHN5c3RlbQBEaXJlY3Rvcnkgbm90IGVtcHR5AENvbm5lY3Rpb24gcmVzZXQgYnkgcGVlcgBPcGVyYXRpb24gdGltZWQgb3V0AENvbm5lY3Rpb24gcmVmdXNlZABIb3N0IGlzIGRvd24ASG9zdCBpcyB1bnJlYWNoYWJsZQBBZGRyZXNzIGluIHVzZQBCcm9rZW4gcGlwZQBJL08gZXJyb3IATm8gc3VjaCBkZXZpY2Ugb3IgYWRkcmVzcwBCbG9jayBkZXZpY2UgcmVxdWlyZWQATm8gc3VjaCBkZXZpY2UATm90IGEgZGlyZWN0b3J5AElzIGEgZGlyZWN0b3J5AFRleHQgZmlsZSBidXN5AEV4ZWMgZm9ybWF0IGVycm9yAEludmFsaWQgYXJndW1lbnQAQXJndW1lbnQgbGlzdCB0b28gbG9uZwBTeW1ib2xpYyBsaW5rIGxvb3AARmlsZW5hbWUgdG9vIGxvbmcAVG9vIG1hbnkgb3BlbiBmaWxlcyBpbiBzeXN0ZW0ATm8gZmlsZSBkZXNjcmlwdG9ycyBhdmFpbGFibGUAQmFkIGZpbGUgZGVzY3JpcHRvcgBObyBjaGlsZCBwcm9jZXNzAEJhZCBhZGRyZXNzAEZpbGUgdG9vIGxhcmdlAFRvbyBtYW55IGxpbmtzAE5vIGxvY2tzIGF2YWlsYWJsZQBSZXNvdXJjZSBkZWFkbG9jayB3b3VsZCBvY2N1cgBTdGF0ZSBub3QgcmVjb3ZlcmFibGUAUHJldmlvdXMgb3duZXIgZGllZABPcGVyYXRpb24gY2FuY2VsZWQARnVuY3Rpb24gbm90IGltcGxlbWVudGVkAE5vIG1lc3NhZ2Ugb2YgZGVzaXJlZCB0eXBlAElkZW50aWZpZXIgcmVtb3ZlZABEZXZpY2Ugbm90IGEgc3RyZWFtAE5vIGRhdGEgYXZhaWxhYmxlAERldmljZSB0aW1lb3V0AE91dCBvZiBzdHJlYW1zIHJlc291cmNlcwBMaW5rIGhhcyBiZWVuIHNldmVyZWQAUHJvdG9jb2wgZXJyb3IAQmFkIG1lc3NhZ2UARmlsZSBkZXNjcmlwdG9yIGluIGJhZCBzdGF0ZQBOb3QgYSBzb2NrZXQARGVzdGluYXRpb24gYWRkcmVzcyByZXF1aXJlZABNZXNzYWdlIHRvbyBsYXJnZQBQcm90b2NvbCB3cm9uZyB0eXBlIGZvciBzb2NrZXQAUHJvdG9jb2wgbm90IGF2YWlsYWJsZQBQcm90b2NvbCBub3Qgc3VwcG9ydGVkAFNvY2tldCB0eXBlIG5vdCBzdXBwb3J0ZWQATm90IHN1cHBvcnRlZABQcm90b2NvbCBmYW1pbHkgbm90IHN1cHBvcnRlZABBZGRyZXNzIGZhbWlseSBub3Qgc3VwcG9ydGVkIGJ5IHByb3RvY29sAEFkZHJlc3Mgbm90IGF2YWlsYWJsZQBOZXR3b3JrIGlzIGRvd24ATmV0d29yayB1bnJlYWNoYWJsZQBDb25uZWN0aW9uIHJlc2V0IGJ5IG5ldHdvcmsAQ29ubmVjdGlvbiBhYm9ydGVkAE5vIGJ1ZmZlciBzcGFjZSBhdmFpbGFibGUAU29ja2V0IGlzIGNvbm5lY3RlZABTb2NrZXQgbm90IGNvbm5lY3RlZABDYW5ub3Qgc2VuZCBhZnRlciBzb2NrZXQgc2h1dGRvd24AT3BlcmF0aW9uIGFscmVhZHkgaW4gcHJvZ3Jlc3MAT3BlcmF0aW9uIGluIHByb2dyZXNzAFN0YWxlIGZpbGUgaGFuZGxlAFJlbW90ZSBJL08gZXJyb3IAUXVvdGEgZXhjZWVkZWQATm8gbWVkaXVtIGZvdW5kAFdyb25nIG1lZGl1bSB0eXBlAE5vIGVycm9yIGluZm9ybWF0aW9uAABVbmtub3duIGVycm9yICVkACVzJXMlcwAAOiAAL3Byb2Mvc2VsZi9mZC8AL2Rldi91cmFuZG9tAHJ3YQAlcy5YWFhYWFgAcitiAHJiAFBLBQYAQZCYAQtOCgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABEAAAASAAAACwAAAAwAAAANAAAADgAAAA8AAAAQAAAAEQAAAAEAAAAIAAAAEEwAADBMAEGQmgELAlBQAEHImgELCR8AAABkTQAAAwBB5JoBC4wBLfRRWM+MscBG9rXLKTEDxwRbcDC0Xf0geH+LmthZKVBoSImrp1YDbP+3zYg/1He0K6WjcPG65Kj8QYP92W/hinovLXSWBx8NCV4Ddixw90ClLKdvV0GoqnTfoFhkA0rHxDxTrq9fGAQVseNtKIarDKS/Q/DpUIE5VxZSN/////////////////////8=";
if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
}
function getBinary() {
  try {
    if (wasmBinary) {
      return new Uint8Array(wasmBinary);
    }
    var binary = tryParseAsDataURI(wasmBinaryFile);
    if (binary) {
      return binary;
    }
    if (readBinary) {
      return readBinary(wasmBinaryFile);
    } else {
      throw "sync fetching of the wasm failed: you can preload it to Module['wasmBinary'] manually, or emcc.py will do that for you when generating HTML (but not JS)";
    }
  } catch (err) {
    abort(err);
  }
}
function createWasm() {
  var info = { a: asmLibraryArg };
  function receiveInstance(instance, module) {
    var exports = instance.exports;
    Module["asm"] = exports;
    removeRunDependency("wasm-instantiate");
  }
  addRunDependency("wasm-instantiate");
  function instantiateSync() {
    var instance;
    var module;
    var binary;
    try {
      binary = getBinary();
      module = new WebAssembly.Module(binary);
      instance = new WebAssembly.Instance(module, info);
    } catch (e) {
      var str = e.toString();
      err("failed to compile wasm module: " + str);
      if (
        str.indexOf("imported Memory") >= 0 ||
        str.indexOf("memory import") >= 0
      ) {
        err(
          "Memory size incompatibility issues may be due to changing INITIAL_MEMORY at runtime to something too large. Use ALLOW_MEMORY_GROWTH to allow any size memory (and also make sure not to set INITIAL_MEMORY at runtime to something smaller than it was at compile time)."
        );
      }
      throw e;
    }
    receiveInstance(instance, module);
  }
  if (Module["instantiateWasm"]) {
    try {
      var exports = Module["instantiateWasm"](info, receiveInstance);
      return exports;
    } catch (e) {
      err("Module.instantiateWasm callback failed with error: " + e);
      return false;
    }
  }
  instantiateSync();
  return Module["asm"];
}
var tempDouble;
var tempI64;
__ATINIT__.push({
  func: function() {
    ___wasm_call_ctors();
  }
});
function demangle(func) {
  return func;
}
function demangleAll(text) {
  var regex = /\b_Z[\w\d_]+/g;
  return text.replace(regex, function(x) {
    var y = demangle(x);
    return x === y ? x : y + " [" + x + "]";
  });
}
function jsStackTrace() {
  var err = new Error();
  if (!err.stack) {
    try {
      throw new Error();
    } catch (e) {
      err = e;
    }
    if (!err.stack) {
      return "(no stack trace available)";
    }
  }
  return err.stack.toString();
}
function stackTrace() {
  var js = jsStackTrace();
  if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
  return demangleAll(js);
}
var PATH = {
  splitPath: function(filename) {
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(filename).slice(1);
  },
  normalizeArray: function(parts, allowAboveRoot) {
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1);
      } else if (last === "..") {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    if (allowAboveRoot) {
      for (; up; up--) {
        parts.unshift("..");
      }
    }
    return parts;
  },
  normalize: function(path) {
    var isAbsolute = path.charAt(0) === "/",
      trailingSlash = path.substr(-1) === "/";
    path = PATH.normalizeArray(
      path.split("/").filter(function(p) {
        return !!p;
      }),
      !isAbsolute
    ).join("/");
    if (!path && !isAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isAbsolute ? "/" : "") + path;
  },
  dirname: function(path) {
    var result = PATH.splitPath(path),
      root = result[0],
      dir = result[1];
    if (!root && !dir) {
      return ".";
    }
    if (dir) {
      dir = dir.substr(0, dir.length - 1);
    }
    return root + dir;
  },
  basename: function(path) {
    if (path === "/") return "/";
    var lastSlash = path.lastIndexOf("/");
    if (lastSlash === -1) return path;
    return path.substr(lastSlash + 1);
  },
  extname: function(path) {
    return PATH.splitPath(path)[3];
  },
  join: function() {
    var paths = Array.prototype.slice.call(arguments, 0);
    return PATH.normalize(paths.join("/"));
  },
  join2: function(l, r) {
    return PATH.normalize(l + "/" + r);
  }
};
function setErrNo(value) {
  HEAP32[___errno_location() >> 2] = value;
  return value;
}
var PATH_FS = {
  resolve: function() {
    var resolvedPath = "",
      resolvedAbsolute = false;
    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = i >= 0 ? arguments[i] : FS.cwd();
      if (typeof path !== "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        return "";
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = path.charAt(0) === "/";
    }
    resolvedPath = PATH.normalizeArray(
      resolvedPath.split("/").filter(function(p) {
        return !!p;
      }),
      !resolvedAbsolute
    ).join("/");
    return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
  },
  relative: function(from, to) {
    from = PATH_FS.resolve(from).substr(1);
    to = PATH_FS.resolve(to).substr(1);
    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== "") break;
      }
      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== "") break;
      }
      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split("/"));
    var toParts = trim(to.split("/"));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  }
};
var TTY = {
  ttys: [],
  init: function() {},
  shutdown: function() {},
  register: function(dev, ops) {
    TTY.ttys[dev] = { input: [], output: [], ops: ops };
    FS.registerDevice(dev, TTY.stream_ops);
  },
  stream_ops: {
    open: function(stream) {
      var tty = TTY.ttys[stream.node.rdev];
      if (!tty) {
        throw new FS.ErrnoError(43);
      }
      stream.tty = tty;
      stream.seekable = false;
    },
    close: function(stream) {
      stream.tty.ops.flush(stream.tty);
    },
    flush: function(stream) {
      stream.tty.ops.flush(stream.tty);
    },
    read: function(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.get_char) {
        throw new FS.ErrnoError(60);
      }
      var bytesRead = 0;
      for (var i = 0; i < length; i++) {
        var result;
        try {
          result = stream.tty.ops.get_char(stream.tty);
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (result === undefined && bytesRead === 0) {
          throw new FS.ErrnoError(6);
        }
        if (result === null || result === undefined) break;
        bytesRead++;
        buffer[offset + i] = result;
      }
      if (bytesRead) {
        stream.node.timestamp = Date.now();
      }
      return bytesRead;
    },
    write: function(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.put_char) {
        throw new FS.ErrnoError(60);
      }
      try {
        for (var i = 0; i < length; i++) {
          stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
        }
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
      if (length) {
        stream.node.timestamp = Date.now();
      }
      return i;
    }
  },
  default_tty_ops: {
    get_char: function(tty) {
      if (!tty.input.length) {
        var result = null;
        if (ENVIRONMENT_IS_NODE) {
          var BUFSIZE = 256;
          var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
          var bytesRead = 0;
          try {
            bytesRead = nodeFS.readSync(
              process.stdin.fd,
              buf,
              0,
              BUFSIZE,
              null
            );
          } catch (e) {
            if (e.toString().indexOf("EOF") != -1) bytesRead = 0;
            else throw e;
          }
          if (bytesRead > 0) {
            result = buf.slice(0, bytesRead).toString("utf-8");
          } else {
            result = null;
          }
        } else if (
          typeof window != "undefined" &&
          typeof window.prompt == "function"
        ) {
          result = window.prompt("Input: ");
          if (result !== null) {
            result += "\n";
          }
        } else if (typeof readline == "function") {
          result = readline();
          if (result !== null) {
            result += "\n";
          }
        }
        if (!result) {
          return null;
        }
        tty.input = intArrayFromString(result, true);
      }
      return tty.input.shift();
    },
    put_char: function(tty, val) {
      if (val === null || val === 10) {
        out(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    flush: function(tty) {
      if (tty.output && tty.output.length > 0) {
        out(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      }
    }
  },
  default_tty1_ops: {
    put_char: function(tty, val) {
      if (val === null || val === 10) {
        err(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    flush: function(tty) {
      if (tty.output && tty.output.length > 0) {
        err(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      }
    }
  }
};
var MEMFS = {
  ops_table: null,
  mount: function(mount) {
    return MEMFS.createNode(null, "/", 16384 | 511, 0);
  },
  createNode: function(parent, name, mode, dev) {
    if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
      throw new FS.ErrnoError(63);
    }
    if (!MEMFS.ops_table) {
      MEMFS.ops_table = {
        dir: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            lookup: MEMFS.node_ops.lookup,
            mknod: MEMFS.node_ops.mknod,
            rename: MEMFS.node_ops.rename,
            unlink: MEMFS.node_ops.unlink,
            rmdir: MEMFS.node_ops.rmdir,
            readdir: MEMFS.node_ops.readdir,
            symlink: MEMFS.node_ops.symlink
          },
          stream: { llseek: MEMFS.stream_ops.llseek }
        },
        file: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          },
          stream: {
            llseek: MEMFS.stream_ops.llseek,
            read: MEMFS.stream_ops.read,
            write: MEMFS.stream_ops.write,
            allocate: MEMFS.stream_ops.allocate,
            mmap: MEMFS.stream_ops.mmap,
            msync: MEMFS.stream_ops.msync
          }
        },
        link: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            readlink: MEMFS.node_ops.readlink
          },
          stream: {}
        },
        chrdev: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr
          },
          stream: FS.chrdev_stream_ops
        }
      };
    }
    var node = FS.createNode(parent, name, mode, dev);
    if (FS.isDir(node.mode)) {
      node.node_ops = MEMFS.ops_table.dir.node;
      node.stream_ops = MEMFS.ops_table.dir.stream;
      node.contents = {};
    } else if (FS.isFile(node.mode)) {
      node.node_ops = MEMFS.ops_table.file.node;
      node.stream_ops = MEMFS.ops_table.file.stream;
      node.usedBytes = 0;
      node.contents = null;
    } else if (FS.isLink(node.mode)) {
      node.node_ops = MEMFS.ops_table.link.node;
      node.stream_ops = MEMFS.ops_table.link.stream;
    } else if (FS.isChrdev(node.mode)) {
      node.node_ops = MEMFS.ops_table.chrdev.node;
      node.stream_ops = MEMFS.ops_table.chrdev.stream;
    }
    node.timestamp = Date.now();
    if (parent) {
      parent.contents[name] = node;
    }
    return node;
  },
  getFileDataAsRegularArray: function(node) {
    if (node.contents && node.contents.subarray) {
      var arr = [];
      for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
      return arr;
    }
    return node.contents;
  },
  getFileDataAsTypedArray: function(node) {
    if (!node.contents) return new Uint8Array(0);
    if (node.contents.subarray)
      return node.contents.subarray(0, node.usedBytes);
    return new Uint8Array(node.contents);
  },
  expandFileStorage: function(node, newCapacity) {
    var prevCapacity = node.contents ? node.contents.length : 0;
    if (prevCapacity >= newCapacity) return;
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(
      newCapacity,
      (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0
    );
    if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
    var oldContents = node.contents;
    node.contents = new Uint8Array(newCapacity);
    if (node.usedBytes > 0)
      node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
    return;
  },
  resizeFileStorage: function(node, newSize) {
    if (node.usedBytes == newSize) return;
    if (newSize == 0) {
      node.contents = null;
      node.usedBytes = 0;
      return;
    }
    if (!node.contents || node.contents.subarray) {
      var oldContents = node.contents;
      node.contents = new Uint8Array(newSize);
      if (oldContents) {
        node.contents.set(
          oldContents.subarray(0, Math.min(newSize, node.usedBytes))
        );
      }
      node.usedBytes = newSize;
      return;
    }
    if (!node.contents) node.contents = [];
    if (node.contents.length > newSize) node.contents.length = newSize;
    else while (node.contents.length < newSize) node.contents.push(0);
    node.usedBytes = newSize;
  },
  node_ops: {
    getattr: function(node) {
      var attr = {};
      attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
      attr.ino = node.id;
      attr.mode = node.mode;
      attr.nlink = 1;
      attr.uid = 0;
      attr.gid = 0;
      attr.rdev = node.rdev;
      if (FS.isDir(node.mode)) {
        attr.size = 4096;
      } else if (FS.isFile(node.mode)) {
        attr.size = node.usedBytes;
      } else if (FS.isLink(node.mode)) {
        attr.size = node.link.length;
      } else {
        attr.size = 0;
      }
      attr.atime = new Date(node.timestamp);
      attr.mtime = new Date(node.timestamp);
      attr.ctime = new Date(node.timestamp);
      attr.blksize = 4096;
      attr.blocks = Math.ceil(attr.size / attr.blksize);
      return attr;
    },
    setattr: function(node, attr) {
      if (attr.mode !== undefined) {
        node.mode = attr.mode;
      }
      if (attr.timestamp !== undefined) {
        node.timestamp = attr.timestamp;
      }
      if (attr.size !== undefined) {
        MEMFS.resizeFileStorage(node, attr.size);
      }
    },
    lookup: function(parent, name) {
      throw FS.genericErrors[44];
    },
    mknod: function(parent, name, mode, dev) {
      return MEMFS.createNode(parent, name, mode, dev);
    },
    rename: function(old_node, new_dir, new_name) {
      if (FS.isDir(old_node.mode)) {
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {}
        if (new_node) {
          for (var i in new_node.contents) {
            throw new FS.ErrnoError(55);
          }
        }
      }
      delete old_node.parent.contents[old_node.name];
      old_node.name = new_name;
      new_dir.contents[new_name] = old_node;
      old_node.parent = new_dir;
    },
    unlink: function(parent, name) {
      delete parent.contents[name];
    },
    rmdir: function(parent, name) {
      var node = FS.lookupNode(parent, name);
      for (var i in node.contents) {
        throw new FS.ErrnoError(55);
      }
      delete parent.contents[name];
    },
    readdir: function(node) {
      var entries = [".", ".."];
      for (var key in node.contents) {
        if (!node.contents.hasOwnProperty(key)) {
          continue;
        }
        entries.push(key);
      }
      return entries;
    },
    symlink: function(parent, newname, oldpath) {
      var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
      node.link = oldpath;
      return node;
    },
    readlink: function(node) {
      if (!FS.isLink(node.mode)) {
        throw new FS.ErrnoError(28);
      }
      return node.link;
    }
  },
  stream_ops: {
    read: function(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= stream.node.usedBytes) return 0;
      var size = Math.min(stream.node.usedBytes - position, length);
      if (size > 8 && contents.subarray) {
        buffer.set(contents.subarray(position, position + size), offset);
      } else {
        for (var i = 0; i < size; i++)
          buffer[offset + i] = contents[position + i];
      }
      return size;
    },
    write: function(stream, buffer, offset, length, position, canOwn) {
      if (buffer.buffer === HEAP8.buffer) {
        canOwn = false;
      }
      if (!length) return 0;
      var node = stream.node;
      node.timestamp = Date.now();
      if (buffer.subarray && (!node.contents || node.contents.subarray)) {
        if (canOwn) {
          node.contents = buffer.subarray(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (node.usedBytes === 0 && position === 0) {
          node.contents = buffer.slice(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (position + length <= node.usedBytes) {
          node.contents.set(buffer.subarray(offset, offset + length), position);
          return length;
        }
      }
      MEMFS.expandFileStorage(node, position + length);
      if (node.contents.subarray && buffer.subarray)
        node.contents.set(buffer.subarray(offset, offset + length), position);
      else {
        for (var i = 0; i < length; i++) {
          node.contents[position + i] = buffer[offset + i];
        }
      }
      node.usedBytes = Math.max(node.usedBytes, position + length);
      return length;
    },
    llseek: function(stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          position += stream.node.usedBytes;
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28);
      }
      return position;
    },
    allocate: function(stream, offset, length) {
      MEMFS.expandFileStorage(stream.node, offset + length);
      stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
    },
    mmap: function(stream, address, length, position, prot, flags) {
      assert(address === 0);
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      var ptr;
      var allocated;
      var contents = stream.node.contents;
      if (!(flags & 2) && contents.buffer === buffer) {
        allocated = false;
        ptr = contents.byteOffset;
      } else {
        if (position > 0 || position + length < contents.length) {
          if (contents.subarray) {
            contents = contents.subarray(position, position + length);
          } else {
            contents = Array.prototype.slice.call(
              contents,
              position,
              position + length
            );
          }
        }
        allocated = true;
        ptr = _malloc(length);
        if (!ptr) {
          throw new FS.ErrnoError(48);
        }
        HEAP8.set(contents, ptr);
      }
      return { ptr: ptr, allocated: allocated };
    },
    msync: function(stream, buffer, offset, length, mmapFlags) {
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      if (mmapFlags & 2) {
        return 0;
      }
      var bytesWritten = MEMFS.stream_ops.write(
        stream,
        buffer,
        0,
        length,
        offset,
        false
      );
      return 0;
    }
  }
};
var ERRNO_CODES = {
  EPERM: 63,
  ENOENT: 44,
  ESRCH: 71,
  EINTR: 27,
  EIO: 29,
  ENXIO: 60,
  E2BIG: 1,
  ENOEXEC: 45,
  EBADF: 8,
  ECHILD: 12,
  EAGAIN: 6,
  EWOULDBLOCK: 6,
  ENOMEM: 48,
  EACCES: 2,
  EFAULT: 21,
  ENOTBLK: 105,
  EBUSY: 10,
  EEXIST: 20,
  EXDEV: 75,
  ENODEV: 43,
  ENOTDIR: 54,
  EISDIR: 31,
  EINVAL: 28,
  ENFILE: 41,
  EMFILE: 33,
  ENOTTY: 59,
  ETXTBSY: 74,
  EFBIG: 22,
  ENOSPC: 51,
  ESPIPE: 70,
  EROFS: 69,
  EMLINK: 34,
  EPIPE: 64,
  EDOM: 18,
  ERANGE: 68,
  ENOMSG: 49,
  EIDRM: 24,
  ECHRNG: 106,
  EL2NSYNC: 156,
  EL3HLT: 107,
  EL3RST: 108,
  ELNRNG: 109,
  EUNATCH: 110,
  ENOCSI: 111,
  EL2HLT: 112,
  EDEADLK: 16,
  ENOLCK: 46,
  EBADE: 113,
  EBADR: 114,
  EXFULL: 115,
  ENOANO: 104,
  EBADRQC: 103,
  EBADSLT: 102,
  EDEADLOCK: 16,
  EBFONT: 101,
  ENOSTR: 100,
  ENODATA: 116,
  ETIME: 117,
  ENOSR: 118,
  ENONET: 119,
  ENOPKG: 120,
  EREMOTE: 121,
  ENOLINK: 47,
  EADV: 122,
  ESRMNT: 123,
  ECOMM: 124,
  EPROTO: 65,
  EMULTIHOP: 36,
  EDOTDOT: 125,
  EBADMSG: 9,
  ENOTUNIQ: 126,
  EBADFD: 127,
  EREMCHG: 128,
  ELIBACC: 129,
  ELIBBAD: 130,
  ELIBSCN: 131,
  ELIBMAX: 132,
  ELIBEXEC: 133,
  ENOSYS: 52,
  ENOTEMPTY: 55,
  ENAMETOOLONG: 37,
  ELOOP: 32,
  EOPNOTSUPP: 138,
  EPFNOSUPPORT: 139,
  ECONNRESET: 15,
  ENOBUFS: 42,
  EAFNOSUPPORT: 5,
  EPROTOTYPE: 67,
  ENOTSOCK: 57,
  ENOPROTOOPT: 50,
  ESHUTDOWN: 140,
  ECONNREFUSED: 14,
  EADDRINUSE: 3,
  ECONNABORTED: 13,
  ENETUNREACH: 40,
  ENETDOWN: 38,
  ETIMEDOUT: 73,
  EHOSTDOWN: 142,
  EHOSTUNREACH: 23,
  EINPROGRESS: 26,
  EALREADY: 7,
  EDESTADDRREQ: 17,
  EMSGSIZE: 35,
  EPROTONOSUPPORT: 66,
  ESOCKTNOSUPPORT: 137,
  EADDRNOTAVAIL: 4,
  ENETRESET: 39,
  EISCONN: 30,
  ENOTCONN: 53,
  ETOOMANYREFS: 141,
  EUSERS: 136,
  EDQUOT: 19,
  ESTALE: 72,
  ENOTSUP: 138,
  ENOMEDIUM: 148,
  EILSEQ: 25,
  EOVERFLOW: 61,
  ECANCELED: 11,
  ENOTRECOVERABLE: 56,
  EOWNERDEAD: 62,
  ESTRPIPE: 135
};
var NODEFS = {
  isWindows: false,
  staticInit: function() {
    NODEFS.isWindows = !!process.platform.match(/^win/);
    var flags = { fs: fs.constants };
    if (flags["fs"]) {
      flags = flags["fs"];
    }
    NODEFS.flagsForNodeMap = {
      1024: flags["O_APPEND"],
      64: flags["O_CREAT"],
      128: flags["O_EXCL"],
      0: flags["O_RDONLY"],
      2: flags["O_RDWR"],
      4096: flags["O_SYNC"],
      512: flags["O_TRUNC"],
      1: flags["O_WRONLY"]
    };
  },
  bufferFrom: function(arrayBuffer) {
    return Buffer["alloc"] ? Buffer.from(arrayBuffer) : new Buffer(arrayBuffer);
  },
  convertNodeCode: function(e) {
    var code = e.code;
    return ERRNO_CODES[code];
  },
  mount: function(mount) {
    return NODEFS.createNode(null, "/", NODEFS.getMode(mount.opts.root), 0);
  },
  createNode: function(parent, name, mode, dev) {
    if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
      throw new FS.ErrnoError(28);
    }
    var node = FS.createNode(parent, name, mode);
    node.node_ops = NODEFS.node_ops;
    node.stream_ops = NODEFS.stream_ops;
    return node;
  },
  getMode: function(path) {
    var stat;
    try {
      stat = fs.lstatSync(path);
      if (NODEFS.isWindows) {
        stat.mode = stat.mode | ((stat.mode & 292) >> 2);
      }
    } catch (e) {
      if (!e.code) throw e;
      throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
    }
    return stat.mode;
  },
  realPath: function(node) {
    var parts = [];
    while (node.parent !== node) {
      parts.push(node.name);
      node = node.parent;
    }
    parts.push(node.mount.opts.root);
    parts.reverse();
    return PATH.join.apply(null, parts);
  },
  flagsForNode: function(flags) {
    flags &= ~2097152;
    flags &= ~2048;
    flags &= ~32768;
    flags &= ~524288;
    var newFlags = 0;
    for (var k in NODEFS.flagsForNodeMap) {
      if (flags & k) {
        newFlags |= NODEFS.flagsForNodeMap[k];
        flags ^= k;
      }
    }
    if (!flags) {
      return newFlags;
    } else {
      throw new FS.ErrnoError(28);
    }
  },
  node_ops: {
    getattr: function(node) {
      var path = NODEFS.realPath(node);
      var stat;
      try {
        stat = fs.lstatSync(path);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
      if (NODEFS.isWindows && !stat.blksize) {
        stat.blksize = 4096;
      }
      if (NODEFS.isWindows && !stat.blocks) {
        stat.blocks = ((stat.size + stat.blksize - 1) / stat.blksize) | 0;
      }
      return {
        dev: stat.dev,
        ino: stat.ino,
        mode: stat.mode,
        nlink: stat.nlink,
        uid: stat.uid,
        gid: stat.gid,
        rdev: stat.rdev,
        size: stat.size,
        atime: stat.atime,
        mtime: stat.mtime,
        ctime: stat.ctime,
        blksize: stat.blksize,
        blocks: stat.blocks
      };
    },
    setattr: function(node, attr) {
      var path = NODEFS.realPath(node);
      try {
        if (attr.mode !== undefined) {
          fs.chmodSync(path, attr.mode);
          node.mode = attr.mode;
        }
        if (attr.timestamp !== undefined) {
          var date = new Date(attr.timestamp);
          fs.utimesSync(path, date, date);
        }
        if (attr.size !== undefined) {
          fs.truncateSync(path, attr.size);
        }
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    lookup: function(parent, name) {
      var path = PATH.join2(NODEFS.realPath(parent), name);
      var mode = NODEFS.getMode(path);
      return NODEFS.createNode(parent, name, mode);
    },
    mknod: function(parent, name, mode, dev) {
      var node = NODEFS.createNode(parent, name, mode, dev);
      var path = NODEFS.realPath(node);
      try {
        if (FS.isDir(node.mode)) {
          fs.mkdirSync(path, node.mode);
        } else {
          fs.writeFileSync(path, "", { mode: node.mode });
        }
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
      return node;
    },
    rename: function(oldNode, newDir, newName) {
      var oldPath = NODEFS.realPath(oldNode);
      var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
      try {
        fs.renameSync(oldPath, newPath);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
      oldNode.name = newName;
    },
    unlink: function(parent, name) {
      var path = PATH.join2(NODEFS.realPath(parent), name);
      try {
        fs.unlinkSync(path);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    rmdir: function(parent, name) {
      var path = PATH.join2(NODEFS.realPath(parent), name);
      try {
        fs.rmdirSync(path);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    readdir: function(node) {
      var path = NODEFS.realPath(node);
      try {
        return fs.readdirSync(path);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    symlink: function(parent, newName, oldPath) {
      var newPath = PATH.join2(NODEFS.realPath(parent), newName);
      try {
        fs.symlinkSync(oldPath, newPath);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    readlink: function(node) {
      var path = NODEFS.realPath(node);
      try {
        path = fs.readlinkSync(path);
        path = NODEJS_PATH.relative(
          NODEJS_PATH.resolve(node.mount.opts.root),
          path
        );
        return path;
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    }
  },
  stream_ops: {
    open: function(stream) {
      var path = NODEFS.realPath(stream.node);
      try {
        if (FS.isFile(stream.node.mode)) {
          stream.nfd = fs.openSync(path, NODEFS.flagsForNode(stream.flags));
        }
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    close: function(stream) {
      try {
        if (FS.isFile(stream.node.mode) && stream.nfd) {
          fs.closeSync(stream.nfd);
        }
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    read: function(stream, buffer, offset, length, position) {
      if (length === 0) return 0;
      try {
        return fs.readSync(
          stream.nfd,
          NODEFS.bufferFrom(buffer.buffer),
          offset,
          length,
          position
        );
      } catch (e) {
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    write: function(stream, buffer, offset, length, position) {
      try {
        return fs.writeSync(
          stream.nfd,
          NODEFS.bufferFrom(buffer.buffer),
          offset,
          length,
          position
        );
      } catch (e) {
        throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
      }
    },
    llseek: function(stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          try {
            var stat = fs.fstatSync(stream.nfd);
            position += stat.size;
          } catch (e) {
            throw new FS.ErrnoError(NODEFS.convertNodeCode(e));
          }
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28);
      }
      return position;
    },
    mmap: function(stream, address, length, position, prot, flags) {
      assert(address === 0);
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      var ptr = _malloc(length);
      NODEFS.stream_ops.read(stream, HEAP8, ptr, length, position);
      return { ptr: ptr, allocated: true };
    },
    msync: function(stream, buffer, offset, length, mmapFlags) {
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      if (mmapFlags & 2) {
        return 0;
      }
      var bytesWritten = NODEFS.stream_ops.write(
        stream,
        buffer,
        0,
        length,
        offset,
        false
      );
      return 0;
    }
  }
};
var NODERAWFS = {
  lookupPath: function(path) {
    return { path: path, node: { mode: NODEFS.getMode(path) } };
  },
  createStandardStreams: function() {
    FS.streams[0] = {
      fd: 0,
      nfd: 0,
      position: 0,
      path: "",
      flags: 0,
      tty: true,
      seekable: false
    };
    for (var i = 1; i < 3; i++) {
      FS.streams[i] = {
        fd: i,
        nfd: i,
        position: 0,
        path: "",
        flags: 577,
        tty: true,
        seekable: false
      };
    }
  },
  cwd: function() {
    return process.cwd();
  },
  chdir: function() {
    process.chdir.apply(void 0, arguments);
  },
  mknod: function(path, mode) {
    if (FS.isDir(path)) {
      fs.mkdirSync(path, mode);
    } else {
      fs.writeFileSync(path, "", { mode: mode });
    }
  },
  mkdir: function() {
    fs.mkdirSync.apply(void 0, arguments);
  },
  symlink: function() {
    fs.symlinkSync.apply(void 0, arguments);
  },
  rename: function() {
    fs.renameSync.apply(void 0, arguments);
  },
  rmdir: function() {
    fs.rmdirSync.apply(void 0, arguments);
  },
  readdir: function() {
    fs.readdirSync.apply(void 0, arguments);
  },
  unlink: function() {
    fs.unlinkSync.apply(void 0, arguments);
  },
  readlink: function() {
    return fs.readlinkSync.apply(void 0, arguments);
  },
  stat: function() {
    return fs.statSync.apply(void 0, arguments);
  },
  lstat: function() {
    return fs.lstatSync.apply(void 0, arguments);
  },
  chmod: function() {
    fs.chmodSync.apply(void 0, arguments);
  },
  fchmod: function() {
    fs.fchmodSync.apply(void 0, arguments);
  },
  chown: function() {
    fs.chownSync.apply(void 0, arguments);
  },
  fchown: function() {
    fs.fchownSync.apply(void 0, arguments);
  },
  truncate: function() {
    fs.truncateSync.apply(void 0, arguments);
  },
  ftruncate: function() {
    fs.ftruncateSync.apply(void 0, arguments);
  },
  utime: function() {
    fs.utimesSync.apply(void 0, arguments);
  },
  open: function(path, flags, mode, suggestFD) {
    if (typeof flags === "string") {
      flags = VFS.modeStringToFlags(flags);
    }
    var nfd = fs.openSync(path, NODEFS.flagsForNode(flags), mode);
    var fd = suggestFD != null ? suggestFD : FS.nextfd(nfd);
    var stream = {
      fd: fd,
      nfd: nfd,
      position: 0,
      path: path,
      flags: flags,
      seekable: true
    };
    FS.streams[fd] = stream;
    return stream;
  },
  close: function(stream) {
    if (!stream.stream_ops) {
      fs.closeSync(stream.nfd);
    }
    FS.closeStream(stream.fd);
  },
  llseek: function(stream, offset, whence) {
    if (stream.stream_ops) {
      return VFS.llseek(stream, offset, whence);
    }
    var position = offset;
    if (whence === 1) {
      position += stream.position;
    } else if (whence === 2) {
      position += fs.fstatSync(stream.nfd).size;
    } else if (whence !== 0) {
      throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
    }
    if (position < 0) {
      throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
    }
    stream.position = position;
    return position;
  },
  read: function(stream, buffer, offset, length, position) {
    if (stream.stream_ops) {
      return VFS.read(stream, buffer, offset, length, position);
    }
    var seeking = typeof position !== "undefined";
    if (!seeking && stream.seekable) position = stream.position;
    var bytesRead = fs.readSync(
      stream.nfd,
      NODEFS.bufferFrom(buffer.buffer),
      offset,
      length,
      position
    );
    if (!seeking) stream.position += bytesRead;
    return bytesRead;
  },
  write: function(stream, buffer, offset, length, position) {
    if (stream.stream_ops) {
      return VFS.write(stream, buffer, offset, length, position);
    }
    if (stream.flags & +"1024") {
      FS.llseek(stream, 0, +"2");
    }
    var seeking = typeof position !== "undefined";
    if (!seeking && stream.seekable) position = stream.position;
    var bytesWritten = fs.writeSync(
      stream.nfd,
      NODEFS.bufferFrom(buffer.buffer),
      offset,
      length,
      position
    );
    if (!seeking) stream.position += bytesWritten;
    return bytesWritten;
  },
  allocate: function() {
    throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
  },
  mmap: function() {
    throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
  },
  msync: function() {
    return 0;
  },
  munmap: function() {
    return 0;
  },
  ioctl: function() {
    throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
  }
};
var FS = {
  root: null,
  mounts: [],
  devices: {},
  streams: [],
  nextInode: 1,
  nameTable: null,
  currentPath: "/",
  initialized: false,
  ignorePermissions: true,
  trackingDelegate: {},
  tracking: { openFlags: { READ: 1, WRITE: 2 } },
  ErrnoError: null,
  genericErrors: {},
  filesystems: null,
  syncFSRequests: 0,
  handleFSError: function(e) {
    if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
    return setErrNo(e.errno);
  },
  lookupPath: function(path, opts) {
    path = PATH_FS.resolve(FS.cwd(), path);
    opts = opts || {};
    if (!path) return { path: "", node: null };
    var defaults = { follow_mount: true, recurse_count: 0 };
    for (var key in defaults) {
      if (opts[key] === undefined) {
        opts[key] = defaults[key];
      }
    }
    if (opts.recurse_count > 8) {
      throw new FS.ErrnoError(32);
    }
    var parts = PATH.normalizeArray(
      path.split("/").filter(function(p) {
        return !!p;
      }),
      false
    );
    var current = FS.root;
    var current_path = "/";
    for (var i = 0; i < parts.length; i++) {
      var islast = i === parts.length - 1;
      if (islast && opts.parent) {
        break;
      }
      current = FS.lookupNode(current, parts[i]);
      current_path = PATH.join2(current_path, parts[i]);
      if (FS.isMountpoint(current)) {
        if (!islast || (islast && opts.follow_mount)) {
          current = current.mounted.root;
        }
      }
      if (!islast || opts.follow) {
        var count = 0;
        while (FS.isLink(current.mode)) {
          var link = FS.readlink(current_path);
          current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
          var lookup = FS.lookupPath(current_path, {
            recurse_count: opts.recurse_count
          });
          current = lookup.node;
          if (count++ > 40) {
            throw new FS.ErrnoError(32);
          }
        }
      }
    }
    return { path: current_path, node: current };
  },
  getPath: function(node) {
    var path;
    while (true) {
      if (FS.isRoot(node)) {
        var mount = node.mount.mountpoint;
        if (!path) return mount;
        return mount[mount.length - 1] !== "/"
          ? mount + "/" + path
          : mount + path;
      }
      path = path ? node.name + "/" + path : node.name;
      node = node.parent;
    }
  },
  hashName: function(parentid, name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    }
    return ((parentid + hash) >>> 0) % FS.nameTable.length;
  },
  hashAddNode: function(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    node.name_next = FS.nameTable[hash];
    FS.nameTable[hash] = node;
  },
  hashRemoveNode: function(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    if (FS.nameTable[hash] === node) {
      FS.nameTable[hash] = node.name_next;
    } else {
      var current = FS.nameTable[hash];
      while (current) {
        if (current.name_next === node) {
          current.name_next = node.name_next;
          break;
        }
        current = current.name_next;
      }
    }
  },
  lookupNode: function(parent, name) {
    var errCode = FS.mayLookup(parent);
    if (errCode) {
      throw new FS.ErrnoError(errCode, parent);
    }
    var hash = FS.hashName(parent.id, name);
    for (var node = FS.nameTable[hash]; node; node = node.name_next) {
      var nodeName = node.name;
      if (node.parent.id === parent.id && nodeName === name) {
        return node;
      }
    }
    return FS.lookup(parent, name);
  },
  createNode: function(parent, name, mode, rdev) {
    var node = new FS.FSNode(parent, name, mode, rdev);
    FS.hashAddNode(node);
    return node;
  },
  destroyNode: function(node) {
    FS.hashRemoveNode(node);
  },
  isRoot: function(node) {
    return node === node.parent;
  },
  isMountpoint: function(node) {
    return !!node.mounted;
  },
  isFile: function(mode) {
    return (mode & 61440) === 32768;
  },
  isDir: function(mode) {
    return (mode & 61440) === 16384;
  },
  isLink: function(mode) {
    return (mode & 61440) === 40960;
  },
  isChrdev: function(mode) {
    return (mode & 61440) === 8192;
  },
  isBlkdev: function(mode) {
    return (mode & 61440) === 24576;
  },
  isFIFO: function(mode) {
    return (mode & 61440) === 4096;
  },
  isSocket: function(mode) {
    return (mode & 49152) === 49152;
  },
  flagModes: {
    r: 0,
    rs: 1052672,
    "r+": 2,
    w: 577,
    wx: 705,
    xw: 705,
    "w+": 578,
    "wx+": 706,
    "xw+": 706,
    a: 1089,
    ax: 1217,
    xa: 1217,
    "a+": 1090,
    "ax+": 1218,
    "xa+": 1218
  },
  modeStringToFlags: function(str) {
    var flags = FS.flagModes[str];
    if (typeof flags === "undefined") {
      throw new Error("Unknown file open mode: " + str);
    }
    return flags;
  },
  flagsToPermissionString: function(flag) {
    var perms = ["r", "w", "rw"][flag & 3];
    if (flag & 512) {
      perms += "w";
    }
    return perms;
  },
  nodePermissions: function(node, perms) {
    if (FS.ignorePermissions) {
      return 0;
    }
    if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
      return 2;
    } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
      return 2;
    } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
      return 2;
    }
    return 0;
  },
  mayLookup: function(dir) {
    var errCode = FS.nodePermissions(dir, "x");
    if (errCode) return errCode;
    if (!dir.node_ops.lookup) return 2;
    return 0;
  },
  mayCreate: function(dir, name) {
    try {
      var node = FS.lookupNode(dir, name);
      return 20;
    } catch (e) {}
    return FS.nodePermissions(dir, "wx");
  },
  mayDelete: function(dir, name, isdir) {
    var node;
    try {
      node = FS.lookupNode(dir, name);
    } catch (e) {
      return e.errno;
    }
    var errCode = FS.nodePermissions(dir, "wx");
    if (errCode) {
      return errCode;
    }
    if (isdir) {
      if (!FS.isDir(node.mode)) {
        return 54;
      }
      if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
        return 10;
      }
    } else {
      if (FS.isDir(node.mode)) {
        return 31;
      }
    }
    return 0;
  },
  mayOpen: function(node, flags) {
    if (!node) {
      return 44;
    }
    if (FS.isLink(node.mode)) {
      return 32;
    } else if (FS.isDir(node.mode)) {
      if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
        return 31;
      }
    }
    return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
  },
  MAX_OPEN_FDS: 4096,
  nextfd: function(fd_start, fd_end) {
    fd_start = fd_start || 0;
    fd_end = fd_end || FS.MAX_OPEN_FDS;
    for (var fd = fd_start; fd <= fd_end; fd++) {
      if (!FS.streams[fd]) {
        return fd;
      }
    }
    throw new FS.ErrnoError(33);
  },
  getStream: function(fd) {
    return FS.streams[fd];
  },
  createStream: function(stream, fd_start, fd_end) {
    if (!FS.FSStream) {
      FS.FSStream = function() {};
      FS.FSStream.prototype = {
        object: {
          get: function() {
            return this.node;
          },
          set: function(val) {
            this.node = val;
          }
        },
        isRead: {
          get: function() {
            return (this.flags & 2097155) !== 1;
          }
        },
        isWrite: {
          get: function() {
            return (this.flags & 2097155) !== 0;
          }
        },
        isAppend: {
          get: function() {
            return this.flags & 1024;
          }
        }
      };
    }
    var newStream = new FS.FSStream();
    for (var p in stream) {
      newStream[p] = stream[p];
    }
    stream = newStream;
    var fd = FS.nextfd(fd_start, fd_end);
    stream.fd = fd;
    FS.streams[fd] = stream;
    return stream;
  },
  closeStream: function(fd) {
    FS.streams[fd] = null;
  },
  chrdev_stream_ops: {
    open: function(stream) {
      var device = FS.getDevice(stream.node.rdev);
      stream.stream_ops = device.stream_ops;
      if (stream.stream_ops.open) {
        stream.stream_ops.open(stream);
      }
    },
    llseek: function() {
      throw new FS.ErrnoError(70);
    }
  },
  major: function(dev) {
    return dev >> 8;
  },
  minor: function(dev) {
    return dev & 255;
  },
  makedev: function(ma, mi) {
    return (ma << 8) | mi;
  },
  registerDevice: function(dev, ops) {
    FS.devices[dev] = { stream_ops: ops };
  },
  getDevice: function(dev) {
    return FS.devices[dev];
  },
  getMounts: function(mount) {
    var mounts = [];
    var check = [mount];
    while (check.length) {
      var m = check.pop();
      mounts.push(m);
      check.push.apply(check, m.mounts);
    }
    return mounts;
  },
  syncfs: function(populate, callback) {
    if (typeof populate === "function") {
      callback = populate;
      populate = false;
    }
    FS.syncFSRequests++;
    if (FS.syncFSRequests > 1) {
      err(
        "warning: " +
          FS.syncFSRequests +
          " FS.syncfs operations in flight at once, probably just doing extra work"
      );
    }
    var mounts = FS.getMounts(FS.root.mount);
    var completed = 0;
    function doCallback(errCode) {
      FS.syncFSRequests--;
      return callback(errCode);
    }
    function done(errCode) {
      if (errCode) {
        if (!done.errored) {
          done.errored = true;
          return doCallback(errCode);
        }
        return;
      }
      if (++completed >= mounts.length) {
        doCallback(null);
      }
    }
    mounts.forEach(function(mount) {
      if (!mount.type.syncfs) {
        return done(null);
      }
      mount.type.syncfs(mount, populate, done);
    });
  },
  mount: function(type, opts, mountpoint) {
    var root = mountpoint === "/";
    var pseudo = !mountpoint;
    var node;
    if (root && FS.root) {
      throw new FS.ErrnoError(10);
    } else if (!root && !pseudo) {
      var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
      mountpoint = lookup.path;
      node = lookup.node;
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      if (!FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
    }
    var mount = { type: type, opts: opts, mountpoint: mountpoint, mounts: [] };
    var mountRoot = type.mount(mount);
    mountRoot.mount = mount;
    mount.root = mountRoot;
    if (root) {
      FS.root = mountRoot;
    } else if (node) {
      node.mounted = mount;
      if (node.mount) {
        node.mount.mounts.push(mount);
      }
    }
    return mountRoot;
  },
  unmount: function(mountpoint) {
    var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
    if (!FS.isMountpoint(lookup.node)) {
      throw new FS.ErrnoError(28);
    }
    var node = lookup.node;
    var mount = node.mounted;
    var mounts = FS.getMounts(mount);
    Object.keys(FS.nameTable).forEach(function(hash) {
      var current = FS.nameTable[hash];
      while (current) {
        var next = current.name_next;
        if (mounts.indexOf(current.mount) !== -1) {
          FS.destroyNode(current);
        }
        current = next;
      }
    });
    node.mounted = null;
    var idx = node.mount.mounts.indexOf(mount);
    node.mount.mounts.splice(idx, 1);
  },
  lookup: function(parent, name) {
    return parent.node_ops.lookup(parent, name);
  },
  mknod: function(path, mode, dev) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    if (!name || name === "." || name === "..") {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.mayCreate(parent, name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.mknod) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.mknod(parent, name, mode, dev);
  },
  create: function(path, mode) {
    mode = mode !== undefined ? mode : 438;
    mode &= 4095;
    mode |= 32768;
    return FS.mknod(path, mode, 0);
  },
  mkdir: function(path, mode) {
    mode = mode !== undefined ? mode : 511;
    mode &= 511 | 512;
    mode |= 16384;
    return FS.mknod(path, mode, 0);
  },
  mkdirTree: function(path, mode) {
    var dirs = path.split("/");
    var d = "";
    for (var i = 0; i < dirs.length; ++i) {
      if (!dirs[i]) continue;
      d += "/" + dirs[i];
      try {
        FS.mkdir(d, mode);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
    }
  },
  mkdev: function(path, mode, dev) {
    if (typeof dev === "undefined") {
      dev = mode;
      mode = 438;
    }
    mode |= 8192;
    return FS.mknod(path, mode, dev);
  },
  symlink: function(oldpath, newpath) {
    if (!PATH_FS.resolve(oldpath)) {
      throw new FS.ErrnoError(44);
    }
    var lookup = FS.lookupPath(newpath, { parent: true });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var newname = PATH.basename(newpath);
    var errCode = FS.mayCreate(parent, newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.symlink) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.symlink(parent, newname, oldpath);
  },
  rename: function(old_path, new_path) {
    var old_dirname = PATH.dirname(old_path);
    var new_dirname = PATH.dirname(new_path);
    var old_name = PATH.basename(old_path);
    var new_name = PATH.basename(new_path);
    var lookup, old_dir, new_dir;
    try {
      lookup = FS.lookupPath(old_path, { parent: true });
      old_dir = lookup.node;
      lookup = FS.lookupPath(new_path, { parent: true });
      new_dir = lookup.node;
    } catch (e) {
      throw new FS.ErrnoError(10);
    }
    if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
    if (old_dir.mount !== new_dir.mount) {
      throw new FS.ErrnoError(75);
    }
    var old_node = FS.lookupNode(old_dir, old_name);
    var relative = PATH_FS.relative(old_path, new_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(28);
    }
    relative = PATH_FS.relative(new_path, old_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(55);
    }
    var new_node;
    try {
      new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    if (old_node === new_node) {
      return;
    }
    var isdir = FS.isDir(old_node.mode);
    var errCode = FS.mayDelete(old_dir, old_name, isdir);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    errCode = new_node
      ? FS.mayDelete(new_dir, new_name, isdir)
      : FS.mayCreate(new_dir, new_name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!old_dir.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
      throw new FS.ErrnoError(10);
    }
    if (new_dir !== old_dir) {
      errCode = FS.nodePermissions(old_dir, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    try {
      if (FS.trackingDelegate["willMovePath"]) {
        FS.trackingDelegate["willMovePath"](old_path, new_path);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['willMovePath']('" +
          old_path +
          "', '" +
          new_path +
          "') threw an exception: " +
          e.message
      );
    }
    FS.hashRemoveNode(old_node);
    try {
      old_dir.node_ops.rename(old_node, new_dir, new_name);
    } catch (e) {
      throw e;
    } finally {
      FS.hashAddNode(old_node);
    }
    try {
      if (FS.trackingDelegate["onMovePath"])
        FS.trackingDelegate["onMovePath"](old_path, new_path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onMovePath']('" +
          old_path +
          "', '" +
          new_path +
          "') threw an exception: " +
          e.message
      );
    }
  },
  rmdir: function(path) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, true);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.rmdir) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    try {
      if (FS.trackingDelegate["willDeletePath"]) {
        FS.trackingDelegate["willDeletePath"](path);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['willDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
    parent.node_ops.rmdir(parent, name);
    FS.destroyNode(node);
    try {
      if (FS.trackingDelegate["onDeletePath"])
        FS.trackingDelegate["onDeletePath"](path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
  },
  readdir: function(path) {
    var lookup = FS.lookupPath(path, { follow: true });
    var node = lookup.node;
    if (!node.node_ops.readdir) {
      throw new FS.ErrnoError(54);
    }
    return node.node_ops.readdir(node);
  },
  unlink: function(path) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, false);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.unlink) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    try {
      if (FS.trackingDelegate["willDeletePath"]) {
        FS.trackingDelegate["willDeletePath"](path);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['willDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
    parent.node_ops.unlink(parent, name);
    FS.destroyNode(node);
    try {
      if (FS.trackingDelegate["onDeletePath"])
        FS.trackingDelegate["onDeletePath"](path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
  },
  readlink: function(path) {
    var lookup = FS.lookupPath(path);
    var link = lookup.node;
    if (!link) {
      throw new FS.ErrnoError(44);
    }
    if (!link.node_ops.readlink) {
      throw new FS.ErrnoError(28);
    }
    return PATH_FS.resolve(
      FS.getPath(link.parent),
      link.node_ops.readlink(link)
    );
  },
  stat: function(path, dontFollow) {
    var lookup = FS.lookupPath(path, { follow: !dontFollow });
    var node = lookup.node;
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    if (!node.node_ops.getattr) {
      throw new FS.ErrnoError(63);
    }
    return node.node_ops.getattr(node);
  },
  lstat: function(path) {
    return FS.stat(path, true);
  },
  chmod: function(path, mode, dontFollow) {
    var node;
    if (typeof path === "string") {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    node.node_ops.setattr(node, {
      mode: (mode & 4095) | (node.mode & ~4095),
      timestamp: Date.now()
    });
  },
  lchmod: function(path, mode) {
    FS.chmod(path, mode, true);
  },
  fchmod: function(fd, mode) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    FS.chmod(stream.node, mode);
  },
  chown: function(path, uid, gid, dontFollow) {
    var node;
    if (typeof path === "string") {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    node.node_ops.setattr(node, { timestamp: Date.now() });
  },
  lchown: function(path, uid, gid) {
    FS.chown(path, uid, gid, true);
  },
  fchown: function(fd, uid, gid) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    FS.chown(stream.node, uid, gid);
  },
  truncate: function(path, len) {
    if (len < 0) {
      throw new FS.ErrnoError(28);
    }
    var node;
    if (typeof path === "string") {
      var lookup = FS.lookupPath(path, { follow: true });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isDir(node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!FS.isFile(node.mode)) {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.nodePermissions(node, "w");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    node.node_ops.setattr(node, { size: len, timestamp: Date.now() });
  },
  ftruncate: function(fd, len) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(28);
    }
    FS.truncate(stream.node, len);
  },
  utime: function(path, atime, mtime) {
    var lookup = FS.lookupPath(path, { follow: true });
    var node = lookup.node;
    node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
  },
  open: function(path, flags, mode, fd_start, fd_end) {
    if (path === "") {
      throw new FS.ErrnoError(44);
    }
    flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
    mode = typeof mode === "undefined" ? 438 : mode;
    if (flags & 64) {
      mode = (mode & 4095) | 32768;
    } else {
      mode = 0;
    }
    var node;
    if (typeof path === "object") {
      node = path;
    } else {
      path = PATH.normalize(path);
      try {
        var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
        node = lookup.node;
      } catch (e) {}
    }
    var created = false;
    if (flags & 64) {
      if (node) {
        if (flags & 128) {
          throw new FS.ErrnoError(20);
        }
      } else {
        node = FS.mknod(path, mode, 0);
        created = true;
      }
    }
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    if (FS.isChrdev(node.mode)) {
      flags &= ~512;
    }
    if (flags & 65536 && !FS.isDir(node.mode)) {
      throw new FS.ErrnoError(54);
    }
    if (!created) {
      var errCode = FS.mayOpen(node, flags);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    if (flags & 512) {
      FS.truncate(node, 0);
    }
    flags &= ~(128 | 512 | 131072);
    var stream = FS.createStream(
      {
        node: node,
        path: FS.getPath(node),
        flags: flags,
        seekable: true,
        position: 0,
        stream_ops: node.stream_ops,
        ungotten: [],
        error: false
      },
      fd_start,
      fd_end
    );
    if (stream.stream_ops.open) {
      stream.stream_ops.open(stream);
    }
    if (Module["logReadFiles"] && !(flags & 1)) {
      if (!FS.readFiles) FS.readFiles = {};
      if (!(path in FS.readFiles)) {
        FS.readFiles[path] = 1;
        err("FS.trackingDelegate error on read file: " + path);
      }
    }
    try {
      if (FS.trackingDelegate["onOpenFile"]) {
        var trackingFlags = 0;
        if ((flags & 2097155) !== 1) {
          trackingFlags |= FS.tracking.openFlags.READ;
        }
        if ((flags & 2097155) !== 0) {
          trackingFlags |= FS.tracking.openFlags.WRITE;
        }
        FS.trackingDelegate["onOpenFile"](path, trackingFlags);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['onOpenFile']('" +
          path +
          "', flags) threw an exception: " +
          e.message
      );
    }
    return stream;
  },
  close: function(stream) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (stream.getdents) stream.getdents = null;
    try {
      if (stream.stream_ops.close) {
        stream.stream_ops.close(stream);
      }
    } catch (e) {
      throw e;
    } finally {
      FS.closeStream(stream.fd);
    }
    stream.fd = null;
  },
  isClosed: function(stream) {
    return stream.fd === null;
  },
  llseek: function(stream, offset, whence) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (!stream.seekable || !stream.stream_ops.llseek) {
      throw new FS.ErrnoError(70);
    }
    if (whence != 0 && whence != 1 && whence != 2) {
      throw new FS.ErrnoError(28);
    }
    stream.position = stream.stream_ops.llseek(stream, offset, whence);
    stream.ungotten = [];
    return stream.position;
  },
  read: function(stream, buffer, offset, length, position) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.read) {
      throw new FS.ErrnoError(28);
    }
    var seeking = typeof position !== "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesRead = stream.stream_ops.read(
      stream,
      buffer,
      offset,
      length,
      position
    );
    if (!seeking) stream.position += bytesRead;
    return bytesRead;
  },
  write: function(stream, buffer, offset, length, position, canOwn) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.write) {
      throw new FS.ErrnoError(28);
    }
    if (stream.seekable && stream.flags & 1024) {
      FS.llseek(stream, 0, 2);
    }
    var seeking = typeof position !== "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesWritten = stream.stream_ops.write(
      stream,
      buffer,
      offset,
      length,
      position,
      canOwn
    );
    if (!seeking) stream.position += bytesWritten;
    try {
      if (stream.path && FS.trackingDelegate["onWriteToFile"])
        FS.trackingDelegate["onWriteToFile"](stream.path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onWriteToFile']('" +
          stream.path +
          "') threw an exception: " +
          e.message
      );
    }
    return bytesWritten;
  },
  allocate: function(stream, offset, length) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (offset < 0 || length <= 0) {
      throw new FS.ErrnoError(28);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    if (!stream.stream_ops.allocate) {
      throw new FS.ErrnoError(138);
    }
    stream.stream_ops.allocate(stream, offset, length);
  },
  mmap: function(stream, address, length, position, prot, flags) {
    if (
      (prot & 2) !== 0 &&
      (flags & 2) === 0 &&
      (stream.flags & 2097155) !== 2
    ) {
      throw new FS.ErrnoError(2);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(2);
    }
    if (!stream.stream_ops.mmap) {
      throw new FS.ErrnoError(43);
    }
    return stream.stream_ops.mmap(
      stream,
      address,
      length,
      position,
      prot,
      flags
    );
  },
  msync: function(stream, buffer, offset, length, mmapFlags) {
    if (!stream || !stream.stream_ops.msync) {
      return 0;
    }
    return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
  },
  munmap: function(stream) {
    return 0;
  },
  ioctl: function(stream, cmd, arg) {
    if (!stream.stream_ops.ioctl) {
      throw new FS.ErrnoError(59);
    }
    return stream.stream_ops.ioctl(stream, cmd, arg);
  },
  readFile: function(path, opts) {
    opts = opts || {};
    opts.flags = opts.flags || "r";
    opts.encoding = opts.encoding || "binary";
    if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
      throw new Error('Invalid encoding type "' + opts.encoding + '"');
    }
    var ret;
    var stream = FS.open(path, opts.flags);
    var stat = FS.stat(path);
    var length = stat.size;
    var buf = new Uint8Array(length);
    FS.read(stream, buf, 0, length, 0);
    if (opts.encoding === "utf8") {
      ret = UTF8ArrayToString(buf, 0);
    } else if (opts.encoding === "binary") {
      ret = buf;
    }
    FS.close(stream);
    return ret;
  },
  writeFile: function(path, data, opts) {
    opts = opts || {};
    opts.flags = opts.flags || "w";
    var stream = FS.open(path, opts.flags, opts.mode);
    if (typeof data === "string") {
      var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
      var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
      FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
    } else if (ArrayBuffer.isView(data)) {
      FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
    } else {
      throw new Error("Unsupported data type");
    }
    FS.close(stream);
  },
  cwd: function() {
    return FS.currentPath;
  },
  chdir: function(path) {
    var lookup = FS.lookupPath(path, { follow: true });
    if (lookup.node === null) {
      throw new FS.ErrnoError(44);
    }
    if (!FS.isDir(lookup.node.mode)) {
      throw new FS.ErrnoError(54);
    }
    var errCode = FS.nodePermissions(lookup.node, "x");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.currentPath = lookup.path;
  },
  createDefaultDirectories: function() {
    FS.mkdir("/tmp");
    FS.mkdir("/home");
    FS.mkdir("/home/web_user");
  },
  createDefaultDevices: function() {
    FS.mkdir("/dev");
    FS.registerDevice(FS.makedev(1, 3), {
      read: function() {
        return 0;
      },
      write: function(stream, buffer, offset, length, pos) {
        return length;
      }
    });
    FS.mkdev("/dev/null", FS.makedev(1, 3));
    TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
    TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
    FS.mkdev("/dev/tty", FS.makedev(5, 0));
    FS.mkdev("/dev/tty1", FS.makedev(6, 0));
    var random_device;
    if (
      typeof crypto === "object" &&
      typeof crypto["getRandomValues"] === "function"
    ) {
      var randomBuffer = new Uint8Array(1);
      random_device = function() {
        crypto.getRandomValues(randomBuffer);
        return randomBuffer[0];
      };
    } else if (ENVIRONMENT_IS_NODE) {
      try {
        var crypto_module = __webpack_require__(417);
        random_device = function() {
          return crypto_module["randomBytes"](1)[0];
        };
      } catch (e) {}
    } else {
    }
    if (!random_device) {
      random_device = function() {
        abort("random_device");
      };
    }
    FS.createDevice("/dev", "random", random_device);
    FS.createDevice("/dev", "urandom", random_device);
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp");
  },
  createSpecialDirectories: function() {
    FS.mkdir("/proc");
    FS.mkdir("/proc/self");
    FS.mkdir("/proc/self/fd");
    FS.mount(
      {
        mount: function() {
          var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
          node.node_ops = {
            lookup: function(parent, name) {
              var fd = +name;
              var stream = FS.getStream(fd);
              if (!stream) throw new FS.ErrnoError(8);
              var ret = {
                parent: null,
                mount: { mountpoint: "fake" },
                node_ops: {
                  readlink: function() {
                    return stream.path;
                  }
                }
              };
              ret.parent = ret;
              return ret;
            }
          };
          return node;
        }
      },
      {},
      "/proc/self/fd"
    );
  },
  createStandardStreams: function() {
    if (Module["stdin"]) {
      FS.createDevice("/dev", "stdin", Module["stdin"]);
    } else {
      FS.symlink("/dev/tty", "/dev/stdin");
    }
    if (Module["stdout"]) {
      FS.createDevice("/dev", "stdout", null, Module["stdout"]);
    } else {
      FS.symlink("/dev/tty", "/dev/stdout");
    }
    if (Module["stderr"]) {
      FS.createDevice("/dev", "stderr", null, Module["stderr"]);
    } else {
      FS.symlink("/dev/tty1", "/dev/stderr");
    }
    var stdin = FS.open("/dev/stdin", "r");
    var stdout = FS.open("/dev/stdout", "w");
    var stderr = FS.open("/dev/stderr", "w");
  },
  ensureErrnoError: function() {
    if (FS.ErrnoError) return;
    FS.ErrnoError = function ErrnoError(errno, node) {
      this.node = node;
      this.setErrno = function(errno) {
        this.errno = errno;
      };
      this.setErrno(errno);
      this.message = "FS error";
    };
    FS.ErrnoError.prototype = new Error();
    FS.ErrnoError.prototype.constructor = FS.ErrnoError;
    [44].forEach(function(code) {
      FS.genericErrors[code] = new FS.ErrnoError(code);
      FS.genericErrors[code].stack = "<generic error, no stack>";
    });
  },
  staticInit: function() {
    FS.ensureErrnoError();
    FS.nameTable = new Array(4096);
    FS.mount(MEMFS, {}, "/");
    FS.createDefaultDirectories();
    FS.createDefaultDevices();
    FS.createSpecialDirectories();
    FS.filesystems = { MEMFS: MEMFS, NODEFS: NODEFS };
  },
  init: function(input, output, error) {
    FS.init.initialized = true;
    FS.ensureErrnoError();
    Module["stdin"] = input || Module["stdin"];
    Module["stdout"] = output || Module["stdout"];
    Module["stderr"] = error || Module["stderr"];
    FS.createStandardStreams();
  },
  quit: function() {
    FS.init.initialized = false;
    var fflush = Module["_fflush"];
    if (fflush) fflush(0);
    for (var i = 0; i < FS.streams.length; i++) {
      var stream = FS.streams[i];
      if (!stream) {
        continue;
      }
      FS.close(stream);
    }
  },
  getMode: function(canRead, canWrite) {
    var mode = 0;
    if (canRead) mode |= 292 | 73;
    if (canWrite) mode |= 146;
    return mode;
  },
  joinPath: function(parts, forceRelative) {
    var path = PATH.join.apply(null, parts);
    if (forceRelative && path[0] == "/") path = path.substr(1);
    return path;
  },
  absolutePath: function(relative, base) {
    return PATH_FS.resolve(base, relative);
  },
  standardizePath: function(path) {
    return PATH.normalize(path);
  },
  findObject: function(path, dontResolveLastLink) {
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (ret.exists) {
      return ret.object;
    } else {
      setErrNo(ret.error);
      return null;
    }
  },
  analyzePath: function(path, dontResolveLastLink) {
    try {
      var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
      path = lookup.path;
    } catch (e) {}
    var ret = {
      isRoot: false,
      exists: false,
      error: 0,
      name: null,
      path: null,
      object: null,
      parentExists: false,
      parentPath: null,
      parentObject: null
    };
    try {
      var lookup = FS.lookupPath(path, { parent: true });
      ret.parentExists = true;
      ret.parentPath = lookup.path;
      ret.parentObject = lookup.node;
      ret.name = PATH.basename(path);
      lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
      ret.exists = true;
      ret.path = lookup.path;
      ret.object = lookup.node;
      ret.name = lookup.node.name;
      ret.isRoot = lookup.path === "/";
    } catch (e) {
      ret.error = e.errno;
    }
    return ret;
  },
  createFolder: function(parent, name, canRead, canWrite) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    var mode = FS.getMode(canRead, canWrite);
    return FS.mkdir(path, mode);
  },
  createPath: function(parent, path, canRead, canWrite) {
    parent = typeof parent === "string" ? parent : FS.getPath(parent);
    var parts = path.split("/").reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent, part);
      try {
        FS.mkdir(current);
      } catch (e) {}
      parent = current;
    }
    return current;
  },
  createFile: function(parent, name, properties, canRead, canWrite) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    var mode = FS.getMode(canRead, canWrite);
    return FS.create(path, mode);
  },
  createDataFile: function(parent, name, data, canRead, canWrite, canOwn) {
    var path = name
      ? PATH.join2(
          typeof parent === "string" ? parent : FS.getPath(parent),
          name
        )
      : parent;
    var mode = FS.getMode(canRead, canWrite);
    var node = FS.create(path, mode);
    if (data) {
      if (typeof data === "string") {
        var arr = new Array(data.length);
        for (var i = 0, len = data.length; i < len; ++i)
          arr[i] = data.charCodeAt(i);
        data = arr;
      }
      FS.chmod(node, mode | 146);
      var stream = FS.open(node, "w");
      FS.write(stream, data, 0, data.length, 0, canOwn);
      FS.close(stream);
      FS.chmod(node, mode);
    }
    return node;
  },
  createDevice: function(parent, name, input, output) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    var mode = FS.getMode(!!input, !!output);
    if (!FS.createDevice.major) FS.createDevice.major = 64;
    var dev = FS.makedev(FS.createDevice.major++, 0);
    FS.registerDevice(dev, {
      open: function(stream) {
        stream.seekable = false;
      },
      close: function(stream) {
        if (output && output.buffer && output.buffer.length) {
          output(10);
        }
      },
      read: function(stream, buffer, offset, length, pos) {
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = input();
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (result === undefined && bytesRead === 0) {
            throw new FS.ErrnoError(6);
          }
          if (result === null || result === undefined) break;
          bytesRead++;
          buffer[offset + i] = result;
        }
        if (bytesRead) {
          stream.node.timestamp = Date.now();
        }
        return bytesRead;
      },
      write: function(stream, buffer, offset, length, pos) {
        for (var i = 0; i < length; i++) {
          try {
            output(buffer[offset + i]);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
        if (length) {
          stream.node.timestamp = Date.now();
        }
        return i;
      }
    });
    return FS.mkdev(path, mode, dev);
  },
  createLink: function(parent, name, target, canRead, canWrite) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    return FS.symlink(target, path);
  },
  forceLoadFile: function(obj) {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    var success = true;
    if (typeof XMLHttpRequest !== "undefined") {
      throw new Error(
        "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
      );
    } else if (read_) {
      try {
        obj.contents = intArrayFromString(read_(obj.url), true);
        obj.usedBytes = obj.contents.length;
      } catch (e) {
        success = false;
      }
    } else {
      throw new Error("Cannot load without read() or XMLHttpRequest.");
    }
    if (!success) setErrNo(29);
    return success;
  },
  createLazyFile: function(parent, name, url, canRead, canWrite) {
    function LazyUint8Array() {
      this.lengthKnown = false;
      this.chunks = [];
    }
    LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
      if (idx > this.length - 1 || idx < 0) {
        return undefined;
      }
      var chunkOffset = idx % this.chunkSize;
      var chunkNum = (idx / this.chunkSize) | 0;
      return this.getter(chunkNum)[chunkOffset];
    };
    LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(
      getter
    ) {
      this.getter = getter;
    };
    LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
      var xhr = new XMLHttpRequest();
      xhr.open("HEAD", url, false);
      xhr.send(null);
      if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
        throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
      var datalength = Number(xhr.getResponseHeader("Content-length"));
      var header;
      var hasByteServing =
        (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
      var usesGzip =
        (header = xhr.getResponseHeader("Content-Encoding")) &&
        header === "gzip";
      var chunkSize = 1024 * 1024;
      if (!hasByteServing) chunkSize = datalength;
      var doXHR = function(from, to) {
        if (from > to)
          throw new Error(
            "invalid range (" + from + ", " + to + ") or no bytes requested!"
          );
        if (to > datalength - 1)
          throw new Error(
            "only " + datalength + " bytes available! programmer error!"
          );
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        if (datalength !== chunkSize)
          xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
        if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
        if (xhr.overrideMimeType) {
          xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }
        xhr.send(null);
        if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
          throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
        if (xhr.response !== undefined) {
          return new Uint8Array(xhr.response || []);
        } else {
          return intArrayFromString(xhr.responseText || "", true);
        }
      };
      var lazyArray = this;
      lazyArray.setDataGetter(function(chunkNum) {
        var start = chunkNum * chunkSize;
        var end = (chunkNum + 1) * chunkSize - 1;
        end = Math.min(end, datalength - 1);
        if (typeof lazyArray.chunks[chunkNum] === "undefined") {
          lazyArray.chunks[chunkNum] = doXHR(start, end);
        }
        if (typeof lazyArray.chunks[chunkNum] === "undefined")
          throw new Error("doXHR failed!");
        return lazyArray.chunks[chunkNum];
      });
      if (usesGzip || !datalength) {
        chunkSize = datalength = 1;
        datalength = this.getter(0).length;
        chunkSize = datalength;
        out(
          "LazyFiles on gzip forces download of the whole file when length is accessed"
        );
      }
      this._length = datalength;
      this._chunkSize = chunkSize;
      this.lengthKnown = true;
    };
    if (typeof XMLHttpRequest !== "undefined") {
      if (!ENVIRONMENT_IS_WORKER)
        throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
      var lazyArray = new LazyUint8Array();
      Object.defineProperties(lazyArray, {
        length: {
          get: function() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._length;
          }
        },
        chunkSize: {
          get: function() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._chunkSize;
          }
        }
      });
      var properties = { isDevice: false, contents: lazyArray };
    } else {
      var properties = { isDevice: false, url: url };
    }
    var node = FS.createFile(parent, name, properties, canRead, canWrite);
    if (properties.contents) {
      node.contents = properties.contents;
    } else if (properties.url) {
      node.contents = null;
      node.url = properties.url;
    }
    Object.defineProperties(node, {
      usedBytes: {
        get: function() {
          return this.contents.length;
        }
      }
    });
    var stream_ops = {};
    var keys = Object.keys(node.stream_ops);
    keys.forEach(function(key) {
      var fn = node.stream_ops[key];
      stream_ops[key] = function forceLoadLazyFile() {
        if (!FS.forceLoadFile(node)) {
          throw new FS.ErrnoError(29);
        }
        return fn.apply(null, arguments);
      };
    });
    stream_ops.read = function stream_ops_read(
      stream,
      buffer,
      offset,
      length,
      position
    ) {
      if (!FS.forceLoadFile(node)) {
        throw new FS.ErrnoError(29);
      }
      var contents = stream.node.contents;
      if (position >= contents.length) return 0;
      var size = Math.min(contents.length - position, length);
      if (contents.slice) {
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents[position + i];
        }
      } else {
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents.get(position + i);
        }
      }
      return size;
    };
    node.stream_ops = stream_ops;
    return node;
  },
  createPreloadedFile: function(
    parent,
    name,
    url,
    canRead,
    canWrite,
    onload,
    onerror,
    dontCreateFile,
    canOwn,
    preFinish
  ) {
    Browser.init();
    var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
    var dep = getUniqueRunDependency("cp " + fullname);
    function processData(byteArray) {
      function finish(byteArray) {
        if (preFinish) preFinish();
        if (!dontCreateFile) {
          FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
        }
        if (onload) onload();
        removeRunDependency(dep);
      }
      var handled = false;
      Module["preloadPlugins"].forEach(function(plugin) {
        if (handled) return;
        if (plugin["canHandle"](fullname)) {
          plugin["handle"](byteArray, fullname, finish, function() {
            if (onerror) onerror();
            removeRunDependency(dep);
          });
          handled = true;
        }
      });
      if (!handled) finish(byteArray);
    }
    addRunDependency(dep);
    if (typeof url == "string") {
      Browser.asyncLoad(
        url,
        function(byteArray) {
          processData(byteArray);
        },
        onerror
      );
    } else {
      processData(url);
    }
  },
  indexedDB: function() {
    return (
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB
    );
  },
  DB_NAME: function() {
    return "EM_FS_" + window.location.pathname;
  },
  DB_VERSION: 20,
  DB_STORE_NAME: "FILE_DATA",
  saveFilesToDB: function(paths, onload, onerror) {
    onload = onload || function() {};
    onerror = onerror || function() {};
    var indexedDB = FS.indexedDB();
    try {
      var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
    } catch (e) {
      return onerror(e);
    }
    openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
      out("creating db");
      var db = openRequest.result;
      db.createObjectStore(FS.DB_STORE_NAME);
    };
    openRequest.onsuccess = function openRequest_onsuccess() {
      var db = openRequest.result;
      var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
      var files = transaction.objectStore(FS.DB_STORE_NAME);
      var ok = 0,
        fail = 0,
        total = paths.length;
      function finish() {
        if (fail == 0) onload();
        else onerror();
      }
      paths.forEach(function(path) {
        var putRequest = files.put(FS.analyzePath(path).object.contents, path);
        putRequest.onsuccess = function putRequest_onsuccess() {
          ok++;
          if (ok + fail == total) finish();
        };
        putRequest.onerror = function putRequest_onerror() {
          fail++;
          if (ok + fail == total) finish();
        };
      });
      transaction.onerror = onerror;
    };
    openRequest.onerror = onerror;
  },
  loadFilesFromDB: function(paths, onload, onerror) {
    onload = onload || function() {};
    onerror = onerror || function() {};
    var indexedDB = FS.indexedDB();
    try {
      var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
    } catch (e) {
      return onerror(e);
    }
    openRequest.onupgradeneeded = onerror;
    openRequest.onsuccess = function openRequest_onsuccess() {
      var db = openRequest.result;
      try {
        var transaction = db.transaction([FS.DB_STORE_NAME], "readonly");
      } catch (e) {
        onerror(e);
        return;
      }
      var files = transaction.objectStore(FS.DB_STORE_NAME);
      var ok = 0,
        fail = 0,
        total = paths.length;
      function finish() {
        if (fail == 0) onload();
        else onerror();
      }
      paths.forEach(function(path) {
        var getRequest = files.get(path);
        getRequest.onsuccess = function getRequest_onsuccess() {
          if (FS.analyzePath(path).exists) {
            FS.unlink(path);
          }
          FS.createDataFile(
            PATH.dirname(path),
            PATH.basename(path),
            getRequest.result,
            true,
            true,
            true
          );
          ok++;
          if (ok + fail == total) finish();
        };
        getRequest.onerror = function getRequest_onerror() {
          fail++;
          if (ok + fail == total) finish();
        };
      });
      transaction.onerror = onerror;
    };
    openRequest.onerror = onerror;
  }
};
var SYSCALLS = {
  mappings: {},
  DEFAULT_POLLMASK: 5,
  umask: 511,
  calculateAt: function(dirfd, path) {
    if (path[0] !== "/") {
      var dir;
      if (dirfd === -100) {
        dir = FS.cwd();
      } else {
        var dirstream = FS.getStream(dirfd);
        if (!dirstream) throw new FS.ErrnoError(8);
        dir = dirstream.path;
      }
      path = PATH.join2(dir, path);
    }
    return path;
  },
  doStat: function(func, path, buf) {
    try {
      var stat = func(path);
    } catch (e) {
      if (
        e &&
        e.node &&
        PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))
      ) {
        return -54;
      }
      throw e;
    }
    HEAP32[buf >> 2] = stat.dev;
    HEAP32[(buf + 4) >> 2] = 0;
    HEAP32[(buf + 8) >> 2] = stat.ino;
    HEAP32[(buf + 12) >> 2] = stat.mode;
    HEAP32[(buf + 16) >> 2] = stat.nlink;
    HEAP32[(buf + 20) >> 2] = stat.uid;
    HEAP32[(buf + 24) >> 2] = stat.gid;
    HEAP32[(buf + 28) >> 2] = stat.rdev;
    HEAP32[(buf + 32) >> 2] = 0;
    (tempI64 = [
      stat.size >>> 0,
      ((tempDouble = stat.size),
      +Math_abs(tempDouble) >= 1
        ? tempDouble > 0
          ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>>
            0
          : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>>
            0
        : 0)
    ]),
      (HEAP32[(buf + 40) >> 2] = tempI64[0]),
      (HEAP32[(buf + 44) >> 2] = tempI64[1]);
    HEAP32[(buf + 48) >> 2] = 4096;
    HEAP32[(buf + 52) >> 2] = stat.blocks;
    HEAP32[(buf + 56) >> 2] = (stat.atime.getTime() / 1e3) | 0;
    HEAP32[(buf + 60) >> 2] = 0;
    HEAP32[(buf + 64) >> 2] = (stat.mtime.getTime() / 1e3) | 0;
    HEAP32[(buf + 68) >> 2] = 0;
    HEAP32[(buf + 72) >> 2] = (stat.ctime.getTime() / 1e3) | 0;
    HEAP32[(buf + 76) >> 2] = 0;
    (tempI64 = [
      stat.ino >>> 0,
      ((tempDouble = stat.ino),
      +Math_abs(tempDouble) >= 1
        ? tempDouble > 0
          ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>>
            0
          : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>>
            0
        : 0)
    ]),
      (HEAP32[(buf + 80) >> 2] = tempI64[0]),
      (HEAP32[(buf + 84) >> 2] = tempI64[1]);
    return 0;
  },
  doMsync: function(addr, stream, len, flags, offset) {
    var buffer = HEAPU8.slice(addr, addr + len);
    FS.msync(stream, buffer, offset, len, flags);
  },
  doMkdir: function(path, mode) {
    path = PATH.normalize(path);
    if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
    FS.mkdir(path, mode, 0);
    return 0;
  },
  doMknod: function(path, mode, dev) {
    switch (mode & 61440) {
      case 32768:
      case 8192:
      case 24576:
      case 4096:
      case 49152:
        break;
      default:
        return -28;
    }
    FS.mknod(path, mode, dev);
    return 0;
  },
  doReadlink: function(path, buf, bufsize) {
    if (bufsize <= 0) return -28;
    var ret = FS.readlink(path);
    var len = Math.min(bufsize, lengthBytesUTF8(ret));
    var endChar = HEAP8[buf + len];
    stringToUTF8(ret, buf, bufsize + 1);
    HEAP8[buf + len] = endChar;
    return len;
  },
  doAccess: function(path, amode) {
    if (amode & ~7) {
      return -28;
    }
    var node;
    var lookup = FS.lookupPath(path, { follow: true });
    node = lookup.node;
    if (!node) {
      return -44;
    }
    var perms = "";
    if (amode & 4) perms += "r";
    if (amode & 2) perms += "w";
    if (amode & 1) perms += "x";
    if (perms && FS.nodePermissions(node, perms)) {
      return -2;
    }
    return 0;
  },
  doDup: function(path, flags, suggestFD) {
    var suggest = FS.getStream(suggestFD);
    if (suggest) FS.close(suggest);
    return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
  },
  doReadv: function(stream, iov, iovcnt, offset) {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
      var ptr = HEAP32[(iov + i * 8) >> 2];
      var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
      var curr = FS.read(stream, HEAP8, ptr, len, offset);
      if (curr < 0) return -1;
      ret += curr;
      if (curr < len) break;
    }
    return ret;
  },
  doWritev: function(stream, iov, iovcnt, offset) {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
      var ptr = HEAP32[(iov + i * 8) >> 2];
      var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
      var curr = FS.write(stream, HEAP8, ptr, len, offset);
      if (curr < 0) return -1;
      ret += curr;
    }
    return ret;
  },
  varargs: undefined,
  get: function() {
    SYSCALLS.varargs += 4;
    var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
    return ret;
  },
  getStr: function(ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  },
  getStreamFromFD: function(fd) {
    var stream = FS.getStream(fd);
    if (!stream) throw new FS.ErrnoError(8);
    return stream;
  },
  get64: function(low, high) {
    return low;
  }
};
function ___sys_chmod(path, mode) {
  try {
    path = SYSCALLS.getStr(path);
    FS.chmod(path, mode);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fcntl64(fd, cmd, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (cmd) {
      case 0: {
        var arg = SYSCALLS.get();
        if (arg < 0) {
          return -28;
        }
        var newStream;
        newStream = FS.open(stream.path, stream.flags, 0, arg);
        return newStream.fd;
      }
      case 1:
      case 2:
        return 0;
      case 3:
        return stream.flags;
      case 4: {
        var arg = SYSCALLS.get();
        stream.flags |= arg;
        return 0;
      }
      case 12: {
        var arg = SYSCALLS.get();
        var offset = 0;
        HEAP16[(arg + offset) >> 1] = 2;
        return 0;
      }
      case 13:
      case 14:
        return 0;
      case 16:
      case 8:
        return -28;
      case 9:
        setErrNo(28);
        return -1;
      default: {
        return -28;
      }
    }
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fstat64(fd, buf) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return SYSCALLS.doStat(FS.stat, stream.path, buf);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_ioctl(fd, op, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (op) {
      case 21509:
      case 21505: {
        if (!stream.tty) return -59;
        return 0;
      }
      case 21510:
      case 21511:
      case 21512:
      case 21506:
      case 21507:
      case 21508: {
        if (!stream.tty) return -59;
        return 0;
      }
      case 21519: {
        if (!stream.tty) return -59;
        var argp = SYSCALLS.get();
        HEAP32[argp >> 2] = 0;
        return 0;
      }
      case 21520: {
        if (!stream.tty) return -59;
        return -28;
      }
      case 21531: {
        var argp = SYSCALLS.get();
        return FS.ioctl(stream, op, argp);
      }
      case 21523: {
        if (!stream.tty) return -59;
        return 0;
      }
      case 21524: {
        if (!stream.tty) return -59;
        return 0;
      }
      default:
        abort("bad ioctl syscall " + op);
    }
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_open(path, flags, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var pathname = SYSCALLS.getStr(path);
    var mode = SYSCALLS.get();
    var stream = FS.open(pathname, flags, mode);
    return stream.fd;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_read(fd, buf, count) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return FS.read(stream, HEAP8, buf, count);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_rename(old_path, new_path) {
  try {
    old_path = SYSCALLS.getStr(old_path);
    new_path = SYSCALLS.getStr(new_path);
    FS.rename(old_path, new_path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_rmdir(path) {
  try {
    path = SYSCALLS.getStr(path);
    FS.rmdir(path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_stat64(path, buf) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doStat(FS.stat, path, buf);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_unlink(path) {
  try {
    path = SYSCALLS.getStr(path);
    FS.unlink(path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function _emscripten_memcpy_big(dest, src, num) {
  HEAPU8.copyWithin(dest, src, src + num);
}
function _emscripten_get_heap_size() {
  return HEAPU8.length;
}
function emscripten_realloc_buffer(size) {
  try {
    wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
    updateGlobalBufferAndViews(wasmMemory.buffer);
    return 1;
  } catch (e) {}
}
function _emscripten_resize_heap(requestedSize) {
  requestedSize = requestedSize >>> 0;
  var oldSize = _emscripten_get_heap_size();
  var PAGE_MULTIPLE = 65536;
  var maxHeapSize = 2147483648;
  if (requestedSize > maxHeapSize) {
    return false;
  }
  var minHeapSize = 16777216;
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(
      maxHeapSize,
      alignUp(
        Math.max(minHeapSize, requestedSize, overGrownHeapSize),
        PAGE_MULTIPLE
      )
    );
    var replacement = emscripten_realloc_buffer(newSize);
    if (replacement) {
      return true;
    }
  }
  return false;
}
function _fd_close(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.close(stream);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_fdstat_get(fd, pbuf) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var type = stream.tty
      ? 2
      : FS.isDir(stream.mode)
      ? 3
      : FS.isLink(stream.mode)
      ? 7
      : 4;
    HEAP8[pbuf >> 0] = type;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_read(fd, iov, iovcnt, pnum) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = SYSCALLS.doReadv(stream, iov, iovcnt);
    HEAP32[pnum >> 2] = num;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var HIGH_OFFSET = 4294967296;
    var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
    var DOUBLE_LIMIT = 9007199254740992;
    if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
      return -61;
    }
    FS.llseek(stream, offset, whence);
    (tempI64 = [
      stream.position >>> 0,
      ((tempDouble = stream.position),
      +Math_abs(tempDouble) >= 1
        ? tempDouble > 0
          ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>>
            0
          : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>>
            0
        : 0)
    ]),
      (HEAP32[newOffset >> 2] = tempI64[0]),
      (HEAP32[(newOffset + 4) >> 2] = tempI64[1]);
    if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_write(fd, iov, iovcnt, pnum) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = SYSCALLS.doWritev(stream, iov, iovcnt);
    HEAP32[pnum >> 2] = num;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
var ___tm_current = 20656;
var ___tm_timezone = (stringToUTF8("GMT", 20704, 4), 20704);
function _gmtime_r(time, tmPtr) {
  var date = new Date(HEAP32[time >> 2] * 1e3);
  HEAP32[tmPtr >> 2] = date.getUTCSeconds();
  HEAP32[(tmPtr + 4) >> 2] = date.getUTCMinutes();
  HEAP32[(tmPtr + 8) >> 2] = date.getUTCHours();
  HEAP32[(tmPtr + 12) >> 2] = date.getUTCDate();
  HEAP32[(tmPtr + 16) >> 2] = date.getUTCMonth();
  HEAP32[(tmPtr + 20) >> 2] = date.getUTCFullYear() - 1900;
  HEAP32[(tmPtr + 24) >> 2] = date.getUTCDay();
  HEAP32[(tmPtr + 36) >> 2] = 0;
  HEAP32[(tmPtr + 32) >> 2] = 0;
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
  HEAP32[(tmPtr + 28) >> 2] = yday;
  HEAP32[(tmPtr + 40) >> 2] = ___tm_timezone;
  return tmPtr;
}
function _gmtime(time) {
  return _gmtime_r(time, ___tm_current);
}
function _setTempRet0($i) {
  setTempRet0($i | 0);
}
function _time(ptr) {
  var ret = (Date.now() / 1e3) | 0;
  if (ptr) {
    HEAP32[ptr >> 2] = ret;
  }
  return ret;
}
function _tzset() {
  if (_tzset.called) return;
  _tzset.called = true;
  HEAP32[__get_timezone() >> 2] = new Date().getTimezoneOffset() * 60;
  var currentYear = new Date().getFullYear();
  var winter = new Date(currentYear, 0, 1);
  var summer = new Date(currentYear, 6, 1);
  HEAP32[__get_daylight() >> 2] = Number(
    winter.getTimezoneOffset() != summer.getTimezoneOffset()
  );
  function extractZone(date) {
    var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
    return match ? match[1] : "GMT";
  }
  var winterName = extractZone(winter);
  var summerName = extractZone(summer);
  var winterNamePtr = allocateUTF8(winterName);
  var summerNamePtr = allocateUTF8(summerName);
  if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
    HEAP32[__get_tzname() >> 2] = winterNamePtr;
    HEAP32[(__get_tzname() + 4) >> 2] = summerNamePtr;
  } else {
    HEAP32[__get_tzname() >> 2] = summerNamePtr;
    HEAP32[(__get_tzname() + 4) >> 2] = winterNamePtr;
  }
}
function _timegm(tmPtr) {
  _tzset();
  var time = Date.UTC(
    HEAP32[(tmPtr + 20) >> 2] + 1900,
    HEAP32[(tmPtr + 16) >> 2],
    HEAP32[(tmPtr + 12) >> 2],
    HEAP32[(tmPtr + 8) >> 2],
    HEAP32[(tmPtr + 4) >> 2],
    HEAP32[tmPtr >> 2],
    0
  );
  var date = new Date(time);
  HEAP32[(tmPtr + 24) >> 2] = date.getUTCDay();
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
  HEAP32[(tmPtr + 28) >> 2] = yday;
  return (date.getTime() / 1e3) | 0;
}
var FSNode = function(parent, name, mode, rdev) {
  if (!parent) {
    parent = this;
  }
  this.parent = parent;
  this.mount = parent.mount;
  this.mounted = null;
  this.id = FS.nextInode++;
  this.name = name;
  this.mode = mode;
  this.node_ops = {};
  this.stream_ops = {};
  this.rdev = rdev;
};
var readMode = 292 | 73;
var writeMode = 146;
Object.defineProperties(FSNode.prototype, {
  read: {
    get: function() {
      return (this.mode & readMode) === readMode;
    },
    set: function(val) {
      val ? (this.mode |= readMode) : (this.mode &= ~readMode);
    }
  },
  write: {
    get: function() {
      return (this.mode & writeMode) === writeMode;
    },
    set: function(val) {
      val ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
    }
  },
  isFolder: {
    get: function() {
      return FS.isDir(this.mode);
    }
  },
  isDevice: {
    get: function() {
      return FS.isChrdev(this.mode);
    }
  }
});
FS.FSNode = FSNode;
FS.staticInit();
if (ENVIRONMENT_IS_NODE) {
  var fs = frozenFs;
  var NODEJS_PATH = __webpack_require__(622);
  NODEFS.staticInit();
}
if (ENVIRONMENT_IS_NODE) {
  var _wrapNodeError = function(func) {
    return function() {
      try {
        return func.apply(this, arguments);
      } catch (e) {
        if (!e.code) throw e;
        throw new FS.ErrnoError(ERRNO_CODES[e.code]);
      }
    };
  };
  var VFS = Object.assign({}, FS);
  for (var _key in NODERAWFS) FS[_key] = _wrapNodeError(NODERAWFS[_key]);
} else {
  throw new Error(
    "NODERAWFS is currently only supported on Node.js environment."
  );
}
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}
var decodeBase64 =
  typeof atob === "function"
    ? atob
    : function(input) {
        var keyStr =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do {
          enc1 = keyStr.indexOf(input.charAt(i++));
          enc2 = keyStr.indexOf(input.charAt(i++));
          enc3 = keyStr.indexOf(input.charAt(i++));
          enc4 = keyStr.indexOf(input.charAt(i++));
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          output = output + String.fromCharCode(chr1);
          if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
          }
        } while (i < input.length);
        return output;
      };
function intArrayFromBase64(s) {
  if (typeof ENVIRONMENT_IS_NODE === "boolean" && ENVIRONMENT_IS_NODE) {
    var buf;
    try {
      buf = Buffer.from(s, "base64");
    } catch (_) {
      buf = new Buffer(s, "base64");
    }
    return new Uint8Array(buf["buffer"], buf["byteOffset"], buf["byteLength"]);
  }
  try {
    var decoded = decodeBase64(s);
    var bytes = new Uint8Array(decoded.length);
    for (var i = 0; i < decoded.length; ++i) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return bytes;
  } catch (_) {
    throw new Error("Converting base64 string to bytes failed.");
  }
}
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }
  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}
var asmLibraryArg = {
  p: ___sys_chmod,
  e: ___sys_fcntl64,
  j: ___sys_fstat64,
  o: ___sys_ioctl,
  r: ___sys_open,
  q: ___sys_read,
  h: ___sys_rename,
  s: ___sys_rmdir,
  c: ___sys_stat64,
  g: ___sys_unlink,
  t: _emscripten_memcpy_big,
  u: _emscripten_resize_heap,
  f: _fd_close,
  i: _fd_fdstat_get,
  n: _fd_read,
  l: _fd_seek,
  d: _fd_write,
  k: _gmtime,
  memory: wasmMemory,
  a: _setTempRet0,
  table: wasmTable,
  b: _time,
  m: _timegm
};
var asm = createWasm();
var ___wasm_call_ctors = (Module["___wasm_call_ctors"] = asm["v"]);
var _zipstruct_stat = (Module["_zipstruct_stat"] = asm["w"]);
var _zipstruct_statS = (Module["_zipstruct_statS"] = asm["x"]);
var _zipstruct_stat_name = (Module["_zipstruct_stat_name"] = asm["y"]);
var _zipstruct_stat_index = (Module["_zipstruct_stat_index"] = asm["z"]);
var _zipstruct_stat_size = (Module["_zipstruct_stat_size"] = asm["A"]);
var _zipstruct_stat_mtime = (Module["_zipstruct_stat_mtime"] = asm["B"]);
var _zipstruct_error = (Module["_zipstruct_error"] = asm["C"]);
var _zipstruct_errorS = (Module["_zipstruct_errorS"] = asm["D"]);
var _zipstruct_error_code_zip = (Module["_zipstruct_error_code_zip"] =
  asm["E"]);
var _zipstruct_stat_comp_size = (Module["_zipstruct_stat_comp_size"] =
  asm["F"]);
var _zipstruct_stat_comp_method = (Module["_zipstruct_stat_comp_method"] =
  asm["G"]);
var _zip_close = (Module["_zip_close"] = asm["H"]);
var _zip_delete = (Module["_zip_delete"] = asm["I"]);
var _zip_dir_add = (Module["_zip_dir_add"] = asm["J"]);
var _zip_discard = (Module["_zip_discard"] = asm["K"]);
var _zip_error_init_with_code = (Module["_zip_error_init_with_code"] =
  asm["L"]);
var _zip_get_error = (Module["_zip_get_error"] = asm["M"]);
var _zip_file_get_error = (Module["_zip_file_get_error"] = asm["N"]);
var _zip_error_strerror = (Module["_zip_error_strerror"] = asm["O"]);
var _zip_fclose = (Module["_zip_fclose"] = asm["P"]);
var _zip_file_add = (Module["_zip_file_add"] = asm["Q"]);
var _zip_file_get_external_attributes = (Module[
  "_zip_file_get_external_attributes"
] = asm["R"]);
var _zip_file_set_external_attributes = (Module[
  "_zip_file_set_external_attributes"
] = asm["S"]);
var _zip_file_set_mtime = (Module["_zip_file_set_mtime"] = asm["T"]);
var _zip_fopen = (Module["_zip_fopen"] = asm["U"]);
var _zip_fopen_index = (Module["_zip_fopen_index"] = asm["V"]);
var _zip_fread = (Module["_zip_fread"] = asm["W"]);
var _zip_get_name = (Module["_zip_get_name"] = asm["X"]);
var _zip_get_num_entries = (Module["_zip_get_num_entries"] = asm["Y"]);
var _zip_name_locate = (Module["_zip_name_locate"] = asm["Z"]);
var _zip_open = (Module["_zip_open"] = asm["_"]);
var _zip_open_from_source = (Module["_zip_open_from_source"] = asm["$"]);
var _zip_set_file_compression = (Module["_zip_set_file_compression"] =
  asm["aa"]);
var _zip_source_buffer = (Module["_zip_source_buffer"] = asm["ba"]);
var _zip_source_buffer_create = (Module["_zip_source_buffer_create"] =
  asm["ca"]);
var _zip_source_close = (Module["_zip_source_close"] = asm["da"]);
var _zip_source_error = (Module["_zip_source_error"] = asm["ea"]);
var _zip_source_free = (Module["_zip_source_free"] = asm["fa"]);
var _zip_source_keep = (Module["_zip_source_keep"] = asm["ga"]);
var _zip_source_open = (Module["_zip_source_open"] = asm["ha"]);
var _zip_source_read = (Module["_zip_source_read"] = asm["ia"]);
var _zip_source_seek = (Module["_zip_source_seek"] = asm["ja"]);
var _zip_source_set_mtime = (Module["_zip_source_set_mtime"] = asm["ka"]);
var _zip_source_tell = (Module["_zip_source_tell"] = asm["la"]);
var _zip_stat = (Module["_zip_stat"] = asm["ma"]);
var _zip_stat_index = (Module["_zip_stat_index"] = asm["na"]);
var _zip_ext_count_symlinks = (Module["_zip_ext_count_symlinks"] = asm["oa"]);
var ___errno_location = (Module["___errno_location"] = asm["pa"]);
var __get_tzname = (Module["__get_tzname"] = asm["qa"]);
var __get_daylight = (Module["__get_daylight"] = asm["ra"]);
var __get_timezone = (Module["__get_timezone"] = asm["sa"]);
var stackSave = (Module["stackSave"] = asm["ta"]);
var stackRestore = (Module["stackRestore"] = asm["ua"]);
var stackAlloc = (Module["stackAlloc"] = asm["va"]);
var _malloc = (Module["_malloc"] = asm["wa"]);
var _free = (Module["_free"] = asm["xa"]);
var dynCall_vi = (Module["dynCall_vi"] = asm["ya"]);
Module["cwrap"] = cwrap;
Module["getValue"] = getValue;
var calledRun;
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
}
dependenciesFulfilled = function runCaller() {
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller;
};
function run(args) {
  args = args || arguments_;
  if (runDependencies > 0) {
    return;
  }
  preRun();
  if (runDependencies > 0) return;
  function doRun() {
    if (calledRun) return;
    calledRun = true;
    Module["calledRun"] = true;
    if (ABORT) return;
    initRuntime();
    preMain();
    if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
    postRun();
  }
  if (Module["setStatus"]) {
    Module["setStatus"]("Running...");
    setTimeout(function() {
      setTimeout(function() {
        Module["setStatus"]("");
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module["run"] = run;
if (Module["preInit"]) {
  if (typeof Module["preInit"] == "function")
    Module["preInit"] = [Module["preInit"]];
  while (Module["preInit"].length > 0) {
    Module["preInit"].pop()();
  }
}
noExitRuntime = true;
run();


/***/ }),

/***/ 417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 614:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 282:
/***/ ((module) => {

"use strict";
module.exports = require("module");

/***/ }),

/***/ 87:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 304:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 835:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(170);
/******/ })()
.default;
});