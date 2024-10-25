import React, { Component } from 'react';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

import '../static/Sidebar.css';

const options = [
	{ label: 'Search', icon: 'fas fa-search', page: 'SearchPage' },
	{ label: 'Manage', icon: 'fas fa-folder', page: 'ManageResumePage' },
	{ label: 'Matches', icon: 'fas fa-check-double', page: 'MatchesPage' },
	{ label: 'New Application', icon: 'fas fa-file-alt', page: 'ApplicationPage' },
	{ label: 'My Applications', icon: 'fas fa-user-alt', page: 'MyApplicationPage' },
	{ label: 'Profile', icon: 'fas fa-user-alt', page: 'ProfilePage' }
];

export default class Sidebar extends Component {
	render() {
		return (
			<div class='left-nav'>
				<div class='left-nav-item'>
					{options.map((option) => (
						<div onClick={() => this.props.switchPage(option.page)}>
							<i class={`${option.icon} fas left-nav-icon`}></i>
							<span class='left-nav-label'>{option.label}</span>
						</div>
					))}
					<div onClick={() => this.props.handleLogout()}>
						<i class='fas fa-sign-out-alt left-nav-icon'></i>
						<span class='left-nav-label'>LogOut</span>
					</div>
				</div>
			</div>
		);
	}
}
