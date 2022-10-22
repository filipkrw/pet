export default (function getCwd() {
    return process.cwd().replace(/\\/g, "/");
});
