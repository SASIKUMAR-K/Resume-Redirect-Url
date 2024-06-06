import React, { useState, useEffect } from 'react';
import {
	signInWithPopup,
	GoogleAuthProvider,
	onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase/index';
import Admin from './Admin'; // Make sure the Admin component is correctly imported
import { signOut } from 'firebase/auth';
const provider = new GoogleAuthProvider();
import './css/signIn.css';
import CopyRight from './CopyRight';

const SignIn = () => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				const email = user.email;
				if (email === import.meta.env.VITE_REACT_APP_EMAIL) {
					setIsAdmin(true);
				}
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}
		});

		return () => unsubscribe();
	}, []);

	const handleGoogleSignIn = async () => {
		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			const email = user.email;

			if (email === import.meta.env.VITE_REACT_APP_EMAIL) {
				setIsAdmin(true);
			} else {
				alert(`Access denied to ${email}.`);
			}
		} catch (error) {
			alert('Something went wrong. Try again later.');
			console.error('Error during sign-in:', error);
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

	if (isAuthenticated) {
		if (isAdmin) {
			return (
				<>
					<Admin />;
				</>
			);
		} else {
			handleLogout();
		}
	}

	return (
		<div>
			<div className='signInCon'>
				<button className='signInWithGoogle' onClick={handleGoogleSignIn}>
					Sign in with Google
				</button>
			</div>
			<div className='copyDown'>
				<div className='aboutMeContainer'>
					Design And Coded By
					<p>
						<a
							href='https://www.linkedin.com/in/mr-sasikumar-k/'
							target='_blank'
						>
							SASIKUMAR K
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
