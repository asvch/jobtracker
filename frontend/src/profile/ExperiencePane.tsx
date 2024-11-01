import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import './ExperiencePane.css';
import useDebouncedValue from '../hooks/useDebouncedValue';
import fetch from '../api/handler';

export interface ExperiencePaneProps {
	experiences: Experience[];
	updateExperiences: (experiences: unknown[]) => void;
	type: ExperienceType;
}

export enum ExperienceType {
	Professional = 'Professional',
	Academic = 'Academic'
}

export interface Experience {
	title: string;
	subTitle: string;
	startDate?: Date;
	endDate?: Date;
	bullets: string[];
}

/**
 * Component for displaying and managing a list of experiences (either professional or educational).
 *
 * @param {ExperiencePaneProps} props - The properties for the ExperiencePane component.
 * @param {Experience[]} props.experiences - The initial list of experiences.
 * @param {Function} props.updateExperiences - Function to update the experiences in the parent component.
 * @param {ExperienceType} props.type - The type of experiences (Professional or Educational).
 *
 * @returns {JSX.Element} The rendered ExperiencePane component.
 *
 * @component
 *
 * @example
 * <ExperiencePane
 *   experiences={initialExperiences}
 *   updateExperiences={handleUpdateExperiences}
 *   type={ExperienceType.Professional}
 * />
 */
const ExperiencePane = ({ experiences: _experiences, updateExperiences, type }: ExperiencePaneProps) => {
	const [experiences, setExperiences] = useState<Experience[]>(_experiences);
	const [newExperience, setNewExperience] = useState<Experience>({
		title: '',
		subTitle: '',
		startDate: undefined,
		endDate: undefined,
		bullets: ['']
	});

	const saveUpdates = (updated: Experience[]) => {
		let formatted: unknown[];

		if (type === ExperienceType.Professional) {
			formatted = updated.map((exp) => ({
				title: exp.title,
				companyName: exp.subTitle,
				startDate: exp.startDate,
				endDate: exp.endDate,
				bullets: exp.bullets
			}));
		} else {
			formatted = updated.map((exp) => ({
				degree: exp.title,
				institutionName: exp.subTitle,
				startDate: exp.startDate,
				endDate: exp.endDate,
				bullets: exp.bullets
			}));
		}

		const body: Record<string, unknown> = {};
		if (type === ExperienceType.Professional) {
			body.experiences = formatted;
		} else {
			body.education = formatted;
		}

		fetch({
			url: '/updateProfile',
			method: 'POST',
			body
		}).then(() => {
			updateExperiences(formatted);
		});
	};

	const debouncedExperiences = useDebouncedValue(experiences, 500);

	useEffect(() => {
		saveUpdates(debouncedExperiences);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedExperiences]);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		field: keyof Experience,
		index?: number
	) => {
		const value = e.target.value;

		if (index !== undefined) {
			const updatedExperiences = [...experiences];

			if (field === 'bullets') {
				updatedExperiences[index].bullets = value.split('\n');
			} else if (field === 'startDate' || field === 'endDate') {
				updatedExperiences[index][field] = value ? new Date(value) : undefined;
			} else {
				updatedExperiences[index][field] = value;
			}

			setExperiences(updatedExperiences);
		} else {
			const updatedValue =
				field === 'bullets'
					? value.split('\n')
					: field === 'startDate' || field === 'endDate'
						? new Date(value)
						: value;

			setNewExperience({ ...newExperience, [field]: updatedValue });
		}
	};

	const handleAddExperience = (e: FormEvent) => {
		e.preventDefault();
		setExperiences([...experiences, newExperience]);
		setNewExperience({
			title: '',
			subTitle: '',
			startDate: undefined,
			endDate: undefined,
			bullets: ['']
		});
	};

	const handleDeleteExperience = (index: number) => {
		const updatedExperiences = experiences.filter((_, i) => i !== index);
		setExperiences(updatedExperiences);
	};

	const handleBulletChange = (index: number, bulletIndex: number, value: string) => {
		const updatedExperiences = [...experiences];
		updatedExperiences[index].bullets[bulletIndex] = value;
		setExperiences(updatedExperiences);
	};

	const handleAddBullet = (index: number) => {
		const updatedExperiences = [...experiences];
		updatedExperiences[index].bullets.push('');
		setExperiences(updatedExperiences);
	};

	const handleRemoveBullet = (index: number, bulletIndex: number) => {
		const updatedExperiences = [...experiences];
		updatedExperiences[index].bullets = updatedExperiences[index].bullets.filter((_, i) => i !== bulletIndex);
		setExperiences(updatedExperiences);
	};

	console.log(experiences);

	return (
		<div className='card my-3 p-2' style={{ boxShadow: '0px 5px 12px 0px rgba(0,0,0,0.1)' }}>
			<h2>{type} Experience</h2>
			{experiences
				.sort((a, b) => (b.startDate ?? new Date()).getTime() - (a.startDate ?? new Date()).getTime())
				.map((experience, index) => (
					<div key={index} className='experience-item'>
						<input
							type='text'
							value={experience.title}
							onChange={(e) => handleChange(e, 'title', index)}
							placeholder={type === ExperienceType.Professional ? 'Job Title' : 'Degree'}
						/>
						<input
							type='text'
							value={experience.subTitle}
							onChange={(e) => handleChange(e, 'subTitle', index)}
							placeholder={type === ExperienceType.Professional ? 'Company Name' : 'Institution'}
						/>
						<input
							type='date'
							value={experience.startDate?.toISOString().split('T')[0] ?? ''}
							onChange={(e) => handleChange(e, 'startDate', index)}
						/>
						<input
							type='date'
							value={experience.endDate?.toISOString().split('T')[0] ?? ''}
							onChange={(e) => handleChange(e, 'endDate', index)}
							placeholder='End Date'
						/>
						<ul>
							{(experience.bullets ?? []).map((bullet, bulletIndex) => (
								<li key={bulletIndex}>
									<input
										type='text'
										value={bullet}
										onChange={(e) => handleBulletChange(index, bulletIndex, e.target.value)}
										placeholder='Bullet point'
									/>
									<button onClick={() => handleRemoveBullet(index, bulletIndex)}>Remove Bullet</button>
								</li>
							))}
							<button onClick={() => handleAddBullet(index)}>Add Bullet</button>
						</ul>
						<button onClick={() => handleDeleteExperience(index)}>Delete Experience</button>
					</div>
				))}

			<form onSubmit={handleAddExperience}>
				<h3>Add New {type === ExperienceType.Professional ? 'Work experience' : 'Education'}</h3>
				<input
					type='text'
					value={newExperience.title}
					onChange={(e) => handleChange(e, 'title')}
					placeholder={type === ExperienceType.Professional ? 'Job Title' : 'Degree'}
					required
				/>
				<input
					type='text'
					value={newExperience.subTitle}
					onChange={(e) => handleChange(e, 'subTitle')}
					placeholder={type === ExperienceType.Professional ? 'Company Name' : 'Institution'}
					required
				/>
				<input
					type='date'
					value={newExperience.startDate?.toISOString().split('T')[0] ?? ''}
					onChange={(e) => handleChange(e, 'startDate')}
				/>
				<input
					type='date'
					value={newExperience.endDate?.toISOString().split('T')[0] ?? ''}
					onChange={(e) => handleChange(e, 'endDate')}
					placeholder='End Date'
				/>
				<textarea
					value={newExperience.bullets.join('\n')}
					onChange={(e) => handleChange(e, 'bullets')}
					placeholder='Enter bullet points (one per line)'
					rows={5}
				/>
				<button type='submit'>Add {type === ExperienceType.Professional ? 'Work experience' : 'Education'}</button>
			</form>
		</div>
	);
};

export default ExperiencePane;
