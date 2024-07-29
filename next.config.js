

module.exports = {
   compiler: {
     styledComponents: true,
   },
    async redirects() {
      return [
        {
          source: "/",
          destination: "/main",
          permanent: true,
        },
      ];
    },
	distDir: 'build',
};
