'use strict'
const getData = function () {
  // generate focal points
  const min = 10
  const max = 30
  const hMin = 30
  const hMax = 80
  const nPoints = 2
  const points = []

  for (let i = 0; i < nPoints; i++) {
    points[i] = []
    points[i][0] = Math.random() * (max - min) + min
    points[i][1] = Math.random() * (hMax - hMin) + hMin
  }

  // generate sample data
  const nSamples = 150
  const samplesX = []
  const samplesY = []

  for (let j = 0; j < points.length; j++) {
    for (let i = 0; i < nSamples; i++) {
      samplesX[i + j * nSamples] = gaussian(points[j][0])
      samplesY[i + j * nSamples] = gaussian(points[j][1])
      if (isNaN(samplesX[i + j * nSamples]) || isNaN(samplesY[i + j * nSamples])) i--
    }
  }

  function gaussian (mean, stdev) {
    let u1, u2, v1, v2, s
    if (mean === undefined) {
      mean = 0.0
    }
    if (stdev === undefined) {
      stdev = 1.0
    }
    if (gaussian.v2 === null) {
      do {
        u1 = Math.random()
        u2 = Math.random()

        v1 = 2 * u1 - 1
        v2 = 2 * u2 - 1
        s = v1 * v1 + v2 * v2
      } while (s === 0 || s >= 1)

      gaussian.v2 = v2 * Math.sqrt(-2 * Math.log(s) / s)
      return stdev * v1 * Math.sqrt(-2 * Math.log(s) / s) + mean
    }

    v2 = gaussian.v2
    gaussian.v2 = null
    return stdev * v2 + mean
  }

  return [samplesX, samplesY]
}

/**
 * Draws using Ploty.js
 * @param  {Array} data - array of series to plot
 */
const drawPlot = function (data) {
  const series = []
  for (let i = 0; i < data.length; i++) {
    series[i] = {
      x: data[i][0],
      y: data[i][1],
      mode: 'markers',
      name: 'cluster ' + (i + 1)
    }
  }

  const layout = {
    title: 'K-Means Clusters',
    height: 520,
    width: 640
  }

  Plotly.newPlot('myScatterPlot', series, layout, { staticPlot: true })
}

/**
 * Refreshes all data samples
 */
const refresh = function () {
  data = getData()
  cluster = kmeans(data)
  drawPlot([data])
}

/**
 * Runs one step of k-means operation
 */
// eslint-disable-next-line no-unused-vars
const nextStep = function () {
  const series = []
  const clusterData = cluster.step()

  for (let c = 0; c < clusterData.centroids.length; c++) {
    series[c] = [[], []]
  }

  // populate series
  for (let s = 0; s < clusterData.labels.length; s++) {
    series[clusterData.labels[s]][0].push(data[0][s])
    series[clusterData.labels[s]][1].push(data[1][s])
  }

  drawPlot(series)
}

let data,
  cluster

refresh()
