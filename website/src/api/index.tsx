// 导入各个模块的 API
import { globalDictApi } from './globalDict';
import { roleApi } from './role'
import { articleCategoryApi } from './articleCategory'
// import { articleApi } from './article';

export const api = {
    globalDict: globalDictApi,
    role: roleApi,
    articleCategory: articleCategoryApi
};
