import axios from 'axios';

// Develop server URL
const postBaseUrl = 'http://localhost:3000/api';


////
export function createForm(id, name, phone, drink, cups, money, comment, sugar, ice, auth_email) {
    let url = `${postBaseUrl}/forms`;

    console.log(`Making CreateForm request to: ${url}`);
    //console.log(auth_email);
    return axios.post(url, {
        id, name, phone, drink, cups, money, comment, sugar, ice, auth_email
    }).then(function(res) {
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);
        console.log(res.data);
        return res.data;
    });
}
////Listing myForm
export function listForm(id, auth_email, role){
    let url = `${postBaseUrl}/forms`;

    url += '?' + `postid=${id}` + '&' + `auth_email=${auth_email}` + '&' + `role=${role}`; 

    console.log(`Making GET request to: ${url}`);

    return axios.get(url).then(function(res) {
        //console.log(res.data);
        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);
        return res.data;
    });
}
////Send email to all participants
export function listEmail(id){
    let url = `${postBaseUrl}/forms/emails`;

    url += '?' + `postid=${id}`;

    console.log(`Making GET request to: ${url}`);

    return axios.get(url).then(function(res) {
        console.log(res.data);

        if (res.status !== 200)
            throw new Error(`Unexpected response code: ${res.status}`);
        return res.data;
    });
}
////To make change with checked form
export function postFormsCheck(forms) {
    let url = `${postBaseUrl}/forms/check`;
    forms.forEach(e=>{
        console.log(`Making CreateForm request to: ${url}`);
        
        const formid = e['formid'];
        const check = e['check'];

        return axios.post(url, {
            formid, check
        }).then(function(res) {
            if (res.status !== 200)
                throw new Error(`Unexpected response code: ${res.status}`);
            console.log(res.data);
            return res.data;
        });
    })
    
}