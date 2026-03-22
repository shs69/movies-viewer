import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import type { MovieGrid } from "./MoviesGrid";

function CompareRow({
	label,
	value,
	highlight,
	better,
}: {
	label: string;
	value: string | number;
	highlight?: boolean;
	better?: boolean;
}) {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				p: 1,
				bgcolor: highlight
					? better
						? "success.light"
						: "warning.light"
					: "transparent",
				borderRadius: 1,
			}}
		>
			<Typography variant="body2" color="text.secondary">
				{label}
			</Typography>
			<Typography
				variant="body1"
				sx={{ fontWeight: highlight ? "bold" : "normal" }}
			>
				{value}
			</Typography>
		</Box>
	);
}

export function ComparingTable({
	selectedMovies,
}: {
	selectedMovies: MovieGrid[];
}) {
	return (
		<Stack spacing={3}>
			<Typography variant="h5" align="center">
				Сравнение фильмов
			</Typography>
			<Grid container spacing={2}>
				<Grid size={6}>
					<Card
						sx={{
							bgcolor: "grey.50",
							height: "100%",
						}}
					>
						<CardContent>
							<Typography
								variant="h6"
								align="center"
								sx={{ mb: 2, fontWeight: "bold" }}
							>
								{selectedMovies[0].name}
							</Typography>
							<Stack spacing={1.5}>
								<CompareRow label="Год" value={selectedMovies[0].year} />
								<CompareRow
									label="Рейтинг"
									value={
										selectedMovies[0].rating > 0
											? selectedMovies[0].rating
											: "Нет данных"
									}
									highlight
									better={selectedMovies[0].rating > selectedMovies[1].rating}
								/>
								<CompareRow
									label="Длительность"
									value={selectedMovies[0].duration}
								/>
								<Box>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 0.5 }}
									>
										Жанры:
									</Typography>
									<Stack direction="row" spacing={0.5} flexWrap="wrap">
										{Array.isArray(selectedMovies[0].genres) &&
										selectedMovies[0].genres.length > 0 ? (
											selectedMovies[0].genres.map((genre: string) => (
												<Typography
													key={genre}
													variant="body2"
													sx={{
														bgcolor: "primary.light",
														color: "primary.contrastText",
														p: "2px 8px",
														borderRadius: 1,
													}}
												>
													{genre}
												</Typography>
											))
										) : (
											<Typography variant="body2">
												{selectedMovies[0].genres}
											</Typography>
										)}
									</Stack>
								</Box>
							</Stack>
						</CardContent>
					</Card>
				</Grid>
				<Grid size={6}>
					<Card
						sx={{
							bgcolor: "grey.50",
							height: "100%",
						}}
					>
						<CardContent>
							<Typography
								variant="h6"
								align="center"
								sx={{ mb: 2, fontWeight: "bold" }}
							>
								{selectedMovies[1].name}
							</Typography>
							<Stack spacing={1.5}>
								<CompareRow label="Год" value={selectedMovies[1].year} />
								<CompareRow
									label="Рейтинг"
									value={
										selectedMovies[1].rating > 0
											? selectedMovies[1].rating
											: "Нет данных"
									}
									highlight
									better={selectedMovies[1].rating > selectedMovies[0].rating}
								/>
								<CompareRow
									label="Длительность"
									value={selectedMovies[1].duration}
								/>
								<Box>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 0.5 }}
									>
										Жанры:
									</Typography>
									<Stack direction="row" spacing={0.5} flexWrap="wrap">
										{Array.isArray(selectedMovies[1].genres) &&
										selectedMovies[1].genres.length > 0 ? (
											selectedMovies[1].genres.map((genre: string) => (
												<Typography
													key={genre}
													variant="body2"
													sx={{
														bgcolor: "primary.light",
														color: "primary.contrastText",
														p: "2px 8px",
														borderRadius: 1,
													}}
												>
													{genre}
												</Typography>
											))
										) : (
											<Typography variant="body2">
												{selectedMovies[1].genres}
											</Typography>
										)}
									</Stack>
								</Box>
							</Stack>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Stack>
	);
}
