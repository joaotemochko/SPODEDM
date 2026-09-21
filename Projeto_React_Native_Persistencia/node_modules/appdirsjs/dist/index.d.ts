type Options = {
    appName: string;
    legacyPath?: string;
};
type Directories = {
    cache: string;
    config: string;
    data: string;
    runtime?: string;
};
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
export default function appDirs(options: Options): Directories;
export {};
