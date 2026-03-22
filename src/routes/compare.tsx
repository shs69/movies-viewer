import { Stack, Typography } from "@mui/material";

export default function Compare() {
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
				Compare two films
			</Typography>
		</Stack>
	);
}
