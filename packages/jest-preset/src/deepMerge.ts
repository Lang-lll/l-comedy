type IndexedObject = Record<string | number | symbol, any>;

/**
 * 判断是否为普通对象（非数组、null、函数等）
 */
function isPlainObject(obj: any): obj is IndexedObject {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 判断是否为数组
 */
function isArray(obj: any): obj is any[] {
  return Array.isArray(obj);
}

/**
 * 简易深拷贝合并对象
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  const result = { ...target } as T;

  for (const source of sources) {
    if (!source) continue;

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key];
        const targetValue = result[key];

        if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
          result[key] = deepMerge(targetValue, sourceValue as any);
        } else if (isArray(sourceValue) && isArray(targetValue)) {
          result[key] = [...sourceValue] as any;
        } else if (sourceValue !== undefined) {
          result[key] = sourceValue as any;
        }
      }
    }
  }

  return result;
}
