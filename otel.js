const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

const prometheusExporter = new PrometheusExporter({ port: 9464 });

const sdk = new NodeSDK({
  metricReader: prometheusExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

async function startSDK() {
  try {
    await sdk.start();
    console.log('✅ OpenTelemetry SDK started');
  } catch (err) {
    console.error('❌ OTel startup failed:', err);
  }
}

startSDK();

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('✅ OpenTelemetry SDK shut down'))
    .catch((err) => console.error('❌ Shutdown error', err))
    .finally(() => process.exit(0));
});
