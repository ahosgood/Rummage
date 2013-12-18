shadow-searchables
==================

Filter and search through lists and tables



## Initialisation

$( **Input** ).searchables( **SearchPool**_, **[Options]**_ );



### Parameters

Parameter | Description
--- | ---
Input | Input element to use
SearchPool | Element to search
Options (optional) | Object of searchable options



## Options

Parameter | Type | Description | Default | Details
--- | --- | --- | --- | ---
attribute | String | The attribute name to search for and filter to | `'data-searchables'` |
excludeClass | String | Class name of elements to exclude from filtering | `'searchables-exclude'` |
matchClass | String | Class to add to a matched element | `''` |
noMatchClass | String | Class to add to an unmatched element | `'searchables-nomatch'` |
noMatchClass | String | The class to apply to the SearchPool element (second parameter) when no results are found | `'searchables-noresults'` | Added in 2.5.0
regex | Boolean | Uses the search string as a regular expression | `false`
results | String | A jQuery selector to insert the number of matches found into | `''` |
score | Boolean | Attaches the number of matches to the data-searchables score of the elements | `false` | Added in 2.3.1
searchingClass | String | The class to apply to the SearchPool element (second parameter) when the searchables are filtering results | `'searchables-searching'` | Added in 2.4.0
searchOnLoad | Boolean | If true, apply a search when the page loads | `true` |
searchText | Boolean | If true, search the text of the elements as well as the attribute | `false` |
total | String | A jQuery selector to insert the total number of items into | `''` |



## Example

```
<input id="query" type="search">
<p>Showing <span id="results">?</span> of <span id="total">?</span> results</p>

<ul id="countries">
	<li data-searchables="UK,United Kingdom,GB,Great Britain">United Kingdom</li>
	<li data-searchables="USA,United States of America">United States</li>
	<li data-searchables="FR,France,Francais">France</li>
	<li class="searchables-noresults">No Results Found</li>
</ul>

<script>
	$( '#query' ).searchables( '#countries', { results: '#results', total: '#total' } );
</script>

<style>
	.searchables-nomatch, .sorry-message { display: none; }
	.searchables-noresults .sorry-message { display: list-item; }
</style>
```
