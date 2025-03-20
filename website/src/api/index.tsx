// 导入各个模块的 API
import { globalDictApi } from './globalDict';
import { roleApi } from './role'
import { articleCategoryApi } from './articleCategory'
import { articleApi } from './article';
import { orgApi } from './organization';
import { userInfoApi } from './userinfo';
import { topicApi } from './topics';
import { authApi } from './auth';

// TODO 修改常用的名称
export const api = {
    article: articleApi,
    globalDict: globalDictApi,
    role: roleApi,
    articleCategory: articleCategoryApi,
    org: orgApi,
    userInfo: userInfoApi,
    topic: topicApi,
    auth: authApi
};
