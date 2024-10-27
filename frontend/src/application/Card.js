import React, { Component } from 'react';

const date = [
	{
		class: '1',
		state: 'Wish list',
		wordOfDate: 'Apply By'
	},
	{
		class: '2',
		state: 'Waiting for Referral',
		wordOfDate: 'Referral before '
	},
	{
		class: '3',
		state: 'Applied',
		wordOfDate: 'Applied Date'
	},
	{
		class: '4',
		state: 'Rejected',
		wordOfDate: 'Applied Date'
	}
];

class Card extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showEditModal: props.showEditModal
		};
	}

	stopPropagation(e) {
		e.stopPropagation();
	}

	render() {
		const dateType = date.find((d) => {
			return d.class === this.props.application.status;
		});
		return (
			<div className='card card-col' key={this.state.id + '_card'} onClick={this.state.showEditModal}>
				<div className='card-body'>
					<div className='card-action'>
						<h6 className='card-title' onClick={this.stopPropagation}>
							{this.props.application.jobTitle}
						</h6>
					</div>
					<p className='small-content-text' key={this.props.application.companyName}>
						{this.props.application.companyName}
						<br />
						{dateType.wordOfDate}: {this.props.application.date}
					</p>
					<p>
						Job link:{' '}
						<a
							href={this.props.application.jobLink}
							target='_blank'
							rel='noreferrer'
							onClick='event.stopPropagation();'
						>
							{this.props.application.jobLink}
						</a>
					</p>
					<p>Location: {this.props.application.location}</p>
				</div>
			</div>
		);
	}
}

export default Card;
