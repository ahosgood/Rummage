/**
 * ================================================================================
 * Shadow Searchables
 * --------------------------------------------------------------------------------
 * Author:      Andrew Hosgood
 * Version:     2.7.0
 * Date:        10/06/2014
 * ================================================================================
 */

(
	function( $ ) {
		try {
			if( window.jQuery ) {
				$.fn.searchables = function( jqoSearchTarget, objUserOptions ) {
						var objOptions = $.extend( {}, $.fn.searchables.objDefaultOptions, objUserOptions ),
						contains = function( strNeedle, strHaystack ) {
								return strHaystack.indexOf( strNeedle ) !== -1;
							},
						isBlank = function( mxdValue ) {
								return mxdValue.replace( /[\s\t\r\n]*/g, '' ) == '';
							};
					
						return this.each(
							function() {
								var jqoThisSearch = $( this );
								var strThisSearchNodeName = jqoThisSearch[0].nodeName.toLowerCase();

								if( strThisSearchNodeName === 'input'
										|| strThisSearchNodeName === 'select' ) {
									var jqoBaseSearchPool;

									if( ( typeof jqoSearchTarget === 'object'
												&& ( $( jqoSearchTarget ) instanceof jQuery
													|| jqoSearchTarget.jquery ) )
											|| $( jqoSearchTarget ).length ) {
										jqoSearchTarget = $( jqoSearchTarget );
										jqoBaseSearchPool = jqoSearchTarget.find( '[' + objOptions.attribute + ']' );
									} else {
										throw 'Can\'t find any searchables';
									}

									var intBaseTotal = jqoBaseSearchPool.filter( ':not(' + objOptions.exclude + ')' ).length,
									funSearch = function() {
											var strSearchTerm = jqoThisSearch.val(),
											intResults = 0,
											jqoSearchPool = jqoBaseSearchPool.filter( ':not(' + objOptions.exclude + ')' );

											if( isBlank( strSearchTerm ) ) {
												intResults = jqoSearchPool.filter( ':not(' + objOptions.exclude + ')' ).length;
												jqoSearchPool.addClass( objOptions.matchClass ).removeClass( objOptions.noMatchClass ),
												jqoSearchTarget.removeClass( objOptions.searchingClass + ' ' + objOptions.noResultsClass );
											} else if( objOptions.regex ) {
												try {
													var regExTest = new RegExp( strSearchTerm, 'm' );

													//jqoSearchTarget.each(
														//function() {
															//var jqoTarget = $( this );

															if( !jqoSearchTarget.hasClass( objOptions.searchingClass ) ) {
																jqoSearchTarget.addClass( objOptions.searchingClass );
															}

															jqoSearchPool.each(
																function() {
																	var jqoSearchableItem = $( this );
																	var strSearchables = jqoSearchableItem.attr( objOptions.attribute ).toLowerCase();
																	var blMatch = false;

																	if( regExTest.test( strSearchables )
																			|| ( objOptions.searchText
																				&& regExTest.test( jqoSearchableItem.text() ) ) ) {
																		blMatch = true;
																	}

																	if( blMatch ) {
																		intResults++;

																		if( !isBlank( objOptions.matchClass ) ) {
																			jqoSearchableItem.addClass( objOptions.matchClass )
																		}
																		if( !isBlank( objOptions.noMatchClass ) ) {
																			jqoSearchableItem.removeClass( objOptions.noMatchClass );
																		}
																	} else {
																		if( !isBlank( objOptions.noMatchClass ) ) {
																			jqoSearchableItem.addClass( objOptions.noMatchClass );
																		}
																		if( !isBlank( objOptions.matchClass ) ) {
																			jqoSearchableItem.removeClass( objOptions.matchClass )
																		}
																	}
																}
															);

														//}
													//);
												} catch( e ) {
													intResults = jqoSearchPool.find( '.' + objOptions.matchClass ).length;
												}
											} else {
												var arrAbsoluteSearchTerms = strSearchTerm.toLowerCase().match( /[\+\-]?("([^"]*)"|'([^']*)')/g ),
												strSearchTermSansAbsolute = strSearchTerm.toLowerCase().replace( /[\+\-]?("[^"]*"|'[^']*')/g, '' ),
												arrSearchTerms = arrAbsoluteSearchTerms ? strSearchTermSansAbsolute.split( ' ' ).concat( arrAbsoluteSearchTerms ) : strSearchTermSansAbsolute.split( ' ' );

												//jqoSearchTarget.each(
													//function() {
														//var jqoTarget = $( this );
														if( !jqoSearchTarget.hasClass( objOptions.searchingClass ) ) {
															jqoSearchTarget.addClass( objOptions.searchingClass );
														}

														jqoSearchPool.each(
															function() {
																var jqoSearchableItem = $( this );
																var strSearchables = jqoSearchableItem.attr( objOptions.attribute ).toLowerCase();
																var intMatches = 0;

																if( strThisSearchNodeName === 'select' ) {
																	if( objOptions.searchText ) {
																		intMatches = strSearchTerm.toLowerCase() === jqoSearchableItem.text().toLowerCase() ? 1 : 0;
																	} else {
																		intMatches = strSearchTerm.toLowerCase() === jqoSearchableItem.attr( objOptions.attribute ).toLowerCase() ? 1 : 0;
																	}
																} else {
																	if( objOptions.searchText ) {
																		strSearchables += ',' + jqoSearchableItem.text();
																	}

																	for( var intTerm = 0, intTerms = arrSearchTerms.length; intTerm < intTerms; intTerm++ ) {
																		var strSearchTermPiece = arrSearchTerms[intTerm];

																		if( strSearchTermPiece !== '' ) {
																			if( strSearchTermPiece.length > 1
																					&& strSearchTermPiece.substr( 0, 1 ) === '+'
																					&& !contains( strSearchTermPiece.substr( 1 ).replace( /^"/, '' ).replace( /"$/, '' ), strSearchables ) ) {
																				intMatches = 0;
																				break;
																			} else if( strSearchTermPiece.length > 1
																					&& strSearchTermPiece.substr( 0, 1 ) === '-'
																					&& contains( strSearchTermPiece.substr( 1 ).replace( /^"/, '' ).replace( /"$/, '' ), strSearchables ) ) {
																				intMatches = 0;
																				break;
																			} else {
																				strSearchTermPiece = strSearchTermPiece.replace( /^"/, '' ).replace( /"$/, '' );
																				while( contains( strSearchTermPiece, strSearchables ) ) {
																					var intMatchStart = strSearchables.indexOf( strSearchTermPiece );
																					strSearchables = strSearchables.substring( 0, intMatchStart ) + strSearchables.substr( intMatchStart + strSearchTermPiece.length );
																					intMatches++;
																					if( !objOptions.score ) {
																						break;
																					}
																				}
																			}
																		}
																	}
																}

																if( intMatches > 0 ) {
																	intResults++;

																	if( !isBlank( objOptions.matchClass ) ) {
																		jqoSearchableItem.addClass( objOptions.matchClass );
																	}
																	if( !isBlank( objOptions.noMatchClass ) ) {
																		jqoSearchableItem.removeClass( objOptions.noMatchClass );
																	}
																} else {
																	if( !isBlank( objOptions.noMatchClass ) ) {
																		jqoSearchableItem.addClass( objOptions.noMatchClass );
																	}
																	if( !isBlank( objOptions.matchClass ) ) {
																		jqoSearchableItem.removeClass( objOptions.matchClass );
																	}
																}

																if( objOptions.score ) {
																	jqoSearchableItem.attr( 'data-searchablesscore', intMatches );
																}
															}
														);
													//}
												//);
											}

											if( intResults === 0 ) {
												jqoSearchTarget.addClass( objOptions.noResultsClass );
											} else {
												jqoSearchTarget.removeClass( objOptions.noResultsClass );
											}

											if( ( typeof objOptions.results === 'object'
														&& ( $( objOptions.results ) instanceof jQuery
															|| objOptions.results.jquery ) )
													|| $( objOptions.results ).length ) {
												$( objOptions.results ).text( intResults );
											}

											if( ( ( typeof objOptions.total === 'object'
															&& ( $( objOptions.total ) instanceof jQuery
																|| objOptions.total.jquery ) )
														|| $( objOptions.total ).length )
													&& jqoSearchPool.length !== intBaseTotal ) {
												intBaseTotal = jqoSearchPool.length;
												$( objOptions.total ).text( intBaseTotal );
											}
										};

									if( objOptions.searchOnLoad ) {
										funSearch();
									}

									switch( strThisSearchNodeName ) {
										case 'input':
											jqoThisSearch.off( 'keyup search' ).on( 'keyup search', funSearch );
											break;

										case 'select':
											jqoThisSearch.off( 'click' ).on( 'click', funSearch );
											break;
									}

									jqoThisSearch.on(
										{
											'searchables.reindex': funSearch
										}
									);

									if( ( typeof objOptions.total === 'object'
												&& ( $( objOptions.total ) instanceof jQuery
													|| objOptions.total.jquery ) )
											|| $( objOptions.total ).length ) {
										$( objOptions.total ).text( intBaseTotal );
									}
								} else {
									throw 'Searchables can only be called on INPUT and SELECT elements';
								}
							}
						);
					},
				$.fn.searchables.objDefaultOptions = {
						attribute: 'data-searchables',
						exclude: '.searchables-exclude',
						matchClass: '',
						noMatchClass: 'searchables-nomatch',
						noResultsClass: 'searchables-noresults',
						regex: false,
						results: '',
						score: false,
						searchingClass: 'searchables-searching',
						searchOnLoad: true,
						searchText: false,
						total: ''
					};
			} else {
				throw 'Shadow Searchables requires jQuery to run';
			}
		} catch( err ) {
			if( window.console ) {
				if( window.console.error ) {
					console.error( err );
				} else if( window.console.log ) {
					console.log( err );
				}
			}
		}
	}
)( jQuery );