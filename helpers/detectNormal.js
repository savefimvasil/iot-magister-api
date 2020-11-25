const last = {
  temperature: [],
  humidity: []
}

const contrastPeriod = 5
const contrast = 4

function detectNormal (param, val) {
  let isContrast = false
  last[param].forEach(item => {
    if (Math.abs(val - item) > contrast) {
      isContrast = true
    }
  })

  if (!isContrast) {
    if (last[param].length > contrastPeriod) {
      last[param].splice(0, 1)
      last[param].push(val)
    } else {
      last[param].push(val)
    }
    // true if normal
    return true
  } else {
    last[param] = []
    // false if contrast
    return false
  }
}

module.exports = detectNormal
