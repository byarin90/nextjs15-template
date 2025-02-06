type LoggerContext = Record<string, string | number | boolean | null>

class Logger {
    path: string
    context: LoggerContext

    constructor(path: string, context?: LoggerContext) {
        this.path = path || ''
        this.context = context || {}
    }

    info(message: string) {
        console.log('INFO:', 'got info from', this.path, { ...this.context, message })
    }

    warn(message: string) {
        console.warn('WARN:', 'got warning from', this.path, { ...this.context, message })
    }

    error(message: string) {
        console.error('ERROR:', 'got error from', this.path, { ...this.context, message })
    }

    addContext(context: LoggerContext) {
        this.context = { ...this.context, ...context }
    }

    addToPath(path: string) {
        this.path = this.path + path
    }
}

export default Logger