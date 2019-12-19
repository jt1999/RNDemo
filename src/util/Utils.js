export default class Utils {
    /**
     * 检查当前item是否被收藏
     * @param item
     * @param keys
     * @returns {boolean}
     */
    static checkFavorite(item, keys = []) {
        if (!keys) return false;
        for (let i = 0, len = keys.length; i < len; i++) {
            let id = item.id ? item.id : item.fullName;
            if (id.toString() === keys[i]) {
                return true;
            }
        }
        return false;
    }

}
