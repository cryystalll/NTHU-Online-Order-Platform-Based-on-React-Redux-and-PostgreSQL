import React from 'react';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
////這裡是import 現有的module的component!
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Input,
    Button
} from 'reactstrap';
import {connect} from 'react-redux';

import Today from 'components/Today.jsx';
import Forecast from 'components/Forecast.jsx';
import {setSearchText} from 'states/post-actions.js';
import {toggleNavbar} from 'states/main-actions.js';


import {withAuthenticator, AmplifySignOut} from "@aws-amplify/ui-react"; ////
import {Auth} from "aws-amplify";   ////


import './Main.css';

////define a component
class Main extends React.Component {
    static propTypes = {
        searchText: PropTypes.string,
        navbarToggle: PropTypes.bool,
        store: PropTypes.object,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.searchEl = null;

        this.handleNavbarToggle = this.handleNavbarToggle.bind(this);
        this.handleSearchKeyPress = this.handleSearchKeyPress.bind(this);
        this.handleClearSearch = this.handleClearSearch.bind(this);
    }

    render() {
        const name = Auth.user.name;////
        console.log(this.props.authData);
        Auth.currentAuthenticatedUser().then(user => {console.log(user)});
        Auth.currentUserInfo().then(Info => {console.log(Info)});
        console.log(name);////
        //// to see which user is authenticated, can see in console: cognitoUser object
        return (
            <Router>
                <div className='main'>
                    <div className='bg-faded'>
                        <div className='container'>
                            <Navbar color='blue' light expand>

                                <NavbarToggler onClick={this.handleNavbarToggle}/>

                                <NavbarBrand className='text-info' href="/" ><i class="fa fa-beer" aria-hidden="true"></i>{' '}NTHU x NCTU 飲料團購</NavbarBrand>
                                <Collapse isOpen={this.props.navbarToggle} navbar>
                                    {/* <Nav navbar>
                                        <NavItem>
                                            <NavLink tag={Link} to='/'>homepage</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={Link} to='/forecast'>forecast</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink tag={Link} to='/myposts'>myposts</NavLink>
                                        </NavItem>
                                    </Nav> */}
                                    {/* <div className='search ml-auto'>
                                        <Input className='ml-auto' type='text' placeholder='Search' onKeyPress={this.handleSearchKeyPress} innerRef={e => this.searchEl = e}></Input>
                                        {
                                            this.props.searchText &&
                                            <i className='navbar-text fa fa-times' onClick={this.handleClearSearch}></i>
                                        }
                                    </div> */}
                                    <div className='greeting'><i class="fa fa-user-circle" aria-hidden="true"></i>{' '}
                                        歡迎加入, {name}</div>
                                </Collapse>

                                <Button outline color='info' onClick={()=>{Auth.signOut().then(()=> { window.location.reload() })}}>Sign Out</Button>
                            </Navbar>
                        </div>
                    </div>

                    <Route exact path="/" render={() => (
                        <Today />
                    )}/>
                    {/*routing to myposts*/}
                    <Route exact path="/forecast" render={() => (
                        <Forecast />
                    )}/>
                    <Route exact path="/myposts" render={() => (
                        <MyPosts />
                    )}/>
                    <div className='footer'>
                        Created by Team 21 · NTHU SS
                    </div>
                </div>
            </Router>
        );
    }

    handleNavbarToggle() {
        this.props.dispatch(toggleNavbar());
    }

    handleSearchKeyPress(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13){
            this.props.dispatch(setSearchText(e.target.value));
        }
    }

    handleClearSearch() {
        this.props.dispatch(setSearchText(''));
        this.searchEl.value = '';
    }
}

////
export default withAuthenticator(connect(state => ({
    ...state.main,
    searchText: state.searchText,
}))(Main));
