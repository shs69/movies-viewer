import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	Stack,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { apiClient } from "../client";
import {
	addToFavorite,
	findInFavoritesById,
	removeFromFavoritesById,
} from "../utils/utils";

export async function loader({ request }: { request: Request }) {
	const url = new URL(request.url);
	const id = url.pathname.split("/").filter(Boolean)[2];
	console.log(id);

	const options = {
		method: "GET",
		url: `/v1.4/movie/${id}`,
		params: {},
	};

	try {
		const { data } = await apiClient.request(options);
		return data;
	} catch (error) {
		console.error(error);
		return {
			movie: [],
		};
	}
}

export function Film() {
	const film = useLoaderData();
	const navigate = useNavigate();
	const ratingValues: number[] = Object.values(film.rating);
	const rating = Number(Math.max(...ratingValues).toFixed(2));
	const [isFavorite, setIsFavorite] = useState(findInFavoritesById(film.id));
	const [favoriteOpen, setFavoriteOpen] = useState(false);
	const [buttonName, setButtonName] = useState(
		!isFavorite ? "Добавить в избранное" : "Удалить из избранного",
	);

	const toFavorite = () => {
		addToFavorite(film);
		setFavoriteOpen(false);
		setButtonName("Удалить из избранного");
		setIsFavorite(true);
	};

	const removeFavorite = () => {
		removeFromFavoritesById(film.id);
		setFavoriteOpen(false);
		setButtonName("Добавить в избранное");
		setIsFavorite(false);
	};

	const ratingColor =
		rating >= 7
			? "success.main"
			: rating >= 5
				? "warning.main"
				: rating === 0
					? "gray"
					: "error.main";

	return (
		<Stack
			sx={{
				p: 5,
				minHeight: "100dvh",
				justifyContent: "center",
				alignItems: "center",
			}}
			spacing={3}
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
			<Stack
				direction={{ xs: "column", md: "row" }}
				spacing={3}
				sx={{ width: "60%" }}
			>
				<Box
					sx={{
						flexShrink: 0,
						width: { xs: "100%", md: 300 },
						height: { xs: 400, sm: 450 },
					}}
				>
					{film.poster?.url ? (
						<Box
							component="img"
							src={film.poster.url}
							alt={film.name}
							sx={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								border: "1px solid gray",
								borderRadius: 3,
							}}
						/>
					) : (
						<Box
							sx={{
								width: "100%",
								height: "100%",
								bgcolor: "grey.300",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								border: "1px solid gray",
								borderRadius: 3,
							}}
						>
							<Typography
								variant="h6"
								color="text.secondary"
								sx={{ opacity: 0.5 }}
							>
								Нет постера
							</Typography>
						</Box>
					)}
				</Box>

				<Stack sx={{ flex: 1 }} spacing={2}>
					<Typography variant="h4" sx={{ fontWeight: "bold" }}>
						{film.name}
					</Typography>

					{film.alternativeName && (
						<Typography variant="h6" color="text.secondary">
							{film.alternativeName}
						</Typography>
					)}

					<Stack direction="row" spacing={2} alignItems="center">
						<Typography
							variant="h5"
							sx={{
								fontWeight: "bold",
								color: ratingColor,
							}}
						>
							★ {rating > 0 ? rating : "Оценок нет"}
						</Typography>
						<Typography variant="h6" color="text.secondary">
							{film.year}
						</Typography>
					</Stack>

					{film.genres.length > 0 && (
						<Stack direction="row" spacing={1} flexWrap="wrap">
							{film.genres.map((genre: { name: string }) => (
								<Typography
									key={genre.name}
									variant="body2"
									sx={{
										bgcolor: "grey.200",
										p: "4px 8px",
										borderRadius: 1,
									}}
								>
									{genre.name}
								</Typography>
							))}
						</Stack>
					)}

					<Box>
						<Typography variant="h6" sx={{ mb: 1 }}>
							Описание
						</Typography>
						<Typography
							variant="body1"
							sx={{
								whiteSpace: "pre-wrap",
								wordBreak: "break-word",
								lineHeight: 1.6,
							}}
						>
							{film.description ? film.description : "Нет описания"}
						</Typography>
					</Box>
					<Button
						variant="contained"
						onClick={() => setFavoriteOpen(true)}
						sx={{ mt: 5 }}
					>
						{buttonName}
					</Button>
				</Stack>
			</Stack>
			<Button onClick={() => navigate(-1)} sx={{ mt: 5 }}>
				Назад
			</Button>
			<Dialog open={favoriteOpen} onClose={() => setFavoriteOpen(false)}>
				<DialogTitle>
					{!isFavorite
						? "Вы точно хотите добавить в избранное?"
						: "Вы точно хотите удалить из избранного?"}
				</DialogTitle>
				<DialogActions>
					<Button onClick={() => setFavoriteOpen(false)}>Отмена</Button>
					<Button
						onClick={() => (!isFavorite ? toFavorite() : removeFavorite())}
						variant="contained"
					>
						{!isFavorite ? "Добавить" : "Удалить"}
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
}
