import Types from '../../action/types';
import ThemeFactory, {ThemeFlags} from '../../res/style/ThemeFactory';

const defaultState = {
  theme: ThemeFactory.createTheme(ThemeFlags.Default),
  onShowCustomThemeView: false,
};


export default function onAction(state = defaultState, action) {
  //注意：不能在这修改state,只能返回新的state或者返回原state
  switch (action.type) {
    case Types.THEME_CHANGE:
      return {
        ...state,
        theme: action.theme,
      };
    case Types.THEME_SHOW_VIEW:
      return {
        ...state,
        customThemeViewVisible: action.customThemeViewVisible,
      };
    default:
      return state;
  }
}
