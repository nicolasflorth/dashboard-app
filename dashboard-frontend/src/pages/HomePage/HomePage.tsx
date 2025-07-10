import { Link } from 'react-router-dom';
import { RootState } from "@/app/store";
import { useSelector } from 'react-redux'
import { useTranslation } from "react-i18next";

function HomePage() {
	const { t } = useTranslation(["common", "pages/home"]);
	const { isAuthenticated } = useSelector((state: RootState) => state.auth);

	return (
		<main>

			<div>
				<h1>{t("title", { ns: "pages/home"})}</h1>
				<p>{t("p1", { ns: "pages/home"})}</p>

				{isAuthenticated &&
					<p>{t("p2", { ns: "pages/home"})}<Link
						to="/dashboard"
						className=""
					>
						{t("dashboard", { ns: "common"})}
					</Link></p>
				}

			</div>
		</main>
	);
}

export default HomePage;
