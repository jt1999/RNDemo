import {onThemeChange, onShowCustomThemeView, onThemeInit} from './theme';
import {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} from './popular';
import {onRefreshTrending, onLoadMoreTrending, onFlushTreeningFavorite} from './trending';
import {onLoadFavoriteData} from './favorite';
import {onLoadLanguage} from './language';
import {onLoadMoreSearch,onSearch,onSearchCancel} from './search'

export default {
  onThemeChange,
  onRefreshPopular,
  onLoadMorePopular,
  onFlushPopularFavorite,
  onRefreshTrending,
  onLoadMoreTrending,
  onFlushTreeningFavorite,
  onLoadFavoriteData,
  onLoadLanguage,
  onShowCustomThemeView,
  onThemeInit,
  onLoadMoreSearch,
  onSearch,
  onSearchCancel
};
