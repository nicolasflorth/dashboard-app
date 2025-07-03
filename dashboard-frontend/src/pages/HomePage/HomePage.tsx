import { Link } from 'react-router-dom';
import { RootState } from "@/app/store";
import { useSelector } from 'react-redux'

function HomePage() {
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);

	return (
		<main>

			<div>
				<h1>Welcome to My App</h1>
				<p>This is the home page. Feel free to explore!</p>

				{isAuthenticated &&
					<p>As you are Logedin you can access the <Link
						to="/dashboard"
						className=""
					>
						Dashboard
					</Link></p>
				}

			</div>
		</main>
	);
}

export default HomePage;
