export default {
  splitList(metaData, splitLength) {
    const result = []
    if (metaData != null) {
      for (let i = 0; i < metaData.length; i += splitLength) {
        for (let t = 0; t < 10; t++) {
          if (metaData.charAt(i + splitLength) != ' ') {
            splitLength++
          }
        }
        result.push(metaData.slice(i, i + splitLength))
      }
    }
    return result;
  },
}