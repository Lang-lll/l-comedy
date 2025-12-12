// 检测并加载 optionalDependencies
export async function loadOptionalDependency<T = any>(
  packageName: string,
  importName?: string
): Promise<T | null> {
  try {
    // 动态导入包
    const module = await import(packageName)
    return importName ? module[importName] : module.default || module
  } catch (error: any) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log(`⚠️ 未安装 optional dependency: ${packageName}`)
      return null
    }
    console.error(`✗ 加载 ${packageName} 时出错:`, error)
    return null
  }
}
