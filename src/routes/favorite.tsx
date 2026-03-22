import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { MoviesGrid } from "../components/MoviesGrid";
import { readFromFavorites } from "../utils/utils";

export function Favorite() {
	const navigate = useNavigate();
	const favorite = readFromFavorites();
	return (
		<Stack
			sx={{
				minHeight: "100dvh",
				p: 5,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Stack alignItems="center" sx={{ p: 1 }}>
				<Typography
					variant="h3"
					component="h1"
					sx={{ fontSize: { xs: 28, md: 34 } }}
				>
					Movies Viewer
				</Typography>
			</Stack>
			<Typography variant="h6" component="h1" sx={{ p: 1 }}>
				Favorite list
			</Typography>
			<Stack
				sx={{
					width: "100%",
					flex: 1,
					p: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<MoviesGrid movies={favorite} />
			</Stack>
			<Button onClick={() => navigate(-1)} sx={{ mt: 1 }}>
				Назад
			</Button>
		</Stack>
	);
}
