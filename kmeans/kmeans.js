'use strict'
const kmeans = function (data, nClusters) {
  if (typeof data === 'undefined') throw new Error('Sample data is missing.')
  if (typeof nClusters === 'undefined') nClusters = 2

  let nfeatures = null
  let nSamples = null

  const centroids = []
  const labels = []
  let inertia = 0

  // check data
  nfeatures = data.length
  nSamples = data[0].length
  for (let f = 0; f < nfeatures; f++) {
    if (nSamples !== data[f].length) { throw new Error('nSamples are not the same for all features.') }
  }

  // get data boundaries
  const boundaries = []
  for (let f = 0; f < nfeatures; f++) {
    boundaries[f] = { min: Infinity, max: -Infinity }
    for (let s = 0; s < nSamples; s++) {
      if (data[f][s] < boundaries[f].min) { boundaries[f].min = data[f][s] }
      if (data[f][s] > boundaries[f].max) { boundaries[f].max = data[f][s] }
    }
  }

  // start centroids
  for (let c = 0; c < nClusters; c++) {
    centroids[c] = []
    for (let f = 0; f < nfeatures; f++) {
      centroids[c][f] = Math.random() * (boundaries[f].max - boundaries[f].min) + boundaries[f].min
    }
  }

  self.step = function () {
    // reset inertia
    inertia = 0

    // pick closest centroid
    for (let s = 0; s < nSamples; s++) {
      let distance = Infinity
      let label = 0

      for (let c = 0; c < nClusters; c++) {
        let _distance = 0

        for (let f = 0; f < nfeatures; f++) { _distance += (data[f][s] - centroids[c][f]) * (data[f][s] - centroids[c][f]) }
        if (_distance < distance) {
          distance = _distance
          label = c
        }
      }

      inertia += distance
      labels[s] = label
    }

    // move centroids torwards center of their own cluster
    for (let c = 0; c < nClusters; c++) {
      for (let f = 0; f < nfeatures; f++) {
        let meanSum = 0
        let meanCount = 0

        for (let s = 0; s < nSamples; s++) {
          if (labels[s] === c) {
            meanSum += data[f][s]
            meanCount++
          }
        }

        centroids[c][f] = meanSum / meanCount
      }
    }

    return {
      centroids: centroids,
      labels: labels,
      inertia: inertia
    }
  }

  self.predict = function (maxIterations) {
    if (typeof maxIterations === 'undefined' || !Number.isInteger(maxIterations)) maxIterations = 1000

    let previousCentroids = null
    for (let i = 0; i < maxIterations; i++) {
      previousCentroids = centroids.toString()
      step()
      if (centroids.toString() === previousCentroids) break
    }
    return {
      centroids: centroids,
      labels: labels,
      inertia: inertia
    }
  }

  return self
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = kmeans
  }
  exports.kmeans = kmeans
}
