export default function respond(message: unknown, status: number) {
	return new Response(
		JSON.stringify({
			message
		}),
		{
			status,
			headers: { 'Content-Type': 'application/json' }
		}
	);
}
