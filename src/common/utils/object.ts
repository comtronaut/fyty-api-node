export function pullProperty<TObject extends {}, TKey extends keyof TObject>(
  objectList: TObject[],
  key: TKey
): TObject[TKey][] {
  const out = [];
  for (const object of objectList) {
    out.push(object[key]);
    delete object[key];
  }
  return out;
}
