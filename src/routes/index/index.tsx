import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	FormGroup,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import { MoviesGrid } from "../../components/MoviesGrid";
import {
	createRange,
	GENRES,
	parseMovies,
	parseRange,
} from "../../utils/utils";
import {
	clampRating,
	clampYear,
	validateRating,
	validateYear,
} from "../../utils/validators";

export default function Index() {
	const loaderData = useLoaderData();
	const fetcher = useFetcher();
	const navigate = useNavigate();
	const [filtersOpen, setFiltersOpen] = useState(false);
	const [search, setSearch] = useState(loaderData.searchParams?.search || "");
	const [moviesState, setMoviesState] = useState({
		movies: parseMovies(loaderData.movies),
		next: loaderData.next,
		hasNext: loaderData.hasNext,
	});
	const ref = useRef<HTMLDivElement | null>(null);

	const [filters, setFilters] = useState({
		year: parseRange(loaderData.searchParams?.year),
		ratingKp: parseRange(loaderData.searchParams?.ratingKp),
		genres: loaderData.searchParams?.genres || [],
	});

	useEffect(() => {
		setMoviesState({
			movies: parseMovies(loaderData.movies),
			next: loaderData.next,
			hasNext: loaderData.hasNext,
		});
	}, [loaderData]);

	useEffect(() => {
		if (!fetcher.data) return;

		const newMovies = parseMovies(fetcher.data.movies);

		setMoviesState((prev) => ({
			movies: [...prev.movies, ...newMovies],
			next: fetcher.data.next,
			hasNext: fetcher.data.hasNext,
		}));
	}, [fetcher.data]);

	const loadNext = useCallback(() => {
		if (!moviesState.hasNext) return;
		if (fetcher.state !== "idle") return;
		if (!moviesState.next) return;

		const params = new URLSearchParams();
		params.set("next", moviesState.next);
		filters.genres.map((g: string) => params.append("genres.name", g));
		if (filters.year.from) params.set("year", createRange(filters.year));
		if (filters.ratingKp.from)
			params.set("rating.kp", createRange(filters.ratingKp));
		console.log([...params.values()]);

		fetcher.load(`/films?${params.toString()}`);
	}, [moviesState.hasNext, moviesState.next, fetcher, fetcher.state]);

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				loadNext();
			}
		});

		if (ref.current) observer.observe(ref.current);

		return () => observer.disconnect();
	}, [loadNext]);

	const handleFilters = () => {
		const params = new URLSearchParams();
		filters.genres.map((g: string) => params.append("genres.name", g));
		if (filters.year.from) params.set("year", createRange(filters.year));
		if (filters.ratingKp.from)
			params.set("rating.kp", createRange(filters.ratingKp));
		console.log([...params.values()]);

		navigate(`/films?${params.toString()}`);
	};

	const handleSearch = () => {
		const params = new URLSearchParams();
		if (search) params.set("query", search);

		navigate(`/search?${params.toString()}`);
	};

	const handleApplyFilters = () => {
		setFiltersOpen(false);
		handleFilters();
	};

	const handleClearFilters = () => {
		setFilters({
			year: { from: "", to: "" },
			ratingKp: { from: "", to: "" },
			genres: [],
		});
		navigate("/films");
	};

	return (
		<Stack
			sx={{
				minHeight: "100vh",
				p: 1,
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

			<Stack
				direction={{ xs: "column", sm: "row" }}
				spacing={1}
				sx={{
					width: "100%",
					px: { xs: 5, sm: 8, md: 15, lg: 20, xl: 30 },
				}}
			>
				<TextField
					size="small"
					placeholder="Поиск фильмов..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleSearch()}
					sx={{ flex: 1 }}
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment position="end">
									<Button
										onClick={handleSearch}
										variant="outlined"
										sx={{ height: 30, width: 30 }}
									>
										<SearchIcon />
									</Button>
								</InputAdornment>
							),
						},
					}}
				/>
				<Button
					variant="outlined"
					startIcon={<FilterListIcon />}
					onClick={() => setFiltersOpen(true)}
				>
					Фильтры
				</Button>
				<Button
					variant="outlined"
					startIcon={<FavoriteIcon />}
					onClick={() => navigate("/favorite")}
				>
					Избранное
				</Button>
			</Stack>

			<Stack
				sx={{
					flex: 1,
					p: 1,
					pt: 3,
				}}
				alignItems="center"
			>
				<MoviesGrid movies={moviesState.movies} />
				<div ref={ref} style={{ height: 1 }} />
			</Stack>

			<Dialog
				open={filtersOpen}
				onClose={() => setFiltersOpen(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>
					Фильтры
					<IconButton
						onClick={() => setFiltersOpen(false)}
						sx={{ position: "absolute", right: 8, top: 8 }}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					<Stack spacing={3}>
						<Box>
							<Typography variant="subtitle2" sx={{ mb: 1 }}>
								Жанры
							</Typography>
							<FormGroup
								sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
							>
								{GENRES.map((genre) => (
									<FormControlLabel
										key={genre}
										control={
											<Checkbox
												checked={filters.genres.includes(genre)}
												onChange={(e) => {
													if (e.target.checked) {
														setFilters((prev) => ({
															...prev,
															genres: [...prev.genres, genre],
														}));
													} else {
														setFilters((prev) => ({
															...prev,
															genres: prev.genres.filter(
																(g: string) => g !== genre,
															),
														}));
													}
												}}
											/>
										}
										label={genre}
									/>
								))}
							</FormGroup>
						</Box>

						<Box>
							<Typography variant="subtitle2" sx={{ mb: 1 }}>
								Год выпуска
							</Typography>
							<Stack direction="row" spacing={1}>
								<TextField
									size="small"
									type="number"
									placeholder="От"
									value={filters.year.from || ""}
									onChange={(e) => {
										if (validateYear(e.target.value)) {
											setFilters((prev) => ({
												...prev,
												year: { ...prev.year, from: e.target.value },
											}));
										}
									}}
									onBlur={(e) => {
										if (e.target.value !== "") {
											setFilters((prev) => ({
												...prev,
												year: { ...prev.year, from: clampYear(e.target.value) },
											}));
										}
									}}
									sx={{ flex: 1 }}
									slotProps={{
										htmlInput: {
											pattern: "\\d{4}",
											min: 1990,
											max: new Date().getFullYear(),
										},
									}}
								/>
								<TextField
									size="small"
									type="number"
									placeholder="До"
									value={filters.year.to || ""}
									onChange={(e) => {
										if (validateYear(e.target.value)) {
											setFilters((prev) => ({
												...prev,
												year: { ...prev.year, to: e.target.value },
											}));
										}
									}}
									onBlur={(e) => {
										if (e.target.value !== "") {
											setFilters((prev) => ({
												...prev,
												year: { ...prev.year, to: clampYear(e.target.value) },
											}));
										}
									}}
									sx={{ flex: 1 }}
									slotProps={{
										htmlInput: {
											pattern: "\\d{4}",
											min: 1990,
											max: new Date().getFullYear(),
										},
									}}
								/>
							</Stack>
						</Box>

						<Box>
							<Typography variant="subtitle2" sx={{ mb: 1 }}>
								Рейтинг КП
							</Typography>
							<Stack direction="row" spacing={1}>
								<TextField
									size="small"
									type="number"
									placeholder="От"
									value={filters.ratingKp.from || ""}
									onChange={(e) => {
										if (validateRating(e.target.value)) {
											setFilters((prev) => ({
												...prev,
												ratingKp: { ...prev.ratingKp, from: e.target.value },
											}));
										}
									}}
									onBlur={(e) => {
										if (e.target.value !== "") {
											setFilters((prev) => ({
												...prev,
												ratingKp: {
													...prev.ratingKp,
													from: clampRating(e.target.value),
												},
											}));
										}
									}}
									sx={{ flex: 1 }}
									slotProps={{
										htmlInput: {
											pattern: "\\d+(\\.\\d+)?",
											min: 0.0,
											max: 10.0,
										},
									}}
								/>
								<TextField
									size="small"
									type="number"
									placeholder="До"
									value={filters.ratingKp.to || ""}
									onChange={(e) => {
										if (validateRating(e.target.value)) {
											setFilters((prev) => ({
												...prev,
												ratingKp: { ...prev.ratingKp, to: e.target.value },
											}));
										}
									}}
									onBlur={(e) => {
										if (e.target.value !== "") {
											setFilters((prev) => ({
												...prev,
												ratingKp: {
													...prev.ratingKp,
													to: clampRating(e.target.value),
												},
											}));
										}
									}}
									sx={{ flex: 1 }}
									slotProps={{
										htmlInput: {
											pattern: "\\d+(\\.\\d+)?",
											min: 0,
											max: 10,
										},
									}}
								/>
							</Stack>
						</Box>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClearFilters}>Сбросить</Button>
					<Button onClick={handleApplyFilters} variant="contained">
						Применить
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
}
