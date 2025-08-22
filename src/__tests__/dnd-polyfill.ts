
export function createDataTransfer() {
  const store: Record<string, string> = {}
  return {
    dropEffect: 'move',
    effectAllowed: 'all',
    files: [] as File[],
    items: [] as DataTransferItem[],
    types: [] as string[],
    setData(format: string, data: string) {
      store[format] = data
      if (!this.types.includes(format)) this.types.push(format)
    },
    getData(format: string) {
      return store[format]
    },
    clearData(format?: string) {
      if (format) { delete store[format] }
      else { Object.keys(store).forEach(k => delete store[k]) }
    }
  } as unknown as DataTransfer
}
