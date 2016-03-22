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
      var args = {
        _asc: desc.asc
      }
      if (Array.isArray(desc.id)) {
        //combined score id : weight
        desc.id.forEach(function(col) {
          args[col.id] = col.weight;
        });
      } else {
        //simple
        args._column = desc.id;
      }
      return $.getJSON('./sort', args);
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
      return $.getJSON('./sample', {
        length: 100
      });
    },
    /**
     * return the matching indices matching the given arguments
     * @param search
     * @param column
     */
    search: function(search, column) {
      return $.getJSON('./search', {
        query: search,
        column: column
      });
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
