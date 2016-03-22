(function (LineUpJS, d3) {
  const config = {
    renderingOptions: {
      stacked: true
    }
  };


  const columns = [
    {
      column: 'name',
      type: 'string'
    },
    {
      column: 'v1',
      type: 'number',
      domain: [0, 100]
    },
    {
      column: 'v2',
      type: 'number',
      domain: [0, 100]
    },
    {
      column: 'v3',
      type: 'number',
      domain: [0, 100]
    }
  ];

  const serverLink = {
    /**
     * sort the dataset by the given description
     * @param desc
     */
    sort: function(desc) {
      return Promise.resolve(d3.range(100));
    },
    /**
     * returns a slice of the data array identified by a list of indices
     * @param indices
     */
    view: function(indices) {
      return $.getJSON('./data', {
        i: indices.join(',')
      });
    },
    /**
     * returns a sample of the values for a given column
     * @param column
     */
    mappingSample: function(column) {
      return Promise.resolve([]);
    },
    /**
     * return the matching indices matching the given arguments
     * @param search
     * @param column
     */
    search: function(search, column) {
      return Promise.resolve([]);
    }
  }

  const provider = new LineUpJS.provider.RemoteDataProvider(serverLink, columns);
  provider.deriveDefault();

  const lineup = LineUpJS.create(provider, d3.select('main'), config);

  lineup.addPool(d3.select('#pool').node(), {
    hideUsed: false,
    elemWidth: 80,
    elemHeight: 30,
    layout: 'grid',
    width: 320,
    addAtEndOnClick: true,
    additionalDesc : [
      LineUpJS.model.StackColumn.desc('+ Stack')
    ]
  });
 lineup.update();

 d3.select(window).on('resize', function() {
   if (lineup) {
     lineup.update();
   }
 });

}(LineUpJS, d3));
