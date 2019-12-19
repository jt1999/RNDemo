import Types from '../../action/types';

const defaultState = {
    theme: '#678',
};


export default function onAction(state = defaultState, action) {
    //注意：不能在这修改state,只能返回新的state或者返回原state
    switch (action.type) {
        case Types.THEME_CHANGE:
            return {
                ...state,
                theme: action.theme,
            };
        default:
            return state;
    }
}
