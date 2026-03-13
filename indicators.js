// indicators.js — Pure computation functions for technical analysis
// Used by worker.js (via importScripts) and by Jest tests (via require)

// Function to compute ADX
function computeAdx(data, period = 14) {
    const adxData = [];
    const high = data.map(row => parseFloat(row[2])); // Assuming 'High' is the 3rd column
    const low = data.map(row => parseFloat(row[3])); // Assuming 'Low' is the 4th column
    const close = data.map(row => parseFloat(row[4])); // Assuming 'Close' is the 5th column

    let tr = [];
    let pdm = [];
    let ndm = [];
    let tr14 = [];
    let pdm14 = [];
    let ndm14 = [];
    let pdi14 = [];
    let ndi14 = [];
    let dx = [];
    let adx = [];

    for (let i = 1; i < data.length; i++) {
        const trValue = Math.max(high[i] - low[i], Math.abs(high[i] - close[i - 1]), Math.abs(low[i] - close[i - 1]));
        tr.push(trValue);

        const pdmValue = high[i] > high[i - 1] && high[i] - high[i - 1] > low[i - 1] - low[i] ? high[i] - high[i - 1] : 0;
        pdm.push(pdmValue);

        const ndmValue = low[i - 1] > low[i] && low[i - 1] - low[i] > high[i] - high[i - 1] ? low[i - 1] - low[i] : 0;
        ndm.push(ndmValue);

        if (i >= period) {
            const tr14Value = tr.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            tr14.push(tr14Value);

            const pdm14Value = pdm.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            pdm14.push(pdm14Value);

            const ndm14Value = ndm.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            ndm14.push(ndm14Value);

            const pdi14Value = (pdm14Value / tr14Value) * 100;
            pdi14.push(pdi14Value);

            const ndi14Value = (ndm14Value / tr14Value) * 100;
            ndi14.push(ndi14Value);

            const dxValue = (Math.abs(pdi14Value - ndi14Value) / (pdi14Value + ndi14Value)) * 100;
            dx.push(dxValue);

            if (adx.length === 0) {
                adx.push(dxValue);
            } else {
                const adxValue = ((adx[adx.length - 1] * (period - 1)) + dxValue) / period;
                adx.push(adxValue);
            }
        }
    }

    for (let i = period; i < data.length; i++) {
        if (!isNaN(pdi14[i - period]) && !isNaN(ndi14[i - period]) && !isNaN(dx[i - period]) && !isNaN(adx[i - period])) {
            adxData.push({
                date: data[i][0], // Assuming 'Date' is the 1st column
                pdi: pdi14[i - period].toFixed(2),
                ndi: ndi14[i - period].toFixed(2),
                dx: dx[i - period].toFixed(2),
                adx: adx[i - period].toFixed(2)
            });
        }
    }

    return adxData;
}

// Function to compute ADXTR
function computeAdxtr(data) {
    const adxData = computeAdx(data);
    const adxtrData = adxData.map((row, index, array) => {
        if (index === 0) return null; // Skip the first row

        const prevPdi = parseFloat(array[index - 1].pdi);
        const prevNdi = parseFloat(array[index - 1].ndi);
        const currPdi = parseFloat(row.pdi);
        const currNdi = parseFloat(row.ndi);
        const currAdx = parseFloat(row.adx);

        let signal = 0;
        if (!isNaN(prevPdi) && !isNaN(prevNdi) && !isNaN(currPdi) && !isNaN(currNdi) && !isNaN(currAdx)) {
            if (prevPdi < prevNdi && currPdi > currNdi && currAdx > 20) {
                signal = 1;
            } else if (prevPdi > prevNdi && currPdi < currNdi && currAdx > 20) {
                signal = -1;
            }
        }

        return { date: row.date, signal: signal };
    }).filter(row => row !== null); // Filter out null values

    return adxtrData;
}

// Function to compute Bollinger Bands (BB)
function computeBb(data, period = 20, multiplier = 2) {
    const bbData = [];
    const close = data.map(row => parseFloat(row[4])); // Assuming 'Close' is the 5th column

    for (let i = period - 1; i < close.length; i++) {
        const slice = close.slice(i - period + 1, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / period;
        const stdDev = Math.sqrt(slice.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / period);
        const upperBand = mean + (multiplier * stdDev);
        const lowerBand = mean - (multiplier * stdDev);
        const percentB = ((close[i] - lowerBand) / (upperBand - lowerBand)) * 100;

        if (!isNaN(lowerBand) && !isNaN(mean) && !isNaN(upperBand) && !isNaN(percentB)) {
            bbData.push({
                date: data[i][0], // Assuming 'Date' is the 1st column
                lowerBand: lowerBand.toFixed(2),
                mean: mean.toFixed(2),
                upperBand: upperBand.toFixed(2),
                percentB: percentB.toFixed(2)
            });
        }
    }

    return bbData;
}

// Function to compute BBTR
function computeBbtr(data) {
    const bbData = computeBb(data);
    const bbtrData = bbData.map((row, index, array) => {
        if (index === 0) return null; // Skip the first row

        const prevPercentB = parseFloat(array[index - 1].percentB);
        const currPercentB = parseFloat(row.percentB);

        let signal = 0;
        if (!isNaN(prevPercentB) && !isNaN(currPercentB)) {
            if (prevPercentB < 20 && currPercentB > 20) {
                signal = 1;
            } else if (prevPercentB > 80 && currPercentB < 80) {
                signal = -1;
            }
        }

        return { date: row.date, signal: signal };
    }).filter(row => row !== null); // Filter out null values

    return bbtrData;
}

// Function to compute Commodity Channel Index (CCI)
function computeCci(data, period = 20) {
    const cciData = [];
    const typicalPrice = data.map(row => (parseFloat(row[2]) + parseFloat(row[3]) + parseFloat(row[4])) / 3);

    for (let i = period - 1; i < typicalPrice.length; i++) {
        const tpSlice = typicalPrice.slice(i - period + 1, i + 1);
        const sma = tpSlice.reduce((a, b) => a + b, 0) / period;
        const meanDeviation = tpSlice.reduce((a, b) => a + Math.abs(b - sma), 0) / period;
        const cciValue = (typicalPrice[i] - sma) / (0.015 * meanDeviation);

        cciData.push({
            date: data[i][0], // Assuming 'Date' is the 1st column
            cci: cciValue.toFixed(2)
        });
    }

    return cciData;
}

// Function to compute CCITR
function computeCcitr(data) {
    const cciData = computeCci(data);

    const ccitrData = cciData.map((row, index, array) => {
        if (index === 0) return { date: row.date, x: 0 };

        const prevCci = parseFloat(array[index - 1].cci);
        const currCci = parseFloat(row.cci);

        let signal = 0;
        if (!isNaN(prevCci) && !isNaN(currCci)) {
            if (prevCci < -100 && currCci > -100) {
                signal = 1;
            } else if (prevCci < 100 && currCci > 100) {
                signal = -1;
            }
        }

        return { date: row.date, x: signal };
    });

    return ccitrData;
}

// Helper function to calculate EMA
function calculateEma(values, period) {
    const k = 2 / (period + 1);
    let ema = values[0];
    for (let i = 1; i < values.length; i++) {
        ema = values[i] * k + ema * (1 - k);
    }
    return ema;
}

// Function to compute MACD
function computeMacd(data) {
    const shortPeriod = 12;
    const longPeriod = 26;
    const signalPeriod = 9;

    const shortEma = [];
    const longEma = [];
    const macdLine = [];
    const signalLine = [];
    const macdData = [];

    for (let i = 0; i < data.length; i++) {
        let close = parseFloat(data[i][4]);

        // Check if the leading digit is zero and not a decimal number starting with 0.
        if (data[i][4].startsWith('0') && !data[i][4].startsWith('0.')) {
            close *= 100;
        }

        if (i >= shortPeriod - 1) {
            const shortEmaValue = calculateEma(data.slice(i - shortPeriod + 1, i + 1).map(row => {
                let value = parseFloat(row[4]);
                if (row[4].startsWith('0') && !row[4].startsWith('0.')) {
                    value *= 100;
                }
                return value;
            }), shortPeriod);
            shortEma.push(shortEmaValue);
        } else {
            shortEma.push(NaN);
        }

        if (i >= longPeriod - 1) {
            const longEmaValue = calculateEma(data.slice(i - longPeriod + 1, i + 1).map(row => {
                let value = parseFloat(row[4]);
                if (row[4].startsWith('0') && !row[4].startsWith('0.')) {
                    value *= 100;
                }
                return value;
            }), longPeriod);
            longEma.push(longEmaValue);
        } else {
            longEma.push(NaN);
        }

        if (i >= longPeriod - 1) {
            const macdValue = shortEma[shortEma.length - 1] - longEma[longEma.length - 1];
            macdLine.push(macdValue);

            if (macdLine.length >= signalPeriod) {
                const signalValue = calculateEma(macdLine.slice(macdLine.length - signalPeriod), signalPeriod);
                signalLine.push(signalValue);
            } else {
                signalLine.push(NaN);
            }
        } else {
            macdLine.push(NaN);
            signalLine.push(NaN);
        }

        const macd = isNaN(macdLine[macdLine.length - 1]) ? 'NA' : parseFloat(macdLine[macdLine.length - 1].toFixed(4));
        const signal = isNaN(signalLine[signalLine.length - 1]) ? 'NA' : parseFloat(signalLine[signalLine.length - 1].toFixed(4));

        macdData.push({
            date: data[i][0],
            macd: macd,
            signal: signal
        });
    }

    return macdData;
}

// Function to compute CMACD
function computeCmacd(data) {
    const macdData = computeMacd(data);
    const cmacdData = macdData.map((row, index, array) => {
        if (index === 0) return { date: row.date, x: 0 };

        const prevMacd = array[index - 1].macd;
        const currMacd = row.macd;

        let signal = 0;
        if (prevMacd !== 'NA' && currMacd !== 'NA') {
            if (prevMacd < 0 && currMacd > 0) {
                signal = 1;
            } else if (prevMacd > 0 && currMacd < 0) {
                signal = -1;
            }
        }

        return { date: row.date, x: signal };
    });

    return cmacdData;
}

// Function to compute SMACD
function computeSmacd(data) {
    const macdData = computeMacd(data);
    const smacdData = macdData.map((row, index, array) => {
        if (index === 0) return { date: row.date, x: 0 };

        const prevMacd = array[index - 1].macd;
        const prevSignal = array[index - 1].signal;
        const currMacd = row.macd;
        const currSignal = row.signal;

        let signal = 0;
        if (prevMacd !== 'NA' && prevSignal !== 'NA' && currMacd !== 'NA' && currSignal !== 'NA') {
            if (prevMacd < prevSignal && currMacd > currSignal) {
                signal = 1;
            } else if (prevMacd > prevSignal && currMacd < currSignal) {
                signal = -1;
            }
        }

        return { date: row.date, x: signal };
    });

    return smacdData;
}

// Export for Node.js/Jest (ignored in browser/Web Worker context)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        computeAdx,
        computeAdxtr,
        computeBb,
        computeBbtr,
        computeCci,
        computeCcitr,
        calculateEma,
        computeMacd,
        computeCmacd,
        computeSmacd
    };
}
