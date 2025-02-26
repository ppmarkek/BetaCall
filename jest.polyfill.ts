if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj: unknown) => {
    if (obj === undefined) return undefined;
    const json = JSON.stringify(obj);
    return json === undefined ? undefined : JSON.parse(json);
  };
}
