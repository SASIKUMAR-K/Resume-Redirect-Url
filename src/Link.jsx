import './css/link.css';

const Link = ({ linkName, link }) => {
	return (
		<div className='linkContainer'>
			<a
				className='anchorContainer'
				href={link}
				target='_blank'
				title='Go to The Link'
			>
				<div className='linkName'>{linkName}</div>
				<div className='linkText'>{link}</div>
			</a>
		</div>
	);
};

export default Link;
