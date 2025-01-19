export default function respond(status: number, message?: unknown, error?: unknown) {
	return new Response(
		JSON.stringify({
			message,
			error
		}),
		{
			status,
			headers: { 'Content-Type': 'application/json' }
		}
	);
}
