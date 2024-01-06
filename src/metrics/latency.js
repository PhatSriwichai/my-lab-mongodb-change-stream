const Prometheus = require('prom-client');

const latencyHistogram = new Prometheus.Histogram({
    name: 'mlab_mongodb_change_stream_latency',
    help: 'Latency of MongoDB Change Stream Events in milliseconds',
    buckets: [0.05, 0.01, 0.03, 0.05, 0.1, 1]
});

Prometheus.register.registerMetric(latencyHistogram);

module.exports = {
    latencyHistogram
}