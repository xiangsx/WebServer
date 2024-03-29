'use strict';

const { wrap } = require('aggregate-base');
const { Transport } = require('egg-logger');
const assert = require('assert');
const { TcpConnectionPool } = require('./tcp_connection_pool');

const SIZE_LIMIT = 1024 * 1024;

class ELKTransport extends Transport {
    constructor(config) {
        super(config);

        const { host, port, tcp } = config;

        assert(host, 'should pass config.host');
        assert(port, 'should pass config.port');
        assert(tcp, 'should pass config.tcp');

        this.config = config;

        this.tcpPool = new TcpConnectionPool(host, port, tcp);

        this._logs = [];

    }

    upload(logs) {
        let result = '';
        for (const log of logs) {
            if (log) {
                result += (JSON.stringify(log) + '\n');
            }
        }
        const buf = Buffer.from(result);
        if (buf.length > SIZE_LIMIT) return;
        this.tcpPool.send(result);
    }
}

module.exports = wrap(ELKTransport, {
    interval: 1000,
    intercept: 'log',
    interceptTransform(level, args, meta) {
        if (!meta || !meta.date) {
            return;
        }
        return {
            '@version': '1',
            '@timestamp': (new Date(meta.date.split(',')[0])).toISOString(),
            type: this.config.logType,
            paddingMessage: meta.paddingMessage,
            message: meta.message,
            pid: meta.pid,
            hostname: meta.hostname,
            level,
            sn: meta.ctx.sn,
            deviceID: meta.ctx.deviceID,
            isSIO: meta.ctx.isSIO,
            ...this.config.fields,
        };
    },
    flush: 'upload',
});

