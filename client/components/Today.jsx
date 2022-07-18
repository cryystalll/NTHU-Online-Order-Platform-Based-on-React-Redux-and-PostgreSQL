import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Input, Label} from 'reactstrap';
import {connect} from 'react-redux';

import WeatherDisplay from 'components/WeatherDisplay.jsx';
import WeatherForm from 'components/WeatherForm.jsx';
import {cancelWeather} from 'api/open-weather-map.js';
import {getWeather} from 'states/weather-actions.js';
import {listPosts, createPost, createVote} from 'states/post-actions.js';
import PostForm from 'components/PostForm.jsx';
import PostList from 'components/PostList.jsx';
import {Auth} from "aws-amplify";
import MyCarousel from 'components/carousel.jsx';


import './Today.css';

class Today extends React.Component {
    static propTypes = {
        city: PropTypes.string,
        code: PropTypes.number,
        group: PropTypes.string,
        description: PropTypes.string,
        temp: PropTypes.number,
        unit: PropTypes.string,
        weatherLoading: PropTypes.bool,
        masking: PropTypes.bool,
        searchText: PropTypes.string,
        postLoading: PropTypes.bool,
        posts: PropTypes.array,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            isMyPost: false
        }
    }

    componentDidMount() {
        this.props.dispatch(getWeather('Hsinchu', this.props.unit));
        this.props.dispatch(listPosts(this.props.searchText, this.state.isMyPost, Auth.user.email));
    }

    componentWillUnmount() {
        if (this.props.weatherLoading) {
            cancelWeather();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.searchText !== this.props.searchText) {
            this.props.dispatch(listPosts(nextProps.searchText));
        }
    }

    render() {
        const {city, group, description, temp, unit, masking, postLoading} = this.props;

        document.body.className = `weather-bg ${group}`;
        document.querySelector('.weather-bg .mask').className = `mask ${masking ? 'masking' : ''}`;

        return (
            <div className='today'>
                <div className='weather'>
                  <MyCarousel />

                </div>
                <div className='posts'>
                    <h4 className='label'>&nbsp;&nbsp;</h4>
                    <div className='my'>
                    <div><Input type="checkbox"  onClick={() =>{
                            this.state.isMyPost = (this.state.isMyPost)?false:true;
                            this.props.dispatch(listPosts(this.props.searchText, this.state.isMyPost, Auth.user.email));
                            //console.log(this.state.isMyPost);
                        }
                    } />&nbsp;
                    <Label>我揪的團{' '}<i className='fa fa-paper-plane' aria-hidden="true"></i></Label>
                    </div>
                    </div>

                    <PostForm isMyPost = {this.state.isMyPost}/>
                    <PostList />{
                        postLoading &&
                        <Alert color='warning' className='loading'>Loading...</Alert>
                    }
                </div>
            </div>
        );
    }
}

export default connect(state => ({
    ...state.weather,
    unit: state.unit,
    postLoading: state.post.postLoading,
    searchText: state.searchText,
}))(Today);
