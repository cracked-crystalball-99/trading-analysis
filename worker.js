// Load shared indicator functions
importScripts('indicators.js');

self.addEventListener('message', function (e) {
    const { type, data } = e.data;
    console.log('Worker received message:', type); // Debugging statement
    if (type === 'computeAdx') {
        const adxData = computeAdx(data);
        self.postMessage({ type: 'adx', data: adxData });
    } else if (type === 'computeAdxtr') {
        const adxtrData = computeAdxtr(data);
        self.postMessage({ type: 'adxtr', data: adxtrData });
    } else if (type === 'computeBb') {
        const bbData = computeBb(data);
        self.postMessage({ type: 'bb', data: bbData });
    } else if (type === 'computeBbtr') {
        const bbtrData = computeBbtr(data);
        self.postMessage({ type: 'bbtr', data: bbtrData });
    } else if (type === 'computeCci') {
        const cciData = computeCci(data);
        self.postMessage({ type: 'cci', data: cciData });
    } else if (type === 'computeCcitr') {
        const ccitrData = computeCcitr(data);
        self.postMessage({ type: 'ccitr', data: ccitrData });
    } else if (type === 'computeMacd') {
        const macdData = computeMacd(data);
        self.postMessage({ type: 'macd', data: macdData });
    } else if (type === 'computeCmacd') {
        const cmacdData = computeCmacd(data);
        self.postMessage({ type: 'cmacd', data: cmacdData });
    } else if (type === 'computeSmacd') {
        const smacdData = computeSmacd(data);
        self.postMessage({ type: 'smacd', data: smacdData });
    } else if (type === 'computeRoc') {
        const rocData = computeRoc(data);
        self.postMessage({ type: 'roc', data: rocData });
    } else if (type === 'computeRoctr') {
        const roctrData = computeRoctr(data);
        self.postMessage({ type: 'roctr', data: roctrData });
    } else if (type === 'computeRsi') {
        const rsiData = computeRsi(data);
        console.log('Computed RSI data:', rsiData); // Debugging statement
        self.postMessage({ type: 'rsi', data: rsiData });
    } else if (type === 'computeRsitr') {
        const rsitrData = computeRsitr(data);
        console.log('Computed RSITR data:', rsitrData); // Debugging statement
        self.postMessage({ type: 'rsitr', data: rsitrData });
    } else if (type === 'computeSar') {
        console.log('Starting SAR computation'); // Debugging statement
        const sarData = computeSar(data);
        console.log('Computed SAR data:', sarData); // Debugging statement
        self.postMessage({ type: 'sar', data: sarData });
    } else if (type === 'computeSartr') {
        console.log('Starting SARTR computation'); // Debugging statement
        const sartrData = computeSartr(data);
        console.log('Computed SARTR data:', sartrData); // Debugging statement
        self.postMessage({ type: 'sartr', data: sartrData });
    } else if (type === 'computeSmi') {
        console.log('Starting SMI computation'); // Debugging statement
        const smiData = computeSmi(data);
        console.log('Computed SMI data:', smiData); // Debugging statement
        self.postMessage({ type: 'smi', data: smiData });
    } else if (type === 'computeSmitr') {
        console.log('Starting SMITR computation'); // Debugging statement
        const smitrData = computeSmitr(data);
        console.log('Computed SMITR data:', smitrData); // Debugging statement
        self.postMessage({ type: 'smitr', data: smitrData });
    } else if (type === 'computeWpr') {
        console.log('Starting WPR computation'); // Debugging statement
        const wprData = computeWpr(data);
        console.log('Computed WPR data:', wprData); // Debugging statement
        self.postMessage({ type: 'wpr', data: wprData });
    } else if (type === 'computeWprtr') {
        console.log('Starting WPRTR computation'); // Debugging statement
        const wprtrData = computeWprtr(data);
        console.log('Computed WPRTR data:', wprtrData); // Debugging statement
        self.postMessage({ type: 'wprtr', data: wprtrData });
    } else if (type === 'computeSma5') {
        console.log('Starting SMA5 computation'); // Debugging statement
        const sma5Data = computeSma5(data);
        console.log('Computed SMA5 data:', sma5Data); // Debugging statement
        self.postMessage({ type: 'sma5', data: sma5Data });
    } else if (type === 'computeCcismatr') {
        console.log('Starting CCISMATR computation'); // Debugging statement
        const ccismatrData = computeCcismatr(data);
        console.log('Computed CCISMATR data:', ccismatrData); // Debugging statement
        self.postMessage({ type: 'ccismatr', data: ccismatrData });
    } else if (type === 'computeRocsmatr') {
        console.log('Starting ROCSMATR computation'); // Debugging statement
        const rocsmatrData = computeRocsmatr(data);
        console.log('Computed ROCSMATR data:', rocsmatrData); // Debugging statement
        self.postMessage({ type: 'rocsmatr', data: rocsmatrData });
    } else if (type === 'computeRsismatr') {
        console.log('Starting RSISMATR computation'); // Debugging statement
        const rsismatrData = computeRsismatr(data);
        console.log('Computed RSISMATR data:', rsismatrData); // Debugging statement
        self.postMessage({ type: 'rsismatr', data: rsismatrData });
    } else if (type === 'computeSmismatr') {
        console.log('Starting SMISMATR computation'); // Debugging statement
        const smismatrData = computeSmismatr(data);
        console.log('Computed SMISMATR data:', smismatrData); // Debugging statement
        self.postMessage({ type: 'smismatr', data: smismatrData });
    } else if (type === 'computeWprsmatr') {
        console.log('Starting WPRSMATR computation'); // Debugging statement
        const wprsmatrData = computeWprsmatr(data);
        console.log('Computed WPRSMATR data:', wprsmatrData); // Debugging statement
        self.postMessage({ type: 'wprsmatr', data: wprsmatrData });
    }
});

// All indicator computation functions are now in indicators.js
// Loaded via importScripts('indicators.js') at the top of this file
