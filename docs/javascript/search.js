const search = instantsearch({
  appId: '{{ site.algolia.application_id }}',
  apiKey: '{{ site.algolia.search_only_api_key }}',
  indexName: '{{ site.algolia.index_name }}',
  routing: true,
  reset: true,
  //hide results if search box is empty
  searchFunction: function(helper) {
    if (helper.state.query.length === 0) {
        return; // do not trigger search
    }

    helper.search(); // trigger search
  }
});

const hitTemplate = function(hit) {
  let date = '';
  if (hit.date) {
    date = moment.unix(hit.date).format('MMM D, YYYY');
  }

  let url = `{{ site.baseurl }}${hit.url}#${hit.anchor}`;

  const title = hit._highlightResult.title.value;

  let breadcrumbs = '';
  if (hit._highlightResult.headings) {
    breadcrumbs = hit._highlightResult.headings.map(match => {
      return `<span class="post-breadcrumb">${match.value}</span>`
    }).join(' > ')
  }

  const content = hit._highlightResult.html.value;

  return `
    <div class="post-item">
      <span class="post-meta">${date}</span>
      <h2><a class="post-link" href="${url}">${title}</a></h2>

      <div class="post-snippet">${content}</div>
    </div>
  `;
}

// Instantsearch
search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search-searchbar',
    placeholder: 'Search Secretless...',
    autofocus: false,
    poweredBy: false,
    reset: true,
    loadingIndicator: false
  })
);

search.addWidget(
  instantsearch.widgets.hits({
    container: '#search-hits',
    templates: {
      empty: '<p class="info">Sorry, no results were found.</p>',
      item: hitTemplate
    }
  })
);

// initialize pagination
search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
    maxPages: 20,
    // default is to scroll to 'body', here we disable this behavior
    scrollTo: false
  })
);

search.start();