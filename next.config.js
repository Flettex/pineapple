const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @type {import('next').NextConfig} */
const nextConfig = (phase, { defaultConfig }) => ({
	reactStrictMode: true,
	async redirects() {
		if (phase === PHASE_DEVELOPMENT_SERVER) {
			return [
				{
					source: '/api/:path*',
					destination: `http://localhost:8080/:path*`,
					permanent: true
				},
				{
					source: '/api/:path*/',
					destination: `http://localhost:8080/:path*/`,
					permanent: true
				},
			];
		}
		return [
			{
				source: '/api/:path*',
				destination: 'https://flettex-backend.fly.dev/:path*',
				permanent: true
			},
			{
				source: '/api/:path*/',
				destination: 'https://flettex-backend.fly.dev/:path*/',
				permanent: true
			}
		];
	},
	// async rewrites() {
	// 	return [
    //         // {
    //         //     source: '/api/:path*',
    //         //     destination: `http://localhost:8080/:path*`,
    //         // },
	// 		// {
	// 		//   source: '/api/:path*/',
	// 		//   destination: `http://localhost:8080/:path*/`,
	// 		// },
	// 		{
	// 			source: '/api/:path*',
	// 			destination: 'https://flettex-backend.fly.dev/:path*'
	// 		},
	// 		{
	// 			source: '/api/:path*/',
	// 			destination: 'https://flettex-backend.fly.dev/:path*/'
	// 		}
	// 		// {
	// 		// 	source: "/api/:path*/",
	// 		// 	destination: `https://flettex-chat.up.railway.app/:path*/`,
	// 		// },
	// 	];
	// },
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "Permissions-Policy",
						value: "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
				],
			},
		];
	},
});

module.exports = nextConfig;
