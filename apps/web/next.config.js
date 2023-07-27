/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { webpack }) => {
		config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /memcpy/ }))

		return config
	},
}

module.exports = nextConfig
