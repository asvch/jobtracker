import React, { useEffect, useState } from 'react';
import fetch from '../api/handler';

/**
 * CreateResumePage component allows users to select a resume template and generate a PDF resume.
 *
 * This component fetches available resume templates from the server and displays them as embedded PDFs.
 * Users can click on a template to generate a resume using that template, which will either open in a new tab
 * or trigger a download if the new tab cannot be opened.
 *
 * @component
 * @example
 * return (
 *   <CreateResumePage />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @remarks
 * - The component uses `useState` to manage the list of templates.
 * - The `useEffect` hook is used to fetch the templates when the component mounts.
 * - The `generateResume` function handles the resume generation and file download/opening logic.
 *
 * @todo
 * - Add loading indicators to improve user experience during template fetching and resume generation.
 */
const CreateResumePage = () => {
	const [templates, setTemplates] = useState<string[]>([]);
	useEffect(() => {
		fetch({ url: '/resumeTemplates' }).then((response) => setTemplates(response as string[]));
	}, []);

	const generateResume = (templateName: string) => {
		fetch({ url: `/generateResume`, method: 'POST', body: { templateName }, raw: true }).then(async (response) => {
			const blob = new Blob([response as BlobPart], { type: 'application/pdf' });
			const url = window.URL.createObjectURL(blob);
			const newTab = window.open(url, '_blank');

			if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
				// If opening failed, trigger download
				const anchor = document.createElement('a');
				anchor.href = url;
				anchor.download = `${templateName}.pdf`;
				document.body.appendChild(anchor);
				anchor.click();
				document.body.removeChild(anchor);
			}

			//TODO: Loading indicators?
		});
	};

	return (
		<div style={{ marginTop: '6%', marginLeft: '10%' }}>
			<div style={{ textAlign: 'center' }}>Choose a template</div>
			<div style={{ display: 'flex', flexDirection: 'row', marginTop: '2%' }}>
				{templates.map((template) => (
					<div style={{ marginRight: '20px' }} key={template}>
						<embed src={`/resume-templates/${template}.pdf`} style={{ width: '200px', height: '250px' }} />
						<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
							<div className='text-center' onClick={console.log}>
								{template}
							</div>
							<button onClick={() => generateResume(template)}>Use</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CreateResumePage;
