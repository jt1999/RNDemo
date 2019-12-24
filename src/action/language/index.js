import LanguageDao from '../../expand/dao/LanguageDao';
import Types from '../types';

/**
 * 加载标签
 * @param flagKey
 * @returns {Function}
 */
export function onLoadLanguage(flagKey) {
  return async dispatch => {
    try {
      let languages = await new LanguageDao(flagKey).fetch();
      dispatch({type: Types.LANGUAGE_LOAD_SUCCESS, languages: languages, flag: flagKey});
    } catch (e) {
      console.log(e);
    }
  };
}
