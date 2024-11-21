export default {
  splitList(metaData, splitLength) {
    const result = []
    if (metaData != null) {
      for (let i = 0; i < metaData.length; i += splitLength) {
        result.push(metaData.slice(i, i + splitLength))
      }
    }
    return result;
  },
}