"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = appDirs;
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
/**
 * Returns application-specific paths for directories.
 *
 * For Linux, it returns paths according to
 * [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
 *
 * For macOS, it returns paths according to
 * [Apple Technical Q&A](https://developer.apple.com/library/archive/qa/qa1170/_index.html#//apple_ref/doc/uid/DTS10001702)
 *
 * For Windows, it returns paths according to
 * [a Stack Overflow answer](https://stackoverflow.com/questions/43853548/xdg-basedir-directories-for-windows)
 *
 * Specific information about each OS can be found
 * in the corresponding functions.
 *
 * @param options  Application options
 * @param options.appName  Application name
 * @param options.legacyPath  Path provided for backward compatibility
 *                            so users are not forced to move files.
 *                            Will be used if it exists in the filesystem.
 */
function appDirs(options) {
    if (process.platform === "linux") {
        return linux(options);
    }
    else if (process.platform === "win32") {
        return windows(options);
    }
    else if (process.platform === "darwin") {
        return macos(options);
    }
    return fallback(options);
}
function fallback({ appName, legacyPath }) {
    console.warn(`[appdirsjs]: can't get directories for "${process.platform}" platform, using fallback values`);
    function fallbackPath() {
        if (legacyPath) {
            return legacyPath;
        }
        // Sane default for Unix-like systems
        return path.join(os.homedir(), "." + appName);
    }
    return Object.freeze({
        cache: fallbackPath(),
        config: fallbackPath(),
        data: fallbackPath(),
    });
}
function linux({ appName, legacyPath }) {
    const home = os.homedir();
    const env = process.env;
    const uid = (process.getuid !== undefined)
        ? process.getuid()
        : "unknown-uid";
    function xdgPath(allowLegacy, env, defaultRoot) {
        if (allowLegacy && legacyPath && fs.existsSync(legacyPath)) {
            return legacyPath;
        }
        const root = env || defaultRoot;
        return path.join(root, appName);
    }
    return Object.freeze({
        cache: xdgPath(true, env.XDG_CACHE_HOME, path.join(home, ".cache")),
        config: xdgPath(true, env.XDG_CONFIG_HOME, path.join(home, ".config")),
        data: xdgPath(true, env.XDG_DATA_HOME, path.join(home, ".local", "share")),
        runtime: xdgPath(false, env.XDG_RUNTIME_DIR, path.join("/run", "user", uid.toString())),
    });
}
function windows({ appName, legacyPath }) {
    if (legacyPath && fs.existsSync(legacyPath)) {
        return Object.freeze({
            cache: legacyPath,
            config: legacyPath,
            data: legacyPath,
        });
    }
    const home = os.homedir();
    const roamingAppData = process.env.APPDATA || path.join(home, "AppData", "Roaming");
    const localAppData = process.env.LOCALAPPDATA || path.join(home, "AppData", "Local");
    return Object.freeze({
        cache: path.join(localAppData, "Temp", appName),
        config: path.join(roamingAppData, appName),
        data: path.join(localAppData, appName),
    });
}
function macos({ appName, legacyPath }) {
    if (legacyPath && fs.existsSync(legacyPath)) {
        return Object.freeze({
            cache: legacyPath,
            config: legacyPath,
            data: legacyPath,
        });
    }
    const home = os.homedir();
    return Object.freeze({
        cache: path.join(home, "Library", "Caches", appName),
        config: path.join(home, "Library", "Preferences", appName),
        data: path.join(home, "Library", "Application Support", appName),
    });
}
