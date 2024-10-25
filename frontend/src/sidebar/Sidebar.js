import React, { Component } from 'react';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import { CONSTANTS } from '../data/Constants';

import '../static/Sidebar.css';

export default class Sidebar extends Component {
	render() {
		return (
			<div class='left-nav'>
				<div class='left-nav-item'>
					<div onClick={() => this.props.switchPage('SearchPage')}>
						<i class='fas fa-search left-nav-icon'></i>
						<span class='left-nav-label'>Search</span>
					</div>
					<div onClick={() => this.props.switchPage('ManageResumePage')}>
						<i class='fas fa-folder left-nav-icon'></i>
						<span class='left-nav-label'>Manage</span>
					</div>
					<div onClick={() => this.props.switchPage('MatchesPage')}>
						<i class='fas fa-check-double left-nav-icon'></i>
						<span class='left-nav-label'>Matches</span>
					</div>
					<div onClick={() => this.props.switchPage('ApplicationPage')}>
						<i class='fas fa-file-alt left-nav-icon'></i>
						<span class='left-nav-label'>NewApplication</span>
					</div>
					<div onClick={() => this.props.switchPage('MyApplicationPage')}>
						<i class='fas fa-user-alt left-nav-icon'></i>
						<span class='left-nav-label'>MyApplications</span>
					</div>
					<div onClick={() => this.props.switchPage('ProfilePage')}>
						<i class='fas fa-user-alt left-nav-icon'></i>
						<span class='left-nav-label'>Profile</span>
					</div>
					<div onClick={() => this.props.handleLogout()}>
						<i class='fas fa-sign-out-alt left-nav-icon'></i>
						<span class='left-nav-label'>LogOut</span>
					</div>
				</div>
			</div>
		);
	}
}
