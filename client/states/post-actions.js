import {
    listPosts as listPostsFromApi,
    createPost as createPostFromApi,
    createVote as createVoteFromApi
} from 'api/posts.js';

 
/*  Search text */

export function setSearchText(searchText) {
    return {
        type: '@SEARCH_TEXT/SET_SEARCH_TEXT',
        searchText
    };
}

/*  Posts */

function startLoading() {
    return {
        type: '@POST/START_LOADING'
    };
}

function endLoading() {
    return {
        type: '@POST/END_LOADING'
    };
}

function endListPosts(posts) {
    return {
        type: '@POST/END_LIST_POSTS',
        posts
    };
}

function endCreatePost(post) {
    return {
        type: '@POST/END_CREATE_POST',
        post
    };
}

function endCreateVote(post) {
    return {
        type: '@POST/END_CREATE_VOTE',
        post
    };
}

export function listPosts(searchText, isMyPost, auth_email) {
    return (dispatch, getState) => {
        dispatch(startLoading());
        return listPostsFromApi(searchText, isMyPost, auth_email).then(posts => {
            dispatch(endListPosts(posts));
        }).catch(err => {
            console.error('Error listing posts', err);
        }).then(() => {
            dispatch(endLoading())
        });
    };
};

export function createPost(postData, auth_email, isMyPost) {
    return (dispatch, getState) => {
        dispatch(startLoading());

        return createPostFromApi(postData, auth_email).then(post => {
            dispatch(listPosts(getState().searchText, isMyPost, auth_email));
        }).catch(err => {
            console.error('Error creating post', err);
            dispatch(endLoading());
        }).then(() => {
            dispatch(endLoading())
        });
    };
};

export function createVote(id, mood) {
    return (dispatch, getState) => {
        dispatch(startLoading());

        return createVoteFromApi(id, mood).then(post => {
            dispatch(listPosts());
        }).catch(err => {
            console.error('Error creating vote', err);
        }).then(() => dispatch(endLoading()));
    };
};

/*  Post Form */

export function input(value) {
    return {
        type: '@POST_FORM/INPUT',
        value
    };
};

export function inputDanger(danger) {
    return {
        type: '@POST_FORM/INPUT_DANGER',
        danger
    };
};

export function toggleMood() {
    return {
        type: '@POST_FORM/TOGGLE_MOOD'
    };
};

export function setMoodToggle(toggle) {
    return {
        type: '@POST_FORM/SET_MOOD_TOGGLE',
        toggle
    };
};

export function selectMood(mood) {
    return {
        type: '@POST_FORM/SELECT_MOOD',
        mood
    };
};

export function setFormTogglemain() {
    return {
       type:'@POST_FORM/FORM_OPEN'
    };
};

/*  Post item */

export function toggleTooltip(id) {
    return {
        type: '@POST_ITEM/TOGGLE_TOOLTIP',
        id
    };
};

export function setTooltipToggle(id, toggle) {
    return {
        type: '@POST_ITEM/TOGGLE_TOOLTIP',
        id,
        toggle
    };
};

export function setDetailToggle(id) {
    return {
        type: '@POST_ITEM/TOGGLE_DETAIL',
        id,
    };
};

export function setFormToggle(id) {
    return {
        type: '@POST_ITEM/TOGGLE_FORM',
        id,
    };
};

export function setFormToggleMy(id) {
    //console.log('test');
    return {
        type: '@POST_ITEM/TOGGLE_FORMMY',
        id,
    };
};

export function setFormToggleMy1(id) {
    //console.log('test');
    return {
        type: '@POST_ITEM/TOGGLE_FORMMY1',
        id,
    };
};


export function setNoticeToggle(id) {
    return {
        type: '@POST_ITEM/TOGGLE_NOTICE',
        id,
    };
};