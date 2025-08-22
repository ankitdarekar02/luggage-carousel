export function createDataTransfer(): DataTransfer {
  const store: Record<string, string> = {}
  const typesArr: string[] = []

  return {
    dropEffect: 'move',
    effectAllowed: 'all',
    files: [] as any,
    items: [] as any,

    // Expose a readonly array of types, like a real DataTransfer
    get types() {
      return typesArr as unknown as ReadonlyArray<string>
    },

    setData(format: string, data: string) {
      store[format] = data
      if (!typesArr.includes(format)) typesArr.push(format)
    },

    getData(format: string) {
      return store[format] ?? ''
    },

    clearData(format?: string) {
      if (format) {
        delete store[format]
        const i = typesArr.indexOf(format)
        if (i >= 0) typesArr.splice(i, 1)
      } else {
        for (const k of Object.keys(store)) delete store[k]
        typesArr.length = 0
      }
    }
  } as unknown as DataTransfer
}
