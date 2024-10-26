import React, { useEffect, useState } from 'react';
import fetch from '../api/handler';

const CreateResumePage = () => {
	const [templates, setTemplates] = useState<string[]>([]);
	useEffect(() => {
		fetch({ url: '/resumeTemplates' }).then((response) => setTemplates(response));
	}, []);

	const generateResume = (templateName: string) => {
		fetch({ url: `/generateResume`, method: 'POST', body: { templateName }, raw: true }).then(async (response) => {
			const blob = new Blob([response], { type: 'application/pdf' });
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
		<>
			<div style={{ marginTop: '6%', marginLeft: '10%', textAlign: 'center' }}>Choose a template</div>
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
		</>
	);
};

export default CreateResumePage;
