import { createBrowserRouter, redirect } from "react-router";
import { LoadingFallback } from "./components/loadingFallback";
import Compare from "./routes/compare";
import { Favorite } from "./routes/favorite";
import { Film, loader as FilmLoader } from "./routes/film";
import Index from "./routes/index/index";
import { loader as IndexLoader } from "./routes/index/loader";
import { Search, loader as searchLoader } from "./routes/search";

const router = createBrowserRouter(
	[
		{
			path: "/",
			loader: () => redirect("/films"),
		},
		{
			path: "films",
			Component: Index,
			HydrateFallback: LoadingFallback,
			loader: IndexLoader,
		},
		{
			path: "compare",
			Component: Compare,
		},
		{
			path: "film/:id",
			Component: Film,
			loader: FilmLoader,
			HydrateFallback: LoadingFallback,
		},
		{
			path: "favorite",
			Component: Favorite,
		},
		{
			path: "search",
			Component: Search,
			loader: searchLoader,
			HydrateFallback: LoadingFallback,
		},
	],
	{ basename: "/movies-viewer" },
);

export default router;
