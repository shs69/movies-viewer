import { apiClient } from "../../client";

export async function loader({ request }: { request: Request }) {
	const url = new URL(request.url);
	const next = url.searchParams.get("next");
	const search = url.searchParams.get("search") || "";
	const genres = url.searchParams.getAll("genres.name");
	const year = url.searchParams.get("year") || "";
	const ratingKp = url.searchParams.get("rating.kp") || "";

	const options = {
		method: "GET",
		url: "/v1.5/movie",
		params: {
			limit: 50,
			...(next ? { next } : {}),
			...(genres.length > 0
				? { "genres.name": genres.map((g) => `+${g}`) }
				: {}),
			...(year ? { year } : {}),
			...(ratingKp ? { "rating.kp": ratingKp } : {}),
		},
	};

	try {
		const { data } = await apiClient.request(options);
		return {
			movies: data.docs,
			next: data.next,
			hasNext: data.hasNext,
			searchParams: { genres, year, ratingKp },
		};
	} catch (error) {
		console.error(error);
		return {
			movies: [],
			next: null,
			hasNext: false,
			searchParams: { search, genres, year, ratingKp },
		};
	}
}
