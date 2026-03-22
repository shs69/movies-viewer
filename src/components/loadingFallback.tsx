import { CircularProgress, Stack, Typography } from "@mui/material";

export function LoadingFallback() {
	return (
		<Stack
			alignItems="center"
			justifyContent="center"
			sx={{ minHeight: "100vh" }}
		>
			<CircularProgress />
			<Typography sx={{ mt: 2 }}>Загрузка...</Typography>
		</Stack>
	);
}
