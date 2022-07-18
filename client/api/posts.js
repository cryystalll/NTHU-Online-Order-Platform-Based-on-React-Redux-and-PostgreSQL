import axios from 'axios';

// Develop server URL
const postBaseUrl = 'http://localhost:3000/api';

// Staging server URL
// const postBaseUrl = 'http://weathermood-staging.us-west-2.elasticbeanstalk.com/api';

// Production server URL
// const postBaseUrl = 'http://weathermood-cloudprog-env2.mefye6uxcy.us-east-1.elasticbeanstalk.com/api';

export function listPosts(searchText = '', isMyPost, auth_email, start) {
    if(isMyPost){
        let url = `${postBaseUrl}/posts/getMyPost`;
        let query = [];
        if (searchText)
            query.push(`searchText=${searchText}`);
        if (auth_email)
            query.push(`auth_email=${auth_email}`);
        if (start)
            query.push(`start=${start}`);
        if (query.length)
            url += '?' + query.join('&');

        console.log(`Making GET request to: ${url}`);

        console.log(auth_email)

        return axios.get(url).then(function(res) {
            if (res.status !== 200)
                throw new Error(`Unexpected response code: ${res.status}`);
            //console.log(res.data);
            return res.data;
        });
    }
    else{
        let url = `${postBaseUrl}/posts`;
        let query = [];
        if (searchText)
            query.push(`searchText=${searchText}`);
        if (start)
            query.push(`start=${start}`);
        if (query.length)
            url += '?' + query.join('&');

        console.log(`Making GET request to: ${url}`);

        return axios.get(url).then(function(res) {
            if (res.status !== 200)
                throw new Error(`Unexpected response code: ${res.status}`);
            console.log(res.data);
            return res.data;
        });
    }
    
}

export function createPost(postData, auth_email) {
    let url = `${postBaseUrl}/posts`;

    console.log(`Making POST request to: ${url}`);

    return axios.post(url, {
        postData,
        auth_email
    }).then(function(res) {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);
        console.log(res.data);
        return res.data;
    });
}

export function createVote(id, mood) {
    let url = `${postBaseUrl}/posts/${id}/${mood.toLowerCase()}Votes`;

    console.log(`Making POST request to: ${url}`);

    return axios.post(url).then(function(res) {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);

        return res.data;
    });
}
