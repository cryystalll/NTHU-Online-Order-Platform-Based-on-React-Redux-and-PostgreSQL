/* Search text */

export function searchText(state = '', action) {
  switch (action.type) {
      case '@SEARCH_TEXT/SET_SEARCH_TEXT':
          return action.searchText;
      default:
          return state;
  }
}

/* Posts */

const initPostState = {
  postLoading: false,
  posts: [],
  hasMore: true
};
export function post(state = initPostState, action) {
  switch (action.type) {
      case '@POST/START_LOADING':
          return {
              ...state,
              postLoading: true
          };
      case '@POST/END_LOADING':
          return {
              ...state,
              postLoading: false
          };
      case '@POST/END_LIST_POSTS':
          return {
              ...state,
              posts: action.posts,
              hasMore: action.posts.length > 0
          };
      case '@POST/END_CREATE_VOTE':
          var newPosts = state.posts.map(p => {
              if (p.id === action.post.id)
                  return action.post;
              return p;
          });
          return {
              ...state,
              posts: newPosts,
          };
      // TODO
      case '@POST/END_CREATE_POST':
          var newPosts = state.posts.map(p => {
              if (p.id === action.post.id)
                  return action.post;
              return p;
          });
          return {
              ...state,
              posts: newPosts,
          };
      default:
          return state;
  }
}

/* Post Form */

const initPostFormState = {
  inputValue: '',
  inputDanger: false,
  moodToggle: false,
  mood: 'na',
  formOpen:false,
};

export function postForm(state = initPostFormState, action) {
  switch (action.type) {
      case '@POST_FORM/INPUT':
          return {
              ...state,
              inputValue: action.value
          };
      case '@POST_FORM/INPUT_DANGER':
          return {
              ...state,
              inputDanger: action.danger
          };
      case '@POST_FORM/TOGGLE_MOOD':
          return {
              ...state,
              moodToggle: !state.moodToggle
          };
      case '@POST_FORM/SET_MOOD_TOGGLE':
          return {
              ...state,
              moodToggle: action.toggle
          };
      case '@POST_FORM/SELECT_MOOD':
          return {
              ...state,
              mood: action.mood
          };
          case '@POST_FORM/FORM_OPEN':
              return {
                  ...state,
                  formOpen: state.formOpen ? false:true
              };

      default:
          return state;
  }
}

/* Post item */

const initPostItemState = {
  tooltipOpen: {},
  detailOpen: {},
  formOpen: {},
  myformOpen: {},
  noticeOpen: {}
};

export function postItem(state = initPostItemState, action) {
  switch (action.type) {
      case '@POST_ITEM/TOGGLE_TOOLTIP':
          return {
              ...state,
              tooltipOpen: {
                  ...state.tooltipOpen,
                  [action.id]: state.tooltipOpen[action.id] ? false : true
              }
          };
      case '@POST_ITEM/SET_TOOLTIP_TOGGLE':
          return {
              ...state,
              tooltipOpen: {
                  ...state.tooltipOpen,
                  [action.id]: action.toggle
              }
          };
      case '@POST_ITEM/TOGGLE_DETAIL':
          return {
              ...state,
              detailOpen: {
                  ...state.detailOpen,
                  [action.id]: state.detailOpen[action.id] ? false : true
              }
          };
      case '@POST_ITEM/TOGGLE_FORM':
          return {
              ...state,
              formOpen: {
                  ...state.detailOpen,
                  [action.id]: state.formOpen[action.id] ? false : true
              }
          };
      case '@POST_ITEM/TOGGLE_FORMMY':
          return {
              ...state,
              myformOpen: {
                  ...state.detailOpen,
                  [action.id]:  true
              }
          };
          case '@POST_ITEM/TOGGLE_FORMMY1':
          return {
              ...state,
              myformOpen: {
                  ...state.detailOpen,
                  [action.id]:  false 
              }
          };
      case '@POST_ITEM/TOGGLE_NOTICE':
              return {
                  ...state,
                  noticeOpen: {
                      ...state.noticeOpen,
                      [action.id]: state.noticeOpen[action.id] ? false : true
                  }
              };

      default:
          return state;
  }
}