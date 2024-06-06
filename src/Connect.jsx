import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Redirect from './Redirect';
import LinkContainer from './LinkContainer';
import SignIn from './SignIn';
function Connect() {
	return (
		<>
			<Router>
				<Routes>
					<Route path='/' element={<LinkContainer />} />
					<Route path='/admin' element={<SignIn />} />
					<Route path='/:linkUrl' element={<Redirect />} />
				</Routes>
			</Router>
		</>
	);
}

export default Connect;
