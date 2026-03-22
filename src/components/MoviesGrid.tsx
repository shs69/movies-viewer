import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Dialog,
	DialogActions,
	DialogContent,
	Grid,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ComparingTable } from "./comparingTable";

export interface MovieGrid {
	id: number;
	name: string;
	posterUrl?: string;
	year: string;
	rating: number;
	duration: string | number;
	genres: string | string[];
}

export interface MoviesGridProps {
	movies: MovieGrid[];
}

export function MoviesGrid(movies: MoviesGridProps) {
	const navigate = useNavigate();
	const [compareOpen, setCompareOpen] = useState(false);
	const [selectedMovies, setSelectedMovies] = useState<MovieGrid[]>([]);

	const handleAddToCompare = (e: React.MouseEvent, film: MovieGrid) => {
		e.stopPropagation();
		const newMovies = [...selectedMovies, film];
		setSelectedMovies(newMovies);

		if (newMovies.length === 2) {
			setCompareOpen(true);
		}
	};

	return (
		<Grid container spacing={2} sx={{ width: "100%" }}>
			{movies.movies.map((elem) => (
				<Grid
					size={{ xs: 6, sm: 4, md: 3, lg: 2.4, xl: 1.5 }}
					key={elem.id}
					onClick={() => {
						navigate(`/film/${elem.id}`);
					}}
					sx={{
						cursor: "pointer",
					}}
				>
					<Card
						sx={{
							height: "100%",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<Box sx={{ p: 1 }}>
							{elem.posterUrl ? (
								<CardMedia
									component="img"
									image={elem.posterUrl}
									alt={elem.name}
									sx={{
										width: "100%",
										height: 300,
										objectFit: "cover",
										flexShrink: 0,
										border: "1px solid gray",
										borderRadius: 3,
									}}
								/>
							) : (
								<Box
									sx={{
										width: "100%",
										height: 300,
										bgcolor: "grey.300",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexShrink: 0,
										border: "1px solid gray.300",
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
						<CardContent
							sx={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								gap: 0.5,
								p: 2,
							}}
						>
							<Typography
								variant="subtitle2"
								sx={{
									fontWeight: "bold",
									display: "-webkit-box",
									WebkitLineClamp: 2,
									WebkitBoxOrient: "vertical",
									overflow: "hidden",
									textOverflow: "ellipsis",
									wordBreak: "break-word",
								}}
							>
								{elem.name}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ wordBreak: "break-word" }}
							>
								{elem.year}
							</Typography>
							<Typography
								variant="body2"
								sx={{
									fontWeight: "bold",
									color:
										elem.rating >= 7
											? "success.main"
											: elem.rating >= 5
												? "warning.main"
												: elem.rating === 0
													? "gray"
													: "error.main",
								}}
							>
								{elem.rating > 0 ? elem.rating : "Оценок нет"}
							</Typography>
						</CardContent>
						<Button
							sx={{ mb: 2, minHeight: 40 }}
							onClick={(e) => handleAddToCompare(e, elem)}
						>
							Добавить для сравнения
						</Button>
					</Card>
				</Grid>
			))}

			<Dialog
				open={compareOpen}
				onClose={() => {
					setCompareOpen(false);
					setSelectedMovies([]);
				}}
				maxWidth="md"
				fullWidth
			>
				<DialogContent>
					{selectedMovies.length === 2 && (
						<ComparingTable selectedMovies={selectedMovies} />
					)}
				</DialogContent>
				<DialogActions sx={{ display: "flex", justifyContent: "center" }}>
					<Button
						onClick={() => {
							setCompareOpen(false);
							setSelectedMovies([]);
						}}
						variant="contained"
					>
						Выйти
					</Button>
				</DialogActions>
			</Dialog>
		</Grid>
	);
}
