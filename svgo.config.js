module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // disable plugins
          removeViewBox: false,
        },
      },
    },
    // Enable built-in plugins
    'removeXMLNS',
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'cleanupAttrs',
    'mergeStyles',
    'minifyStyles',
    'cleanupIDs',
    'removeUselessDefs',
    'removeNonInheritableGroupAttrs',
    'removeUnusedNS',
    'cleanupNumericValues',
    'cleanupListOfValues',
    'convertColors',
    'removeUnknownsAndDefaults',
    'removeRasterImages',
    'sortAttrs',
  ]
}; 