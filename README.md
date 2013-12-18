shadow-searchables
==================

Filter and search through lists and tables

Initialisation

$( Input ).searchables( SearchPool, [Options] );

Parameters

Input
Input element to use

SearchPool
Element to search

Options (optional)
Object of searchable options

Options
attribute String
The attribute name to search for and filter to (Default: 'data-searchables')
excludeClass String
Class name of elements to exclude from filtering (Default: 'searchables-exclude')
matchClass String
Class to add to a matched element (Default: '')
noMatchClass String
Class to add to an unmatched element (Default: 'searchables-nomatch')
noResults String (Removed in 2.5.0)
A jQuery selector for the element that is shown and hidden when there are no matching results (Default: '.searchables-noresults')
noMatchClass String (Added in 2.5.0)
The class to apply to the SearchPool element (second parameter) when no results are found (Default: 'searchables-noresults')
regex Boolean
Uses the search string as a regular expression (Default: false)
results String
A jQuery selector to insert the number of matches found into (Default: '')
score Boolean (Added in 2.3.1)
Attaches the number of matches to the data-searchables score of the elements
searchingClass String (Added in 2.4.0)
The class to apply to the SearchPool element (second parameter) when the searchables are filtering results (Default: 'searchables-searching')
searchOnLoad Boolean
If true, apply a search when the page loads (Default: true)
searchText Boolean
If true, search the text of the elements as well as the attribute (Default: false)
total String
A jQuery selector to insert the total number of items into (Default: '')
