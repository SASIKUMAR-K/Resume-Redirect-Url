import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
	updateDoc,
} from 'firebase/firestore';
import './css/admin.css';

const Admin = () => {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [keyValue, setKeyValue] = useState('');
	const [link, setLink] = useState('');
	const [resumeLinks, setResumeLinks] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchType, setSearchType] = useState('name');
	const formRef = useRef(null);

	const fetchResumeLinks = async () => {
		try {
			const querySnapshot = await getDocs(collection(db, 'resumeLinks'));
			const links = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setResumeLinks(links);
		} catch (error) {
			console.error('Error fetching resume links:', error);
		}
	};

	useEffect(() => {
		fetchResumeLinks();
	}, []);

	const handleAddResumeLink = async () => {
		if (!name || !keyValue || !link) {
			alert('All fields are required.');
			return;
		}

		try {
			const querySnapshot = await getDocs(
				query(collection(db, 'resumeLinks'), where('key', '==', keyValue))
			);
			if (!querySnapshot.empty) {
				alert('Key must be unique. Please choose a different key.');
				return;
			}

			await addDoc(collection(db, 'resumeLinks'), {
				name,
				key: keyValue,
				link,
			});

			setName('');
			setKeyValue('');
			setLink('');

			await fetchResumeLinks(); // Await for fetching
		} catch (error) {
			console.error('Error adding resume link:', error);
		}
	};

	const handleEdit = (id, name, key, link) => {
		setEditingId(id);
		setName(name);
		setKeyValue(key);
		setLink(link);
		formRef.current.scrollIntoView({ behavior: 'smooth' });
	};

	const handleUpdate = async () => {
		try {
			await updateDoc(doc(db, 'resumeLinks', editingId), {
				name,
				key: keyValue,
				link,
			});
			setEditingId(null);
			setName('');
			setKeyValue('');
			setLink('');
			await fetchResumeLinks(); // Await for fetching
		} catch (error) {
			console.error('Error updating resume link:', error);
		}
	};

	const handleDelete = async (id) => {
		const confirmDelete = window.confirm(
			'Are you sure you want to delete this entry?'
		);
		if (confirmDelete) {
			try {
				await deleteDoc(doc(db, 'resumeLinks', id));
				await fetchResumeLinks(); // Await for fetching
				if (id == editingId) {
					setEditingId(null);
					setName('');
					setKeyValue('');
					setLink('');
				}
			} catch (error) {
				console.error('Error deleting resume link:', error);
			}
		}
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
			navigate('/admin');
		} catch (error) {
			console.error('Error during logout:', error);
		}
	};

	const handleSearch = () => {
		const filteredLinks = resumeLinks.filter((link) => {
			switch (searchType) {
				case 'name':
					return link.name.toLowerCase().includes(searchTerm.toLowerCase());
				case 'key':
					return link.key.toLowerCase().includes(searchTerm.toLowerCase());
				case 'link':
					return link.link.toLowerCase().includes(searchTerm.toLowerCase());
				default:
					return false;
			}
		});
		setResumeLinks(filteredLinks);
	};

	const handleClearSearch = () => {
		setSearchTerm('');
		fetchResumeLinks();
	};

	return (
		<div>
			<button className='logOutBut' onClick={handleLogout}>
				Logout
			</button>

			<form
				className='resumeFormMain'
				onSubmit={(e) => e.preventDefault()}
				ref={formRef}
			>
				<label>Name:</label>
				<input
					type='text'
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<label>Key:</label>
				<input
					type='text'
					value={keyValue}
					onChange={(e) => setKeyValue(e.target.value)}
				/>

				<label>Link:</label>
				<input
					type='text'
					value={link}
					onChange={(e) => setLink(e.target.value)}
				/>

				{editingId ? (
					<button type='button' onClick={handleUpdate}>
						Update
					</button>
				) : (
					<button type='button' onClick={handleAddResumeLink}>
						Add
					</button>
				)}
			</form>

			<form className='resumeFormMain' onSubmit={(e) => e.preventDefault()}>
				<label>Search by</label>
				<select
					value={searchType}
					onChange={(e) => setSearchType(e.target.value)}
				>
					<option value='name'>Name</option>
					<option value='key'>Key</option>
					<option value='link'>Link</option>
				</select>
				<input
					type='text'
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button type='button' onClick={handleSearch}>
					Search
				</button>
				<button type='button' onClick={handleClearSearch}>
					Clear Search
				</button>
			</form>

			<div className='resume-links-container'>
				{resumeLinks.map((link) => (
					<div key={link.id} className='resume-link'>
						<div>
							<strong>Name:</strong> {link.name}
						</div>
						<div>
							<strong>Key:</strong> {link.key}
						</div>
						<div>
							<strong>Link:</strong> {link.link}
						</div>
						<div className='actions'>
							<button
								onClick={() =>
									handleEdit(link.id, link.name, link.key, link.link)
								}
							>
								Edit
							</button>
							<button
								className='deleteBut'
								onClick={() => handleDelete(link.id)}
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Admin;
