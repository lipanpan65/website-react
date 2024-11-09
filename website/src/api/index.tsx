// 导入各个模块的 API
import { globalDictApi } from './globalDict';
import { roleApi } from './role'
import { articleCategoryApi } from './articleCategory'
// import { articleApi } from './article';
// 可以继续添加其他 API 模块...

export const api = {
    globalDict: globalDictApi,
    role: roleApi,
    articleCategory: articleCategoryApi
};
