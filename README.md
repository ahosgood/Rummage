#Shadow Searchables

Utilising jQuery, Shadow Searchables filter and search through HTML attributes, allowing you to search without AJAX



## Initialisation

Shadow Searchables requires jQuery v1.7 or higher

`$( input ).searchables( searchPool, [options] );`

| Parameter          | Description                              |
| ------------------ | ---------------------------------------- |
| input              | Input element to use                     |
| searchPool         | Pool of elements to search within        |
| options (optional) | Object of searchable options (see below) |



## Options

| Parameter      | Type    | Description                                                                                                           | Default                   | Details             |
| -------------- | ------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------- |
| attribute      | String  | The attribute name to search for and filter                                                                           | `'data-searchables'`      |                     |
| exclude        | String  | Selector of elements to exclude from the filtering process                                                            | `'.searchables-exclude'`  | Added in 2.7.0      |
| excludeClass   | String  | Class name of elements to exclude from the filtering process (changed to 'exclude' parameter)                         | `'searchables-exclude'`   | Deprecated in 2.7.0 |
| matchClass     | String  | Class to add to a matched element                                                                                     | `''`                      |                     |
| noMatchClass   | String  | Class to add to an unmatched element                                                                                  | `'searchables-nomatch'`   |                     |
| noResultsClass | String  | The class to apply to the search pool when no results are found                                                       | `'searchables-noresults'` | Added in 2.5.0      |
| regex          | Boolean | Allows searching with a regular expression                                                                            | `false`                   |                     |
| results        | String  | A jQuery selector to insert the number of matches found into                                                          | `''`                      |                     |
| score          | Boolean | Attaches the number of matches to the data-searchables score of the elements                                          | `false`                   | Added in 2.3.1      |
| searchingClass | String  | The class to apply to the search pool element when the searchables are filtering results (removed when not filtering) | `'searchables-searching'` | Added in 2.4.0      |
| searchOnLoad   | Boolean | If true, apply a search when the searchables are initiated                                                            | `true`                    |                     |
| searchText     | Boolean | If true, search the text of the elements as well as the attribute                                                     | `false`                   |                     |
| total          | String  | A jQuery selector to insert the total number of items into                                                            | `''`                      |                     |



## Events

`$( input ).trigger( event );`

| Event               | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| searchables.reindex | Forces a search, re-evaluating the number of results and total |



### Search String Examples

Using the array of countries:

`["United Kingdom", "United States", "France", "United Kingdom of the Netherlands"]`

| Type    | Example               | Result                                                                  | Matches                                                                  |
| ------- | --------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Single  | `united`              | Every item with "united" in                                             | United Kingdom, United States, United Kingdom of the Netherlands         |
| OR      | `united france`       | Every item with either "united" or "france" in                          | United Kingdom, United States, France, United Kingdom of the Netherlands |
| AND     | `united +kingdom`     | Every item with both "united" and "kingdom" in                          | United Kingdom, United Kingdom of the Netherlands                        |
| NOT     | `united -kingdom`     | Every item with "united" in, minus those with "kingdom"                 | United States                                                            |
| Literal | `"united kingdom of"` | Every item with the exact string "united kingdom" in (case insensitive) | United Kingdom of the Netherlands                                        |
