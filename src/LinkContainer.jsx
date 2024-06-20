import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Link from './Link'; // Import your Link component
import loadingGif from './img/loading.gif'; // Import your loading GIF
import CopyRight from './CopyRight';

const LinkContainer = () => {
	const [resumeLinks, setResumeLinks] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchResumeLinks = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, 'resumeLinks'));
				const links = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setResumeLinks(links);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching resume links:', error);
				setLoading(false);
			}
		};

		fetchResumeLinks();

		// Scroll to the top when the component mounts
		window.scrollTo({ top: 0, behavior: 'smooth' });

		// Clean up any ongoing tasks when the component unmounts
		return () => {
			// Cleanup tasks here
		};
	}, []);

	if (loading) {
		return (
			<>
				<div className='loadingGif'>
					<img src={loadingGif} alt='Loading...' />
				</div>
				<CopyRight />
			</>
		);
	}

	if (resumeLinks.length === 0) {
		return (
			<>
				<div className='linkNotFoundCon'>
					<p className='linkNotFound'>Link not found</p>
				</div>
				<CopyRight />
			</>
		);
	}

	return (
		<div>
			<div className='sasiHeading'>Sasikumar's Resume Link</div>
			{resumeLinks.map((item) => (
				<Link key={item.id} linkName={item.name} link={item.link} />
			))}
			<CopyRight />
		</div>
	);
};

export default LinkContainer;
