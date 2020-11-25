async function getAverage (store, snapshot) {
  await store.collection('average').get().then(docs => {
    docs.forEach(doc => {
      let snapshotValue = {}
      snapshot.forEach(item => {
        snapshotValue = item.val()
      })
      store.collection('average').doc(doc.data().key).set({
        value: (+doc.data().value * (doc.data().count) + snapshotValue[doc.data().key]) / (doc.data().count + 1),
        count: doc.data().count + 1,
        key: doc.data().key
      })
    })
  })
}

module.exports = getAverage
