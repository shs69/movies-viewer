import { Button, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import { apiClient } from "../client";
import { MoviesGrid } from "../components/MoviesGrid";
import { parseMovies } from "../utils/utils";

export async function loader({ request }: { request: Request }) {
	const url = new URL(request.url);
	const query = url.searchParams.get("query");
	const page = url.searchParams.get("page") || 1;
	console.log(query);

	const options = {
		method: "GET",
		url: `v1.4/movie/search`,
		params: {
			query: query,
			page: page,
		},
	};

	try {
		const { data } = await apiClient.request(options);
		return {
			movies: data.docs,
			page: data.page,
			totalPage: data.pages,
			query: query,
		};
	} catch (error) {
		console.error(error);
		return {
			movie: [],
		};
	}
}

export function Search() {
	const navigate = useNavigate();
	const loaderData = useLoaderData();
	const fetcher = useFetcher();
	const [moviesState, setMoviesState] = useState({
		movies: parseMovies(loaderData.movies),
		page: loaderData.page,
		totalPage: loaderData.totalPage,
	});
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!fetcher.data) return;

		const newMovies = parseMovies(fetcher.data.movies);

		setMoviesState((prev) => ({
			movies: [...prev.movies, ...newMovies],
			page: fetcher.data.page,
			totalPage: fetcher.data.totalPage,
		}));
	}, [fetcher.data]);

	const loadNext = useCallback(() => {
		if (moviesState.page >= moviesState.totalPage) return;
		if (fetcher.state !== "idle") return;

		const params = new URLSearchParams();
		params.set("page", String(moviesState.page + 1));
		params.set("query", loaderData.query);
		console.log([...params.values()]);

		fetcher.load(`/search?${params.toString()}`);
	}, [moviesState.page, fetcher, fetcher.state]);

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				loadNext();
			}
		});

		if (ref.current) observer.observe(ref.current);

		return () => observer.disconnect();
	}, [loadNext]);

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
				Search page
			</Typography>
			<Button onClick={() => navigate(-1)} sx={{ mt: 1 }}>
				Назад
			</Button>
			<Stack
				sx={{
					width: "100%",
					flex: 1,
					p: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<MoviesGrid movies={moviesState.movies} />
				<div ref={ref} style={{ height: 1 }} />
			</Stack>
		</Stack>
	);
}
